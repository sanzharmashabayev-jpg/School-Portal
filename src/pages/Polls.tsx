import React, { useMemo, useState, useEffect } from 'react';
import { Card } from '../components/UI/Card';
import { Button } from '../components/UI/Button';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { useData } from '../contexts/DataContext';

export function Polls() {
  const { polls, votePoll } = useData();
  const [selectedOptions, setSelectedOptions] = useState<Record<number, number>>({});
  const [votedPolls, setVotedPolls] = useState<Set<number>>(new Set());
  const activePolls = useMemo(() => polls.filter(p => p.status === 'Активен'), [polls]);
  const completedPolls = useMemo(() => polls.filter(p => p.status === 'Завершен'), [polls]);
  
  // Load voted polls from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('schoolportal_voted_polls');
    if (saved) {
      try {
        setVotedPolls(new Set(JSON.parse(saved)));
      } catch (e) {
        console.error('Error loading voted polls:', e);
      }
    }
  }, []);
  
  const handleVote = (pollId: number) => {
    const optionIndex = selectedOptions[pollId];
    if (optionIndex !== undefined && !votedPolls.has(pollId)) {
      votePoll(pollId, optionIndex);
      const newVotedPolls = new Set(votedPolls);
      newVotedPolls.add(pollId);
      setVotedPolls(newVotedPolls);
      localStorage.setItem('schoolportal_voted_polls', JSON.stringify([...newVotedPolls]));
    }
  };
  
  // Функция для форматирования даты дедлайна
  const getDeadlineText = (deadline: string) => {
    const deadlineDate = new Date(deadline);
    const now = new Date();
    const diffDays = Math.ceil((deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'Истек';
    if (diffDays === 0) return 'Сегодня';
    if (diffDays === 1) return 'Завтра';
    return `${diffDays} ${diffDays < 5 ? 'дня' : 'дней'}`;
  };
  const COLORS = ['#374151', '#4b5563', '#6b7280', '#9ca3af', '#d1d5db', '#e5e7eb'];
  return <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-800 to-green-900">
          Опросы и голосования
        </h1>
        <p className="mt-2 text-green-600">
          Участвуйте в опросах и влияйте на школьную жизнь
        </p>
      </div>
      <h2 className="text-2xl font-bold text-green-900">Активные опросы</h2>
      <div className="space-y-6">
        {activePolls.length === 0 ? (
          <Card>
            <div className="p-12 text-center">
              <p className="text-green-600">Нет активных опросов</p>
            </div>
          </Card>
        ) : (
          activePolls.map(poll => <Card key={poll.id} hover>
            <div className="p-8">
              <h3 className="text-xl font-bold text-green-900">{poll.title}</h3>
              <p className="mt-2 text-sm text-green-600">{poll.description}</p>
              <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <div className="space-y-4">
                    {poll.options.map((option, index) => <div key={index}>
                        <div className="flex items-center justify-between mb-2">
                          <label className="flex items-center cursor-pointer">
                            <input 
                              type="radio" 
                              name={`poll-${poll.id}`} 
                              className="h-4 w-4 text-green-800" 
                              checked={selectedOptions[poll.id] === index}
                              onChange={() => setSelectedOptions(prev => ({ ...prev, [poll.id]: index }))}
                              disabled={votedPolls.has(poll.id)}
                            />
                            <span className="ml-3 text-sm font-medium text-green-700">
                              {option.text}
                            </span>
                          </label>
                          <span className="text-sm font-semibold text-green-800">
                            {poll.totalVotes > 0 ? Math.round((option.votes / poll.totalVotes) * 100) : 0}%
                          </span>
                        </div>
                        <div className="w-full bg-green-200 rounded-full h-3 overflow-hidden">
                          <div className="bg-gradient-to-r from-green-700 to-green-900 h-3 rounded-full transition-all duration-500 shadow-sm" style={{
                      width: `${poll.totalVotes > 0 ? (option.votes / poll.totalVotes) * 100 : 0}%`
                    }}></div>
                        </div>
                      </div>)}
                  </div>
                  <div className="mt-6 flex items-center justify-between">
                    <span className="text-sm text-green-600 font-medium">
                      Всего голосов: {poll.totalVotes}
                    </span>
                    <span className="text-sm text-red-600 font-semibold">
                      Осталось: {getDeadlineText(poll.deadline)}
                    </span>
                  </div>
                  <div className="mt-6">
                    {votedPolls.has(poll.id) ? (
                      <div className="px-4 py-2 bg-green-100 text-green-800 rounded-lg text-sm font-medium">
                        ✓ Вы уже проголосовали
                      </div>
                    ) : (
                      <Button 
                        variant="primary" 
                        onClick={() => handleVote(poll.id)}
                        disabled={selectedOptions[poll.id] === undefined}
                      >
                        Проголосовать
                      </Button>
                    )}
                  </div>
                </div>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={poll.options} cx="50%" cy="50%" outerRadius={100} fill="#8884d8" dataKey="votes" label={({
                    text,
                    percent
                  }) => `${text}: ${(percent * 100).toFixed(0)}%`}>
                        {poll.options.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </Card>)
        )}
      </div>
      <h2 className="text-2xl font-bold text-green-900">Завершенные опросы</h2>
      <div className="space-y-6">
        {completedPolls.length === 0 ? (
          <Card>
            <div className="p-12 text-center">
              <p className="text-green-600">Нет завершенных опросов</p>
            </div>
          </Card>
        ) : (
          completedPolls.map(poll => <Card key={poll.id} hover>
            <div className="p-8">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-green-900">
                  {poll.title}
                </h3>
                <span className="inline-flex items-center px-4 py-2 rounded-full text-xs font-semibold bg-gradient-to-r from-green-100 to-green-200 text-green-700">
                  Завершен
                </span>
              </div>
              <p className="mt-2 text-sm text-green-600">{poll.description}</p>
              <div className="mt-6 h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={poll.options.map(opt => ({ name: opt.text, votes: opt.votes }))} margin={{
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
                <span className="text-sm text-green-600 font-medium">
                  Всего голосов: {poll.totalVotes}
                </span>
              </div>
            </div>
          </Card>)
        )}
      </div>
    </div>;
}