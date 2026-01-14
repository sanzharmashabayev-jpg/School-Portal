import React from 'react';
import { Card } from '../components/UI/Card';
import { NewspaperIcon, CalendarIcon, VoteIcon, BellIcon, UsersIcon, TrendingUpIcon } from 'lucide-react';
export function AdminDashboard() {
  const stats = [{
    name: 'Всего новостей',
    value: '24',
    icon: NewspaperIcon,
    change: '+12%',
    changeType: 'positive'
  }, {
    name: 'Активных событий',
    value: '8',
    icon: CalendarIcon,
    change: '+5%',
    changeType: 'positive'
  }, {
    name: 'Открытых опросов',
    value: '5',
    icon: VoteIcon,
    change: '-2%',
    changeType: 'negative'
  }, {
    name: 'Пользователей',
    value: '342',
    icon: UsersIcon,
    change: '+18%',
    changeType: 'positive'
  }];
  return <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-green-900">Панель управления</h1>
        <p className="mt-2 text-green-600">
          Обзор статистики и управление контентом
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map(stat => <Card key={stat.name}>
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div className="p-3 rounded-xl bg-gradient-to-br from-red-50 to-red-100">
                  <stat.icon className="h-6 w-6 text-red-600" />
                </div>
                <span className={`text-sm font-semibold ${stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.change}
                </span>
              </div>
              <div className="mt-4">
                <p className="text-sm text-green-600">{stat.name}</p>
                <p className="text-3xl font-bold text-green-900 mt-1">
                  {stat.value}
                </p>
              </div>
            </div>
          </Card>)}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-bold text-green-900 mb-4">
              Последние действия
            </h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="p-2 rounded-lg bg-green-100">
                  <NewspaperIcon className="h-4 w-4 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-green-900">
                    Новость опубликована
                  </p>
                  <p className="text-xs text-green-600">2 часа назад</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="p-2 rounded-lg bg-blue-100">
                  <CalendarIcon className="h-4 w-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-green-900">
                    Событие обновлено
                  </p>
                  <p className="text-xs text-green-600">5 часов назад</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="p-2 rounded-lg bg-purple-100">
                  <VoteIcon className="h-4 w-4 text-purple-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-green-900">
                    Опрос создан
                  </p>
                  <p className="text-xs text-green-600">1 день назад</p>
                </div>
              </div>
            </div>
          </div>
        </Card>
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-bold text-green-900 mb-4">
              Быстрые действия
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <button className="p-4 rounded-xl bg-gradient-to-br from-red-50 to-red-100 hover:from-red-100 hover:to-red-200 transition-all text-left">
                <NewspaperIcon className="h-5 w-5 text-red-600 mb-2" />
                <p className="text-sm font-semibold text-green-900">
                  Добавить новость
                </p>
              </button>
              <button className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 transition-all text-left">
                <CalendarIcon className="h-5 w-5 text-blue-600 mb-2" />
                <p className="text-sm font-semibold text-green-900">
                  Создать событие
                </p>
              </button>
              <button className="p-4 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 transition-all text-left">
                <VoteIcon className="h-5 w-5 text-purple-600 mb-2" />
                <p className="text-sm font-semibold text-green-900">
                  Новый опрос
                </p>
              </button>
              <button className="p-4 rounded-xl bg-gradient-to-br from-orange-50 to-orange-100 hover:from-orange-100 hover:to-orange-200 transition-all text-left">
                <BellIcon className="h-5 w-5 text-orange-600 mb-2" />
                <p className="text-sm font-semibold text-green-900">
                  Объявление
                </p>
              </button>
            </div>
          </div>
        </Card>
      </div>
    </div>;
}