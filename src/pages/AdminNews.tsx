import React, { useState, useCallback } from 'react';
import { Card } from '../components/UI/Card';
import { Button } from '../components/UI/Button';
import { AdminModal } from '../components/Admin/AdminModal';
import { ImageUpload } from '../components/UI/ImageUpload';
import { PostPreview } from '../components/UI/PostPreview';
import { PlusIcon, EditIcon, TrashIcon, ImageIcon, SearchIcon, FilterIcon, EyeIcon } from 'lucide-react';
import { useData, NewsItem } from '../contexts/DataContext';

interface NewsFormData {
  title: string;
  category: string;
  content: string;
  image: string;
  status: 'Опубликовано' | 'Черновик';
}

interface NewsFormProps {
  onSubmit: (e: React.FormEvent) => void;
  isEdit?: boolean;
  newNews: NewsFormData;
  setNewNews: React.Dispatch<React.SetStateAction<NewsFormData>>;
  setShowAddModal: React.Dispatch<React.SetStateAction<boolean>>;
  setShowEditModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const NewsForm = React.memo(function NewsFormComponent({
  onSubmit,
  isEdit = false,
  newNews,
  setNewNews,
  setShowAddModal,
  setShowEditModal
}: NewsFormProps) {
  const [showPreview, setShowPreview] = useState(false);
  
  return <>
    <form onSubmit={onSubmit} className="p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-green-700 mb-2">
            Заголовок *
          </label>
          <input type="text" value={newNews.title} onChange={e => setNewNews(prev => ({ ...prev, title: e.target.value }))} className="w-full px-4 py-3 rounded-xl border border-green-400 focus:ring-2 focus:ring-red-500 focus:border-transparent" placeholder="Введите заголовок новости" required />
        </div>
        <div>
          <label className="block text-sm font-semibold text-green-700 mb-2">
            Категория *
          </label>
          <select value={newNews.category} onChange={e => setNewNews(prev => ({ ...prev, category: e.target.value }))} className="w-full px-4 py-3 rounded-xl border border-green-400 focus:ring-2 focus:ring-red-500 focus:border-transparent" required>
            <option value="">Выберите категорию</option>
            <option value="Школьные новости">Школьные новости</option>
            <option value="Мероприятия">Мероприятия</option>
            <option value="Достижения">Достижения</option>
            <option value="Объявления">Объявления</option>
          </select>
        </div>
      </div>
      <div>
        <label className="block text-sm font-semibold text-green-700 mb-2">
          Содержание *
        </label>
        <textarea value={newNews.content} onChange={e => setNewNews(prev => ({ ...prev, content: e.target.value }))} rows={8} className="w-full px-4 py-3 rounded-xl border border-green-400 focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none" placeholder="Введите содержание новости" required />
      </div>
      <div>
        <ImageUpload
          value={newNews.image}
          onChange={(value) => setNewNews(prev => ({ ...prev, image: value }))}
          label="Изображение"
        />
      </div>
      <div>
        <label className="block text-sm font-semibold text-green-700 mb-2">
          Статус
        </label>
        <div className="flex space-x-4">
          <label className="flex items-center cursor-pointer">
            <input type="radio" value="Опубликовано" checked={newNews.status === 'Опубликовано'} onChange={e => setNewNews(prev => ({ ...prev, status: e.target.value as 'Опубликовано' | 'Черновик' }))} className="h-4 w-4 text-red-600" />
            <span className="ml-2 text-sm text-green-700">Опубликовать</span>
          </label>
          <label className="flex items-center cursor-pointer">
            <input type="radio" value="Черновик" checked={newNews.status === 'Черновик'} onChange={e => setNewNews(prev => ({ ...prev, status: e.target.value as 'Опубликовано' | 'Черновик' }))} className="h-4 w-4 text-red-600" />
            <span className="ml-2 text-sm text-green-700">
              Сохранить как черновик
            </span>
          </label>
        </div>
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
        setNewNews({
          title: '',
          category: '',
          content: '',
          image: '',
          status: 'Опубликовано'
        });
      }}>
          Отмена
        </Button>
        <Button type="submit" className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800">
          {isEdit ? 'Сохранить изменения' : 'Опубликовать новость'}
        </Button>
      </div>
      </div>
    </form>
    
    {showPreview && (
      <PostPreview
        title={newNews.title}
        content={newNews.content}
        image={newNews.image}
        category={newNews.category}
        date={new Date().toLocaleDateString('ru-RU')}
        author="Администратор"
        onClose={() => setShowPreview(false)}
        type="news"
      />
    )}
  </>;
});

NewsForm.displayName = 'NewsForm';

export function AdminNews() {
  const { newsItems, addNews, updateNews, deleteNews } = useData();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'Опубликовано' | 'Черновик'>('all');
  const [newNews, setNewNews] = useState({
    title: '',
    category: '',
    content: '',
    image: '',
    status: 'Опубликовано' as 'Опубликовано' | 'Черновик'
  });
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addNews(newNews);
    setShowAddModal(false);
    setNewNews({
      title: '',
      category: '',
      content: '',
      image: '',
      status: 'Опубликовано'
    });
  };
  const handleEdit = (news: NewsItem) => {
    setSelectedNews(news);
    setNewNews({
      title: news.title,
      category: news.category,
      content: news.content,
      image: news.image,
      status: news.status
    });
    setShowEditModal(true);
  };
  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedNews) return;
    updateNews(selectedNews.id, newNews);
    setShowEditModal(false);
    setSelectedNews(null);
    setNewNews({
      title: '',
      category: '',
      content: '',
      image: '',
      status: 'Опубликовано'
    });
  };
  const handleDelete = (id: number) => {
    if (confirm('Вы уверены, что хотите удалить эту новость?')) {
      deleteNews(id);
    }
  };
  const filteredNews = newsItems.filter(news => {
    const matchesSearch = news.title.toLowerCase().includes(searchQuery.toLowerCase()) || news.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || news.status === filterStatus;
    return matchesSearch && matchesFilter;
  });
  return <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-green-900">
            Управление новостями
          </h1>
          <p className="mt-2 text-green-600">
            Всего новостей: {newsItems.length}
          </p>
        </div>
        <Button onClick={() => setShowAddModal(true)} icon={<PlusIcon className="h-5 w-5" />} className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800">
          Добавить новость
        </Button>
      </div>

      <Card>
        <div className="p-6 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-green-500" />
              <input type="text" placeholder="Поиск новостей..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-3 border border-green-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent" />
            </div>
            <div className="flex items-center space-x-2">
              <FilterIcon className="h-5 w-5 text-green-500" />
              <select value={filterStatus} onChange={e => setFilterStatus(e.target.value as typeof filterStatus)} className="px-4 py-3 border border-green-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent">
                <option value="all">Все статусы</option>
                <option value="Опубликовано">Опубликовано</option>
                <option value="Черновик">Черновик</option>
              </select>
            </div>
          </div>
        </div>
      </Card>

      <div className="space-y-4">
        {filteredNews.length === 0 ? <Card>
            <div className="p-12 text-center">
              <p className="text-green-600">Новостей не найдено</p>
            </div>
          </Card> : filteredNews.map(news => <Card key={news.id} hover>
              <div className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3 mb-3">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-green-100 to-green-200 text-green-800">
                        {news.category}
                      </span>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${news.status === 'Опубликовано' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {news.status}
                      </span>
                      <span className="text-sm text-green-600">{news.date}</span>
                    </div>
                    <h3 className="text-xl font-bold text-green-900 mb-2 truncate">
                      {news.title}
                    </h3>
                    <p className="text-green-600 line-clamp-2">{news.content}</p>
                    <p className="text-sm text-green-600 mt-2">
                      Автор: {news.author}
                    </p>
                  </div>
                  <div className="flex flex-col space-y-2">
                    <button onClick={() => handleEdit(news)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all" title="Редактировать">
                      <EditIcon className="h-5 w-5" />
                    </button>
                    <button onClick={() => handleDelete(news.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all" title="Удалить">
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            </Card>)}
      </div>

      <AdminModal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Добавить новость" size="lg">
        <NewsForm 
          onSubmit={handleSubmit} 
          newNews={newNews}
          setNewNews={setNewNews}
          setShowAddModal={setShowAddModal}
          setShowEditModal={setShowEditModal}
        />
      </AdminModal>

      <AdminModal isOpen={showEditModal} onClose={() => {
      setShowEditModal(false);
      setSelectedNews(null);
    }} title="Редактировать новость" size="lg">
        <NewsForm 
          onSubmit={handleUpdate} 
          isEdit 
          newNews={newNews}
          setNewNews={setNewNews}
          setShowAddModal={setShowAddModal}
          setShowEditModal={setShowEditModal}
        />
      </AdminModal>
    </div>;
}