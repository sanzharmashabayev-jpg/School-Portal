import React, { useState, useCallback } from 'react';
import { Card } from '../components/UI/Card';
import { Button } from '../components/UI/Button';
import { AdminModal } from '../components/Admin/AdminModal';
import { PlusIcon, EditIcon, TrashIcon, SearchIcon, BarChart3Icon } from 'lucide-react';
import { useData, Poll } from '../contexts/DataContext';

interface PollFormProps {
  newPoll: {
    title: string;
    description: string;
    options: string[];
    deadline: string;
    status: 'Активен' | 'Завершен';
  };
  onFieldChange: (field: keyof PollFormProps['newPoll']) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onOptionChange: (index: number, value: string) => void;
  onAddOption: () => void;
  onRemoveOption: (index: number) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  isEdit?: boolean;
}

const PollForm = React.memo(({
  newPoll,
  onFieldChange,
  onOptionChange,
  onAddOption,
  onRemoveOption,
  onSubmit,
  onCancel,
  isEdit = false
}: PollFormProps) => {
  return <form onSubmit={onSubmit} className="p-6 space-y-6">
      <div>
        <label className="block text-sm font-semibold text-green-700 mb-2">
          Вопрос опроса *
        </label>
        <input type="text" value={newPoll.title} onChange={onFieldChange('title')} className="w-full px-4 py-3 rounded-xl border border-green-400 focus:ring-2 focus:ring-red-500 focus:border-transparent" placeholder="Введите вопрос" required />
      </div>
      <div>
        <label className="block text-sm font-semibold text-green-700 mb-2">
          Описание
        </label>
        <textarea value={newPoll.description} onChange={onFieldChange('description')} rows={3} className="w-full px-4 py-3 rounded-xl border border-green-400 focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none" placeholder="Дополнительная информация об опросе" />
      </div>
      <div>
        <label className="block text-sm font-semibold text-green-700 mb-2">
          Варианты ответов *
        </label>
        <div className="space-y-3">
          {newPoll.options.map((option, index) => <div key={index} className="flex items-center space-x-2">
              <input type="text" value={option} onChange={e => onOptionChange(index, e.target.value)} className="flex-1 px-4 py-3 rounded-xl border border-green-400 focus:ring-2 focus:ring-red-500 focus:border-transparent" placeholder={`Вариант ${index + 1}`} required />
              {newPoll.options.length > 2 && <button type="button" onClick={() => onRemoveOption(index)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all">
                  <TrashIcon className="h-5 w-5" />
                </button>}
            </div>)}
        </div>
        <button type="button" onClick={onAddOption} className="mt-3 text-sm text-red-600 hover:text-red-700 font-medium">
          + Добавить вариант
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-green-700 mb-2">
            Срок окончания *
          </label>
          <input type="date" value={newPoll.deadline} onChange={onFieldChange('deadline')} className="w-full px-4 py-3 rounded-xl border border-green-400 focus:ring-2 focus:ring-red-500 focus:border-transparent" required />
        </div>
        <div>
          <label className="block text-sm font-semibold text-green-700 mb-2">
            Статус
          </label>
          <select value={newPoll.status} onChange={onFieldChange('status')} className="w-full px-4 py-3 rounded-xl border border-green-400 focus:ring-2 focus:ring-red-500 focus:border-transparent">
            <option value="Активен">Активен</option>
            <option value="Завершен">Завершен</option>
          </select>
        </div>
      </div>
      <div className="flex justify-end space-x-3 pt-4 border-t border-green-200">
        <Button type="button" variant="outline" onClick={onCancel}>
          Отмена
        </Button>
        <Button type="submit" className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800">
          {isEdit ? 'Сохранить изменения' : 'Создать опрос'}
        </Button>
      </div>
    </form>;
});

PollForm.displayName = 'PollForm';

export function AdminPolls() {
  const { polls, addPoll, updatePoll, deletePoll } = useData();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedPoll, setSelectedPoll] = useState<Poll | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [newPoll, setNewPoll] = useState({
    title: '',
    description: '',
    options: ['', ''],
    deadline: '',
    status: 'Активен' as 'Активен' | 'Завершен'
  });

  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      await addPoll({
        title: newPoll.title,
        description: newPoll.description,
        options: newPoll.options.filter(opt => opt.trim()).map(opt => ({
          text: opt,
          votes: 0
        })),
        status: newPoll.status,
        deadline: newPoll.deadline
      });
      setShowAddModal(false);
      setNewPoll({ title: '', description: '', options: ['', ''], deadline: '', status: 'Активен' });
    } catch (err: any) {
      setError(err?.message || 'Ошибка при создании опроса');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (poll: Poll) => {
    setSelectedPoll(poll);
    setNewPoll({
      title: poll.title,
      description: poll.description,
      options: poll.options.map(opt => opt.text),
      deadline: poll.deadline,
      status: poll.status
    });
    setShowEditModal(true);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPoll) return;
    setError(null);
    setSaving(true);
    try {
      await updatePoll(selectedPoll.id, {
        title: newPoll.title,
        description: newPoll.description,
        options: newPoll.options.filter(opt => opt.trim()).map((opt, idx) => ({
          text: opt,
          votes: selectedPoll.options[idx]?.votes || 0
        })),
        deadline: newPoll.deadline,
        status: newPoll.status
      });
      setShowEditModal(false);
      setSelectedPoll(null);
      setNewPoll({ title: '', description: '', options: ['', ''], deadline: '', status: 'Активен' });
    } catch (err: any) {
      setError(err?.message || 'Ошибка при обновлении опроса');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Вы уверены, что хотите удалить этот опрос?')) return;
    setError(null);
    try {
      await deletePoll(id);
    } catch (err: any) {
      setError(err?.message || 'Ошибка при удалении опроса');
    }
  };

  const addOption = useCallback(() => {
    setNewPoll(prev => ({
      ...prev,
      options: [...prev.options, '']
    }));
  }, []);

  const removeOption = useCallback((index: number) => {
    setNewPoll(prev => {
      if (prev.options.length > 2) {
        return {
          ...prev,
          options: prev.options.filter((_, i) => i !== index)
        };
      }
      return prev;
    });
  }, []);

  const updateOption = useCallback((index: number, value: string) => {
    setNewPoll(prev => {
      const newOptions = [...prev.options];
      newOptions[index] = value;
      return { ...prev, options: newOptions };
    });
  }, []);

  const handleFieldChange = useCallback((field: keyof typeof newPoll) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setNewPoll(prev => ({ ...prev, [field]: e.target.value }));
  }, []);

  const handleCancel = useCallback(() => {
    if (showEditModal) {
      setShowEditModal(false);
      setSelectedPoll(null);
    } else {
      setShowAddModal(false);
    }
    setNewPoll({
      title: '',
      description: '',
      options: ['', ''],
      deadline: '',
      status: 'Активен'
    });
  }, [showEditModal]);

  const filteredPolls = polls.filter(poll => poll.title.toLowerCase().includes(searchQuery.toLowerCase()) || poll.description.toLowerCase().includes(searchQuery.toLowerCase()));

  return <div className="space-y-6">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
          {error}
        </div>
      )}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-green-900">
            Управление опросами
          </h1>
          <p className="mt-2 text-green-600">Всего опросов: {polls.length}</p>
        </div>
        <Button onClick={() => setShowAddModal(true)} icon={<PlusIcon className="h-5 w-5" />} className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800">
          Создать опрос
        </Button>
      </div>
      <Card>
        <div className="p-6">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-green-500" />
            <input type="text" placeholder="Поиск опросов..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-3 border border-green-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent" />
          </div>
        </div>
      </Card>
      <div className="space-y-6">
        {filteredPolls.length === 0 ? <Card>
            <div className="p-12 text-center">
              <BarChart3Icon className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <p className="text-green-600">Опросов не найдено</p>
            </div>
          </Card> : filteredPolls.map(poll => <Card key={poll.id} hover>
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${poll.status === 'Активен' ? 'bg-green-100 text-green-800' : 'bg-green-100 text-green-800'}`}>
                        {poll.status}
                      </span>
                      <span className="text-sm text-green-600">
                        До: {poll.deadline}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-green-900 mb-2">
                      {poll.title}
                    </h3>
                    <p className="text-sm text-green-600">{poll.description}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button onClick={() => handleEdit(poll)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all" title="Редактировать">
                      <EditIcon className="h-5 w-5" />
                    </button>
                    <button onClick={() => handleDelete(poll.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all" title="Удалить">
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  {poll.options.map((option, idx) => <div key={idx} className="flex items-center justify-between">
                      <span className="text-sm text-green-700">
                        {option.text}
                      </span>
                      <div className="flex items-center space-x-3">
                        <div className="w-32 bg-green-200 rounded-full h-2">
                          <div className="bg-gradient-to-r from-red-600 to-red-700 h-2 rounded-full" style={{
                    width: `${poll.totalVotes > 0 ? option.votes / poll.totalVotes * 100 : 0}%`
                  }} />
                        </div>
                        <span className="text-sm font-semibold text-green-800 w-12 text-right">
                          {option.votes}
                        </span>
                      </div>
                    </div>)}
                </div>
                <div className="mt-4 pt-4 border-t border-green-200">
                  <span className="text-sm text-green-600">
                    Всего голосов:{' '}
                    <span className="font-semibold">{poll.totalVotes}</span>
                  </span>
                </div>
              </div>
            </Card>)}
      </div>
      <AdminModal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Создать опрос" size="lg">
        <PollForm 
          newPoll={newPoll}
          onFieldChange={handleFieldChange}
          onOptionChange={updateOption}
          onAddOption={addOption}
          onRemoveOption={removeOption}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      </AdminModal>
      <AdminModal isOpen={showEditModal} onClose={() => {
      setShowEditModal(false);
      setSelectedPoll(null);
    }} title="Редактировать опрос" size="lg">
        <PollForm 
          newPoll={newPoll}
          onFieldChange={handleFieldChange}
          onOptionChange={updateOption}
          onAddOption={addOption}
          onRemoveOption={removeOption}
          onSubmit={handleUpdate}
          onCancel={handleCancel}
          isEdit
        />
      </AdminModal>
    </div>;
}
