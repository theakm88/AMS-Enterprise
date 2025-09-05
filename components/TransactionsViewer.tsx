import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useCrmData } from '../hooks/useCrmData';
import type { Retailer, Transaction } from '../types';
import { AddIcon, SearchIcon, EditIcon } from './icons/Icons';

interface TransactionModalProps {
    transaction: Transaction | null;
    retailers: Retailer[];
    onClose: () => void;
    onSave: (transaction: Omit<Transaction, 'id'> | Transaction) => void;
    isRetailerLocked?: boolean;
}

export const TransactionModal: React.FC<TransactionModalProps> = ({ transaction, retailers, onClose, onSave, isRetailerLocked = false }) => {
    const getInitialState = useCallback(() => {
        if (transaction) {
            return {
                ...transaction,
                time: transaction.time.slice(0, 16)
            };
        }
        return {
            retailerId: retailers[0]?.id || '',
            type: 'Auto-refill' as 'Auto-refill' | 'Push order',
            time: new Date().toISOString().slice(0, 16),
            amount: 0,
            commissionRate: 3,
        };
    }, [transaction, retailers]);
    
    const [formData, setFormData] = useState(getInitialState());
    const [netAmount, setNetAmount] = useState(0);
    const [amountError, setAmountError] = useState<string | null>(null);

    useEffect(() => {
        const amountNum = Number(formData.amount);
        const commissionNum = Number(formData.commissionRate);
        if (!isNaN(amountNum) && !isNaN(commissionNum)) {
            const calculatedAmount = amountNum - (amountNum * commissionNum) / 100;
            setNetAmount(Math.round(calculatedAmount / 10) * 10);
        } else {
            setNetAmount(0);
        }
    }, [formData.amount, formData.commissionRate]);
    
    useEffect(() => {
        setFormData(getInitialState());
    }, [transaction, getInitialState]);


    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (name === 'amount') {
            setAmountError(null);
        }
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const amountNum = Number(formData.amount);
        if (isNaN(amountNum) || amountNum <= 0) {
            setAmountError("Amount must be a positive number greater than zero.");
            return;
        }
        onSave({ 
            ...formData, 
            amount: amountNum, 
            commissionRate: Number(formData.commissionRate),
            time: new Date(formData.time).toISOString(),
        });
    };

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-4 animate-fade-in">
            <div className="bg-surface rounded-lg shadow-2xl w-full max-w-md animate-slide-up">
                 <div className="p-6 border-b border-border">
                    <h2 className="text-xl font-bold text-text-primary">{transaction ? 'Edit Transaction' : 'Add New Transaction'}</h2>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="p-6 space-y-4">
                         <div>
                            <label htmlFor="retailerId" className="block text-sm font-medium text-text-secondary">Retailer</label>
                            <select name="retailerId" id="retailerId" value={formData.retailerId} onChange={handleChange} className="mt-1 block w-full rounded-md border-border bg-background text-text-primary shadow-sm focus:border-primary focus:ring-primary sm:text-sm disabled:bg-surface-hover disabled:cursor-not-allowed" required disabled={isRetailerLocked}>
                               {retailers.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                            </select>
                        </div>
                         <div>
                            <label htmlFor="type" className="block text-sm font-medium text-text-secondary">Transaction Type</label>
                            <select name="type" id="type" value={formData.type} onChange={handleChange} className="mt-1 block w-full rounded-md border-border bg-background text-text-primary shadow-sm focus:border-primary focus:ring-primary sm:text-sm" required>
                                <option value="Auto-refill">Auto-refill</option>
                                <option value="Push order">Push order</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="time" className="block text-sm font-medium text-text-secondary">Date & Time</label>
                            <input type="datetime-local" name="time" id="time" value={formData.time} onChange={handleChange} className="mt-1 block w-full rounded-md border-border bg-background text-text-primary shadow-sm focus:border-primary focus:ring-primary sm:text-sm" required />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="amount" className="block text-sm font-medium text-text-secondary">Amount (INR)</label>
                                <input 
                                    type="number" 
                                    step="0.01" 
                                    name="amount" 
                                    id="amount" 
                                    value={formData.amount} 
                                    onChange={handleChange} 
                                    className={`mt-1 block w-full rounded-md border bg-background text-text-primary shadow-sm sm:text-sm ${
                                        amountError 
                                            ? 'border-danger focus:border-danger focus:ring-danger' 
                                            : 'border-border focus:border-primary focus:ring-primary'
                                    }`} 
                                    required 
                                />
                                {amountError && <p className="mt-1 text-xs text-danger">{amountError}</p>}
                            </div>
                            <div>
                                <label htmlFor="commissionRate" className="block text-sm font-medium text-text-secondary">Commission (%)</label>
                                <input type="number" step="0.1" name="commissionRate" id="commissionRate" value={formData.commissionRate} onChange={handleChange} className="mt-1 block w-full rounded-md border-border bg-background text-text-primary shadow-sm focus:border-primary focus:ring-primary sm:text-sm" required />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="netAmount" className="block text-sm font-medium text-text-secondary">Net Amount (INR, rounded)</label>
                            <input type="text" name="netAmount" id="netAmount" value={netAmount} className="mt-1 block w-full rounded-md border-border shadow-sm sm:text-sm bg-surface-hover text-text-secondary font-medium" readOnly />
                        </div>
                    </div>
                    <div className="flex justify-end space-x-3 p-6 bg-background rounded-b-lg">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-text-secondary bg-surface hover:bg-surface-hover border border-border rounded-md">Cancel</button>
                        <button type="submit" className="px-4 py-2 text-sm font-medium text-text-on-primary bg-primary rounded-md hover:bg-primary-focus focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">Save Transaction</button>
                    </div>
                </form>
            </div>
        </div>
    );
};


const TransactionsViewer = () => {
    const { transactions, getRetailerNameById, retailers, addTransaction, updateTransaction, loading, error } = useCrmData();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [selectedType, setSelectedType] = useState('All');
    
    const formatCurrency = (amount: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);
    const formatDate = (dateString: string) => new Date(dateString).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });

    const handleAddNew = () => {
        setEditingTransaction(null);
        setIsModalOpen(true);
    };

    const handleEdit = (transaction: Transaction) => {
        setEditingTransaction(transaction);
        setIsModalOpen(true);
    };

    const handleCloseModal = useCallback(() => {
        setIsModalOpen(false);
        setEditingTransaction(null);
    }, []);

    const handleSave = useCallback(async (transactionData: Transaction | Omit<Transaction, 'id'>) => {
        if ('id' in transactionData && transactionData.id) {
            await updateTransaction(transactionData);
        } else {
            await addTransaction(transactionData as Omit<Transaction, 'id'>);
        }
        handleCloseModal();
    }, [addTransaction, updateTransaction, handleCloseModal]);

    const filteredTransactions = useMemo(() => {
        return transactions.filter(transaction => {
            const retailerNameMatch = !searchTerm.trim() ||
                getRetailerNameById(transaction.retailerId)
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase());

            const transactionDate = new Date(transaction.time);
            const startDateMatch = !startDate || transactionDate >= new Date(startDate);
            const endDateMatch = !endDate || transactionDate <= new Date(new Date(endDate).setHours(23, 59, 59, 999));
            
            const typeMatch = selectedType === 'All' || transaction.type === selectedType;

            return retailerNameMatch && startDateMatch && endDateMatch && typeMatch;
        });
    }, [transactions, searchTerm, startDate, endDate, selectedType, getRetailerNameById]);

    return (
        <>
            <div className="bg-surface rounded-xl shadow-lg">
                <div className="p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                        <div className="mb-4 sm:mb-0 w-full sm:w-auto">
                            <h2 className="text-lg font-semibold text-text-primary">All Transactions</h2>
                            <p className="text-sm text-text-secondary mt-1">Wallet auto-refills and push orders.</p>
                        </div>
                        <button onClick={handleAddNew} className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-text-on-primary bg-primary rounded-md hover:bg-primary-focus flex items-center justify-center shadow-sm hover:shadow-md transition-shadow">
                            <AddIcon className="h-5 w-5 mr-2" />
                            Add Transaction
                        </button>
                    </div>
                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                        <div>
                            <label htmlFor="search" className="block text-sm font-medium text-text-secondary mb-1">Search Retailer</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <SearchIcon className="h-5 w-5 text-text-secondary" />
                                </div>
                                <input
                                    id="search"
                                    type="text"
                                    placeholder="e.g. RAJA MOBILES"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-2 border border-border rounded-md leading-5 bg-background text-text-primary placeholder-text-secondary focus:outline-none focus:placeholder-text-secondary focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm"
                                />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="typeFilter" className="block text-sm font-medium text-text-secondary mb-1">Type</label>
                            <select
                                id="typeFilter"
                                value={selectedType}
                                onChange={(e) => setSelectedType(e.target.value)}
                                className="block w-full px-3 py-2 border border-border rounded-md leading-5 bg-background text-text-primary focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm"
                            >
                                <option value="All">All Types</option>
                                <option value="Auto-refill">Auto-refill</option>
                                <option value="Push order">Push order</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="startDate" className="block text-sm font-medium text-text-secondary mb-1">Start Date</label>
                            <input
                                type="date"
                                id="startDate"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="block w-full px-3 py-2 border border-border rounded-md leading-5 bg-background text-text-primary placeholder-text-secondary focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm"
                            />
                        </div>
                        <div>
                            <label htmlFor="endDate" className="block text-sm font-medium text-text-secondary mb-1">End Date</label>
                            <input
                                type="date"
                                id="endDate"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="block w-full px-3 py-2 border border-border rounded-md leading-5 bg-background text-text-primary placeholder-text-secondary focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm"
                            />
                        </div>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    {loading['transactions'] && <div className="p-6 text-center">Loading transactions...</div>}
                    {error['transactions'] && <div className="p-6 text-center text-danger">Error: {error['transactions']}</div>}
                    {!loading['transactions'] && !error['transactions'] && (
                    <table className="min-w-full">
                        <thead className="bg-surface-hover">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">Retailer</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">Type</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">Date & Time</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">Amount</th>
                                <th scope="col" className="hidden md:table-cell px-6 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">Commission</th>
                                <th scope="col" className="hidden md:table-cell px-6 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">Net Amount</th>
                                <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                            </tr>
                        </thead>
                        <tbody className="bg-surface">
                            {filteredTransactions.map((transaction) => {
                                const rawNetAmount = transaction.amount - (transaction.amount * transaction.commissionRate / 100);
                                const netAmount = Math.round(rawNetAmount / 10) * 10;
                                return (
                                <tr key={transaction.id} className="border-b border-border hover:bg-surface-hover">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-text-primary">{getRetailerNameById(transaction.retailerId)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                                        <span className={`px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                            transaction.type === 'Auto-refill' ? 'bg-success/10 text-success' : 'bg-secondary/10 text-secondary'
                                        }`}>
                                            {transaction.type}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">{formatDate(transaction.time)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">{formatCurrency(transaction.amount)}</td>
                                    <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap text-sm text-text-secondary">{transaction.commissionRate}%</td>
                                    <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap text-sm font-semibold text-text-primary">{formatCurrency(netAmount)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button onClick={() => handleEdit(transaction)} className="text-secondary hover:opacity-80">
                                            <EditIcon />
                                        </button>
                                    </td>
                                </tr>
                                );
                            })}
                        </tbody>
                    </table>
                    )}
                </div>
            </div>
            {isModalOpen && <TransactionModal transaction={editingTransaction} retailers={retailers} onClose={handleCloseModal} onSave={handleSave} />}
        </>
    );
};

export default TransactionsViewer;