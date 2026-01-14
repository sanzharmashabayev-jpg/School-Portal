import React, { useState, useCallback } from 'react';
import { Card } from '../components/UI/Card';
import { Button } from '../components/UI/Button';
import { AdminModal } from '../components/Admin/AdminModal';
import { PlusIcon, EditIcon, TrashIcon, SearchIcon, FilterIcon, BellIcon } from 'lucide-react';
import { useData, Announcement } from '../contexts/DataContext';

export function AdminAnnouncements() {
  const { announcements, addAnnouncement, updateAnnouncement, deleteAnnouncement } = useData();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'info' | 'warning' | 'event'>('all');
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: '',
    content: '',
    type: 'info' as 'info' | 'warning' | 'event',
    from: ''
  });
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addAnnouncement(newAnnouncement);
    setShowAddModal(false);
    setNewAnnouncement({
      title: '',
      content: '',
      type: 'info',
      from: ''
    });
  };
  const handleEdit = (announcement: Announcement) => {
    setSelectedAnnouncement(announcement);
    setNewAnnouncement({
      title: announcement.title,
      content: announcement.content,
      type: announcement.type,
      from: announcement.from
    });
    setShowEditModal(true);
  };
  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAnnouncement) return;
    updateAnnouncement(selectedAnnouncement.id, newAnnouncement);
    setShowEditModal(false);
    setSelectedAnnouncement(null);
    setNewAnnouncement({
      title: '',
      content: '',
      type: 'info',
      from: ''
    });
  };
  const handleDelete = (id: number) => {
    if (confirm('Вы уверены, что хотите удалить это объявление?')) {
      deleteAnnouncement(id);
    }
  };
  const filteredAnnouncements = announcements.filter(announcement => {
    const matchesSearch = announcement.title.toLowerCase().includes(searchQuery.toLowerCase()) || announcement.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterType === 'all' || announcement.type === filterType;
    return matchesSearch && matchesFilter;
  });
  const handleAnnouncementFieldChange = useCallback((field: keyof typeof newAnnouncement) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setNewAnnouncement(prev => ({ ...prev, [field]: e.target.value }));
  }, []);

  const AnnouncementForm = ({
    onSubmit,
    isEdit = false
  }: {
    onSubmit: (e: React.FormEvent) => void;
    isEdit?: boolean;
  }) => <form onSubmit={onSubmit} className="p-6 space-y-6">
      <div>
        <label className="block text-sm font-semibold text-green-700 mb-2">
          Заголовок *
        </label>
        <input type="text" value={newAnnouncement.title} onChange={handleAnnouncementFieldChange('title')} className="w-full px-4 py-3 rounded-xl border border-green-400 focus:ring-2 focus:ring-red-500 focus:border-transparent" placeholder="Введите заголовок объявления" required />
      </div>
      <div>
        <label className="block text-sm font-semibold text-green-700 mb-2">
          Содержание *
        </label>
        <textarea value={newAnnouncement.content} onChange={handleAnnouncementFieldChange('content')} rows={8} className="w-full px-4 py-3 rounded-xl border border-green-400 focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none" placeholder="Введите содержание объявления" required />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-green-700 mb-2">
            Тип объявления *
          </label>
          <select value={newAnnouncement.type} onChange={handleAnnouncementFieldChange('type')} className="w-full px-4 py-3 rounded-xl border border-green-400 focus:ring-2 focus:ring-red-500 focus:border-transparent" required>
            <option value="info">Информация</option>
            <option value="warning">Важно</option>
            <option value="event">Событие</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold text-green-700 mb-2">
            От кого *
          </label>
          <input type="text" value={newAnnouncement.from} onChange={handleAnnouncementFieldChange('from')} className="w-full px-4 py-3 rounded-xl border border-green-400 focus:ring-2 focus:ring-red-500 focus:border-transparent" placeholder="Администрация школы" required />
        </div>
      </div>
      <div className="flex justify-end space-x-3 pt-4 border-t border-green-200">
        <Button type="button" variant="outline" onClick={() => {
        if (isEdit) {
          setShowEditModal(false);
        } else {
          setShowAddModal(false);
        }
        setNewAnnouncement({
          title: '',
          content: '',
          type: 'info',
          from: ''
        });
      }}>
          Отмена
        </Button>
        <Button type="submit" className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800">
          {isEdit ? 'Сохранить изменения' : 'Опубликовать объявление'}
        </Button>
      </div>
    </form>;
  return <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-green-900">
            Управление объявлениями
          </h1>
          <p className="mt-2 text-green-600">
            Всего объявлений: {announcements.length}
          </p>
        </div>
        <Button onClick={() => setShowAddModal(true)} icon={<PlusIcon className="h-5 w-5" />} className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800">
          Добавить объявление
        </Button>
      </div>
      <Card>
        <div className="p-6 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-green-500" />
              <input type="text" placeholder="Поиск объявлений..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-3 border border-green-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent" />
            </div>
            <div className="flex items-center space-x-2">
              <FilterIcon className="h-5 w-5 text-green-500" />
              <select value={filterType} onChange={e => setFilterType(e.target.value as typeof filterType)} className="px-4 py-3 border border-green-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent">
                <option value="all">Все типы</option>
                <option value="info">Информация</option>
                <option value="warning">Важно</option>
                <option value="event">События</option>
              </select>
            </div>
          </div>
        </div>
      </Card>
      <div className="space-y-4">
        {filteredAnnouncements.length === 0 ? <Card>
            <div className="p-12 text-center">
              <BellIcon className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <p className="text-green-600">Объявлений не найдено</p>
            </div>
          </Card> : filteredAnnouncements.map(announcement => <Card key={announcement.id} hover>
              <div className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-3">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${announcement.type === 'warning' ? 'bg-amber-100 text-amber-800' : announcement.type === 'event' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                        {announcement.type === 'warning' ? 'Важно' : announcement.type === 'event' ? 'Событие' : 'Информация'}
                      </span>
                      <span className="text-sm text-green-600">
                        {announcement.date}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-green-900 mb-2">
                      {announcement.title}
                    </h3>
                    <p className="text-green-600 mb-2">{announcement.content}</p>
                    <p className="text-sm text-green-600">
                      От: {announcement.from}
                    </p>
                  </div>
                  <div className="flex flex-col space-y-2">
                    <button onClick={() => handleEdit(announcement)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all" title="Редактировать">
                      <EditIcon className="h-5 w-5" />
                    </button>
                    <button onClick={() => handleDelete(announcement.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all" title="Удалить">
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            </Card>)}
      </div>
      <AdminModal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Добавить объявление" size="lg">
        <AnnouncementForm onSubmit={handleSubmit} />
      </AdminModal>
      <AdminModal isOpen={showEditModal} onClose={() => {
      setShowEditModal(false);
      setSelectedAnnouncement(null);
    }} title="Редактировать объявление" size="lg">
        <AnnouncementForm onSubmit={handleUpdate} isEdit />
      </AdminModal>
    </div>;
}