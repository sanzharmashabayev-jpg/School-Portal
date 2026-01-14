import React, { useRef, useState, useEffect } from 'react';
import { UploadIcon, XIcon, ImageIcon, CropIcon } from 'lucide-react';
import { ImageCropper } from './ImageCropper';

interface ImageUploadProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  className?: string;
}

export function ImageUpload({ value, onChange, label = 'Изображение', className = '' }: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(value || null);
  const [isDragging, setIsDragging] = useState(false);
  const [showCropper, setShowCropper] = useState(false);
  const [imageToCrop, setImageToCrop] = useState<string | null>(null);

  // Синхронизируем preview с value при изменении пропсов
  useEffect(() => {
    if (value) {
      setPreview(value);
    } else if (!value && preview && preview.startsWith('data:')) {
      // Сохраняем base64 превью, если value был очищен извне
      setPreview(null);
    }
  }, [value]);

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Пожалуйста, выберите файл изображения');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Размер файла не должен превышать 5 МБ');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      // Показываем обрезку для новых изображений
      setImageToCrop(result);
      setShowCropper(true);
    };
    reader.readAsDataURL(file);
  };

  const handleCropComplete = (croppedImage: string) => {
    setPreview(croppedImage);
    onChange(croppedImage);
    setShowCropper(false);
    setImageToCrop(null);
  };

  const handleCropCancel = () => {
    setShowCropper(false);
    setImageToCrop(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleRemove = () => {
    setPreview(null);
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={className}>
      <label className="block text-sm font-semibold text-green-700 mb-2">
        {label}
      </label>
      
      {preview ? (
        <div className="relative">
          <div className="relative w-full h-64 rounded-xl overflow-hidden border-2 border-green-400 bg-green-50">
            <img 
              src={preview} 
              alt="Preview" 
              className="w-full h-full object-cover"
            />
            <button
              type="button"
              onClick={handleRemove}
              className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors shadow-lg"
            >
              <XIcon className="h-4 w-4" />
            </button>
          </div>
          <div className="mt-2 flex items-center space-x-2 flex-wrap gap-2">
            <button
              type="button"
              onClick={() => {
                if (preview) {
                  setImageToCrop(preview);
                  setShowCropper(true);
                }
              }}
              className="inline-flex items-center px-3 py-2 text-xs font-semibold rounded-lg border-2 border-green-400 text-green-700 hover:bg-white hover:border-green-800 hover:text-green-900 shadow-sm hover:shadow-md focus:ring-green-600 transition-all"
            >
              <CropIcon className="h-4 w-4 mr-2" />
              Обрезать
            </button>
            <button
              type="button"
              onClick={handleClick}
              className="inline-flex items-center px-3 py-2 text-xs font-semibold rounded-lg border-2 border-green-400 text-green-700 hover:bg-white hover:border-green-800 hover:text-green-900 shadow-sm hover:shadow-md focus:ring-green-600 transition-all"
            >
              <UploadIcon className="h-4 w-4 mr-2" />
              Заменить
            </button>
            <span className="text-xs text-green-600">
              Или перетащите новое изображение
            </span>
          </div>
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={handleClick}
          className={`
            relative w-full h-48 rounded-xl border-2 border-dashed 
            ${isDragging ? 'border-green-600 bg-green-50' : 'border-green-400 bg-green-50/50'}
            flex flex-col items-center justify-center cursor-pointer
            transition-all hover:border-green-600 hover:bg-green-50
            ${className}
          `}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          <div className="flex flex-col items-center">
            <div className="p-4 rounded-full bg-green-100 mb-3">
              <ImageIcon className="h-8 w-8 text-green-700" />
            </div>
            <p className="text-sm font-medium text-green-700 mb-1">
              Нажмите или перетащите изображение сюда
            </p>
            <p className="text-xs text-green-600">
              PNG, JPG, GIF до 5 МБ
            </p>
          </div>
        </div>
      )}

      {/* Альтернативный способ: URL */}
      <div className="mt-4">
        <label className="block text-xs font-medium text-green-600 mb-1">
          Или введите URL изображения
        </label>
        <input
          type="url"
          value={value && !value.startsWith('data:') ? value : ''}
          onChange={(e) => {
            const url = e.target.value;
            if (url) {
              setPreview(url);
              onChange(url);
            } else if (!preview || preview.startsWith('data:')) {
              // Сохраняем base64 превью, если URL пустой
              onChange(preview || '');
            }
          }}
          placeholder="https://example.com/image.jpg"
          className="w-full px-4 py-2 rounded-lg border border-green-400 focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
        />
      </div>

      {showCropper && imageToCrop && (
        <ImageCropper
          imageSrc={imageToCrop}
          onCrop={handleCropComplete}
          onCancel={handleCropCancel}
          aspectRatio={16 / 9}
          outputWidth={800}
          outputHeight={450}
        />
      )}
    </div>
  );
}

