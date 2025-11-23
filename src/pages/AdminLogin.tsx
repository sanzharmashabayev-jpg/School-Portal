import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/UI/Card';
import { Button } from '../components/UI/Button';
import { ShieldCheckIcon } from 'lucide-react';
export function AdminLogin() {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple admin authentication - in production, use proper authentication
    if (credentials.username === 'admin' && credentials.password === 'admin123') {
      localStorage.setItem('isAdminAuthenticated', 'true');
      navigate('/admin/dashboard');
    } else {
      alert('Неверные учетные данные администратора');
    }
  };
  return <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <div className="p-8">
          <div className="flex justify-center mb-6">
            <div className="h-16 w-16 rounded-full bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center shadow-xl">
              <ShieldCheckIcon className="h-8 w-8 text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-gray-800 to-gray-900 mb-2">
            Вход для администратора
          </h2>
          <p className="text-center text-gray-600 mb-8">
            Введите учетные данные администратора
          </p>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Имя пользователя
              </label>
              <input type="text" value={credentials.username} onChange={e => setCredentials({
              ...credentials,
              username: e.target.value
            })} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all" placeholder="admin" required />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Пароль
              </label>
              <input type="password" value={credentials.password} onChange={e => setCredentials({
              ...credentials,
              password: e.target.value
            })} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all" placeholder="••••••••" required />
            </div>
            <Button type="submit" className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800">
              Войти как администратор
            </Button>
          </form>
          <p className="mt-6 text-center text-sm text-gray-600">
            Демо: admin / admin123
          </p>
        </div>
      </Card>
    </div>;
}