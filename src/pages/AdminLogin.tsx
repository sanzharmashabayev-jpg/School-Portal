import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card } from '../components/UI/Card';
import { Button } from '../components/UI/Button';
import { ShieldCheckIcon, ArrowLeftIcon } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

export function AdminLogin() {
  const navigate = useNavigate();
  const { signIn, quickLogin } = useAuth();
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (!credentials.email || !credentials.password) {
      setError('Пожалуйста, заполните все поля');
      setLoading(false);
      return;
    }

    // Проверяем, являются ли введенные данные тестовыми учетными данными администратора
    const isTestAdmin = credentials.email === 'admin@admin.school.ru' && credentials.password === 'admin123456';

    if (isTestAdmin) {
      // Используем быстрый вход для тестового администратора
      quickLogin(true);
      navigate('/admin/dashboard');
      setLoading(false);
      return;
    }

    // Пытаемся войти через Supabase
    try {
      const { error: signInError } = await signIn(credentials.email, credentials.password);
      
      if (signInError) {
        // Если Supabase не настроен или произошла ошибка, проверяем, может это тестовый админ
        if (signInError.message?.includes('Invalid API key') || 
            signInError.message?.includes('Failed to fetch') ||
            signInError.message?.includes('Network')) {
          setError('Supabase не настроен. Используйте тестовые учетные данные: admin@admin.school.ru / admin123456');
        } else {
        setError('Неверные учетные данные администратора');
        }
        setLoading(false);
        return;
      }

      // Проверяем, является ли пользователь администратором
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user && (user.user_metadata?.role === 'admin' || user.email?.endsWith('@admin.school.ru'))) {
        navigate('/admin/dashboard');
      } else {
        await supabase.auth.signOut();
        setError('У вас нет прав администратора');
      }
    } catch (err: any) {
      // Если произошла ошибка сети или Supabase не настроен, предлагаем использовать тестовые данные
      if (err.message?.includes('Failed to fetch') || err.message?.includes('Network')) {
        setError('Supabase не настроен. Используйте тестовые учетные данные: admin@admin.school.ru / admin123456');
      } else {
      setError(err.message || 'Произошла ошибка при входе');
      }
    } finally {
      setLoading(false);
    }
  };
  return <div className="min-h-screen w-full bg-gradient-to-br from-green-900 via-green-800 to-green-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <div className="p-8">
          <Link to="/login" className="inline-flex items-center text-green-500 hover:text-green-400 mb-6 transition-colors group">
            <ArrowLeftIcon className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Вернуться к обычному входу
          </Link>
          <div className="flex justify-center mb-6">
            <div className="h-16 w-16 rounded-full bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center shadow-xl">
              <ShieldCheckIcon className="h-8 w-8 text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-green-800 to-green-900 mb-2">
            Вход для администратора
          </h2>
          <p className="text-center text-green-600 mb-8">
            Введите учетные данные администратора
          </p>
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-green-700 mb-2">
                Email
              </label>
              <input type="email" value={credentials.email} onChange={e => setCredentials({
              ...credentials,
              email: e.target.value
            })} className="w-full px-4 py-3 rounded-xl border border-green-400 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all" placeholder="admin@admin.school.ru" required />
            </div>
            <div>
              <label className="block text-sm font-semibold text-green-700 mb-2">
                Пароль
              </label>
              <input type="password" value={credentials.password} onChange={e => setCredentials({
              ...credentials,
              password: e.target.value
            })} className="w-full px-4 py-3 rounded-xl border border-green-400 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all" placeholder="••••••••" required />
            </div>
            <Button type="submit" className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800" disabled={loading}>
              {loading ? 'Вход...' : 'Войти как администратор'}
            </Button>
          </form>
        </div>
      </Card>
    </div>;
}