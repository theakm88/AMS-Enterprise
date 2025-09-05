import React, { useState, useRef, useEffect } from 'react';
import { HashRouter, Routes, Route, Outlet, useLocation, Link } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import RetailerManagement from './components/RetailerManagement';
import TransactionsViewer from './components/TransactionsViewer';
import Reports from './components/Reports';
import Settings from './components/Settings';
import ProfileModal from './components/ProfileModal';
import { useCrmData } from './hooks/useCrmData';
import { MenuIcon, SunIcon, MoonIcon, ProfileIcon, LogoutIcon } from './components/icons/Icons';
import { useTheme } from './contexts/ThemeContext';
import RetailerDetail from './components/RetailerDetail';

const pageTitles: { [key: string]: string } = {
  '/': 'Dashboard',
  '/retailers': 'Retailer Management',
  '/transactions': 'Transactions Viewer',
  '/reports': 'EOD Reports',
  '/settings': 'Settings & Profile',
};

const Header: React.FC<{ onMenuClick: () => void, onProfileClick: () => void }> = ({ onMenuClick, onProfileClick }) => {
  const location = useLocation();
  let title = pageTitles[location.pathname] || 'CRM';
  if (location.pathname.startsWith('/retailers/') && location.pathname.length > '/retailers'.length + 1) {
    title = 'Retailer Details';
  }
  const { theme, toggleTheme } = useTheme();
  const { user } = useCrmData();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="bg-transparent z-10 sticky top-0">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
        <div className="flex items-center">
            <button
                type="button"
                className="text-text-secondary md:hidden mr-4"
                onClick={onMenuClick}
            >
                <span className="sr-only">Open sidebar</span>
                <MenuIcon className="h-6 w-6" />
            </button>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-text-primary">{title}</h1>
        </div>
        <div className="flex items-center space-x-2 sm:space-x-4">
            <button
                onClick={toggleTheme}
                className="p-2 rounded-full text-text-secondary hover:bg-surface-hover"
                aria-label="Toggle theme"
            >
                {theme === 'light' ? <MoonIcon className="h-6 w-6" /> : <SunIcon className="h-6 w-6" />}
            </button>
            
            {user && (
            <div className="relative" ref={profileMenuRef}>
                <button onClick={() => setIsProfileOpen(!isProfileOpen)} className="flex items-center space-x-2 cursor-pointer p-1 rounded-md hover:bg-surface-hover">
                    <img className="h-9 w-9 rounded-full object-cover" src={user.profilePictureUrl} alt="User" />
                    <div className="hidden sm:block">
                        <p className="font-semibold text-sm text-text-primary">{user.name}</p>
                        <p className="text-xs text-text-secondary">{user.role}</p>
                    </div>
                </button>
                {isProfileOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-surface rounded-md shadow-lg py-1 z-20 animate-fade-in origin-top-right">
                        <button onClick={() => { onProfileClick(); setIsProfileOpen(false); }} className="w-full text-left flex items-center px-4 py-2 text-sm text-text-primary hover:bg-surface-hover">
                            <ProfileIcon className="h-5 w-5 mr-3" />
                            Your Profile
                        </button>
                        <a href="#" className="flex items-center px-4 py-2 text-sm text-text-primary hover:bg-surface-hover">
                            <LogoutIcon className="h-5 w-5 mr-3" />
                            Logout
                        </a>
                    </div>
                )}
            </div>
            )}
        </div>
      </div>
    </header>
  );
};

const AppLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    const { user, updateUser } = useCrmData();

    return (
        <div className="flex h-screen bg-background">
            <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
            <main className="flex-1 overflow-y-auto">
                <Header onMenuClick={() => setSidebarOpen(true)} onProfileClick={() => setIsProfileModalOpen(true)} />
                <div className="p-4 sm:p-6 lg:p-8 pt-0">
                    <Outlet context={{ openProfileModal: () => setIsProfileModalOpen(true) }} />
                </div>
            </main>
            {isProfileModalOpen && user && (
                <ProfileModal 
                    user={user} 
                    onClose={() => setIsProfileModalOpen(false)} 
                    onSave={(updatedUser) => {
                        updateUser(updatedUser);
                        setIsProfileModalOpen(false);
                    }}
                />
            )}
        </div>
    );
};


const App = () => {
  return (
    <HashRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/retailers" element={<RetailerManagement />} />
          <Route path="/retailers/:retailerId" element={<RetailerDetail />} />
          <Route path="/transactions" element={<TransactionsViewer />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Routes>
    </HashRouter>
  );
};

export default App;