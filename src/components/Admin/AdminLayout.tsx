import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LayoutDashboardIcon, NewspaperIcon, CalendarIcon, VoteIcon, BellIcon, LogOutIcon, ShieldCheckIcon, MenuIcon, XIcon } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface AdminLayoutProps {
  children: React.ReactNode;
}
export function AdminLayout({
  children
}: AdminLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigation = [{
    name: 'Панель управления',
    href: '/admin/dashboard',
    icon: LayoutDashboardIcon
  }, {
    name: 'Управление новостями',
    href: '/admin/news',
    icon: NewspaperIcon
  }, {
    name: 'Управление событиями',
    href: '/admin/events',
    icon: CalendarIcon
  }, {
    name: 'Управление опросами',
    href: '/admin/polls',
    icon: VoteIcon
  }, {
    name: 'Управление объявлениями',
    href: '/admin/announcements',
    icon: BellIcon
  }];
  const handleLogout = async () => {
    await signOut();
    navigate('/admin/login');
  };
  return <div className="flex h-screen bg-gradient-to-br from-green-900 via-green-800 to-green-900">
      {/* Mobile sidebar */}
      {sidebarOpen && <div className="fixed inset-0 flex z-40 md:hidden">
          <div className="fixed inset-0 bg-green-600 bg-opacity-75" onClick={() => setSidebarOpen(false)}></div>
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-green-900">
            <div className="absolute top-0 right-0 -mr-12 pt-2">
              <button onClick={() => setSidebarOpen(false)} className="ml-1 flex items-center justify-center h-10 w-10 rounded-full">
                <XIcon className="h-6 w-6 text-white" />
              </button>
            </div>
            <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
              <div className="flex items-center px-4 mb-8">
                <ShieldCheckIcon className="h-8 w-8 text-red-500" />
                <span className="ml-2 text-white font-bold text-xl">
                  Admin Panel
                </span>
              </div>
              <nav className="px-2 space-y-1">
                {navigation.map(item => {
              const isActive = location.pathname === item.href;
              return <Link key={item.name} to={item.href} onClick={() => setSidebarOpen(false)} className={`group flex items-center px-2 py-2 text-base font-medium rounded-md ${isActive ? 'bg-red-600 text-white' : 'text-green-400 hover:bg-green-700'}`}>
                      <item.icon className="mr-4 h-6 w-6" />
                      {item.name}
                    </Link>;
            })}
              </nav>
            </div>
          </div>
        </div>}
      {/* Desktop sidebar */}
      <div className="hidden md:flex md:w-72 md:flex-col">
        <div className="flex flex-col flex-1 bg-green-900 border-r border-green-700">
          <div className="flex items-center h-16 px-6 border-b border-green-700">
            <ShieldCheckIcon className="h-8 w-8 text-red-500" />
            <span className="ml-2 text-white font-bold text-xl">
              Admin Panel
            </span>
          </div>
          <nav className="flex-1 px-3 py-6 space-y-2">
            {navigation.map(item => {
            const isActive = location.pathname === item.href;
            return <Link key={item.name} to={item.href} className={`flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all ${isActive ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg' : 'text-green-400 hover:bg-green-800'}`}>
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>;
          })}
          </nav>
          <div className="p-4 border-t border-green-700">
            <button onClick={handleLogout} className="w-full flex items-center justify-center px-4 py-3 text-sm font-medium text-red-400 hover:bg-green-800 rounded-xl transition-all">
              <LogOutIcon className="mr-2 h-4 w-4" />
              Выйти
            </button>
          </div>
        </div>
      </div>
      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Mobile header */}
        <div className="md:hidden flex items-center justify-between px-4 py-3 bg-green-900 border-b border-green-700">
          <button onClick={() => setSidebarOpen(true)} className="text-green-400 hover:text-white">
            <MenuIcon className="h-6 w-6" />
          </button>
          <div className="flex items-center">
            <ShieldCheckIcon className="h-6 w-6 text-red-500" />
            <span className="ml-2 text-white font-bold">Admin</span>
          </div>
          <div className="w-6"></div>
        </div>
        <main className="flex-1 overflow-y-auto bg-gradient-to-br from-green-50 via-green-100 to-green-200 p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>;
}