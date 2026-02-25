import { Card } from '../components/UI/Card';
import { Link } from 'react-router-dom';
import { NewspaperIcon, CalendarIcon, VoteIcon, BellIcon } from 'lucide-react';
import { useData } from '../contexts/DataContext';

export function Home() {
  const { newsItems, events } = useData();
  
  // Фильтруем и берем первые 3 элемента
  const publishedNews = newsItems
    .filter(news => news.status === 'Опубликовано')
    .slice(0, 3);
  
  const activeEvents = events
    .filter(event => event.status === 'Активно')
    .slice(0, 3);

  // Функция для форматирования даты в "время назад"
  const getTimeAgo = (dateString: string) => {
    let date: Date;
    if (dateString.includes('T')) {
      date = new Date(dateString);
    } else {
      date = new Date(dateString + 'T00:00:00');
    }
    
    const now = new Date();
    if (isNaN(date.getTime())) {
      return 'недавно';
    }
    
    const diffMs = now.getTime() - date.getTime();
    if (diffMs < 0) {
      return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' });
    }
    
    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffSeconds < 60) return 'только что';
    if (diffMinutes < 60) return `${diffMinutes} ${diffMinutes === 1 ? 'минуту' : diffMinutes < 5 ? 'минуты' : 'минут'} назад`;
    if (diffHours < 24) return `${diffHours} ${diffHours === 1 ? 'час' : diffHours < 5 ? 'часа' : 'часов'} назад`;
    if (diffDays === 1) return 'вчера';
    if (diffDays < 7) return `${diffDays} ${diffDays === 1 ? 'день' : diffDays < 5 ? 'дня' : 'дней'} назад`;
    return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined });
  };

  // Функция для форматирования даты события
  const formatEventDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
  };
  return <div className="space-y-8">
      <div className="text-center md:text-left">
        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-800 to-green-900">
          Добро пожаловать в Shoqan Portal
        </h1>
        <p className="mt-2 text-lg text-green-600">
          Все новости и события школьной жизни в одном месте
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Link to="/portal/news">
          <Card hover className="p-6 group">
            <div className="flex items-center">
              <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-green-700 to-green-900 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                <NewspaperIcon className="h-7 w-7 text-white" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-green-900">Новости</h3>
                <p className="text-sm text-green-600">Последние события школы</p>
              </div>
            </div>
          </Card>
        </Link>
        <Link to="/portal/events">
          <Card hover className="p-6 group">
            <div className="flex items-center">
              <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-green-600 to-green-800 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                <CalendarIcon className="h-7 w-7 text-white" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-green-900">События</h3>
                <p className="text-sm text-green-600">Календарь мероприятий</p>
              </div>
            </div>
          </Card>
        </Link>
        <Link to="/portal/polls">
          <Card hover className="p-6 group">
            <div className="flex items-center">
              <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-green-600 to-green-700 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                <VoteIcon className="h-7 w-7 text-white" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-green-900">Опросы</h3>
                <p className="text-sm text-green-600">Голосования и опросы</p>
              </div>
            </div>
          </Card>
        </Link>
        <Link to="/portal/announcements">
          <Card hover className="p-6 group">
            <div className="flex items-center">
              <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-green-800 to-black flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                <BellIcon className="h-7 w-7 text-white" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-green-900">
                  Объявления
                </h3>
                <p className="text-sm text-green-600">Важная информация</p>
              </div>
            </div>
          </Card>
        </Link>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <div className="p-6 border-b border-green-200">
              <h3 className="text-xl font-bold text-green-900">
                Последние новости
              </h3>
            </div>
            <div className="divide-y divide-green-200">
              {publishedNews.length === 0 ? (
                <div className="p-6 text-center text-green-600">
                  Пока нет новостей
                </div>
              ) : (
                publishedNews.map(news => (
                  <Link key={news.id} to="/portal/news" className="block">
                    <div className="p-6 hover:bg-white/50 transition-colors cursor-pointer">
                      <p className="text-sm text-green-800 font-semibold">
                        {news.category}
                      </p>
                      <h4 className="mt-2 text-lg font-semibold text-green-900">
                        {news.title}
                      </h4>
                      <p className="mt-2 text-sm text-green-600 line-clamp-2">
                        {news.content}
                      </p>
                      <div className="mt-3 flex items-center text-xs text-green-600">
                        <span>{getTimeAgo(news.date)}</span>
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </div>
            <div className="p-6 border-t border-green-200">
              <Link to="/portal/news" className="text-sm text-green-800 font-semibold hover:text-green-900 transition-colors">
                Все новости →
              </Link>
            </div>
          </Card>
        </div>
        <div>
          <Card>
            <div className="p-6 border-b border-green-200">
              <h3 className="text-xl font-bold text-green-900">
                Ближайшие события
              </h3>
            </div>
            <div className="divide-y divide-green-200">
              {activeEvents.length === 0 ? (
                <div className="p-6 text-center text-green-600">
                  Пока нет событий
                </div>
              ) : (
                activeEvents.map(event => (
                  <Link key={event.id} to="/portal/events" className="block">
                    <div className="p-6 hover:bg-white/50 transition-colors cursor-pointer">
                      <p className="text-xs text-green-600 font-medium">
                        {formatEventDate(event.date)}
                      </p>
                      <h4 className="mt-2 text-sm font-semibold text-green-900">
                        {event.title}
                      </h4>
                      <p className="mt-1 text-xs text-green-600">
                        {event.time && event.location ? `${event.time} • ${event.location}` : event.time || event.location || ''}
                      </p>
                    </div>
                  </Link>
                ))
              )}
            </div>
            <div className="p-6 border-t border-green-200">
              <Link to="/portal/events" className="text-sm text-green-800 font-semibold hover:text-green-900 transition-colors">
                Все события →
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>;
}