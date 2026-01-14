import React from 'react';
import { Card } from './Card';
import { XIcon } from 'lucide-react';

interface PostPreviewProps {
  title: string;
  content: string;
  image?: string;
  category?: string;
  date?: string;
  author?: string;
  onClose: () => void;
  type?: 'news' | 'event';
  eventDetails?: {
    date?: string;
    time?: string;
    location?: string;
    subject?: string;
  };
}

export function PostPreview({
  title,
  content,
  image,
  category,
  date,
  author,
  onClose,
  type = 'news',
  eventDetails
}: PostPreviewProps) {
  return (
    <div className="fixed inset-0 z-[10000] bg-black bg-opacity-75 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-auto">
        <div className="p-6 border-b border-green-200 flex items-center justify-between">
          <h3 className="text-xl font-bold text-green-900">Предпросмотр поста</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-green-100 rounded-lg transition-colors"
          >
            <XIcon className="h-5 w-5 text-green-700" />
          </button>
        </div>
        
        <div className="p-6">
          <Card>
            <div className={image ? "md:flex" : ""}>
              {image && (
                <div className="md:flex-shrink-0">
                  <img 
                    className="h-56 w-full object-cover md:h-full md:w-80 rounded-t-2xl md:rounded-l-2xl md:rounded-tr-none" 
                    src={image} 
                    alt={title}
                    style={{ aspectRatio: '16/9', objectFit: 'cover' }}
                  />
                </div>
              )}
              <div className={image ? "p-6 md:p-8 flex-1" : "p-6 md:p-8"}>
                {category && (
                  <div className="flex items-center space-x-3 mb-3">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-green-100 to-green-200 text-green-800">
                      {category}
                    </span>
                    {date && (
                      <span className="text-sm text-green-600">{date}</span>
                    )}
                  </div>
                )}
                
                <h3 className="text-xl font-bold text-green-900 mb-3">
                  {title || 'Заголовок поста'}
                </h3>
                
                {type === 'event' && eventDetails && (
                  <div className="mb-4 space-y-2 text-sm text-green-600">
                    {eventDetails.subject && (
                      <p>
                        <strong>Предмет:</strong>{' '}
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 ml-1">
                          {eventDetails.subject}
                        </span>
                      </p>
                    )}
                    {eventDetails.date && (
                      <p><strong>Дата:</strong> {eventDetails.date}</p>
                    )}
                    {eventDetails.time && (
                      <p><strong>Время:</strong> {eventDetails.time}</p>
                    )}
                    {eventDetails.location && (
                      <p><strong>Место:</strong> {eventDetails.location}</p>
                    )}
                  </div>
                )}
                
                <p className="text-green-600 leading-relaxed whitespace-pre-wrap">
                  {content || 'Содержание поста...'}
                </p>
                
                {author && (
                  <p className="text-sm text-green-600 mt-4">
                    Автор: {author}
                  </p>
                )}
              </div>
            </div>
          </Card>
          
          <div className="mt-6 text-center">
            <button
              onClick={onClose}
              className="px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-green-800 to-green-900 rounded-lg hover:from-green-900 hover:to-black transition-all"
            >
              Закрыть предпросмотр
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

