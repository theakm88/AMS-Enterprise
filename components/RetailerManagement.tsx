import React, { useState, useCallback } from 'react';
import { useCrmData } from '../hooks/useCrmData';
import type { Retailer } from '../types';
import { EditIcon, DeleteIcon, AddIcon } from './icons/Icons';
import { Link } from 'react-router-dom';

const RetailerModal: React.FC<{ retailer: Partial<Retailer> | null; onClose: () => void; onSave: (retailer: Retailer) => void; }> = ({ retailer, onClose, onSave }) => {
    const [formData, setFormData] = useState<Partial<Retailer>>(retailer || { name: '', partnerId: '', pendingBalance: 0 });
    const [errors, setErrors] = useState<{ name?: string; partnerId?: string; pendingBalance?: string }>({});

    const validate = useCallback((data: Partial<Retailer>) => {
        const tempErrors: { name?: string; partnerId?: string; pendingBalance?: string } = {};
        if (!data.name?.trim()) {
            tempErrors.name = 'Retailer name is required.';
        }
        if (!data.partnerId) {
            tempErrors.partnerId = 'Partner ID is required.';
        } else if (!/^\d{10}$/.test(data.partnerId)) {
            tempErrors.partnerId = 'Partner ID must be exactly 10 digits.';
        }
        if (data.pendingBalance === undefined || data.pendingBalance === null) {
            tempErrors.pendingBalance = 'Pending balance is required.';
        } else if (Number(data.pendingBalance) < 0) {
            tempErrors.pendingBalance = 'Pending balance cannot be negative.';
        }
        return tempErrors;
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        // Allow clearing the number field without it defaulting to 0
        const isNumericField = name === 'pendingBalance';
        const parsedValue = isNumericField && value === '' ? '' : (isNumericField ? Number(value) : value);

        const updatedFormData = { ...formData, [name]: parsedValue };
        setFormData(updatedFormData);

        // Real-time validation for the changed field
        const fieldErrors = validate({ [name]: value });
        setErrors(prev => ({
            ...prev,
            [name]: fieldErrors[name as keyof typeof fieldErrors]
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const validationErrors = validate(formData);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
        onSave(formData as Retailer);
    };

    if (!retailer) return null;
    
    const baseInputClasses = "block w-full rounded-lg border bg-background p-3 text-sm text-text-primary shadow-sm transition-colors duration-200 focus:outline-none focus:ring-2 dark:bg-slate-800 dark:border-slate-700";
    const normalClasses = "border-border focus:ring-primary";
    const errorClasses = "border-danger focus:ring-danger";

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-4 animate-fade-in">
            <div className="bg-surface rounded-lg shadow-2xl w-full max-w-md animate-slide-up">
                <div className="p-6 border-b border-border">
                    <h2 className="text-xl font-bold text-text-primary">{retailer.id ? 'Edit Retailer' : 'Add New Retailer'}</h2>
                </div>
                <form onSubmit={handleSubmit} noValidate>
                    <div className="p-6 space-y-5">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-text-secondary mb-1">Retailer Name</label>
                            <input 
                                type="text" 
                                name="name" 
                                id="name" 
                                value={formData.name || ''} 
                                onChange={handleChange}
                                placeholder="Enter retailer name"
                                className={`${baseInputClasses} ${errors.name ? errorClasses : normalClasses}`}
                                required 
                            />
                            {errors.name && <p className="mt-1.5 text-xs text-danger">{errors.name}</p>}
                        </div>
                        <div>
                            <label htmlFor="partnerId" className="block text-sm font-medium text-text-secondary mb-1">Partner ID</label>
                             <input 
                                type="text" 
                                name="partnerId" 
                                id="partnerId" 
                                value={formData.partnerId || ''} 
                                onChange={handleChange} 
                                placeholder="Enter 10-digit partner ID"
                                maxLength={10}
                                className={`${baseInputClasses} ${errors.partnerId ? errorClasses : normalClasses}`}
                                required 
                            />
                            {errors.partnerId && <p className="mt-1.5 text-xs text-danger">{errors.partnerId}</p>}
                        </div>
                        <div>
                            <label htmlFor="pendingBalance" className="block text-sm font-medium text-text-secondary mb-1">Pending Balance (INR)</label>
                            <input 
                                type="number" 
                                name="pendingBalance" 
                                id="pendingBalance" 
                                value={formData.pendingBalance ?? ''} 
                                onChange={handleChange} 
                                placeholder="e.g., 5000"
                                className={`${baseInputClasses} ${errors.pendingBalance ? errorClasses : normalClasses}`}
                                required 
                                min="0"
                            />
                            {errors.pendingBalance && <p className="mt-1.5 text-xs text-danger">{errors.pendingBalance}</p>}
                        </div>
                    </div>
                    <div className="flex justify-end space-x-3 p-6 bg-background rounded-b-lg">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-text-secondary bg-surface hover:bg-surface-hover border border-border rounded-md">Cancel</button>
                        <button type="submit" className="px-4 py-2 text-sm font-medium text-text-on-primary bg-primary rounded-md hover:bg-primary-focus focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">Save</button>
                    </div>
                </form>
            </div>
        </div>
    );
};


const RetailerManagement = () => {
    const { retailers, addRetailer, updateRetailer, deleteRetailer, loading, error } = useCrmData();
    const [editingRetailer, setEditingRetailer] = useState<Partial<Retailer> | null>(null);

    const handleAddNew = () => {
        setEditingRetailer({ name: '', partnerId: '', pendingBalance: 0, lastCollectionDate: new Date().toISOString().split('T')[0] });
    };

    const handleEdit = (retailer: Retailer) => {
        setEditingRetailer(retailer);
    };
    
    const handleDelete = (retailerId: string) => {
        const retailerToDelete = retailers.find(r => r.id === retailerId);
        if (retailerToDelete && window.confirm(`Are you sure you want to delete the retailer "${retailerToDelete.name}"? This action cannot be undone.`)) {
            deleteRetailer(retailerId);
        }
    }

    const handleSave = useCallback(async (retailerToSave: Retailer) => {
        if (retailerToSave.id) {
            await updateRetailer(retailerToSave);
        } else {
            await addRetailer(retailerToSave);
        }
        setEditingRetailer(null);
    }, [addRetailer, updateRetailer]);

    const handleCloseModal = () => {
        setEditingRetailer(null);
    };
    
    const formatCurrency = (amount: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);

    return (
        <>
            <div className="bg-surface rounded-xl shadow-lg">
                 <div className="p-4 sm:p-6 flex flex-col sm:flex-row sm:justify-between sm:items-center">
                    <div className="mb-4 sm:mb-0 w-full sm:w-auto">
                        <h2 className="text-lg font-semibold text-text-primary">All Retailers</h2>
                        <p className="text-sm text-text-secondary mt-1">{retailers.length} results found</p>
                    </div>
                    <button onClick={handleAddNew} className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-text-on-primary bg-primary rounded-md hover:bg-primary-focus flex items-center justify-center shadow-sm hover:shadow-md transition-shadow">
                        <AddIcon className="h-5 w-5 mr-2" />
                        Add Retailer
                    </button>
                </div>
                <div className="overflow-x-auto">
                    {loading['retailers'] && <div className="p-6 text-center">Loading retailers...</div>}
                    {error['retailers'] && <div className="p-6 text-center text-danger">Error: {error['retailers']}</div>}
                    {!loading['retailers'] && !error['retailers'] && (
                    <table className="min-w-full">
                        <thead className="bg-surface-hover">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">Name</th>
                                <th scope="col" className="hidden sm:table-cell px-6 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">Partner ID</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">Pending Balance</th>
                                <th scope="col" className="hidden sm:table-cell px-6 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">Last Collection</th>
                                <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                            </tr>
                        </thead>
                        <tbody className="bg-surface">
                            {retailers.map((retailer) => (
                                <tr key={retailer.id} className="border-b border-border hover:bg-surface-hover">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-text-primary">
                                        <Link to={`/retailers/${retailer.id}`} className="hover:underline hover:text-primary transition-colors">
                                            {retailer.name}
                                        </Link>
                                    </td>
                                    <td className="hidden sm:table-cell px-6 py-4 whitespace-nowrap text-sm text-text-secondary">{retailer.partnerId}</td>
                                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-semibold ${retailer.pendingBalance > 0 ? 'text-danger' : 'text-success'}`}>{formatCurrency(retailer.pendingBalance)}</td>
                                    <td className="hidden sm:table-cell px-6 py-4 whitespace-nowrap text-sm text-text-secondary">{retailer.lastCollectionDate}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex items-center justify-end space-x-4">
                                            <button onClick={() => handleEdit(retailer)} className="text-secondary hover:opacity-80"><EditIcon /></button>
                                            <button onClick={() => handleDelete(retailer.id)} className="text-danger hover:opacity-80"><DeleteIcon /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    )}
                </div>
            </div>
            {editingRetailer && <RetailerModal retailer={editingRetailer} onClose={handleCloseModal} onSave={handleSave} />}
        </>
    );
};

export default RetailerManagement;