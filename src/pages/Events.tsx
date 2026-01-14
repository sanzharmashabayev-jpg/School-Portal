import React, { useState, useMemo } from 'react';
import { Card } from '../components/UI/Card';
import { Button } from '../components/UI/Button';
import { CalendarIcon, MapPinIcon, ClockIcon, UsersIcon, FilterIcon } from 'lucide-react';
import { useData } from '../contexts/DataContext';

export function Events() {
  const { events } = useData();
  const [activeTab, setActiveTab] = useState<'school' | 'olympiads'>('school');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  
  const activeEvents = useMemo(() => events.filter(e => e.status === 'Активно'), [events]);
  const schoolEvents = useMemo(() => activeEvents.filter(e => e.type === 'school'), [activeEvents]);
  
  // Получаем все уникальные предметы из олимпиад
  const allSubjects = useMemo(() => {
    const subjects = activeEvents
      .filter(e => e.type === 'olympiad' && e.subject)
      .map(e => e.subject!)
      .filter((value, index, self) => self.indexOf(value) === index)
      .sort();
    return subjects;
  }, [activeEvents]);
  
  // Фильтруем олимпиады по выбранному предмету
  const olympiads = useMemo(() => {
    let filtered = activeEvents.filter(e => e.type === 'olympiad');
    if (selectedSubject !== 'all') {
      filtered = filtered.filter(e => e.subject === selectedSubject);
    }
    return filtered;
  }, [activeEvents, selectedSubject]);
  
  // Функция для форматирования даты
  const formatDate = (dateString: string) => {
    // Handle both old format (YYYY-MM-DD) and new format (ISO string)
    let date: Date;
    if (dateString.includes('T')) {
      date = new Date(dateString);
    } else {
      // Old format - just date
      date = new Date(dateString + 'T00:00:00');
    }
    
    if (isNaN(date.getTime())) {
      return dateString; // Return original if invalid
    }
    
    return date.toLocaleDateString('ru-RU', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric'
    });
  };
  return <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-800 to-green-900">
          События
        </h1>
        <p className="mt-2 text-green-600">
          Календарь школьных мероприятий и олимпиад
        </p>
      </div>
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
      <div className="glass-effect rounded-2xl p-1 inline-flex space-x-1">
          <button className={`py-2 px-6 font-semibold text-sm rounded-xl transition-all ${activeTab === 'school' ? 'bg-gradient-to-r from-green-800 to-green-900 text-white shadow-lg' : 'text-green-700 hover:bg-white/50'}`} onClick={() => {
            setActiveTab('school');
            setSelectedSubject('all');
          }}>
          Школьные мероприятия
        </button>
        <button className={`py-2 px-6 font-semibold text-sm rounded-xl transition-all ${activeTab === 'olympiads' ? 'bg-gradient-to-r from-green-800 to-green-900 text-white shadow-lg' : 'text-green-700 hover:bg-white/50'}`} onClick={() => setActiveTab('olympiads')}>
          Олимпиады и конкурсы
        </button>
        </div>
        
        {activeTab === 'olympiads' && allSubjects.length > 0 && (
          <div className="flex items-center space-x-2">
            <FilterIcon className="h-5 w-5 text-green-600" />
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="px-4 py-2 rounded-xl border border-green-400 focus:ring-2 focus:ring-green-600 focus:border-transparent bg-white text-green-700 font-medium"
            >
              <option value="all">Все предметы</option>
              {allSubjects.map(subject => (
                <option key={subject} value={subject}>{subject}</option>
              ))}
            </select>
          </div>
        )}
      </div>
      {activeTab === 'school' ? <div className="space-y-6">
          {schoolEvents.length === 0 ? (
            <Card>
              <div className="p-12 text-center">
                <p className="text-green-600">Нет активных школьных мероприятий</p>
              </div>
            </Card>
          ) : (
            schoolEvents.map(event => <Card key={event.id} hover>
              <div className={event.image ? "md:flex" : ""}>
                {event.image && (
                  <div className="md:flex-shrink-0">
                    <img className="h-56 w-full object-cover md:h-full md:w-64 rounded-t-2xl md:rounded-l-2xl md:rounded-tr-none" src={event.image} alt={event.title} style={{ aspectRatio: '16/9', objectFit: 'cover' }} />
                  </div>
                )}
                <div className={event.image ? "p-8 flex-1" : "p-8"}>
                <h3 className="text-xl font-bold text-green-900">
                  {event.title}
                </h3>
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center text-sm text-green-600">
                    <div className="p-2 rounded-lg bg-green-50 mr-3">
                      <CalendarIcon className="h-4 w-4 text-green-700" />
                    </div>
                    <span className="font-medium">{formatDate(event.date)}</span>
                  </div>
                  <div className="flex items-center text-sm text-green-600">
                    <div className="p-2 rounded-lg bg-green-50 mr-3">
                      <ClockIcon className="h-4 w-4 text-green-700" />
                    </div>
                    <span className="font-medium">{event.time}</span>
                  </div>
                  <div className="flex items-center text-sm text-green-600">
                    <div className="p-2 rounded-lg bg-green-50 mr-3">
                      <MapPinIcon className="h-4 w-4 text-green-700" />
                    </div>
                    <span className="font-medium">{event.location}</span>
                  </div>
                </div>
                <p className="mt-4 text-sm text-green-600 leading-relaxed">
                  {event.description}
                </p>
                <div className="mt-6">
                  <Button variant="outline" size="sm">
                    Подробнее
                  </Button>
                  </div>
                </div>
              </div>
            </Card>)
          )}
        </div> : <div className="space-y-6">
          {olympiads.length === 0 ? (
            <Card>
              <div className="p-12 text-center">
                <p className="text-green-600">Нет активных олимпиад и конкурсов</p>
              </div>
            </Card>
          ) : (
            olympiads.map(olympiad => <Card key={olympiad.id} hover>
              <div className={olympiad.image ? "md:flex" : ""}>
                {olympiad.image && (
                  <div className="md:flex-shrink-0">
                    <img className="h-56 w-full object-cover md:h-full md:w-64 rounded-t-2xl md:rounded-l-2xl md:rounded-tr-none" src={olympiad.image} alt={olympiad.title} />
                  </div>
                )}
                <div className={olympiad.image ? "p-8 flex-1" : "p-8"}>
                <div className="flex items-center space-x-2 mb-3">
                <h3 className="text-xl font-bold text-green-900">
                  {olympiad.title}
                </h3>
                  {olympiad.subject && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800">
                      {olympiad.subject}
                    </span>
                  )}
                </div>
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center text-sm text-green-600">
                    <div className="p-2 rounded-lg bg-green-50 mr-3">
                      <CalendarIcon className="h-4 w-4 text-green-700" />
                    </div>
                    <span className="font-medium">{olympiad.date}</span>
                  </div>
                  <div className="flex items-center text-sm text-green-600">
                    <div className="p-2 rounded-lg bg-green-50 mr-3">
                      <ClockIcon className="h-4 w-4 text-green-700" />
                    </div>
                    <span className="font-medium">{olympiad.time}</span>
                  </div>
                  <div className="flex items-center text-sm text-green-600">
                    <div className="p-2 rounded-lg bg-green-50 mr-3">
                      <MapPinIcon className="h-4 w-4 text-green-700" />
                    </div>
                    <span className="font-medium">{olympiad.location}</span>
                  </div>
                </div>
                <p className="mt-4 text-sm text-green-600 leading-relaxed">
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
              </div>
            </Card>)
          )}
        </div>}
    </div>;
}