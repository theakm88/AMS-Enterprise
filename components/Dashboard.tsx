import React, { useEffect, useState } from 'react';
import { useCrmData } from '../hooks/useCrmData';
import { useTheme } from '../contexts/ThemeContext';
import { CashIcon, UpiIcon, CollectionIcon, PendingIcon } from './icons/Icons';
import { AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface StatCardProps {
    title: string;
    value: string;
    icon: React.ElementType;
    colorClass: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, colorClass }) => {
    return (
        <div className="bg-surface rounded-xl shadow-lg p-4 sm:p-6">
            <div className="flex items-center">
                <div className={`flex-shrink-0 h-12 w-12 rounded-lg flex items-center justify-center ${colorClass}`}>
                    <Icon className="h-6 w-6" />
                </div>
                <div className="ml-4">
                    <p className="text-sm font-medium text-text-secondary">{title}</p>
                    <p className="text-2xl font-bold text-text-primary">{value}</p>
                </div>
            </div>
        </div>
    );
};

const DonutChartCard: React.FC<{data: any[]}> = ({data}) => {
    const { theme } = useTheme();
    const colors = theme === 'light' ? ['#22C55E', '#A855F7'] : ['#34D399', '#38BDF8'];

    return (
        <div className="bg-surface rounded-xl shadow-lg p-4 sm:p-6">
            <h3 className="text-lg font-semibold text-text-primary mb-4">Payment Methods Today</h3>
            <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        fill="#8884d8"
                        paddingAngle={5}
                        dataKey="value"
                    >
                        {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                        ))}
                    </Pie>
                    <Tooltip cursor={{fill: 'transparent'}} />
                </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center space-x-6 mt-4">
                {data.map((entry, index) => (
                    <div key={entry.name} className="flex items-center space-x-2">
                        <div className="h-3 w-3 rounded-full" style={{backgroundColor: colors[index % colors.length]}}></div>
                        <span className="text-sm text-text-secondary">{entry.name}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

const CustomAreaTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-border bg-surface p-3 shadow-lg">
        <p className="text-sm font-semibold text-text-primary">{label}</p>
        <p className="text-sm text-primary">
          Collections: {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(payload[0].value)}
        </p>
      </div>
    );
  }
  return null;
};


const Dashboard = () => {
    const { fetchDashboardStats } = useCrmData();
    const { theme } = useTheme();
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setLoading(true);
        fetchDashboardStats()
            .then(setStats)
            .catch(err => setError('Failed to load dashboard data.'))
            .finally(() => setLoading(false));
    }, [fetchDashboardStats]);
    
    const formatCurrency = (amount: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);
    
    const tickColor = theme === 'dark' ? '#94a3b8' : '#64748b';
    const gridColor = theme === 'dark' ? '#334155' : '#e2e8f0';
    const primaryChartColor = theme === 'dark' ? '#34D399' : '#7C3AED';
    const primaryChartFill = theme === 'light' ? 'rgba(124, 58, 237, 0.1)' : 'rgba(52, 211, 153, 0.1)';

    if (loading) {
        return <div className="text-center p-8">Loading dashboard...</div>;
    }
    
    if (error || !stats) {
        return <div className="text-center p-8 text-danger">{error || 'Could not load dashboard data.'}</div>;
    }

    return (
        <div className="space-y-6 lg:space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                <StatCard title="Collected Today" value={formatCurrency(stats.totalCollectedToday)} icon={CollectionIcon} colorClass="bg-secondary/10 text-secondary" />
                <StatCard title="Total Pending" value={formatCurrency(stats.totalPending)} icon={PendingIcon} colorClass="bg-accent/10 text-accent" />
                <StatCard title="Cash Today" value={formatCurrency(stats.cashCollectedToday)} icon={CashIcon} colorClass="bg-success/10 text-success" />
                <StatCard title="UPI Today" value={formatCurrency(stats.upiCollectedToday)} icon={UpiIcon} colorClass="bg-primary/10 text-primary" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                <div className="lg:col-span-2 bg-surface rounded-xl shadow-lg p-4 sm:p-6">
                    <h3 className="text-lg font-semibold text-text-primary mb-4">Weekly Collection Overview</h3>
                     <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={stats.weeklyOverviewData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                          <defs>
                            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor={primaryChartColor} stopOpacity={0.8}/>
                              <stop offset="95%" stopColor={primaryChartColor} stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
                          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: tickColor, fontFamily: 'Inter' }} />
                          <YAxis axisLine={false} tickLine={false} tickFormatter={(value) => `₹${Number(value) / 1000}k`} tick={{ fill: tickColor, fontFamily: 'Inter' }} />
                          <Tooltip cursor={{fill: primaryChartFill}} content={<CustomAreaTooltip />} />
                          <Area type="monotone" dataKey="Collections" stroke={primaryChartColor} fillOpacity={1} fill="url(#chartGradient)" strokeWidth={2} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
                <DonutChartCard data={stats.paymentMethodData} />
            </div>
            
             <div className="bg-surface rounded-xl shadow-lg p-4 sm:p-6">
                <h3 className="text-lg font-semibold text-text-primary mb-4">Top Pending Retailers</h3>
                <div className="space-y-4">
                    {stats.topPendingRetailers.map((retailer: any, index: number) => (
                        <div key={retailer.id} className={`flex items-center space-x-2 sm:space-x-4 ${index < stats.topPendingRetailers.length -1 ? 'pb-4 border-b border-border' : ''}`}>
                           <div className="flex-shrink-0 h-10 w-10 rounded-full bg-danger/10 flex items-center justify-center">
                              <span className="text-danger font-semibold">{retailer.name.charAt(0)}</span>
                           </div>
                           <div className="flex-1 min-w-0">
                                <p className="font-medium text-sm text-text-primary truncate">{retailer.name}</p>
                                <p className="text-xs text-text-secondary">{retailer.partnerId}</p>
                            </div>
                            <p className="font-semibold text-sm text-danger whitespace-nowrap">{formatCurrency(retailer.pendingBalance)}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;