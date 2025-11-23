import React from 'react';
import { Card } from '../components/UI/Card';
import { Link } from 'react-router-dom';
import { NewspaperIcon, CalendarIcon, VoteIcon, BellIcon } from 'lucide-react';
export function Home() {
  return <div className="space-y-8">
      <div className="text-center md:text-left">
        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-800 to-gray-900">
          Добро пожаловать в Shoqan Portal
        </h1>
        <p className="mt-2 text-lg text-gray-600">
          Все новости и события школьной жизни в одном месте
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Link to="/portal/news">
          <Card hover className="p-6 group">
            <div className="flex items-center">
              <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                <NewspaperIcon className="h-7 w-7 text-white" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Новости</h3>
                <p className="text-sm text-gray-600">Последние события школы</p>
              </div>
            </div>
          </Card>
        </Link>
        <Link to="/portal/events">
          <Card hover className="p-6 group">
            <div className="flex items-center">
              <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                <CalendarIcon className="h-7 w-7 text-white" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">События</h3>
                <p className="text-sm text-gray-600">Календарь мероприятий</p>
              </div>
            </div>
          </Card>
        </Link>
        <Link to="/portal/polls">
          <Card hover className="p-6 group">
            <div className="flex items-center">
              <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-gray-500 to-gray-700 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                <VoteIcon className="h-7 w-7 text-white" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Опросы</h3>
                <p className="text-sm text-gray-600">Голосования и опросы</p>
              </div>
            </div>
          </Card>
        </Link>
        <Link to="/portal/announcements">
          <Card hover className="p-6 group">
            <div className="flex items-center">
              <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-gray-800 to-black flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                <BellIcon className="h-7 w-7 text-white" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Объявления
                </h3>
                <p className="text-sm text-gray-600">Важная информация</p>
              </div>
            </div>
          </Card>
        </Link>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">
                Последние новости
              </h3>
            </div>
            <div className="divide-y divide-gray-200">
              {[1, 2, 3].map(item => <div key={item} className="p-6 hover:bg-white/50 transition-colors cursor-pointer">
                  <p className="text-sm text-gray-800 font-semibold">
                    Школьные новости
                  </p>
                  <h4 className="mt-2 text-lg font-semibold text-gray-900">
                    Победа нашей команды на городской олимпиаде по математике
                  </h4>
                  <p className="mt-2 text-sm text-gray-600">
                    Наши ученики заняли первое место в городской олимпиаде по
                    математике среди школ города.
                  </p>
                  <div className="mt-3 flex items-center text-xs text-gray-500">
                    <span>2 часа назад</span>
                    <span className="mx-2">•</span>
                    <span>15 комментариев</span>
                  </div>
                </div>)}
            </div>
            <div className="p-6 border-t border-gray-200">
              <Link to="/portal/news" className="text-sm text-gray-800 font-semibold hover:text-gray-900 transition-colors">
                Все новости →
              </Link>
            </div>
          </Card>
        </div>
        <div>
          <Card>
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">
                Ближайшие события
              </h3>
            </div>
            <div className="divide-y divide-gray-200">
              {[1, 2, 3].map(item => <div key={item} className="p-6 hover:bg-white/50 transition-colors cursor-pointer">
                  <p className="text-xs text-gray-500 font-medium">
                    26 октября, 2023
                  </p>
                  <h4 className="mt-2 text-sm font-semibold text-gray-900">
                    День открытых дверей
                  </h4>
                  <p className="mt-1 text-xs text-gray-600">
                    10:00 - 15:00 • Актовый зал
                  </p>
                </div>)}
            </div>
            <div className="p-6 border-t border-gray-200">
              <Link to="/portal/events" className="text-sm text-gray-800 font-semibold hover:text-gray-900 transition-colors">
                Все события →
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>;
}