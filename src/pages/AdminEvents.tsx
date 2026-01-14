import React, { useState, useCallback } from 'react';
import { Card } from '../components/UI/Card';
import { Button } from '../components/UI/Button';
import { AdminModal } from '../components/Admin/AdminModal';
import { ImageUpload } from '../components/UI/ImageUpload';
import { PostPreview } from '../components/UI/PostPreview';
import { PlusIcon, EditIcon, TrashIcon, SearchIcon, FilterIcon, CalendarIcon, EyeIcon } from 'lucide-react';
import { useData, Event } from '../contexts/DataContext';

export function AdminEvents() {
  const { events, addEvent, updateEvent, deleteEvent } = useData();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'school' | 'olympiad'>('all');
  const [newEvent, setNewEvent] = useState({
    title: '',
    type: 'school' as 'school' | 'olympiad',
    subject: '',
    date: '',
    time: '',
    location: '',
    description: '',
    image: '',
    status: 'Активно' as 'Активно' | 'Завершено' | 'Отменено'
  });

  const subjects = [
    'Математика',
    'Физика',
    'Химия',
    'Биология',
    'Информатика',
    'Русский язык',
    'Литература',
    'История',
    'География',
    'Английский язык',
    'Немецкий язык',
    'Французский язык',
    'Обществознание',
    'Экономика',
    'Астрономия',
    'Экология',
    'ОБЖ',
    'Физкультура',
    'Искусство',
    'Музыка',
    'Технология',
    'Другое'
  ];
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addEvent(newEvent);
    setShowAddModal(false);
    setNewEvent({
      title: '',
      type: 'school',
      subject: '',
      date: '',
      time: '',
      location: '',
      description: '',
      image: '',
      status: 'Активно'
    });
  };
  const handleEdit = (event: Event) => {
    setSelectedEvent(event);
    setNewEvent({
      title: event.title,
      type: event.type,
      subject: event.subject || '',
      date: event.date,
      time: event.time,
      location: event.location,
      description: event.description,
      image: event.image || '',
      status: event.status
    });
    setShowEditModal(true);
  };
  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEvent) return;
    updateEvent(selectedEvent.id, newEvent);
    setShowEditModal(false);
    setSelectedEvent(null);
    setNewEvent({
      title: '',
      type: 'school',
      subject: '',
      date: '',
      time: '',
      location: '',
      description: '',
      image: '',
      status: 'Активно'
    });
  };
  const handleDelete = (id: number) => {
    if (confirm('Вы уверены, что хотите удалить это событие?')) {
      deleteEvent(id);
    }
  };
  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) || event.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterType === 'all' || event.type === filterType;
    return matchesSearch && matchesFilter;
  });
  const handleEventFieldChange = useCallback((field: keyof typeof newEvent) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setNewEvent(prev => ({ ...prev, [field]: e.target.value }));
  }, []);

  const EventForm = ({
    onSubmit,
    isEdit = false
  }: {
    onSubmit: (e: React.FormEvent) => void;
    isEdit?: boolean;
  }) => {
    const [showPreview, setShowPreview] = useState(false);
    
    return <>
      <form onSubmit={onSubmit} className="p-6 space-y-6">
      <div>
        <label className="block text-sm font-semibold text-green-700 mb-2">
          Название события *
        </label>
        <input type="text" value={newEvent.title} onChange={handleEventFieldChange('title')} className="w-full px-4 py-3 rounded-xl border border-green-400 focus:ring-2 focus:ring-red-500 focus:border-transparent" placeholder="Введите название события" required />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-green-700 mb-2">
            Тип события *
          </label>
          <select value={newEvent.type} onChange={handleEventFieldChange('type')} className="w-full px-4 py-3 rounded-xl border border-green-400 focus:ring-2 focus:ring-red-500 focus:border-transparent" required>
            <option value="school">Школьное мероприятие</option>
            <option value="olympiad">Олимпиада/Конкурс</option>
          </select>
        </div>
        {newEvent.type === 'olympiad' && (
          <div>
            <label className="block text-sm font-semibold text-green-700 mb-2">
              Предмет *
            </label>
            <select value={newEvent.subject} onChange={handleEventFieldChange('subject')} className="w-full px-4 py-3 rounded-xl border border-green-400 focus:ring-2 focus:ring-red-500 focus:border-transparent" required={newEvent.type === 'olympiad'}>
              <option value="">Выберите предмет</option>
              {subjects.map(subject => (
                <option key={subject} value={subject}>{subject}</option>
              ))}
            </select>
          </div>
        )}
        <div>
          <label className="block text-sm font-semibold text-green-700 mb-2">
            Статус
          </label>
          <select value={newEvent.status} onChange={handleEventFieldChange('status')} className="w-full px-4 py-3 rounded-xl border border-green-400 focus:ring-2 focus:ring-red-500 focus:border-transparent">
            <option value="Активно">Активно</option>
            <option value="Завершено">Завершено</option>
            <option value="Отменено">Отменено</option>
          </select>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-green-700 mb-2">
            Дата *
          </label>
          <input type="date" value={newEvent.date} onChange={handleEventFieldChange('date')} className="w-full px-4 py-3 rounded-xl border border-green-400 focus:ring-2 focus:ring-red-500 focus:border-transparent" required />
        </div>
        <div>
          <label className="block text-sm font-semibold text-green-700 mb-2">
            Время *
          </label>
          <input type="text" value={newEvent.time} onChange={handleEventFieldChange('time')} className="w-full px-4 py-3 rounded-xl border border-green-400 focus:ring-2 focus:ring-red-500 focus:border-transparent" placeholder="10:00 - 15:00" required />
        </div>
      </div>
      <div>
        <label className="block text-sm font-semibold text-green-700 mb-2">
          Место проведения *
        </label>
        <input type="text" value={newEvent.location} onChange={handleEventFieldChange('location')} className="w-full px-4 py-3 rounded-xl border border-green-400 focus:ring-2 focus:ring-red-500 focus:border-transparent" placeholder="Актовый зал" required />
      </div>
      <div>
        <label className="block text-sm font-semibold text-green-700 mb-2">
          Описание *
        </label>
        <textarea value={newEvent.description} onChange={handleEventFieldChange('description')} rows={6} className="w-full px-4 py-3 rounded-xl border border-green-400 focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none" placeholder="Введите описание события" required />
      </div>
      <div>
        <ImageUpload
          value={newEvent.image || ''}
          onChange={(value) => setNewEvent(prev => ({ ...prev, image: value }))}
          label="Изображение события"
        />
      </div>
      <div className="flex justify-between items-center pt-4 border-t border-green-200">
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => setShowPreview(true)}
          icon={<EyeIcon className="h-4 w-4" />}
        >
          Предпросмотр
        </Button>
        <div className="flex space-x-3">
        <Button type="button" variant="outline" onClick={() => {
        if (isEdit) {
          setShowEditModal(false);
        } else {
          setShowAddModal(false);
        }
        setNewEvent({
          title: '',
          type: 'school',
            subject: '',
          date: '',
          time: '',
          location: '',
          description: '',
            image: '',
          status: 'Активно'
        });
      }}>
          Отмена
        </Button>
        <Button type="submit" className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800">
          {isEdit ? 'Сохранить изменения' : 'Создать событие'}
        </Button>
      </div>
      </div>
    </form>
    
    {showPreview && (
      <PostPreview
        title={newEvent.title}
        content={newEvent.description}
        image={newEvent.image}
        onClose={() => setShowPreview(false)}
        type="event"
        eventDetails={{
          date: newEvent.date,
          time: newEvent.time,
          location: newEvent.location,
          subject: newEvent.subject
        }}
      />
    )}
  </>;
  };
  return <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-green-900">
            Управление событиями
          </h1>
          <p className="mt-2 text-green-600">Всего событий: {events.length}</p>
        </div>
        <Button onClick={() => setShowAddModal(true)} icon={<PlusIcon className="h-5 w-5" />} className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800">
          Добавить событие
        </Button>
      </div>
      <Card>
        <div className="p-6 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-green-500" />
              <input type="text" placeholder="Поиск событий..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-3 border border-green-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent" />
            </div>
            <div className="flex items-center space-x-2">
              <FilterIcon className="h-5 w-5 text-green-500" />
              <select value={filterType} onChange={e => setFilterType(e.target.value as typeof filterType)} className="px-4 py-3 border border-green-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent">
                <option value="all">Все типы</option>
                <option value="school">Школьные мероприятия</option>
                <option value="olympiad">Олимпиады/Конкурсы</option>
              </select>
            </div>
          </div>
        </div>
      </Card>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredEvents.length === 0 ? <Card className="lg:col-span-2">
            <div className="p-12 text-center">
              <CalendarIcon className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <p className="text-green-600">Событий не найдено</p>
            </div>
          </Card> : filteredEvents.map(event => <Card key={event.id} hover>
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2 flex-wrap gap-2">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${event.type === 'school' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'}`}>
                        {event.type === 'school' ? 'Школьное' : 'Олимпиада'}
                      </span>
                      {event.subject && (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800">
                          {event.subject}
                        </span>
                      )}
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${event.status === 'Активно' ? 'bg-green-100 text-green-800' : event.status === 'Завершено' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {event.status}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-green-900 mb-3">
                      {event.title}
                    </h3>
                  </div>
                  <div className="flex space-x-2">
                    <button onClick={() => handleEdit(event)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all" title="Редактировать">
                      <EditIcon className="h-4 w-4" />
                    </button>
                    <button onClick={() => handleDelete(event.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all" title="Удалить">
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <div className="space-y-2 text-sm text-green-600">
                  {event.subject && (
                    <p>
                      <strong>Предмет:</strong> {event.subject}
                    </p>
                  )}
                  <p>
                    <strong>Дата:</strong> {event.date}
                  </p>
                  <p>
                    <strong>Время:</strong> {event.time}
                  </p>
                  <p>
                    <strong>Место:</strong> {event.location}
                  </p>
                  <p className="line-clamp-2">{event.description}</p>
                </div>
              </div>
            </Card>)}
      </div>
      <AdminModal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Добавить событие" size="lg">
        <EventForm onSubmit={handleSubmit} />
      </AdminModal>
      <AdminModal isOpen={showEditModal} onClose={() => {
      setShowEditModal(false);
      setSelectedEvent(null);
    }} title="Редактировать событие" size="lg">
        <EventForm onSubmit={handleUpdate} isEdit />
      </AdminModal>
    </div>;
}