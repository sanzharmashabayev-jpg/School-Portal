import React from 'react';
import { createPortal } from 'react-dom';
import { XIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}
export function AdminModal({
  isOpen,
  onClose,
  title,
  children,
  size = 'md'
}: AdminModalProps) {
  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl'
  };
  if (!isOpen) return null;
  
  return createPortal(
    <div className="fixed inset-0 z-[9999] overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" 
          onClick={onClose} 
        />
        <motion.div 
          key={`modal-${title}`}
          initial={{
            opacity: 0,
            scale: 0.95,
            y: 20
          }}
          animate={{
            opacity: 1,
            scale: 1,
            y: 0
          }}
          exit={{
            opacity: 0,
            scale: 0.95,
            y: 20
          }}
          className={`relative w-full ${sizeClasses[size]} bg-white rounded-2xl shadow-2xl z-[10000] max-h-[90vh] flex flex-col`}
        >
          <div className="flex items-center justify-between p-6 border-b border-green-200 flex-shrink-0">
            <h3 className="text-xl font-bold text-green-900">{title}</h3>
            <button onClick={onClose} className="p-2 hover:bg-green-100 rounded-lg transition-colors">
              <XIcon className="h-5 w-5 text-green-600" />
            </button>
          </div>
          <div className="overflow-y-auto flex-1">
            {children}
          </div>
        </motion.div>
      </div>
    </div>,
    document.body
  );
}