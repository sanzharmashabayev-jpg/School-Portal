import React, { createContext, useContext, useState, useEffect, useMemo, useCallback, ReactNode } from 'react';
import { supabase } from '../lib/supabase';

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
  subject?: string;
  date: string;
  time?: string;
  location?: string;
  description?: string;
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
  addNews: (news: Omit<NewsItem, 'id' | 'date' | 'author'>) => Promise<void>;
  updateNews: (id: number, news: Partial<NewsItem>) => Promise<void>;
  deleteNews: (id: number) => Promise<void>;
  getPublishedNews: () => NewsItem[];
  loading: boolean;

  // Events
  events: Event[];
  setEvents: React.Dispatch<React.SetStateAction<Event[]>>;
  addEvent: (event: Omit<Event, 'id'>) => Promise<void>;
  updateEvent: (id: number, event: Partial<Event>) => Promise<void>;
  deleteEvent: (id: number) => Promise<void>;
  getActiveEvents: () => Event[];

  // Polls
  polls: Poll[];
  setPolls: React.Dispatch<React.SetStateAction<Poll[]>>;
  addPoll: (poll: Omit<Poll, 'id' | 'totalVotes'>) => Promise<void>;
  updatePoll: (id: number, poll: Partial<Poll>) => Promise<void>;
  deletePoll: (id: number) => Promise<void>;
  votePoll: (pollId: number, optionIndex: number) => Promise<void>;
  getActivePolls: () => Poll[];
  hasVotedPoll: (pollId: number) => boolean;

  // Announcements
  announcements: Announcement[];
  setAnnouncements: React.Dispatch<React.SetStateAction<Announcement[]>>;
  addAnnouncement: (announcement: Omit<Announcement, 'id' | 'date'>) => Promise<void>;
  updateAnnouncement: (id: number, announcement: Partial<Announcement>) => Promise<void>;
  deleteAnnouncement: (id: number) => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// Map DB row to app type
function mapNewsRow(row: any): NewsItem {
  return {
    id: row.id,
    category: row.category,
    title: row.title,
    content: row.content,
    image: row.image || '',
    status: row.status,
    date: row.date,
    author: row.author || 'Админ',
  };
}

function mapEventRow(row: any): Event {
  return {
    id: row.id,
    title: row.title,
    type: row.type,
    subject: row.subject,
    date: row.date,
    time: row.time,
    location: row.location,
    description: row.description,
    image: row.image,
    status: row.status,
  };
}

function mapPollRow(row: any): Poll {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    options: Array.isArray(row.options) ? row.options : [],
    status: row.status,
    deadline: row.deadline,
    totalVotes: row.total_votes ?? 0,
  };
}

function mapAnnouncementRow(row: any): Announcement {
  return {
    id: row.id,
    title: row.title,
    content: row.content,
    type: row.type,
    date: row.date,
    from: row.from,
  };
}

export function DataProvider({ children }: { children: ReactNode }) {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [polls, setPolls] = useState<Poll[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [votedPollIds, setVotedPollIds] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);

  // Load voted polls from localStorage (for quickLogin) and Supabase (for real auth)
  const loadVotedPolls = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data } = await supabase.from('poll_votes').select('poll_id').eq('user_id', user.id);
      if (data) {
        setVotedPollIds(new Set(data.map((r: any) => r.poll_id)));
      }
    } else {
      try {
        const saved = localStorage.getItem('schoolportal_voted_polls');
        if (saved) {
          setVotedPollIds(new Set(JSON.parse(saved)));
        }
      } catch {
        // ignore
      }
    }
  }, []);

  // Fetch all data from Supabase
  useEffect(() => {
    let cancelled = false;

    async function fetchAll() {
      setLoading(true);
      try {
        const [newsRes, eventsRes, pollsRes, announcementsRes] = await Promise.all([
          supabase.from('news').select('*').order('id', { ascending: false }),
          supabase.from('events').select('*').order('id', { ascending: false }),
          supabase.from('polls').select('*').order('id', { ascending: false }),
          supabase.from('announcements').select('*').order('id', { ascending: false }),
        ]);

        if (cancelled) return;

        if (newsRes.data) setNewsItems(newsRes.data.map(mapNewsRow));
        if (eventsRes.data) setEvents(eventsRes.data.map(mapEventRow));
        if (pollsRes.data) setPolls(pollsRes.data.map(mapPollRow));
        if (announcementsRes.data) setAnnouncements(announcementsRes.data.map(mapAnnouncementRow));

        await loadVotedPolls();
      } catch (err) {
        console.error('Error loading data from Supabase:', err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchAll();
    return () => { cancelled = true; };
  }, [loadVotedPolls]);

  // Realtime subscriptions for live updates across devices
  useEffect(() => {
    const chNews = supabase.channel('news-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'news' }, () => {
        supabase.from('news').select('*').order('id', { ascending: false }).then(({ data }) => data && setNewsItems(data.map(mapNewsRow)));
      })
      .subscribe();
    const chEvents = supabase.channel('events-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'events' }, () => {
        supabase.from('events').select('*').order('id', { ascending: false }).then(({ data }) => data && setEvents(data.map(mapEventRow)));
      })
      .subscribe();
    const chPolls = supabase.channel('polls-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'polls' }, () => {
        supabase.from('polls').select('*').order('id', { ascending: false }).then(({ data }) => data && setPolls(data.map(mapPollRow)));
      })
      .subscribe();
    const chAnnouncements = supabase.channel('announcements-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'announcements' }, () => {
        supabase.from('announcements').select('*').order('id', { ascending: false }).then(({ data }) => data && setAnnouncements(data.map(mapAnnouncementRow)));
      })
      .subscribe();

    return () => {
      supabase.removeChannel(chNews);
      supabase.removeChannel(chEvents);
      supabase.removeChannel(chPolls);
      supabase.removeChannel(chAnnouncements);
    };
  }, []);

  const hasVotedPoll = useCallback((pollId: number) => votedPollIds.has(pollId), [votedPollIds]);

  // News
  const addNews = useCallback(async (news: Omit<NewsItem, 'id' | 'date' | 'author'>) => {
    const { data, error } = await supabase.from('news').insert({
      category: news.category,
      title: news.title,
      content: news.content,
      image: news.image || '',
      status: news.status,
      date: new Date().toISOString(),
      author: 'Админ',
    }).select('id, category, title, content, image, status, date, author').single();

    if (error) throw error;
    setNewsItems(prev => [mapNewsRow(data), ...prev]);
  }, []);

  const updateNews = useCallback(async (id: number, news: Partial<NewsItem>) => {
    const { data, error } = await supabase.from('news').update(news).eq('id', id).select().single();
    if (error) throw error;
    setNewsItems(prev => prev.map(item => item.id === id ? mapNewsRow(data) : item));
  }, []);

  const deleteNews = useCallback(async (id: number) => {
    const { error } = await supabase.from('news').delete().eq('id', id);
    if (error) throw error;
    setNewsItems(prev => prev.filter(item => item.id !== id));
  }, []);

  const getPublishedNews = useCallback(() => newsItems.filter(n => n.status === 'Опубликовано'), [newsItems]);

  // Events
  const addEvent = useCallback(async (event: Omit<Event, 'id'>) => {
    const { data, error } = await supabase.from('events').insert({
      title: event.title,
      type: event.type,
      subject: event.subject ?? null,
      date: event.date,
      time: event.time ?? null,
      location: event.location ?? null,
      description: event.description ?? null,
      image: event.image ?? null,
      status: event.status,
    }).select().single();

    if (error) throw error;
    setEvents(prev => [mapEventRow(data), ...prev]);
  }, []);

  const updateEvent = useCallback(async (id: number, event: Partial<Event>) => {
    const { data, error } = await supabase.from('events').update(event).eq('id', id).select().single();
    if (error) throw error;
    setEvents(prev => prev.map(item => item.id === id ? mapEventRow(data) : item));
  }, []);

  const deleteEvent = useCallback(async (id: number) => {
    const { error } = await supabase.from('events').delete().eq('id', id);
    if (error) throw error;
    setEvents(prev => prev.filter(item => item.id !== id));
  }, []);

  const getActiveEvents = useCallback(() => events.filter(e => e.status === 'Активно'), [events]);

  // Polls
  const addPoll = useCallback(async (poll: Omit<Poll, 'id' | 'totalVotes'>) => {
    const totalVotes = poll.options.reduce((sum, opt) => sum + opt.votes, 0);
    const { data, error } = await supabase.from('polls').insert({
      title: poll.title,
      description: poll.description,
      options: poll.options,
      status: poll.status,
      deadline: poll.deadline,
      total_votes: totalVotes,
    }).select().single();

    if (error) throw error;
    setPolls(prev => [mapPollRow(data), ...prev]);
  }, []);

  const updatePoll = useCallback(async (id: number, poll: Partial<Poll>) => {
    const updates: any = { ...poll };
    if (poll.options) {
      updates.total_votes = poll.options.reduce((sum: number, opt: PollOption) => sum + opt.votes, 0);
    }
    const { data, error } = await supabase.from('polls').update(updates).eq('id', id).select().single();
    if (error) throw error;
    setPolls(prev => prev.map(item => item.id === id ? mapPollRow(data) : item));
  }, []);

  const deletePoll = useCallback(async (id: number) => {
    const { error } = await supabase.from('polls').delete().eq('id', id);
    if (error) throw error;
    setPolls(prev => prev.filter(item => item.id !== id));
  }, []);

  const votePoll = useCallback(async (pollId: number, optionIndex: number) => {
    const poll = polls.find(p => p.id === pollId);
    if (!poll || poll.status !== 'Активен' || votedPollIds.has(pollId)) return;

    const newOptions = [...poll.options];
    if (!newOptions[optionIndex]) return;

    newOptions[optionIndex] = { ...newOptions[optionIndex], votes: newOptions[optionIndex].votes + 1 };
    const totalVotes = poll.totalVotes + 1;

    const { error } = await supabase.from('polls').update({
      options: newOptions,
      total_votes: totalVotes,
    }).eq('id', pollId);

    if (error) throw error;

    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase.from('poll_votes').insert({ poll_id: pollId, user_id: user.id, option_index: optionIndex });
    } else {
      const newSet = new Set(votedPollIds);
      newSet.add(pollId);
      setVotedPollIds(newSet);
      localStorage.setItem('schoolportal_voted_polls', JSON.stringify([...newSet]));
    }

    setPolls(prev => prev.map(p => p.id === pollId ? { ...p, options: newOptions, totalVotes } : p));
    setVotedPollIds(prev => new Set([...prev, pollId]));
  }, [polls, votedPollIds]);

  const getActivePolls = useCallback(() => polls.filter(p => p.status === 'Активен'), [polls]);

  // Announcements
  const addAnnouncement = useCallback(async (announcement: Omit<Announcement, 'id' | 'date'>) => {
    const { data, error } = await supabase.from('announcements').insert({
      title: announcement.title,
      content: announcement.content,
      type: announcement.type,
      date: new Date().toISOString(),
      from: announcement.from,
    }).select().single();

    if (error) throw error;
    setAnnouncements(prev => [mapAnnouncementRow(data), ...prev]);
  }, []);

  const updateAnnouncement = useCallback(async (id: number, announcement: Partial<Announcement>) => {
    const { data, error } = await supabase.from('announcements').update(announcement).eq('id', id).select().single();
    if (error) throw error;
    setAnnouncements(prev => prev.map(item => item.id === id ? mapAnnouncementRow(data) : item));
  }, []);

  const deleteAnnouncement = useCallback(async (id: number) => {
    const { error } = await supabase.from('announcements').delete().eq('id', id);
    if (error) throw error;
    setAnnouncements(prev => prev.filter(item => item.id !== id));
  }, []);

  const value = useMemo(() => ({
    newsItems,
    setNewsItems,
    addNews,
    updateNews,
    deleteNews,
    getPublishedNews,
    loading,
    events,
    setEvents,
    addEvent,
    updateEvent,
    deleteEvent,
    getActiveEvents,
    polls,
    setPolls,
    addPoll,
    updatePoll,
    deletePoll,
    votePoll,
    getActivePolls,
    hasVotedPoll,
    announcements,
    setAnnouncements,
    addAnnouncement,
    updateAnnouncement,
    deleteAnnouncement,
  }), [newsItems, events, polls, announcements, loading, votedPollIds, addNews, updateNews, deleteNews, getPublishedNews,
    addEvent, updateEvent, deleteEvent, getActiveEvents, addPoll, updatePoll, deletePoll, votePoll, getActivePolls,
    hasVotedPoll, addAnnouncement, updateAnnouncement, deleteAnnouncement]);

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
