import React, { useState } from 'react';
import { Card } from '../components/UI/Card';
import { Button } from '../components/UI/Button';
import { CalendarIcon, MapPinIcon, ClockIcon, UsersIcon } from 'lucide-react';
export function Events() {
  const [activeTab, setActiveTab] = useState<'school' | 'olympiads'>('school');
  const schoolEvents = [{
    id: 1,
    title: 'День открытых дверей',
    date: '26 октября, 2023',
    time: '10:00 - 15:00',
    location: 'Актовый зал',
    description: 'Приглашаем всех родителей и будущих учеников познакомиться с нашей школой, учителями и образовательными программами.',
    participants: 45
  }, {
    id: 2,
    title: 'Школьный концерт ко Дню учителя',
    date: '5 октября, 2023',
    time: '13:00 - 14:30',
    location: 'Актовый зал',
    description: 'Праздничный концерт, подготовленный учениками, в честь Дня учителя. В программе: музыкальные номера, танцы и поздравления.',
    participants: 120
  }, {
    id: 3,
    title: 'Родительское собрание',
    date: '15 октября, 2023',
    time: '18:00 - 19:30',
    location: 'Кабинет 204',
    description: 'Обсуждение учебного процесса, успеваемости и предстоящих мероприятий. Явка родителей обязательна.',
    participants: 28
  }];
  const olympiads = [{
    id: 1,
    title: 'Городская олимпиада по математике',
    date: '12 ноября, 2023',
    time: '10:00 - 13:00',
    location: 'Гимназия №5',
    description: 'Ежегодная городская олимпиада по математике для учеников 8-11 классов. Регистрация обязательна.',
    registrationDeadline: '5 ноября, 2023'
  }, {
    id: 2,
    title: 'Всероссийская олимпиада по физике (школьный этап)',
    date: '20 октября, 2023',
    time: '14:00 - 16:00',
    location: 'Кабинет физики',
    description: 'Школьный этап всероссийской олимпиады по физике. По результатам будут отобраны участники для городского этапа.',
    registrationDeadline: '18 октября, 2023'
  }, {
    id: 3,
    title: 'Международный конкурс "Кенгуру"',
    date: '15 декабря, 2023',
    time: '12:00 - 13:30',
    location: 'Учебные кабинеты',
    description: 'Международный математический конкурс-игра для учеников всех классов. Участие добровольное.',
    registrationDeadline: '1 декабря, 2023'
  }];
  return <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-800 to-gray-900">
          События
        </h1>
        <p className="mt-2 text-gray-600">
          Календарь школьных мероприятий и олимпиад
        </p>
      </div>
      <div className="glass-effect rounded-2xl p-1 inline-flex space-x-1">
        <button className={`py-2 px-6 font-semibold text-sm rounded-xl transition-all ${activeTab === 'school' ? 'bg-gradient-to-r from-gray-800 to-gray-900 text-white shadow-lg' : 'text-gray-700 hover:bg-white/50'}`} onClick={() => setActiveTab('school')}>
          Школьные мероприятия
        </button>
        <button className={`py-2 px-6 font-semibold text-sm rounded-xl transition-all ${activeTab === 'olympiads' ? 'bg-gradient-to-r from-gray-800 to-gray-900 text-white shadow-lg' : 'text-gray-700 hover:bg-white/50'}`} onClick={() => setActiveTab('olympiads')}>
          Олимпиады и конкурсы
        </button>
      </div>
      {activeTab === 'school' ? <div className="space-y-6">
          {schoolEvents.map(event => <Card key={event.id} hover>
              <div className="p-8">
                <h3 className="text-xl font-bold text-gray-900">
                  {event.title}
                </h3>
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <div className="p-2 rounded-lg bg-gray-50 mr-3">
                      <CalendarIcon className="h-4 w-4 text-gray-700" />
                    </div>
                    <span className="font-medium">{event.date}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <div className="p-2 rounded-lg bg-gray-50 mr-3">
                      <ClockIcon className="h-4 w-4 text-gray-700" />
                    </div>
                    <span className="font-medium">{event.time}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <div className="p-2 rounded-lg bg-gray-50 mr-3">
                      <MapPinIcon className="h-4 w-4 text-gray-700" />
                    </div>
                    <span className="font-medium">{event.location}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <div className="p-2 rounded-lg bg-gray-50 mr-3">
                      <UsersIcon className="h-4 w-4 text-gray-700" />
                    </div>
                    <span className="font-medium">
                      {event.participants} участников
                    </span>
                  </div>
                </div>
                <p className="mt-4 text-sm text-gray-600 leading-relaxed">
                  {event.description}
                </p>
                <div className="mt-6">
                  <Button variant="outline" size="sm">
                    Подробнее
                  </Button>
                </div>
              </div>
            </Card>)}
        </div> : <div className="space-y-6">
          {olympiads.map(olympiad => <Card key={olympiad.id} hover>
              <div className="p-8">
                <h3 className="text-xl font-bold text-gray-900">
                  {olympiad.title}
                </h3>
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <div className="p-2 rounded-lg bg-gray-50 mr-3">
                      <CalendarIcon className="h-4 w-4 text-gray-700" />
                    </div>
                    <span className="font-medium">{olympiad.date}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <div className="p-2 rounded-lg bg-gray-50 mr-3">
                      <ClockIcon className="h-4 w-4 text-gray-700" />
                    </div>
                    <span className="font-medium">{olympiad.time}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <div className="p-2 rounded-lg bg-gray-50 mr-3">
                      <MapPinIcon className="h-4 w-4 text-gray-700" />
                    </div>
                    <span className="font-medium">{olympiad.location}</span>
                  </div>
                  <div className="flex items-center text-sm text-red-600">
                    <div className="p-2 rounded-lg bg-red-50 mr-3">
                      <CalendarIcon className="h-4 w-4 text-red-600" />
                    </div>
                    <span className="font-semibold">
                      До: {olympiad.registrationDeadline}
                    </span>
                  </div>
                </div>
                <p className="mt-4 text-sm text-gray-600 leading-relaxed">
                  {olympiad.description}
                </p>
                <div className="mt-6 flex space-x-3">
                  <Button variant="primary" size="sm">
                    Зарегистрироваться
                  </Button>
                  <Button variant="outline" size="sm">
                    Подробнее
                  </Button>
                </div>
              </div>
            </Card>)}
        </div>}
    </div>;
}