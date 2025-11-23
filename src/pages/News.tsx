import React from 'react';
import { Card } from '../components/UI/Card';
import { Button } from '../components/UI/Button';
import { ThumbsUpIcon, MessageSquareIcon, ShareIcon } from 'lucide-react';
export function News() {
  const newsItems = [{
    id: 1,
    category: 'Школьные новости',
    title: 'Победа нашей команды на городской олимпиаде по математике',
    content: 'Наши ученики заняли первое место в городской олимпиаде по математике среди школ города. Поздравляем победителей и их преподавателей с отличным результатом!',
    image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    time: '2 часа назад',
    likes: 24,
    comments: 8
  }, {
    id: 2,
    category: 'Мероприятия',
    title: 'Школьный театр представляет новую постановку',
    content: 'В эту пятницу школьный театр представит новую постановку по произведению А.П. Чехова "Вишневый сад". Приглашаем всех учеников и родителей поддержать наших талантливых актеров!',
    image: 'https://images.unsplash.com/photo-1503095396549-807759245b35?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    time: '1 день назад',
    likes: 42,
    comments: 15
  }, {
    id: 3,
    category: 'Достижения',
    title: 'Наша школа вошла в топ-10 школ региона',
    content: 'По результатам ежегодного рейтинга образовательных учреждений наша школа вошла в десятку лучших школ региона. Это результат упорного труда всего коллектива и наших талантливых учеников.',
    image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    time: '3 дня назад',
    likes: 87,
    comments: 23
  }];
  return <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-800 to-gray-900">
          Новости
        </h1>
        <p className="mt-2 text-gray-600">
          Следите за последними событиями школьной жизни
        </p>
      </div>
      <div className="space-y-6">
        {newsItems.map(news => <Card key={news.id} hover>
            <div className="md:flex">
              <div className="md:flex-shrink-0">
                <img className="h-56 w-full object-cover md:h-full md:w-64 rounded-t-2xl md:rounded-l-2xl md:rounded-tr-none" src={news.image} alt={news.title} />
              </div>
              <div className="p-6 md:p-8 flex flex-col justify-between flex-1">
                <div>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800">
                    {news.category}
                  </span>
                  <h3 className="mt-3 text-2xl font-bold text-gray-900">
                    {news.title}
                  </h3>
                  <p className="mt-3 text-base text-gray-600 leading-relaxed">
                    {news.content}
                  </p>
                </div>
                <div className="mt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-gray-500">
                      <span>{news.time}</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <button className="flex items-center px-3 py-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-all">
                        <ThumbsUpIcon className="h-4 w-4 mr-1.5" />
                        <span className="text-sm font-medium">
                          {news.likes}
                        </span>
                      </button>
                      <button className="flex items-center px-3 py-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-all">
                        <MessageSquareIcon className="h-4 w-4 mr-1.5" />
                        <span className="text-sm font-medium">
                          {news.comments}
                        </span>
                      </button>
                      <button className="flex items-center px-3 py-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-all">
                        <ShareIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>)}
      </div>
      <div className="flex justify-center">
        <Button variant="outline" size="lg">
          Загрузить еще
        </Button>
      </div>
    </div>;
}