import React, { useMemo } from 'react';
import { Card } from '../components/UI/Card';
import { Button } from '../components/UI/Button';
import { ThumbsUpIcon, MessageSquareIcon, ShareIcon } from 'lucide-react';
import { useData } from '../contexts/DataContext';

export function News() {
  const { newsItems } = useData();
  const publishedNews = useMemo(() => newsItems.filter(news => news.status === 'Опубликовано'), [newsItems]);
  
  // Функция для форматирования даты в "время назад"
  const getTimeAgo = (dateString: string) => {
    // Handle both old format (YYYY-MM-DD) and new format (ISO string)
    let date: Date;
    if (dateString.includes('T')) {
      date = new Date(dateString);
    } else {
      // Old format - just date, treat as midnight of that day
      date = new Date(dateString + 'T00:00:00');
    }
    
    const now = new Date();
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return 'недавно';
    }
    
    const diffMs = now.getTime() - date.getTime();
    
    // If negative (future date), return formatted date
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
  return <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-800 to-green-900">
          Новости
        </h1>
        <p className="mt-2 text-green-600">
          Следите за последними событиями школьной жизни
        </p>
      </div>
      <div className="space-y-6">
        {publishedNews.length === 0 ? (
          <Card>
            <div className="p-12 text-center">
              <p className="text-green-600">Пока нет опубликованных новостей</p>
            </div>
          </Card>
        ) : (
          publishedNews.map(news => <Card key={news.id} hover>
            <div className="md:flex">
              {news.image && (
                <div className="md:flex-shrink-0">
                  <img className="h-56 w-full object-cover md:h-full md:w-64 rounded-t-2xl md:rounded-l-2xl md:rounded-tr-none" src={news.image} alt={news.title} style={{ aspectRatio: '16/9', objectFit: 'cover' }} />
                </div>
              )}
              <div className="p-6 md:p-8 flex flex-col justify-between flex-1">
                <div>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-green-100 to-green-200 text-green-800">
                    {news.category}
                  </span>
                  <h3 className="mt-3 text-2xl font-bold text-green-900">
                    {news.title}
                  </h3>
                  <p className="mt-3 text-base text-green-600 leading-relaxed">
                    {news.content}
                  </p>
                </div>
                <div className="mt-6">
                    <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-green-600">
                      <span>{getTimeAgo(news.date)}</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <button className="flex items-center px-3 py-2 rounded-lg text-green-600 hover:text-green-900 hover:bg-green-50 transition-all">
                        <ThumbsUpIcon className="h-4 w-4 mr-1.5" />
                        <span className="text-sm font-medium">0</span>
                      </button>
                      <button className="flex items-center px-3 py-2 rounded-lg text-green-600 hover:text-green-900 hover:bg-green-50 transition-all">
                        <MessageSquareIcon className="h-4 w-4 mr-1.5" />
                        <span className="text-sm font-medium">0</span>
                      </button>
                      <button className="flex items-center px-3 py-2 rounded-lg text-green-600 hover:text-green-900 hover:bg-green-50 transition-all">
                        <ShareIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>)
        )}
      </div>
      <div className="flex justify-center">
        <Button variant="outline" size="lg">
          Загрузить еще
        </Button>
      </div>
    </div>;
}