import React from 'react';
import { Card } from '../components/UI/Card';
import { Button } from '../components/UI/Button';
import { UserIcon, MailIcon, PhoneIcon, BookOpenIcon } from 'lucide-react';
export function Profile() {
  const user = {
    name: 'Иван Иванов',
    role: 'Ученик',
    class: '10А',
    email: 'ivan.ivanov@school.ru',
    phone: '+7 (123) 456-78-90',
    avatar: null,
    stats: {
      events: 12,
      polls: 8,
      suggestions: 3
    }
  };
  return <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-800 to-gray-900">
          Профиль
        </h1>
        <p className="mt-2 text-gray-600">
          Управление личной информацией и настройками
        </p>
      </div>
      <div className="max-w-2xl mx-auto space-y-6">
        <Card>
          <div className="p-8">
            <div className="flex flex-col items-center">
              <div className="h-28 w-28 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center shadow-xl">
                {user.avatar ? <img src={user.avatar} alt={user.name} className="h-28 w-28 rounded-full" /> : <UserIcon className="h-14 w-14 text-white" />}
              </div>
              <h3 className="mt-4 text-xl font-bold text-gray-900">
                {user.name}
              </h3>
              <div className="mt-2 flex items-center space-x-2">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800">
                  {user.role}
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800">
                  Класс: {user.class}
                </span>
              </div>
              <div className="mt-6 grid grid-cols-3 gap-4 w-full">
                <div className="text-center p-4 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100">
                  <span className="block text-2xl font-bold text-gray-800">
                    {user.stats.events}
                  </span>
                  <span className="block text-xs text-gray-600 mt-1">
                    События
                  </span>
                </div>
                <div className="text-center p-4 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100">
                  <span className="block text-2xl font-bold text-gray-800">
                    {user.stats.polls}
                  </span>
                  <span className="block text-xs text-gray-600 mt-1">
                    Опросы
                  </span>
                </div>
                <div className="text-center p-4 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100">
                  <span className="block text-2xl font-bold text-gray-800">
                    {user.stats.suggestions}
                  </span>
                  <span className="block text-xs text-gray-600 mt-1">Идеи</span>
                </div>
              </div>
              <div className="mt-6 w-full">
                <Button variant="outline" className="w-full">
                  Редактировать профиль
                </Button>
              </div>
            </div>
          </div>
        </Card>
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-bold text-gray-900">
              Контактная информация
            </h3>
            <div className="mt-4 space-y-4">
              <div className="flex items-center p-3 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100">
                <div className="p-2 rounded-lg bg-white shadow-sm">
                  <MailIcon className="h-5 w-5 text-gray-700" />
                </div>
                <span className="ml-3 text-sm font-medium text-gray-700">
                  {user.email}
                </span>
              </div>
              <div className="flex items-center p-3 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100">
                <div className="p-2 rounded-lg bg-white shadow-sm">
                  <PhoneIcon className="h-5 w-5 text-gray-700" />
                </div>
                <span className="ml-3 text-sm font-medium text-gray-700">
                  {user.phone}
                </span>
              </div>
              <div className="flex items-center p-3 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100">
                <div className="p-2 rounded-lg bg-white shadow-sm">
                  <BookOpenIcon className="h-5 w-5 text-gray-700" />
                </div>
                <span className="ml-3 text-sm font-medium text-gray-700">
                  Класс {user.class}
                </span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>;
}