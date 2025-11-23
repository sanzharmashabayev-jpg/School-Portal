import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { XIcon, HomeIcon, NewspaperIcon, CalendarIcon, VoteIcon, BellIcon, UserIcon } from 'lucide-react';
interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}
export function MobileNav({
  isOpen,
  onClose
}: MobileNavProps) {
  const location = useLocation();
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
  }, {
    name: 'Профиль',
    href: '/portal/profile',
    icon: UserIcon
  }];
  if (!isOpen) return null;
  return <div className="fixed inset-0 flex z-40 md:hidden">
      <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={onClose}></div>
      <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
        <div className="absolute top-0 right-0 -mr-12 pt-2">
          <button type="button" className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white" onClick={onClose}>
            <span className="sr-only">Закрыть меню</span>
            <XIcon className="h-6 w-6 text-white" />
          </button>
        </div>
        <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
          <div className="flex-shrink-0 flex items-center px-4">
            <span className="text-blue-600 font-bold text-xl">
              Shoqan Portal
            </span>
          </div>
          <nav className="mt-5 px-2 space-y-1">
            {navigation.map(item => {
            const isActive = location.pathname === item.href;
            return <Link key={item.name} to={item.href} className={`group flex items-center px-2 py-2 text-base font-medium rounded-md ${isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'}`} onClick={onClose}>
                  <item.icon className={`mr-4 h-6 w-6 ${isActive ? 'text-blue-600' : 'text-gray-500'}`} />
                  {item.name}
                </Link>;
          })}
          </nav>
        </div>
        <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
          <div className="flex items-center">
            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
              <UserIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-3">
              <p className="text-base font-medium text-gray-700">Иван Иванов</p>
              <p className="text-sm text-gray-500">Ученик</p>
            </div>
          </div>
        </div>
      </div>
    </div>;
}