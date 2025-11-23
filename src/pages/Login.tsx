import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '../components/UI/Button';
import { Card } from '../components/UI/Card';
import { DecryptedText } from '../components/UI/DecryptedText';
import { UserIcon, LockIcon, ArrowLeftIcon } from 'lucide-react';
import { motion } from 'framer-motion';
export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const navigate = useNavigate();
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      localStorage.setItem('isAuthenticated', 'true');
      navigate('/portal');
    }
  };
  return <div className="min-h-screen w-full bg-gradient-to-br from-white via-gray-50 to-gray-100 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <motion.div animate={{
      scale: [1, 1.2, 1],
      opacity: [0.2, 0.3, 0.2]
    }} transition={{
      duration: 8,
      repeat: Infinity,
      ease: 'easeInOut'
    }} className="absolute top-20 left-10 w-72 h-72 bg-gray-300 rounded-full mix-blend-multiply filter blur-3xl"></motion.div>
      <motion.div animate={{
      scale: [1, 1.3, 1],
      opacity: [0.2, 0.3, 0.2]
    }} transition={{
      duration: 10,
      repeat: Infinity,
      ease: 'easeInOut',
      delay: 1
    }} className="absolute bottom-20 right-10 w-72 h-72 bg-gray-400 rounded-full mix-blend-multiply filter blur-3xl"></motion.div>
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
          <Link to="/" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-8 transition-colors group">
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
              }} className="inline-flex h-16 w-16 rounded-2xl bg-gradient-to-br from-gray-700 to-gray-900 items-center justify-center shadow-lg mb-4 cursor-pointer">
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
                  <DecryptedText text="Вход в портал" speed={150} maxIterations={35} sequential={true} revealDirection="center" useOriginalCharsOnly={true} animateOn="view" className="text-transparent bg-clip-text bg-gradient-to-r from-gray-800 to-gray-900" encryptedClassName="text-gray-400 opacity-60" />
                </motion.h2>
                <motion.p initial={{
                opacity: 0
              }} animate={{
                opacity: 1
              }} transition={{
                delay: 0.6
              }} className="mt-2 text-gray-600">
                  Войдите, чтобы получить доступ к Shoqan Portal
                </motion.p>
              </div>
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
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                    Email
                  </label>
                  <motion.div animate={{
                  scale: focusedField === 'email' ? 1.02 : 1
                }} className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <UserIcon className={`h-5 w-5 transition-colors ${focusedField === 'email' ? 'text-gray-700' : 'text-gray-400'}`} />
                    </div>
                    <input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} onFocus={() => setFocusedField('email')} onBlur={() => setFocusedField(null)} className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-700 focus:border-transparent transition-all" placeholder="your.email@school.ru" required />
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
                  <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                    Пароль
                  </label>
                  <motion.div animate={{
                  scale: focusedField === 'password' ? 1.02 : 1
                }} className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <LockIcon className={`h-5 w-5 transition-colors ${focusedField === 'password' ? 'text-gray-700' : 'text-gray-400'}`} />
                    </div>
                    <input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} onFocus={() => setFocusedField('password')} onBlur={() => setFocusedField(null)} className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-700 focus:border-transparent transition-all" placeholder="••••••••" required />
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
                    <input id="remember-me" type="checkbox" className="h-4 w-4 text-gray-800 focus:ring-gray-700 border-gray-300 rounded cursor-pointer" />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 cursor-pointer">
                      Запомнить меня
                    </label>
                  </div>
                  <motion.button whileHover={{
                  scale: 1.05
                }} whileTap={{
                  scale: 0.95
                }} type="button" className="text-sm font-semibold text-gray-800 hover:text-gray-900 transition-colors">
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
                  <Button type="submit" variant="primary" className="w-full" size="lg">
                    Войти
                  </Button>
                </motion.div>
              </form>
              <motion.p initial={{
              opacity: 0
            }} animate={{
              opacity: 1
            }} transition={{
              delay: 1.1
            }} className="mt-6 text-center text-sm text-gray-600">
                Нет аккаунта?{' '}
                <motion.button whileHover={{
                scale: 1.05
              }} whileTap={{
                scale: 0.95
              }} className="font-semibold text-gray-800 hover:text-gray-900 transition-colors">
                  Зарегистрироваться
                </motion.button>
              </motion.p>
            </div>
          </Card>
        </motion.div>
      </motion.div>
    </div>;
}