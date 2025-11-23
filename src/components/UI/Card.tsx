import React from 'react';
interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}
export function Card({
  children,
  className = '',
  hover = false
}: CardProps) {
  return <div className={`glass-effect rounded-2xl shadow-lg border border-white/20 overflow-hidden ${hover ? 'card-hover' : ''} ${className}`}>
      {children}
    </div>;
}