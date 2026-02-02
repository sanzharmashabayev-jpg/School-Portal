import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MenuIcon, BellIcon, LogOutIcon } from 'lucide-react';
import { MetallicLogo } from '../MetallicLogo';
interface HeaderProps {
  onMenuClick: () => void;
}
export function Header({
  onMenuClick
}: HeaderProps) {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    navigate('/');
  };
  return <header className="glass-effect border-b border-green-200 sticky top-0 z-10 shadow-sm">
      <div className="flex items-center justify-between px-4 md:px-6 py-3">
        <div className="flex items-center space-x-3">
          <button type="button" className="md:hidden text-green-600 hover:text-green-900 focus:outline-none transition-colors" onClick={onMenuClick}>
            <MenuIcon className="h-6 w-6" />
          </button>
          <div className="md:hidden">
            <MetallicLogo />
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button className="relative p-2 text-green-600 hover:text-green-900 focus:outline-none transition-colors rounded-full hover:bg-green-50">
            <BellIcon className="h-5 w-5" />
            <span className="absolute top-1 right-1 h-2 w-2 bg-gradient-to-r from-red-500 to-pink-500 rounded-full ring-2 ring-white"></span>
          </button>
          <button onClick={handleLogout} className="hidden md:flex items-center px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-all">
            <LogOutIcon className="h-4 w-4 mr-1" />
            Выйти
          </button>
        </div>
      </div>
    </header>;
}