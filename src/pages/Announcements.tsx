import React, { useState, useMemo } from 'react';
import { Card } from '../components/UI/Card';
import { Button } from '../components/UI/Button';
import { BellIcon, AlertTriangleIcon, InfoIcon, CalendarIcon, SearchIcon, CheckCircleIcon, XIcon } from 'lucide-react';
import { useData, Announcement } from '../contexts/DataContext';

interface AnnouncementWithRead extends Announcement {
  isRead: boolean;
}

export function Announcements() {
  const { announcements: dataAnnouncements } = useData();
  const [readStatus, setReadStatus] = useState<Record<number, boolean>>({});
  
  // Преобразуем объявления с добавлением статуса прочтения
  const announcements = useMemo(() => {
    return dataAnnouncements.map(ann => ({
      ...ann,
      isRead: readStatus[ann.id] || false
    }));
  }, [dataAnnouncements, readStatus]);
  
  // Функция для форматирования даты
  const formatDate = (dateString: string) => {
    // Handle both old format (YYYY-MM-DD) and new format (ISO string)
    let date: Date;
    if (dateString.includes('T')) {
      date = new Date(dateString);
    } else {
      // Old format - just date, add current time for proper parsing
      date = new Date(dateString + 'T00:00:00');
    }
    
    if (isNaN(date.getTime())) {
      return dateString; // Return original if invalid
    }
    
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    const isYesterday = date.toDateString() === new Date(now.getTime() - 86400000).toDateString();
    
    if (isToday) {
      return `Сегодня, ${date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}`;
    }
    if (isYesterday) {
      return `Вчера, ${date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}`;
    }
    
    return date.toLocaleDateString('ru-RU', { 
      day: 'numeric', 
      month: 'long', 
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'info' | 'warning' | 'event' | 'unread'>('all');
  const toggleReadStatus = (id: number) => {
    setReadStatus(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };
  const markAllAsRead = () => {
    const allRead: Record<number, boolean> = {};
    announcements.forEach(ann => {
      allRead[ann.id] = true;
    });
    setReadStatus(allRead);
  };
  const deleteAnnouncement = (id: number) => {
    // Удаление только из локального состояния прочтения
    const newReadStatus = { ...readStatus };
    delete newReadStatus[id];
    setReadStatus(newReadStatus);
  };
  const filteredAnnouncements = announcements.filter(announcement => {
    const matchesSearch = announcement.title.toLowerCase().includes(searchQuery.toLowerCase()) || announcement.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || selectedFilter === 'unread' && !announcement.isRead || announcement.type === selectedFilter;
    return matchesSearch && matchesFilter;
  });
  const unreadCount = announcements.filter(a => !a.isRead).length;
  const getIcon = (type: string) => {
    switch (type) {
      case 'warning':
        return <AlertTriangleIcon className="h-6 w-6 text-amber-500" />;
      case 'event':
        return <CalendarIcon className="h-6 w-6 text-green-500" />;
      case 'info':
      default:
        return <InfoIcon className="h-6 w-6 text-blue-500" />;
    }
  };
  const getBadgeColor = (type: string) => {
    switch (type) {
      case 'warning':
        return 'bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800';
      case 'event':
        return 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800';
      case 'info':
      default:
        return 'bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800';
    }
  };
  return <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-800 to-green-900">
            Объявления
          </h1>
          <p className="mt-2 text-green-600">
            Важная информация от администрации и учителей
            {unreadCount > 0 && <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gradient-to-r from-red-500 to-pink-500 text-white">
                {unreadCount} непрочитанных
              </span>}
          </p>
        </div>
        {unreadCount > 0 && <Button variant="outline" size="sm" onClick={markAllAsRead} icon={<CheckCircleIcon className="h-4 w-4" />}>
            Отметить все как прочитанные
          </Button>}
      </div>

      <Card>
        <div className="p-6 space-y-4">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-green-500" />
            <input type="text" placeholder="Поиск объявлений..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-3 border border-green-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-800 focus:border-transparent transition-all" />
          </div>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => setSelectedFilter('all')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${selectedFilter === 'all' ? 'bg-gradient-to-r from-green-800 to-green-900 text-white shadow-lg' : 'bg-white text-green-700 border border-green-400 hover:bg-green-50'}`}>
              Все
            </button>
            <button onClick={() => setSelectedFilter('unread')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${selectedFilter === 'unread' ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg' : 'bg-white text-green-700 border border-green-400 hover:bg-green-50'}`}>
              Непрочитанные {unreadCount > 0 && `(${unreadCount})`}
            </button>
            <button onClick={() => setSelectedFilter('info')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${selectedFilter === 'info' ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg' : 'bg-white text-green-700 border border-green-400 hover:bg-green-50'}`}>
              Информация
            </button>
            <button onClick={() => setSelectedFilter('warning')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${selectedFilter === 'warning' ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg' : 'bg-white text-green-700 border border-green-400 hover:bg-green-50'}`}>
              Важно
            </button>
            <button onClick={() => setSelectedFilter('event')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${selectedFilter === 'event' ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg' : 'bg-white text-green-700 border border-green-400 hover:bg-green-50'}`}>
              События
            </button>
          </div>
        </div>
      </Card>

      <div className="space-y-6">
        {filteredAnnouncements.length === 0 ? <Card>
            <div className="p-12 text-center">
              <BellIcon className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-green-900 mb-2">
                Объявлений не найдено
              </h3>
              <p className="text-green-600">
                Попробуйте изменить фильтры или поисковый запрос
              </p>
            </div>
          </Card> : filteredAnnouncements.map(announcement => <Card key={announcement.id} hover>
              <div className={`p-8 ${!announcement.isRead ? 'bg-gradient-to-r from-blue-50/50 to-indigo-50/50' : ''}`}>
                <div className="flex items-start">
                  <div className="flex-shrink-0 mr-4 p-3 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50">
                    {getIcon(announcement.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-bold text-green-900">
                            {announcement.title}
                          </h3>
                          {!announcement.isRead && <span className="flex-shrink-0 h-2.5 w-2.5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full ring-2 ring-blue-100"></span>}
                        </div>
                        <span className={`inline-flex items-center px-4 py-2 rounded-full text-xs font-semibold ${getBadgeColor(announcement.type)}`}>
                          {announcement.type === 'warning' ? 'Важно' : announcement.type === 'event' ? 'Событие' : 'Информация'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => toggleReadStatus(announcement.id)} className="p-2 rounded-lg text-green-600 hover:text-blue-600 hover:bg-blue-50 transition-all" title={announcement.isRead ? 'Отметить как непрочитанное' : 'Отметить как прочитанное'}>
                          <CheckCircleIcon className={`h-5 w-5 ${announcement.isRead ? 'text-green-500' : ''}`} />
                        </button>
                        <button onClick={() => deleteAnnouncement(announcement.id)} className="p-2 rounded-lg text-green-600 hover:text-red-600 hover:bg-red-50 transition-all" title="Удалить объявление">
                          <XIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                    <p className="mt-3 text-sm text-green-600 leading-relaxed">
                      {announcement.content}
                    </p>
                    <div className="mt-4 flex items-center text-xs text-green-600">
                      <span className="font-medium">{formatDate(announcement.date)}</span>
                      <span className="mx-2">•</span>
                      <span>От: {announcement.from}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>)}
      </div>
    </div>;
}