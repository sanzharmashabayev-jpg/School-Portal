import React from 'react';
import { Card } from '../components/UI/Card';
import { Button } from '../components/UI/Button';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
export function Polls() {
  const activePolls = [{
    id: 1,
    title: 'Какие кружки вы хотели бы видеть в школе?',
    description: 'Помогите нам выбрать новые направления для внеклассных занятий в следующем учебном году.',
    options: [{
      name: 'Робототехника',
      votes: 45
    }, {
      name: 'Программирование',
      votes: 38
    }, {
      name: 'Театральный',
      votes: 22
    }, {
      name: 'Шахматы',
      votes: 18
    }, {
      name: 'Художественная студия',
      votes: 32
    }],
    totalVotes: 155,
    deadline: '5 дней'
  }, {
    id: 2,
    title: 'Выбор темы для школьного праздника',
    description: 'Голосуйте за тему предстоящего весеннего школьного праздника.',
    options: [{
      name: 'Космос',
      votes: 87
    }, {
      name: 'Экология',
      votes: 54
    }, {
      name: 'История России',
      votes: 63
    }, {
      name: 'Мир профессий',
      votes: 42
    }],
    totalVotes: 246,
    deadline: '2 дня'
  }];
  const completedPolls = [{
    id: 3,
    title: 'Оцените качество школьного питания',
    description: 'Ваше мнение поможет нам улучшить качество питания в школьной столовой.',
    options: [{
      name: 'Отлично',
      votes: 32
    }, {
      name: 'Хорошо',
      votes: 78
    }, {
      name: 'Удовлетворительно',
      votes: 45
    }, {
      name: 'Плохо',
      votes: 12
    }],
    totalVotes: 167,
    completed: true
  }];
  const COLORS = ['#374151', '#4b5563', '#6b7280', '#9ca3af', '#d1d5db', '#e5e7eb'];
  return <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-800 to-gray-900">
          Опросы и голосования
        </h1>
        <p className="mt-2 text-gray-600">
          Участвуйте в опросах и влияйте на школьную жизнь
        </p>
      </div>
      <h2 className="text-2xl font-bold text-gray-900">Активные опросы</h2>
      <div className="space-y-6">
        {activePolls.map(poll => <Card key={poll.id} hover>
            <div className="p-8">
              <h3 className="text-xl font-bold text-gray-900">{poll.title}</h3>
              <p className="mt-2 text-sm text-gray-600">{poll.description}</p>
              <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <div className="space-y-4">
                    {poll.options.map((option, index) => <div key={index}>
                        <div className="flex items-center justify-between mb-2">
                          <label className="flex items-center cursor-pointer">
                            <input type="radio" name={`poll-${poll.id}`} className="h-4 w-4 text-gray-800" />
                            <span className="ml-3 text-sm font-medium text-gray-700">
                              {option.name}
                            </span>
                          </label>
                          <span className="text-sm font-semibold text-gray-800">
                            {Math.round(option.votes / poll.totalVotes * 100)}
                            %
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                          <div className="bg-gradient-to-r from-gray-700 to-gray-900 h-3 rounded-full transition-all duration-500 shadow-sm" style={{
                      width: `${option.votes / poll.totalVotes * 100}%`
                    }}></div>
                        </div>
                      </div>)}
                  </div>
                  <div className="mt-6 flex items-center justify-between">
                    <span className="text-sm text-gray-600 font-medium">
                      Всего голосов: {poll.totalVotes}
                    </span>
                    <span className="text-sm text-red-600 font-semibold">
                      Осталось: {poll.deadline}
                    </span>
                  </div>
                  <div className="mt-6">
                    <Button variant="primary">Проголосовать</Button>
                  </div>
                </div>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={poll.options} cx="50%" cy="50%" outerRadius={100} fill="#8884d8" dataKey="votes" label={({
                    name,
                    percent
                  }) => `${name}: ${(percent * 100).toFixed(0)}%`}>
                        {poll.options.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </Card>)}
      </div>
      <h2 className="text-2xl font-bold text-gray-900">Завершенные опросы</h2>
      <div className="space-y-6">
        {completedPolls.map(poll => <Card key={poll.id} hover>
            <div className="p-8">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">
                  {poll.title}
                </h3>
                <span className="inline-flex items-center px-4 py-2 rounded-full text-xs font-semibold bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700">
                  Завершен
                </span>
              </div>
              <p className="mt-2 text-sm text-gray-600">{poll.description}</p>
              <div className="mt-6 h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={poll.options} margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5
              }}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="votes" fill="url(#colorGradient)" />
                    <defs>
                      <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#374151" />
                        <stop offset="100%" stopColor="#111827" />
                      </linearGradient>
                    </defs>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4">
                <span className="text-sm text-gray-600 font-medium">
                  Всего голосов: {poll.totalVotes}
                </span>
              </div>
            </div>
          </Card>)}
      </div>
    </div>;
}