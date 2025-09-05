import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCrmData } from '../hooks/useCrmData';
import { AddIcon, CashIcon, UpiIcon } from './icons/Icons';
import type { Transaction, Retailer, Collection } from '../types';
import { TransactionModal } from './TransactionsViewer'; 

const RetailerDetail = () => {
    const { retailerId } = useParams<{ retailerId: string }>();
    const { addTransaction, agents } = useCrmData();
    const { fetchRetailerData } = useCrmData();

    const [retailer, setRetailer] = useState<Retailer | null>(null);
    const [retailerTransactions, setRetailerTransactions] = useState<Transaction[]>([]);
    const [retailerCollections, setRetailerCollections] = useState<Collection[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        if (retailerId) {
            setLoading(true);
            fetchRetailerData(retailerId).then(data => {
                setRetailer(data.retailer);
                setRetailerTransactions(data.transactions);
                setRetailerCollections(data.collections);
                setLoading(false);
            });
        }
    }, [retailerId, fetchRetailerData]);
    
    const getAgentNameById = (id: string) => agents.find(a => a.id === id)?.name || 'Unknown Agent';

    const formatCurrency = (amount: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);
    const formatDate = (dateString: string) => new Date(dateString).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });
    const formatDateOnly = (dateString: string) => new Date(dateString).toLocaleDateString('en-IN', { dateStyle: 'medium' });

    const handleSaveTransaction = async (transactionData: Omit<Transaction, 'id'>) => {
        await addTransaction(transactionData);
        // Refetch transactions to show the new one
        if (retailerId) {
            const data = await fetchRetailerData(retailerId);
            setRetailerTransactions(data.transactions);
        }
        setIsModalOpen(false);
    };
    
    if (loading) {
        return <div className="text-center p-8">Loading retailer details...</div>
    }

    if (!retailer) {
        return (
            <div className="text-center p-8 bg-surface rounded-xl shadow-lg">
                <h2 className="text-xl font-bold text-text-primary">Retailer Not Found</h2>
                <p className="text-text-secondary mt-2">The retailer you are looking for does not exist.</p>
                <Link to="/retailers" className="mt-6 inline-flex items-center px-4 py-2 text-sm font-medium text-text-on-primary bg-primary rounded-md hover:bg-primary-focus">
                    <svg className="h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
                    Back to All Retailers
                </Link>
            </div>
        );
    }

    return (
        <>
            <div className="space-y-6 animate-fade-in">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <Link to="/retailers" className="flex items-center text-sm text-text-secondary hover:text-text-primary mb-2 group">
                            <svg className="h-4 w-4 mr-2 transition-transform group-hover:-translate-x-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
                            Back to Retailers
                        </Link>
                        <h1 className="text-2xl font-bold text-text-primary">{retailer.name}</h1>
                        <p className="text-sm text-text-secondary">Partner ID: {retailer.partnerId}</p>
                    </div>
                     <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                        <div className="bg-surface rounded-lg p-4 text-center sm:text-left shadow-md flex-grow">
                            <p className="text-sm text-text-secondary">Pending Balance</p>
                            <p className={`text-2xl font-bold ${retailer.pendingBalance > 0 ? 'text-danger' : 'text-success'}`}>{formatCurrency(retailer.pendingBalance)}</p>
                        </div>
                        <button onClick={() => setIsModalOpen(true)} className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-text-on-primary bg-primary rounded-md hover:bg-primary-focus flex items-center justify-center shadow-sm hover:shadow-md transition-shadow">
                            <AddIcon className="h-5 w-5 mr-2" />
                            Add Transaction
                        </button>
                    </div>
                </div>

                {/* Transaction History */}
                <div className="bg-surface rounded-xl shadow-lg">
                    <div className="p-4 sm:p-6 border-b border-border">
                        <h3 className="text-lg font-semibold text-text-primary">Transaction History</h3>
                    </div>
                    {retailerTransactions.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead className="bg-surface-hover">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">Type</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">Date & Time</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">Amount</th>
                                    <th scope="col" className="hidden sm:table-cell px-6 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">Net Amount</th>
                                </tr>
                            </thead>
                            <tbody className="bg-surface divide-y divide-border">
                                {retailerTransactions.map((transaction) => {
                                    const rawNetAmount = transaction.amount - (transaction.amount * transaction.commissionRate / 100);
                                    const netAmount = Math.round(rawNetAmount / 10) * 10;
                                    return (
                                    <tr key={transaction.id} className="hover:bg-surface-hover">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                                            <span className={`px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${transaction.type === 'Auto-refill' ? 'bg-success/10 text-success' : 'bg-secondary/10 text-secondary'}`}>
                                                {transaction.type}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">{formatDate(transaction.time)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">{formatCurrency(transaction.amount)}</td>
                                        <td className="hidden sm:table-cell px-6 py-4 whitespace-nowrap text-sm font-semibold text-text-primary">{formatCurrency(netAmount)}</td>
                                    </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                     ) : (
                        <p className="p-6 text-center text-text-secondary">No transactions found for this retailer.</p>
                    )}
                </div>

                {/* Collection History */}
                <div className="bg-surface rounded-xl shadow-lg">
                    <div className="p-4 sm:p-6 border-b border-border">
                        <h3 className="text-lg font-semibold text-text-primary">Collection History</h3>
                    </div>
                     {retailerCollections.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead className="bg-surface-hover">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">Date</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">Amount</th>
                                    <th scope="col" className="hidden sm:table-cell px-6 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">Method</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">Agent</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">Status</th>
                                </tr>
                            </thead>
                            <tbody className="bg-surface divide-y divide-border">
                                {retailerCollections.map((collection) => (
                                    <tr key={collection.id} className="hover:bg-surface-hover">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">{formatDateOnly(collection.date)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-text-primary">{formatCurrency(collection.amount)}</td>
                                        <td className="hidden sm:table-cell px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                                            <div className="flex items-center">
                                                {collection.method === 'Cash' ? <CashIcon className="h-4 w-4 mr-2 text-success" /> : <UpiIcon className="h-4 w-4 mr-2 text-primary" />}
                                                {collection.method}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">{getAgentNameById(collection.agentId)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                             <span className={`px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${collection.status === 'Verified' ? 'bg-success/10 text-success' : 'bg-accent/10 text-accent'}`}>
                                                {collection.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    ) : (
                        <p className="p-6 text-center text-text-secondary">No collections found for this retailer.</p>
                    )}
                </div>
            </div>
            
            {isModalOpen && (
                <TransactionModal
                    transaction={null}
                    retailers={[retailer]}
                    onClose={() => setIsModalOpen(false)}
                    onSave={handleSaveTransaction}
                    isRetailerLocked={true}
                />
            )}
        </>
    );
};

export default RetailerDetail;