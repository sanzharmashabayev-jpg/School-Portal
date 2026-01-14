import React, { useRef, useState, useEffect } from 'react';
import { CropIcon, XIcon, CheckIcon } from 'lucide-react';

interface ImageCropperProps {
  imageSrc: string;
  onCrop: (croppedImage: string) => void;
  onCancel: () => void;
  aspectRatio?: number; // Ширина / Высота
  outputWidth?: number;
  outputHeight?: number;
}

export function ImageCropper({ 
  imageSrc, 
  onCrop, 
  onCancel,
  aspectRatio = 16 / 9,
  outputWidth = 800,
  outputHeight = 450
}: ImageCropperProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      setImageLoaded(true);
      // Вычисляем начальный масштаб
      const containerWidth = containerRef.current?.clientWidth || 600;
      const containerHeight = containerRef.current?.clientHeight || 400;
      const imgAspect = img.width / img.height;
      const containerAspect = containerWidth / containerHeight;
      
      let initialScale = 1;
      if (imgAspect > containerAspect) {
        initialScale = containerWidth / img.width;
      } else {
        initialScale = containerHeight / img.height;
      }
      setScale(initialScale * 1.2); // Немного увеличиваем для возможности обрезки
    };
    img.src = imageSrc;
    imageRef.current = img;
  }, [imageSrc]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setScale(prev => Math.max(0.5, Math.min(3, prev * delta)));
  };

  const handleCrop = () => {
    if (!canvasRef.current || !imageRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = outputWidth;
    canvas.height = outputHeight;

    const container = containerRef.current;
    if (!container) return;

    const containerRect = container.getBoundingClientRect();
    const containerWidth = containerRect.width;
    const containerHeight = containerRect.height;
    
    // Вычисляем размеры изображения с учетом масштаба
    const img = imageRef.current;
    const scaledWidth = img.width * scale;
    const scaledHeight = img.height * scale;

    // Вычисляем центр изображения относительно контейнера
    const imgCenterX = containerWidth / 2 + position.x;
    const imgCenterY = containerHeight / 2 + position.y;
    
    // Вычисляем позицию левого верхнего угла изображения
    const imgLeft = imgCenterX - scaledWidth / 2;
    const imgTop = imgCenterY - scaledHeight / 2;
    
    // Вычисляем область обрезки в координатах исходного изображения
    const cropX = Math.max(0, (containerWidth / 2 - outputWidth / 2 - imgLeft) / scale);
    const cropY = Math.max(0, (containerHeight / 2 - outputHeight / 2 - imgTop) / scale);
    
    const sourceWidth = Math.min(outputWidth / scale, img.width - cropX);
    const sourceHeight = Math.min(outputHeight / scale, img.height - cropY);

    // Рисуем обрезанное изображение
    ctx.drawImage(
      img,
      cropX,
      cropY,
      sourceWidth,
      sourceHeight,
      0,
      0,
      outputWidth,
      outputHeight
    );

    const croppedImage = canvas.toDataURL('image/jpeg', 0.9);
    onCrop(croppedImage);
  };

  if (!imageLoaded) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-green-600">Загрузка изображения...</div>
      </div>
    );
  }

  const img = imageRef.current!;
  const scaledWidth = img.width * scale;
  const scaledHeight = img.height * scale;

  return (
    <div className="fixed inset-0 z-[10000] bg-black bg-opacity-75 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-auto">
        <div className="p-6 border-b border-green-200">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-green-900">Обрезка изображения</h3>
            <button
              onClick={onCancel}
              className="p-2 hover:bg-green-100 rounded-lg transition-colors"
            >
              <XIcon className="h-5 w-5 text-green-700" />
            </button>
          </div>
        </div>
        
        <div className="p-6">
          <div className="mb-4 text-sm text-green-600">
            <p>Перетащите изображение для позиционирования, используйте колесо мыши для масштабирования</p>
            <p className="mt-1">Размер выхода: {outputWidth}x{outputHeight}px</p>
          </div>

          <div
            ref={containerRef}
            className="relative w-full h-96 bg-gray-100 rounded-xl overflow-hidden border-2 border-green-400"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onWheel={handleWheel}
            style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
          >
            <div
              className="absolute"
              style={{
                left: `calc(50% + ${position.x}px)`,
                top: `calc(50% + ${position.y}px)`,
                transform: 'translate(-50%, -50%)',
                width: `${scaledWidth}px`,
                height: `${scaledHeight}px`,
              }}
            >
              <img
                src={imageSrc}
                alt="Crop"
                className="w-full h-full object-contain"
                draggable={false}
              />
            </div>
            
            {/* Область обрезки (рамка) */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: `linear-gradient(to right, rgba(0,0,0,0.5) 0%, transparent ${(50 - (outputWidth / 2 / (containerRef.current?.clientWidth || 600) * 100))}%, transparent ${(50 + (outputWidth / 2 / (containerRef.current?.clientWidth || 600) * 100))}%, rgba(0,0,0,0.5) 100%),
                              linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, transparent ${(50 - (outputHeight / 2 / (containerRef.current?.clientHeight || 400) * 100))}%, transparent ${(50 + (outputHeight / 2 / (containerRef.current?.clientHeight || 400) * 100))}%, rgba(0,0,0,0.5) 100%)`
              }}
            >
              <div className="absolute inset-0 border-2 border-white shadow-lg" 
                   style={{
                     left: `calc(50% - ${outputWidth / 2}px)`,
                     top: `calc(50% - ${outputHeight / 2}px)`,
                     width: `${outputWidth}px`,
                     height: `${outputHeight}px`,
                   }}
              />
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <label className="text-sm text-green-700">
                Масштаб: {Math.round(scale * 100)}%
              </label>
              <input
                type="range"
                min="0.5"
                max="3"
                step="0.1"
                value={scale}
                onChange={(e) => setScale(parseFloat(e.target.value))}
                className="w-32"
              />
            </div>
            <div className="flex space-x-3">
              <button
                onClick={onCancel}
                className="px-4 py-2 text-sm font-semibold text-green-700 border-2 border-green-400 rounded-lg hover:bg-green-50 transition-all"
              >
                Отмена
              </button>
              <button
                onClick={handleCrop}
                className="px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-green-800 to-green-900 rounded-lg hover:from-green-900 hover:to-black transition-all flex items-center space-x-2"
              >
                <CheckIcon className="h-4 w-4" />
                <span>Применить обрезку</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}

