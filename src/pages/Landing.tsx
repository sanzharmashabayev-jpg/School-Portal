import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/UI/Button';
import { ParliamentCarousel } from '../components/UI/ParliamentCarousel';
import { SparklesIcon, BellIcon, CalendarIcon, BarChartIcon, ShieldCheckIcon, ZapIcon, UsersIcon, TrendingUpIcon, ArrowRightIcon } from 'lucide-react';
import { ScrollVelocity } from '../components/ScrollVelocity';
import { motion } from 'framer-motion';
import { MetallicLogo } from '../components/MetallicLogo';
export function Landing() {
  const features = [{
    icon: SparklesIcon,
    title: 'Уведомления',
    description: 'Персонализированные оповещения о важных событиях и новостях школы',
    color: 'from-green-700 to-green-900'
  }, {
    icon: CalendarIcon,
    title: 'Единый календарь',
    description: 'Все школьные события и мероприятия в одном удобном календаре',
    color: 'from-green-600 to-green-800'
  }, {
    icon: BarChartIcon,
    title: 'Аналитика и статистика',
    description: 'Отслеживайте участие и вовлеченность в школьную жизнь',
    color: 'from-green-600 to-green-700'
  }, {
    icon: ShieldCheckIcon,
    title: 'Безопасность данных',
    description: 'Современная защита личной информации всех участников',
    color: 'from-green-800 to-black'
  }];
  const stats = [{
    value: '99.9%',
    label: 'Время работы'
  }, {
    value: '24/7',
    label: 'Поддержка'
  }];
  return <div className="min-h-screen w-full bg-gradient-to-br from-white via-green-50 to-green-100 overflow-hidden">
      {/* Header */}
      <motion.header initial={{
      y: -100
    }} animate={{
      y: 0
    }} transition={{
      type: 'spring',
      stiffness: 100
    }} className="glass-effect border-b border-green-200 sticky top-0 z-50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <motion.div initial={{
            opacity: 0,
            x: -20
          }} animate={{
            opacity: 1,
            x: 0
          }} transition={{
            delay: 0.2
          }} className="flex items-center">
              <MetallicLogo />
            </motion.div>
            <motion.div initial={{
            opacity: 0,
            x: 20
          }} animate={{
            opacity: 1,
            x: 0
          }} transition={{
            delay: 0.2
          }} className="flex items-center space-x-2 sm:space-x-4">
              <Link to="/login">
                <Button variant="outline" size="sm" className="sm:text-sm">
                  Войти
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="primary" size="sm" className="sm:text-sm">
                  Начать
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.header>
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.div initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            delay: 0.3
          }} className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-green-100 to-green-200 text-green-800 font-semibold text-sm mb-8 shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
              <SparklesIcon className="h-4 w-4 mr-2 animate-pulse" />
              Инновационная платформа для школ
            </motion.div>
            <motion.h1 initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            delay: 0.4
          }} className="text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-800 to-green-900 mb-6">
              Будущее школьного
              <br />
              взаимодействия
            </motion.h1>
            <motion.p initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            delay: 0.5
          }} className="text-xl text-green-600 max-w-3xl mx-auto mb-12 leading-relaxed">
              Революционная платформа, которая объединяет учеников, учителей и
              родителей в единое цифровое пространство. Следите за новостями,
              участвуйте в опросах и будьте в курсе всех событий.
            </motion.p>
            <motion.div initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            delay: 0.6
          }} className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/login">
                <Button variant="primary" size="lg" icon={<ZapIcon className="h-5 w-5" />} className="group">
                  Попробовать бесплатно
                  <ArrowRightIcon className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Button variant="outline" size="lg">
                Узнать больше
              </Button>
            </motion.div>
          </div>
        </div>
        {/* Animated decorative elements */}
        <motion.div animate={{
        scale: [1, 1.2, 1],
        opacity: [0.2, 0.3, 0.2]
      }} transition={{
        duration: 8,
        repeat: Infinity,
        ease: 'easeInOut'
      }} className="absolute top-20 left-10 w-72 h-72 bg-green-400 rounded-full mix-blend-multiply filter blur-3xl"></motion.div>
        <motion.div animate={{
        scale: [1, 1.3, 1],
        opacity: [0.2, 0.3, 0.2]
      }} transition={{
        duration: 10,
        repeat: Infinity,
        ease: 'easeInOut',
        delay: 1
      }} className="absolute top-40 right-10 w-72 h-72 bg-green-500 rounded-full mix-blend-multiply filter blur-3xl"></motion.div>
      </section>
      {/* Stats Section */}
      <section className="py-16 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8">
            {stats.map((stat, index) => <motion.div key={index} initial={{
            opacity: 0,
            y: 20
          }} whileInView={{
            opacity: 1,
            y: 0
          }} viewport={{
            once: true
          }} transition={{
            delay: index * 0.1
          }} whileHover={{
            scale: 1.05
          }} className="text-center p-6 rounded-2xl glass-effect hover:shadow-xl transition-all cursor-pointer">
                <motion.div initial={{
              scale: 0
            }} whileInView={{
              scale: 1
            }} viewport={{
              once: true
            }} transition={{
              delay: index * 0.1 + 0.2,
              type: 'spring'
            }} className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-800 to-green-900 mb-2">
                  {stat.value}
                </motion.div>
                <div className="text-sm text-green-600 font-medium">
                  {stat.label}
                </div>
              </motion.div>)}
          </div>
        </div>
      </section>
      {/* Features Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }} className="text-center mb-16">
            <h2 className="text-4xl font-bold text-green-900 mb-4">
              Почему Shoqan Portal?
            </h2>
            <p className="text-xl text-green-600 max-w-2xl mx-auto">
              Современные технологии для эффективного взаимодействия в
              образовательной среде
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => <motion.div key={index} initial={{
            opacity: 0,
            y: 30
          }} whileInView={{
            opacity: 1,
            y: 0
          }} viewport={{
            once: true
          }} transition={{
            delay: index * 0.1
          }} whileHover={{
            y: -10,
            scale: 1.02
          }} className="glass-effect rounded-2xl p-8 border border-green-200 shadow-lg hover:shadow-2xl transition-all duration-300 group cursor-pointer">
                <motion.div whileHover={{
              rotate: 360,
              scale: 1.1
            }} transition={{
              duration: 0.6
            }} className={`h-14 w-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center shadow-lg mb-6 group-hover:shadow-xl`}>
                  <feature.icon className="h-7 w-7 text-white" />
                </motion.div>
                <h3 className="text-xl font-bold text-green-900 mb-3 group-hover:text-green-700 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-green-600 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>)}
          </div>
        </div>
      </section>
      {/* School Parliament Section */}
      <section className="py-12 bg-white/50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-6"
          >
            <h3 className="text-xl font-bold text-green-900 mb-1">
              Школьный парламент
            </h3>
            <p className="text-green-600 text-xs">
              Представители ученического самоуправления
            </p>
          </motion.div>
          
          <ParliamentCarousel
            members={[
              { name: 'САТЫБАЛДИНА ДАРИЯ', role: 'президент', isPresident: true },
              { name: 'БАЙГАБАТ АЙЗАРА', role: 'заместитель', isVice: true },
              { name: 'Чен Аким', role: 'министр права и порядка' },
              { name: 'Шакир Анель' },
              { name: 'Шемякин Марат' },
              { name: 'Сабырбаева Карина' },
              { name: 'Кайрат Зере', role: 'министр информации' },
              { name: 'Айтубай Зере' },
              { name: 'Арман Дамир' },
              { name: 'Жанайдарова Амира' },
              { name: 'Машабаев Санжар' },
              { name: 'Омархан Абылай', role: 'министр спорта' },
              { name: 'Нурали Уалихан' },
              { name: 'Суйлемен Арон' },
              { name: 'Куаныш Адель', role: 'министр социальных отношений' },
              { name: 'Аюпова Индира' },
              { name: 'Дамеля' },
              { name: 'Асилбекова Малика', role: 'министр культуры' },
              { name: 'Алтаева Сабила' },
              { name: 'Оспан Инжу' },
              { name: 'Каби Айя' },
              { name: 'Сагатов Альнур', role: 'министр экологии' },
              { name: 'Мухаметжан Адия' },
              { name: 'Бостыбай Жания' },
              { name: 'Жусипкызы Жасмин' },
            ]}
          />
        </div>
      </section>
      {/* Benefits Section */}
      <section className="py-24 bg-gradient-to-r from-green-800 to-green-900 relative overflow-hidden">
        <motion.div animate={{
        x: [0, 100, 0],
        y: [0, -50, 0]
      }} transition={{
        duration: 20,
        repeat: Infinity,
        ease: 'linear'
      }} className="absolute top-0 left-0 w-96 h-96 bg-white/5 rounded-full filter blur-3xl"></motion.div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{
            opacity: 0,
            x: -50
          }} whileInView={{
            opacity: 1,
            x: 0
          }} viewport={{
            once: true
          }}>
              <h2 className="text-4xl font-bold text-white mb-6">
                Преимущества для всех участников
              </h2>
              <div className="space-y-6">
                {[{
                icon: UsersIcon,
                title: 'Для учеников',
                desc: 'Будьте в курсе всех событий, участвуйте в опросах и получайте важные уведомления'
              }, {
                icon: TrendingUpIcon,
                title: 'Для учителей',
                desc: 'Публикуйте объявления и отслеживайте вовлеченность'
              }, {
                icon: ShieldCheckIcon,
                title: 'Для родителей',
                desc: 'Следите за школьной жизнью ребенка и будьте в курсе всех важных событий'
              }].map((item, index) => <motion.div key={index} initial={{
                opacity: 0,
                x: -30
              }} whileInView={{
                opacity: 1,
                x: 0
              }} viewport={{
                once: true
              }} transition={{
                delay: index * 0.2
              }} whileHover={{
                x: 10
              }} className="flex items-start group cursor-pointer">
                    <motion.div whileHover={{
                  rotate: 360
                }} transition={{
                  duration: 0.6
                }} className="flex-shrink-0 h-12 w-12 rounded-xl bg-white/20 flex items-center justify-center mr-4 group-hover:bg-white/30 transition-all">
                      <item.icon className="h-6 w-6 text-white" />
                    </motion.div>
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-2">
                        {item.title}
                      </h3>
                      <p className="text-green-400">{item.desc}</p>
                    </div>
                  </motion.div>)}
              </div>
            </motion.div>
            <motion.div initial={{
            opacity: 0,
            scale: 0.8
          }} whileInView={{
            opacity: 1,
            scale: 1
          }} viewport={{
            once: true
          }} whileHover={{
            scale: 1.05
          }} className="glass-effect rounded-3xl p-8 border border-green-200 shadow-2xl overflow-hidden">
              <img src="/DJI_03282_1756359356.jpg" alt="School campus aerial view" className="rounded-2xl shadow-lg w-full h-full object-cover" />
            </motion.div>
          </div>
        </div>
      </section>
      {/* CTA Section */}
      <section className="py-24">
        <motion.div initial={{
        opacity: 0,
        y: 30
      }} whileInView={{
        opacity: 1,
        y: 0
      }} viewport={{
        once: true
      }} className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-green-900 mb-6">
            Готовы начать?
          </h2>
          <p className="text-xl text-green-600 mb-8">
            Присоединяйтесь к тысячам школ, которые уже используют Shoqan Portal
          </p>
          <Link to="/login">
            <Button variant="primary" size="lg" icon={<ZapIcon className="h-5 w-5" />} className="group">
              Войти в портал
              <ArrowRightIcon className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </motion.div>
      </section>
      {/* Footer */}
      <footer className="bg-green-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-green-600 font-bold text-2xl">
              Shoqan Portal
            </span>
            <p className="mt-4 text-green-500">
              © 2024 Shoqan Portal. Все права защищены.
            </p>
            <p className="mt-3 text-white text-xl font-bold">
              Created by Sanzhar Mashabayev 8L
            </p>
          </div>
        </div>
      </footer>
      {/* Scroll Velocity Component */}
      <div className="bg-green-900 py-12">
        <ScrollVelocity texts={['Инновации • Образование • Будущее •', 'Современные технологии • Эффективность • Развитие •']} velocity={50} className="text-green-500" />
      </div>
    </div>;
}