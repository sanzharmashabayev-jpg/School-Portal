import { createClient } from '@supabase/supabase-js';

// Эти значения должны быть в переменных окружения
// Получите их на https://app.supabase.com в настройках проекта
let supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
let supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Убираем лишние слеши и пробелы
supabaseUrl = supabaseUrl.trim().replace(/\/$/, '');

// Проверка и предупреждение
if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('localhost') || supabaseUrl.includes('your_supabase')) {
  console.error(
    '⚠️ Supabase не настроен правильно!\n' +
    'Пожалуйста, обновите .env файл с правильными значениями:\n' +
    'VITE_SUPABASE_URL=https://your-project-id.supabase.co\n' +
    'VITE_SUPABASE_ANON_KEY=your-anon-key'
  );
}

export const supabase = createClient(supabaseUrl || 'https://placeholder.supabase.co', supabaseAnonKey || 'placeholder-key', {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

