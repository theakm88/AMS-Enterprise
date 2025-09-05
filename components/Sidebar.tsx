import React from 'react';
import { NavLink } from 'react-router-dom';
import { useCrmData } from '../hooks/useCrmData';
import { DashboardIcon, RetailerIcon, TransactionIcon, ReportIcon, SettingsIcon, LogoutIcon, AmsLogo, CloseIcon } from './icons/Icons';

const navigation = [
  { name: 'Dashboard', href: '/', icon: DashboardIcon },
  { name: 'Retailers', href: '/retailers', icon: RetailerIcon },
  { name: 'Transactions', href: '/transactions', icon: TransactionIcon },
  { name: 'Reports', href: '/reports', icon: ReportIcon },
  { name: 'Settings', href: '/settings', icon: SettingsIcon },
];

const Sidebar: React.FC<{ sidebarOpen: boolean; setSidebarOpen: (open: boolean) => void; }> = ({ sidebarOpen, setSidebarOpen }) => {
  const sidebarClasses = "relative flex-1 flex flex-col max-w-xs w-full bg-violet-700 dark:bg-slate-800";

  return (
    <>
    {/* Mobile sidebar */}
    <div className={`fixed inset-0 flex z-40 md:hidden ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} transition-transform duration-300 ease-in-out`}>
      <div className="fixed inset-0 bg-gray-600 bg-opacity-75 dark:bg-black/50" onClick={() => setSidebarOpen(false)}></div>
      <div className={sidebarClasses}>
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
                type="button"
                className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                onClick={() => setSidebarOpen(false)}
            >
                <span className="sr-only">Close sidebar</span>
                <CloseIcon className="h-6 w-6 text-white" />
            </button>
          </div>
          <SidebarContent />
      </div>
       <div className="flex-shrink-0 w-14" aria-hidden="true"></div>
    </div>
    
    {/* Static sidebar for desktop */}
    <div className="hidden md:flex md:flex-shrink-0">
      <div className="flex flex-col w-64">
        <div className="flex flex-col h-0 flex-1 bg-violet-700 dark:bg-slate-800">
          <SidebarContent />
        </div>
      </div>
    </div>
    </>
  );
};


const SidebarContent = () => {
    const { user } = useCrmData();
    return (
        <>
        <div className="flex items-center justify-center h-20 flex-shrink-0 px-4">
            <div className="bg-white/20 p-2 rounded-lg flex items-center justify-center h-14 w-14">
            {user?.companyLogoUrl ? (
                <img src={user.companyLogoUrl} alt="Company Logo" className="h-10 w-10 object-contain" />
            ) : (
                <AmsLogo className="h-10 w-auto text-white" />
            )}
            </div>
            <h1 className="ml-3 text-xl font-bold text-white">AMS Enterprise</h1>
        </div>
        <div className="flex-1 flex flex-col overflow-y-auto">
            <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation.map((item) => (
                <NavLink
                key={item.name}
                to={item.href}
                end={item.href === '/'}
                className={({ isActive }) =>
                    `flex items-center px-4 py-2.5 text-sm font-medium rounded-md transition-colors duration-200 ${
                    isActive
                        ? 'bg-black/20 text-white dark:bg-primary dark:text-text-on-primary'
                        : 'text-violet-100 dark:text-slate-300 hover:bg-black/10 hover:text-white'
                    }`
                }
                >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
                </NavLink>
            ))}
            </nav>
        </div>
        <div className="flex-shrink-0 flex p-4">
            <a
                href="#"
                className="flex-shrink-0 group block w-full"
            >
                <div className="flex items-center px-4 py-2.5 text-sm font-medium rounded-md text-violet-100 dark:text-slate-300 hover:bg-black/10 hover:text-white">
                <LogoutIcon className="mr-3 h-5 w-5" />
                Logout
                </div>
            </a>
        </div>
        </>
    );
};

export default Sidebar;