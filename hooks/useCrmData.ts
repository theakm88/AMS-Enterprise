import React, { createContext, useState, useContext, ReactNode, useEffect, useCallback } from 'react';
import type { Retailer, Transaction, Agent, User } from '../types';
import * as api from '../api';

interface CrmDataContextType {
  user: User | null;
  retailers: Retailer[];
  transactions: Transaction[];
  agents: Agent[];
  loading: Record<string, boolean>;
  error: Record<string, string | null>;
  updateUser: (updatedUser: User) => Promise<void>;
  addRetailer: (retailer: Omit<Retailer, 'id'>) => Promise<void>;
  updateRetailer: (updatedRetailer: Retailer) => Promise<void>;
  deleteRetailer: (retailerId: string) => Promise<void>;
  getRetailerNameById: (id: string) => string;
  addTransaction: (transaction: Omit<Transaction, 'id'>) => Promise<void>;
  updateTransaction: (updatedTransaction: Transaction) => Promise<void>;
  fetchRetailerData: (retailerId: string) => Promise<{ retailer: Retailer | null; transactions: Transaction[]; collections: any[] }>;
  fetchDashboardStats: () => Promise<any>;
}

const CrmDataContext = createContext<CrmDataContextType | undefined>(undefined);

export const CrmDataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [retailers, setRetailers] = useState<Retailer[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [error, setError] = useState<Record<string, string | null>>({});

  const createApiCall = <T,>(key: string, apiFunc: () => Promise<T>, setData: (data: T) => void) => {
    setLoading(prev => ({ ...prev, [key]: true }));
    setError(prev => ({ ...prev, [key]: null }));
    apiFunc()
      .then(setData)
      .catch(err => setError(prev => ({ ...prev, [key]: err.message || `Failed to fetch ${key}` })))
      .finally(() => setLoading(prev => ({ ...prev, [key]: false })));
  };

  useEffect(() => {
    createApiCall('user', api.fetchUser, setUser);
    createApiCall('retailers', api.fetchRetailers, setRetailers);
    createApiCall('transactions', api.fetchTransactions, setTransactions);
    createApiCall('agents', api.fetchAgents, setAgents);
  }, []);
  
  const getRetailerNameById = useCallback((id: string) => {
    return retailers.find(r => r.id === id)?.name || 'Unknown Retailer';
  }, [retailers]);

  const addRetailer = async (retailer: Omit<Retailer, 'id'>) => {
    const newRetailer = await api.createRetailer(retailer);
    setRetailers(prev => [newRetailer, ...prev]);
  };

  const updateRetailer = async (updatedRetailer: Retailer) => {
    await api.updateRetailer(updatedRetailer);
    setRetailers(prev => prev.map(r => r.id === updatedRetailer.id ? updatedRetailer : r));
  };
  
  const deleteRetailer = async (retailerId: string) => {
    await api.deleteRetailer(retailerId);
    setRetailers(prev => prev.filter(r => r.id !== retailerId));
  }
  
  const addTransaction = async (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction = await api.createTransaction(transaction);
    setTransactions(prev => [newTransaction, ...prev].sort((a,b) => new Date(b.time).getTime() - new Date(a.time).getTime()));
  };

  const updateTransaction = async (updatedTransaction: Transaction) => {
    await api.updateTransaction(updatedTransaction);
    setTransactions(prev => 
      prev.map(t => t.id === updatedTransaction.id ? updatedTransaction : t)
          .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
    );
  };

  const updateUser = async (updatedUser: User) => {
    const savedUser = await api.updateUser(updatedUser);
    setUser(savedUser);
  };

  const fetchRetailerData = async (retailerId: string) => {
    const [retailer, transactions, collections] = await Promise.all([
      api.fetchRetailerById(retailerId),
      api.fetchTransactions(retailerId),
      api.fetchCollections(retailerId),
    ]);
    return { retailer, transactions, collections };
  };

  const fetchDashboardStats = () => api.fetchDashboardStats();

  const value: CrmDataContextType = { 
    user,
    retailers, 
    transactions, 
    agents,
    loading,
    error,
    updateUser,
    addRetailer,
    updateRetailer,
    deleteRetailer,
    getRetailerNameById,
    addTransaction,
    updateTransaction,
    fetchRetailerData,
    fetchDashboardStats,
  };

  return React.createElement(CrmDataContext.Provider, { value }, children);
};

export const useCrmData = (): CrmDataContextType => {
  const context = useContext(CrmDataContext);
  if (context === undefined) {
    throw new Error('useCrmData must be used within a CrmDataProvider');
  }
  return context;
};