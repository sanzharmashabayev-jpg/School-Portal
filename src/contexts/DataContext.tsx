import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Типы данных
export interface NewsItem {
  id: number;
  category: string;
  title: string;
  content: string;
  image: string;
  status: 'Опубликовано' | 'Черновик';
  date: string;
  author: string;
}

export interface Event {
  id: number;
  title: string;
  type: 'school' | 'olympiad';
  subject?: string; // Предмет для олимпиад/конкурсов
  date: string;
  time: string;
  location: string;
  description: string;
  image?: string;
  status: 'Активно' | 'Завершено' | 'Отменено';
}

export interface PollOption {
  text: string;
  votes: number;
}

export interface Poll {
  id: number;
  title: string;
  description: string;
  options: PollOption[];
  status: 'Активен' | 'Завершен';
  deadline: string;
  totalVotes: number;
}

export interface Announcement {
  id: number;
  title: string;
  content: string;
  type: 'info' | 'warning' | 'event';
  date: string;
  from: string;
}

interface DataContextType {
  // News
  newsItems: NewsItem[];
  setNewsItems: React.Dispatch<React.SetStateAction<NewsItem[]>>;
  addNews: (news: Omit<NewsItem, 'id' | 'date' | 'author'>) => void;
  updateNews: (id: number, news: Partial<NewsItem>) => void;
  deleteNews: (id: number) => void;
  getPublishedNews: () => NewsItem[];

  // Events
  events: Event[];
  setEvents: React.Dispatch<React.SetStateAction<Event[]>>;
  addEvent: (event: Omit<Event, 'id'>) => void;
  updateEvent: (id: number, event: Partial<Event>) => void;
  deleteEvent: (id: number) => void;
  getActiveEvents: () => Event[];

  // Polls
  polls: Poll[];
  setPolls: React.Dispatch<React.SetStateAction<Poll[]>>;
  addPoll: (poll: Omit<Poll, 'id' | 'totalVotes'>) => void;
  updatePoll: (id: number, poll: Partial<Poll>) => void;
  deletePoll: (id: number) => void;
  votePoll: (pollId: number, optionIndex: number) => void;
  getActivePolls: () => Poll[];

  // Announcements
  announcements: Announcement[];
  setAnnouncements: React.Dispatch<React.SetStateAction<Announcement[]>>;
  addAnnouncement: (announcement: Omit<Announcement, 'id' | 'date'>) => void;
  updateAnnouncement: (id: number, announcement: Partial<Announcement>) => void;
  deleteAnnouncement: (id: number) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// localStorage keys
const STORAGE_KEYS = {
  NEWS: 'schoolportal_news',
  EVENTS: 'schoolportal_events',
  POLLS: 'schoolportal_polls',
  ANNOUNCEMENTS: 'schoolportal_announcements'
};

// Default data
const defaultNews: NewsItem[] = [
    {
      id: 1,
      category: 'Школьные новости',
      title: 'Победа нашей команды на городской олимпиаде по математике',
      content: 'Наши ученики заняли первое место на городской олимпиаде по математике среди школ города.',
      image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b',
      status: 'Опубликовано',
      date: '2024-01-15',
      author: 'Админ'
    },
    {
      id: 2,
      category: 'Мероприятия',
      title: 'Школьный театр представляет новую постановку',
      content: 'В эту пятницу школьный театр представит новую постановку по произведению А.П. Чехова.',
      image: 'https://images.unsplash.com/photo-1503095396549-807759245b35',
      status: 'Опубликовано',
      date: '2024-01-14',
      author: 'Админ'
    }
];

const defaultEvents: Event[] = [
    {
      id: 1,
      title: 'День открытых дверей',
      type: 'school',
      date: '2024-10-26',
      time: '10:00 - 15:00',
      location: 'Актовый зал',
      description: 'Приглашаем всех родителей и будущих учеников познакомиться с нашей школой.',
      status: 'Активно'
    },
    {
      id: 2,
      title: 'Городская олимпиада по математике',
      type: 'olympiad',
    subject: 'Математика',
      date: '2024-11-12',
      time: '10:00 - 13:00',
      location: 'Гимназия №5',
      description: 'Ежегодная городская олимпиада по математике для учеников 8-11 классов.',
      status: 'Активно'
    }
];

const defaultPolls: Poll[] = [
    {
      id: 1,
      title: 'Какие кружки вы хотели бы видеть в школе?',
      description: 'Помогите нам выбрать новые направления для внеклассных занятий.',
      options: [
        { text: 'Робототехника', votes: 45 },
        { text: 'Программирование', votes: 38 },
        { text: 'Театральный', votes: 22 },
        { text: 'Шахматы', votes: 18 }
      ],
      status: 'Активен',
      deadline: '2024-02-15',
      totalVotes: 123
    }
];

const defaultAnnouncements: Announcement[] = [
    {
      id: 1,
      title: 'Изменение в расписании на 25 октября',
      content: 'В связи с проведением педагогического совета занятия 25 октября будут сокращены. Уроки будут идти по 30 минут.',
      type: 'info',
      date: '2024-01-20',
      from: 'Учебная часть'
    },
    {
      id: 2,
      title: 'Важно: Профилактика гриппа и ОРВИ',
      content: 'Уважаемые родители и ученики! В связи с сезонным подъемом заболеваемости просим соблюдать меры профилактики.',
      type: 'warning',
      date: '2024-01-18',
      from: 'Медицинская служба'
    }
];

// Helper functions for localStorage
function loadFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    if (item) {
      return JSON.parse(item) as T;
    }
  } catch (error) {
    console.error(`Error loading ${key} from localStorage:`, error);
  }
  return defaultValue;
}

function saveToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error saving ${key} to localStorage:`, error);
  }
}

export function DataProvider({ children }: { children: ReactNode }) {
  // Load initial data from localStorage or use defaults
  const [newsItems, setNewsItems] = useState<NewsItem[]>(() => 
    loadFromStorage(STORAGE_KEYS.NEWS, defaultNews)
  );
  const [events, setEvents] = useState<Event[]>(() => 
    loadFromStorage(STORAGE_KEYS.EVENTS, defaultEvents)
  );
  const [polls, setPolls] = useState<Poll[]>(() => 
    loadFromStorage(STORAGE_KEYS.POLLS, defaultPolls)
  );
  const [announcements, setAnnouncements] = useState<Announcement[]>(() => 
    loadFromStorage(STORAGE_KEYS.ANNOUNCEMENTS, defaultAnnouncements)
  );

  // Save to localStorage whenever data changes
  useEffect(() => {
    saveToStorage(STORAGE_KEYS.NEWS, newsItems);
  }, [newsItems]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.EVENTS, events);
  }, [events]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.POLLS, polls);
  }, [polls]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.ANNOUNCEMENTS, announcements);
  }, [announcements]);

  // News functions
  const addNews = (news: Omit<NewsItem, 'id' | 'date' | 'author'>) => {
    const newId = Math.max(...newsItems.map(n => n.id), 0) + 1;
    const now = new Date();
    const newItem: NewsItem = {
      ...news,
      id: newId,
      date: now.toISOString(), // Full ISO string with time
      author: 'Админ'
    };
    setNewsItems(prev => [newItem, ...prev]);
  };

  const updateNews = (id: number, news: Partial<NewsItem>) => {
    setNewsItems(prev => prev.map(item => item.id === id ? { ...item, ...news } : item));
  };

  const deleteNews = (id: number) => {
    setNewsItems(prev => prev.filter(item => item.id !== id));
  };

  const getPublishedNews = () => {
    return newsItems.filter(news => news.status === 'Опубликовано');
  };

  // Events functions
  const addEvent = (event: Omit<Event, 'id'>) => {
    const newId = Math.max(...events.map(e => e.id), 0) + 1;
    const newItem: Event = {
      ...event,
      id: newId
    };
    setEvents(prev => [newItem, ...prev]);
  };

  const updateEvent = (id: number, event: Partial<Event>) => {
    setEvents(prev => prev.map(item => item.id === id ? { ...item, ...event } : item));
  };

  const deleteEvent = (id: number) => {
    setEvents(prev => prev.filter(item => item.id !== id));
  };

  const getActiveEvents = () => {
    return events.filter(event => event.status === 'Активно');
  };

  // Polls functions
  const addPoll = (poll: Omit<Poll, 'id' | 'totalVotes'>) => {
    const newId = Math.max(...polls.map(p => p.id), 0) + 1;
    const totalVotes = poll.options.reduce((sum, opt) => sum + opt.votes, 0);
    const newItem: Poll = {
      ...poll,
      id: newId,
      totalVotes
    };
    setPolls(prev => [newItem, ...prev]);
  };

  const updatePoll = (id: number, poll: Partial<Poll>) => {
    setPolls(prev => prev.map(item => {
      if (item.id === id) {
        const updated = { ...item, ...poll };
        if (poll.options) {
          updated.totalVotes = updated.options.reduce((sum, opt) => sum + opt.votes, 0);
        }
        return updated;
      }
      return item;
    }));
  };

  const deletePoll = (id: number) => {
    setPolls(prev => prev.filter(item => item.id !== id));
  };

  const votePoll = (pollId: number, optionIndex: number) => {
    setPolls(prev => prev.map(poll => {
      if (poll.id === pollId && poll.status === 'Активен') {
        const newOptions = [...poll.options];
        if (newOptions[optionIndex]) {
          newOptions[optionIndex] = {
            ...newOptions[optionIndex],
            votes: newOptions[optionIndex].votes + 1
          };
          return {
            ...poll,
            options: newOptions,
            totalVotes: poll.totalVotes + 1
          };
        }
      }
      return poll;
    }));
  };

  const getActivePolls = () => {
    return polls.filter(poll => poll.status === 'Активен');
  };

  // Announcements functions
  const addAnnouncement = (announcement: Omit<Announcement, 'id' | 'date'>) => {
    const newId = Math.max(...announcements.map(a => a.id), 0) + 1;
    const now = new Date();
    const newItem: Announcement = {
      ...announcement,
      id: newId,
      date: now.toISOString() // Full ISO string with time
    };
    setAnnouncements(prev => [newItem, ...prev]);
  };

  const updateAnnouncement = (id: number, announcement: Partial<Announcement>) => {
    setAnnouncements(prev => prev.map(item => item.id === id ? { ...item, ...announcement } : item));
  };

  const deleteAnnouncement = (id: number) => {
    setAnnouncements(prev => prev.filter(item => item.id !== id));
  };

  const value = {
    // News
    newsItems,
    setNewsItems,
    addNews,
    updateNews,
    deleteNews,
    getPublishedNews,
    // Events
    events,
    setEvents,
    addEvent,
    updateEvent,
    deleteEvent,
    getActiveEvents,
    // Polls
    polls,
    setPolls,
    addPoll,
    updatePoll,
    deletePoll,
    votePoll,
    getActivePolls,
    // Announcements
    announcements,
    setAnnouncements,
    addAnnouncement,
    updateAnnouncement,
    deleteAnnouncement
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}

