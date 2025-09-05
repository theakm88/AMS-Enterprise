import { RETAILERS, TRANSACTIONS, COLLECTIONS, AGENTS, CURRENT_USER } from './constants';
import type { Retailer, Transaction, Collection, Agent, User } from './types';

// Simulate network latency
const API_LATENCY = 500;

let retailers: Retailer[] = [...RETAILERS];
let transactions: Transaction[] = [...TRANSACTIONS].sort((a,b) => new Date(b.time).getTime() - new Date(a.time).getTime());
let collections: Collection[] = [...COLLECTIONS];
let agents: Agent[] = [...AGENTS];
let user: User = {...CURRENT_USER};

const simulateRequest = <T>(data: T): Promise<T> => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(JSON.parse(JSON.stringify(data))); // Deep copy to prevent mutation issues
        }, API_LATENCY);
    });
};

// --- User API ---
export const fetchUser = () => simulateRequest(user);
export const updateUser = (updatedUser: User) => {
    user = { ...user, ...updatedUser };
    return simulateRequest(user);
}

// --- Dashboard API ---
export const fetchDashboardStats = () => {
    const today = new Date().toISOString().split('T')[0];
    const todaysCollections = collections.filter(c => c.date === today);

    const totalCollectedToday = todaysCollections.reduce((sum, c) => sum + c.amount, 0);
    const cashCollectedToday = todaysCollections.filter(c => c.method === 'Cash').reduce((sum, c) => sum + c.amount, 0);
    const upiCollectedToday = todaysCollections.filter(c => c.method === 'UPI').reduce((sum, c) => sum + c.amount, 0);
    const totalPending = retailers.reduce((sum, r) => sum + r.pendingBalance, 0);
    const topPendingRetailers = [...retailers].sort((a, b) => b.pendingBalance - a.pendingBalance).slice(0, 5);
    
    const stats = {
        totalCollectedToday,
        totalPending,
        cashCollectedToday,
        upiCollectedToday,
        topPendingRetailers,
        weeklyOverviewData: [ // dummy data for chart
            { name: 'Mon', Collections: 40000 }, { name: 'Tue', Collections: 30000 },
            { name: 'Wed', Collections: 20000 }, { name: 'Thu', Collections: 27800 },
            { name: 'Fri', Collections: 18900 }, { name: 'Sat', Collections: 23900 },
            { name: 'Sun', Collections: 34900 },
        ],
        paymentMethodData: [
            { name: 'Cash', value: cashCollectedToday },
            { name: 'UPI', value: upiCollectedToday },
        ],
    };
    return simulateRequest(stats);
};


// --- Retailers API ---
export const fetchRetailers = () => simulateRequest(retailers);
export const fetchRetailerById = (id: string) => simulateRequest(retailers.find(r => r.id === id) || null);

export const createRetailer = (retailerData: Omit<Retailer, 'id'>) => {
    const newRetailer: Retailer = {
        ...retailerData,
        id: `R${String(retailers.length + 1).padStart(3, '0')}`,
    };
    retailers = [newRetailer, ...retailers];
    return simulateRequest(newRetailer);
};

export const updateRetailer = (updatedRetailer: Retailer) => {
    retailers = retailers.map(r => r.id === updatedRetailer.id ? updatedRetailer : r);
    return simulateRequest(updatedRetailer);
};

export const deleteRetailer = (retailerId: string) => {
    retailers = retailers.filter(r => r.id !== retailerId);
    return simulateRequest(retailerId); // return the id of deleted item
};

// --- Transactions API ---
export const fetchTransactions = (retailerId?: string) => {
    let results = transactions;
    if (retailerId) {
        results = transactions.filter(t => t.retailerId === retailerId);
    }
    return simulateRequest(results);
};

export const createTransaction = (transactionData: Omit<Transaction, 'id'>) => {
    const newTransaction: Transaction = {
        ...transactionData,
        id: `T${String(transactions.length + 1).padStart(3, '0')}`,
    };
    transactions = [newTransaction, ...transactions].sort((a,b) => new Date(b.time).getTime() - new Date(a.time).getTime());
    return simulateRequest(newTransaction);
};

export const updateTransaction = (updatedTransaction: Transaction) => {
    transactions = transactions
        .map(t => t.id === updatedTransaction.id ? updatedTransaction : t)
        .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
    return simulateRequest(updatedTransaction);
};


// --- Collections & Agents API ---
export const fetchCollections = (retailerId: string) => {
    return simulateRequest(collections.filter(c => c.retailerId === retailerId));
};

export const fetchAgents = () => simulateRequest(agents);