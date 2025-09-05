
import type { Retailer, Transaction, Collection, Agent, User } from './types';

export const AGENTS: Agent[] = [
    { id: 'A001', name: 'Rajesh Kumar' },
    { id: 'A002', name: 'Suresh Singh' }
];

export const RETAILERS: Retailer[] = [
  { id: 'R001', name: 'RAJA MOBILES', partnerId: '0661548615', pendingBalance: 5000, lastCollectionDate: '2023-10-25' },
  { id: 'R002', name: 'SRI VARI COMMUNICATIONS', partnerId: '0661548616', pendingBalance: 12500, lastCollectionDate: '2023-10-26' },
  { id: 'R003', name: 'AMMAN CELL POINT', partnerId: '0661548617', pendingBalance: 0, lastCollectionDate: '2023-10-27' },
  { id: 'R004', name: 'NEW MOBILE WORLD', partnerId: '0661548618', pendingBalance: 7800, lastCollectionDate: '2023-10-24' },
  { id: 'R005', name: 'FRIENDS TELECOM', partnerId: '0661548619', pendingBalance: 3200, lastCollectionDate: '2023-10-26' },
  { id: 'R006', name: 'VICTORY MOBILES', partnerId: '0661548620', pendingBalance: 21000, lastCollectionDate: '2023-10-23' },
];

export const TRANSACTIONS: Transaction[] = [
    { id: 'T001', retailerId: 'R001', type: 'Auto-refill', time: '2023-10-27T10:02:00', amount: 3075, commissionRate: 3 },
    { id: 'T002', retailerId: 'R002', type: 'Push order', time: '2023-10-27T11:30:00', amount: 5000, commissionRate: 2.5 },
    { id: 'T003', retailerId: 'R004', type: 'Auto-refill', time: '2023-10-27T12:15:00', amount: 2500, commissionRate: 3 },
    { id: 'T004', retailerId: 'R005', type: 'Auto-refill', time: '2023-10-26T09:00:00', amount: 1500, commissionRate: 3 },
    { id: 'T005', retailerId: 'R006', type: 'Push order', time: '2023-10-26T14:00:00', amount: 10000, commissionRate: 2.5 },
    { id: 'T006', retailerId: 'R002', type: 'Auto-refill', time: '2023-10-26T16:45:00', amount: 7500, commissionRate: 3 },
];

export const COLLECTIONS: Collection[] = [
    { id: 'C001', retailerId: 'R003', agentId: 'A001', amount: 2000, method: 'Cash', status: 'Verified', date: '2023-10-27' },
    { id: 'C002', retailerId: 'R001', agentId: 'A002', amount: 1500, method: 'UPI', status: 'Pending', date: '2023-10-27', proofUrl: 'https://picsum.photos/200' },
    { id: 'C003', retailerId: 'R005', agentId: 'A001', amount: 3200, method: 'Cash', status: 'Verified', date: '2023-10-26' },
    { id: 'C004', retailerId: 'R004', agentId: 'A002', amount: 5000, method: 'UPI', status: 'Verified', date: '2023-10-26', proofUrl: 'https://picsum.photos/200' },
];

export const CURRENT_USER: User = {
    id: 'U001',
    name: 'John Doe',
    email: 'owner@amscorp.com',
    role: 'Owner',
    profilePictureUrl: 'https://picsum.photos/100',
    companyLogoUrl: '', // Default is empty, will show AmsLogo SVG
};