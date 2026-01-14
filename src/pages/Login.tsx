import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '../components/UI/Button';
import { Card } from '../components/UI/Card';
import { DecryptedText } from '../components/UI/DecryptedText';
import { UserIcon, LockIcon, ArrowLeftIcon, ShieldCheckIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const navigate = useNavigate();
  const { signIn, signUp } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setLoading(true);

    if (!email || !password) {
      setError('Пожалуйста, заполните все поля');
      setLoading(false);
      return;
    }

    // Валидация пароля
    if (isSignUp && password.length < 6) {
      setError('Пароль должен содержать минимум 6 символов');
      setLoading(false);
      return;
    }

    try {
      if (isSignUp) {
        // Регистрация
        const { error: signUpError } = await signUp(email, password);
        
        if (signUpError) {
          // Обработка конкретных ошибок
          if (signUpError.message.includes('already registered')) {
            setError('Пользователь с таким email уже зарегистрирован');
          } else if (signUpError.message.includes('invalid email')) {
            setError('Некорректный email адрес');
          } else {
            setError(signUpError.message || 'Ошибка регистрации');
          }
        } else {
          setSuccessMessage('Регистрация успешна! Проверьте email для подтверждения аккаунта (или войдите сразу)');
          setIsSignUp(false);
          // Пробуем сразу войти после регистрации
          setTimeout(async () => {
            const { error: signInError } = await signIn(email, password);
            if (!signInError) {
              navigate('/portal');
            }
          }, 500);
        }
      } else {
        // Вход
        const { error: signInError } = await signIn(email, password);
        
        if (signInError) {
          // Обработка конкретных ошибок
          if (signInError.message.includes('Invalid login credentials')) {
            setError('Неверный email или пароль');
          } else if (signInError.message.includes('Email not confirmed')) {
            setError('Подтвердите email адрес перед входом');
          } else {
            setError(signInError.message || 'Ошибка входа. Проверьте email и пароль.');
          }
        } else {
          navigate('/portal');
        }
      }
    } catch (err: any) {
      setError(err.message || 'Произошла ошибка. Попробуйте еще раз.');
    } finally {
      setLoading(false);
    }
  };
  return <div className="min-h-screen w-full bg-gradient-to-br from-white via-green-50 to-green-100 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <motion.div animate={{
      scale: [1, 1.2, 1],
      opacity: [0.2, 0.3, 0.2]
    }} transition={{
      duration: 8,
      repeat: Infinity,
      ease: 'easeInOut'
    }} className="absolute top-20 left-10 w-72 h-72 bg-green-300 rounded-full mix-blend-multiply filter blur-3xl"></motion.div>
      <motion.div animate={{
      scale: [1, 1.3, 1],
      opacity: [0.2, 0.3, 0.2]
    }} transition={{
      duration: 10,
      repeat: Infinity,
      ease: 'easeInOut',
      delay: 1
    }} className="absolute bottom-20 right-10 w-72 h-72 bg-green-400 rounded-full mix-blend-multiply filter blur-3xl"></motion.div>
      <motion.div initial={{
      opacity: 0,
      y: 20
    }} animate={{
      opacity: 1,
      y: 0
    }} className="w-full max-w-md relative z-10">
        <motion.div initial={{
        opacity: 0,
        x: -20
      }} animate={{
        opacity: 1,
        x: 0
      }} transition={{
        delay: 0.2
      }}>
          <Link to="/" className="inline-flex items-center text-green-600 hover:text-green-900 mb-8 transition-colors group">
            <ArrowLeftIcon className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Вернуться на главную
          </Link>
        </motion.div>
        <motion.div initial={{
        opacity: 0,
        scale: 0.9
      }} animate={{
        opacity: 1,
        scale: 1
      }} transition={{
        delay: 0.3
      }}>
          <Card className="overflow-hidden">
            <div className="p-8">
              <div className="text-center mb-8">
                <motion.div initial={{
                scale: 0,
                rotate: -180
              }} animate={{
                scale: 1,
                rotate: 0
              }} transition={{
                type: 'spring',
                delay: 0.4
              }} whileHover={{
                rotate: 360,
                scale: 1.1
              }} className="inline-flex h-16 w-16 rounded-2xl bg-gradient-to-br from-green-700 to-green-900 items-center justify-center shadow-lg mb-4 cursor-pointer">
                  <UserIcon className="h-8 w-8 text-white" />
                </motion.div>
                <motion.h2 initial={{
                opacity: 0,
                y: 10
              }} animate={{
                opacity: 1,
                y: 0
              }} transition={{
                delay: 0.5
              }} className="text-3xl font-bold">
                  <DecryptedText text={isSignUp ? "Регистрация" : "Вход в портал"} speed={150} maxIterations={35} sequential={true} revealDirection="center" useOriginalCharsOnly={true} animateOn="view" className="text-transparent bg-clip-text bg-gradient-to-r from-green-800 to-green-900" encryptedClassName="text-green-500 opacity-60" />
                </motion.h2>
                <motion.p initial={{
                opacity: 0
              }} animate={{
                opacity: 1
              }} transition={{
                delay: 0.6
              }} className="mt-2 text-green-600">
                  {isSignUp ? 'Создайте аккаунт для доступа к Shoqan Portal' : 'Войдите, чтобы получить доступ к Shoqan Portal'}
                </motion.p>
              </div>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm"
                >
                  {error}
                </motion.div>
              )}
              {successMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-xl text-sm"
                >
                  {successMessage}
                </motion.div>
              )}
              <form onSubmit={handleSubmit} className="space-y-6">
                <motion.div initial={{
                opacity: 0,
                x: -20
              }} animate={{
                opacity: 1,
                x: 0
              }} transition={{
                delay: 0.7
              }}>
                  <label htmlFor="email" className="block text-sm font-semibold text-green-700 mb-2">
                    Email
                  </label>
                  <motion.div animate={{
                  scale: focusedField === 'email' ? 1.02 : 1
                }} className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <UserIcon className={`h-5 w-5 transition-colors ${focusedField === 'email' ? 'text-green-700' : 'text-green-500'}`} />
                    </div>
                    <input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} onFocus={() => setFocusedField('email')} onBlur={() => setFocusedField(null)} className="block w-full pl-10 pr-3 py-3 border border-green-400 rounded-xl focus:ring-2 focus:ring-green-700 focus:border-transparent transition-all" placeholder="your.email@school.ru" required />
                  </motion.div>
                </motion.div>
                <motion.div initial={{
                opacity: 0,
                x: -20
              }} animate={{
                opacity: 1,
                x: 0
              }} transition={{
                delay: 0.8
              }}>
                  <label htmlFor="password" className="block text-sm font-semibold text-green-700 mb-2">
                    Пароль
                  </label>
                  <motion.div animate={{
                  scale: focusedField === 'password' ? 1.02 : 1
                }} className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <LockIcon className={`h-5 w-5 transition-colors ${focusedField === 'password' ? 'text-green-700' : 'text-green-500'}`} />
                    </div>
                    <input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} onFocus={() => setFocusedField('password')} onBlur={() => setFocusedField(null)} className="block w-full pl-10 pr-3 py-3 border border-green-400 rounded-xl focus:ring-2 focus:ring-green-700 focus:border-transparent transition-all" placeholder="••••••••" required />
                  </motion.div>
                </motion.div>
                <motion.div initial={{
                opacity: 0
              }} animate={{
                opacity: 1
              }} transition={{
                delay: 0.9
              }} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input id="remember-me" type="checkbox" className="h-4 w-4 text-green-800 focus:ring-green-700 border-green-400 rounded cursor-pointer" />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-green-700 cursor-pointer">
                      Запомнить меня
                    </label>
                  </div>
                  <motion.button whileHover={{
                  scale: 1.05
                }} whileTap={{
                  scale: 0.95
                }} type="button" className="text-sm font-semibold text-green-800 hover:text-green-900 transition-colors">
                    Забыли пароль?
                  </motion.button>
                </motion.div>
                <motion.div initial={{
                opacity: 0,
                y: 10
              }} animate={{
                opacity: 1,
                y: 0
              }} transition={{
                delay: 1
              }}>
                  <Button type="submit" variant="primary" className="w-full" size="lg" disabled={loading}>
                    {loading ? (isSignUp ? 'Регистрация...' : 'Вход...') : (isSignUp ? 'Зарегистрироваться' : 'Войти')}
                  </Button>
                </motion.div>
              </form>
              <motion.div initial={{
              opacity: 0
            }} animate={{
              opacity: 1
            }} transition={{
              delay: 1.1
            }} className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-green-400"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-green-600">или</span>
                  </div>
                </div>
                <motion.button whileHover={{
                scale: 1.02
              }} whileTap={{
                scale: 0.98
              }} onClick={() => navigate('/admin/login')} className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-red-500 text-red-600 font-semibold hover:bg-red-50 transition-all duration-200">
                  <ShieldCheckIcon className="h-5 w-5" />
                  Вход для администратора
                </motion.button>
              </motion.div>
              <motion.p initial={{
              opacity: 0
            }} animate={{
              opacity: 1
            }} transition={{
              delay: 1.2
            }} className="mt-6 text-center text-sm text-green-600">
                {isSignUp ? (
                  <>
                    Уже есть аккаунт?{' '}
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setIsSignUp(false);
                        setError(null);
                        setSuccessMessage(null);
                      }}
                      className="font-semibold text-green-800 hover:text-green-900 transition-colors"
                    >
                      Войти
                    </motion.button>
                  </>
                ) : (
                  <>
                    Нет аккаунта?{' '}
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setIsSignUp(true);
                        setError(null);
                        setSuccessMessage(null);
                      }}
                      className="font-semibold text-green-800 hover:text-green-900 transition-colors"
                    >
                      Зарегистрироваться
                    </motion.button>
                  </>
                )}
              </motion.p>
            </div>
          </Card>
        </motion.div>
      </motion.div>
    </div>;
}