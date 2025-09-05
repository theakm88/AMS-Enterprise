
export interface Retailer {
  id: string;
  name: string;
  partnerId: string;
  pendingBalance: number;
  lastCollectionDate?: string;
}

export interface Transaction {
  id: string;
  retailerId: string;
  type: 'Auto-refill' | 'Push order';
  time: string;
  amount: number;
  commissionRate: number;
}

export interface Collection {
  id: string;
  retailerId: string;
  agentId: string;
  amount: number;
  method: 'Cash' | 'UPI';
  status: 'Verified' | 'Pending';
  date: string;
  proofUrl?: string;
}

export interface Agent {
  id: string;
  name: string;
}

export interface User {
    id: string;
    name: string;
    email: string;
    role: 'Owner' | 'Admin' | 'Agent';
    profilePictureUrl: string;
    companyLogoUrl: string;
}