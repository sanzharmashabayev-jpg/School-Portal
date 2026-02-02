import React, { Children } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HomeIcon, NewspaperIcon, CalendarIcon, VoteIcon, BellIcon, UserIcon, LogOutIcon } from 'lucide-react';
const container = {
  hidden: {
    opacity: 0
  },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
};
const item = {
  hidden: {
    opacity: 0,
    x: -20
  },
  show: {
    opacity: 1,
    x: 0
  }
};
export function StaggeredMenu() {
  const location = useLocation();
  const navigate = useNavigate();
  const navigation = [{
    name: 'Главная',
    href: '/portal',
    icon: HomeIcon
  }, {
    name: 'Новости',
    href: '/portal/news',
    icon: NewspaperIcon
  }, {
    name: 'События',
    href: '/portal/events',
    icon: CalendarIcon
  }, {
    name: 'Опросы',
    href: '/portal/polls',
    icon: VoteIcon
  }, {
    name: 'Объявления',
    href: '/portal/announcements',
    icon: BellIcon
  }];
  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    navigate('/');
  };
  return <div className="w-72 glass-effect h-full border-r border-green-200 flex flex-col shadow-xl">
      <motion.div initial={{
      opacity: 0,
      y: -10
    }} animate={{
      opacity: 1,
      y: 0
    }} transition={{
      duration: 0.3
    }} className="p-6 border-b border-green-200">
        <Link to="/" className="flex items-center">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-800 to-green-900 font-bold text-2xl">
            Shoqan Portal
          </span>
        </Link>
      </motion.div>
      <nav className="flex-1 pt-6 pb-4 px-3">
        <motion.ul variants={container} initial="hidden" animate="show" className="space-y-2">
          {navigation.map(navItem => {
          const isActive = location.pathname === navItem.href;
          return <motion.li key={navItem.name} variants={item}>
                <Link to={navItem.href} className={`flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all ${isActive ? 'bg-gradient-to-r from-green-800 to-green-900 text-white shadow-lg shadow-green-600/50' : 'text-green-700 hover:bg-white/50 hover:shadow-md'}`}>
                  <navItem.icon className="mr-3 h-5 w-5" />
                  {navItem.name}
                </Link>
              </motion.li>;
        })}
        </motion.ul>
      </nav>
      <motion.div initial={{
      opacity: 0,
      y: 10
    }} animate={{
      opacity: 1,
      y: 0
    }} transition={{
      duration: 0.3,
      delay: 0.6
    }} className="p-4 border-t border-green-200 m-3 space-y-3">
        <div className="flex items-center p-3 rounded-xl bg-gradient-to-br from-green-50 to-green-100 hover:shadow-md transition-shadow">
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-green-700 to-green-900 flex items-center justify-center shadow-lg">
            <UserIcon className="h-5 w-5 text-white" />
          </div>
          <div className="ml-3">
            <p className="text-xs text-green-600">Ученик</p>
          </div>
        </div>
        <button onClick={handleLogout} className="w-full flex items-center justify-center px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition-all">
          <LogOutIcon className="mr-2 h-4 w-4" />
          Выйти
        </button>
      </motion.div>
    </div>;
}