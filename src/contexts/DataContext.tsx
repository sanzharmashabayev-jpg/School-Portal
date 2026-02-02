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

// Default data - пустые массивы для продакшена
const defaultNews: NewsItem[] = [];
const defaultEvents: Event[] = [];
const defaultPolls: Poll[] = [];
const defaultAnnouncements: Announcement[] = [];

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
    const newId = newsItems.length > 0 ? Math.max(...newsItems.map(n => n.id), 0) + 1 : 1;
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
    const newId = events.length > 0 ? Math.max(...events.map(e => e.id), 0) + 1 : 1;
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
    const newId = polls.length > 0 ? Math.max(...polls.map(p => p.id), 0) + 1 : 1;
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
    const newId = announcements.length > 0 ? Math.max(...announcements.map(a => a.id), 0) + 1 : 1;
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

