import React, { useRef, useState, useEffect } from 'react';

interface ParliamentMember {
  name: string;
  role?: string;
  isPresident?: boolean;
  isVice?: boolean;
}

interface ParliamentCarouselProps {
  members: ParliamentMember[];
}

export function ParliamentCarousel({ members }: ParliamentCarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [velocity, setVelocity] = useState(0);
  const [lastX, setLastX] = useState(0);
  const [lastTime, setLastTime] = useState(0);
  const animationRef = useRef<number>(0);
  const inertiaRef = useRef<number>(0);
  const autoScrollRef = useRef<number>(0);

  // Вычисляем ширину контента для анимации
  useEffect(() => {
    if (contentRef.current && containerRef.current) {
      const contentWidth = contentRef.current.scrollWidth;
      // Устанавливаем ширину контейнера для правильной работы overflow
      if (contentWidth > 0) {
        containerRef.current.style.width = '100%';
      }
    }
  }, [members]);

  // Инерция после свайпа
  useEffect(() => {
    if (isDragging || Math.abs(velocity) < 0.1) {
      setVelocity(0);
      return;
    }

    let currentVelocity = velocity;
    let isActive = true;
    let currentScroll = scrollLeft;

    const applyInertia = () => {
      if (!isActive || !contentRef.current || isDragging) {
        setVelocity(0);
        return;
      }
      
      currentScroll -= currentVelocity;
      setScrollLeft(currentScroll);
      
      // Замедление
      currentVelocity *= 0.95;
      
      // Если достигли конца, сбрасываем на начало
      if (contentRef.current) {
        const maxScroll = contentRef.current.scrollWidth / 2;
        if (currentScroll <= -maxScroll) {
          currentScroll = 0;
          setScrollLeft(0);
        }
        if (currentScroll > 0) {
          currentScroll = -maxScroll + 1;
          setScrollLeft(currentScroll);
        }
      }
      
      if (Math.abs(currentVelocity) > 0.1) {
        inertiaRef.current = requestAnimationFrame(applyInertia);
      } else {
        setVelocity(0);
        setScrollLeft(currentScroll);
      }
    };
    
    inertiaRef.current = requestAnimationFrame(applyInertia);

    return () => {
      isActive = false;
      if (inertiaRef.current) {
        cancelAnimationFrame(inertiaRef.current);
      }
    };
  }, [isDragging, velocity, scrollLeft]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!containerRef.current || !contentRef.current) return;
    setIsDragging(true);
    setVelocity(0);
    const x = e.pageX - (containerRef.current.getBoundingClientRect().left || 0);
    setStartX(x);
    setLastX(x);
    setLastTime(Date.now());
    // Получаем текущую позицию из transform или начинаем с 0
    const computedStyle = window.getComputedStyle(contentRef.current);
    const transform = computedStyle.transform;
    if (transform && transform !== 'none') {
      const matrix = transform.match(/matrix\(([^)]+)\)/);
      if (matrix) {
        const values = matrix[1].split(',');
        const currentX = parseFloat(values[4]) || 0;
        setScrollLeft(-currentX);
      }
    } else {
      setScrollLeft(0);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !containerRef.current) return;
    e.preventDefault();
    const x = e.pageX - (containerRef.current.getBoundingClientRect().left || 0);
    const walk = (x - startX) * 2;
    const newScrollLeft = scrollLeft - walk;
    setScrollLeft(newScrollLeft);
    
    // Вычисляем скорость для инерции
    const now = Date.now();
    const timeDelta = now - lastTime;
    if (timeDelta > 0) {
      const currentVelocity = (x - lastX) / timeDelta * 2;
      setVelocity(currentVelocity);
    }
    setLastX(x);
    setLastTime(now);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  // Touch events для мобильных устройств
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!containerRef.current || !contentRef.current) return;
    setIsDragging(true);
    setVelocity(0);
    const x = e.touches[0].pageX - (containerRef.current.getBoundingClientRect().left || 0);
    setStartX(x);
    setLastX(x);
    setLastTime(Date.now());
    // Получаем текущую позицию из transform или начинаем с 0
    const computedStyle = window.getComputedStyle(contentRef.current);
    const transform = computedStyle.transform;
    if (transform && transform !== 'none') {
      const matrix = transform.match(/matrix\(([^)]+)\)/);
      if (matrix) {
        const values = matrix[1].split(',');
        const currentX = parseFloat(values[4]) || 0;
        setScrollLeft(-currentX);
      }
    } else {
      setScrollLeft(0);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !containerRef.current) return;
    const x = e.touches[0].pageX - (containerRef.current.getBoundingClientRect().left || 0);
    const walk = (x - startX) * 2;
    const newScrollLeft = scrollLeft - walk;
    setScrollLeft(newScrollLeft);
    
    // Вычисляем скорость для инерции
    const now = Date.now();
    const timeDelta = now - lastTime;
    if (timeDelta > 0) {
      const currentVelocity = (x - lastX) / timeDelta * 2;
      setVelocity(currentVelocity);
    }
    setLastX(x);
    setLastTime(now);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // Дублируем массив для бесшовной прокрутки
  const duplicatedMembers = [...members, ...members];

  return (
    <div className="relative">
      {/* Градиент слева */}
      <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-white/50 to-transparent z-10 pointer-events-none"></div>
      {/* Градиент справа */}
      <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white/50 to-transparent z-10 pointer-events-none"></div>
      
      <div
        ref={containerRef}
        className="flex gap-4 overflow-x-hidden scrollbar-hide"
        style={{
          cursor: isDragging ? 'grabbing' : 'grab',
          WebkitOverflowScrolling: 'touch',
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div
          ref={contentRef}
          className="flex gap-4"
          style={{
            width: 'max-content',
            animation: isDragging || Math.abs(velocity) > 0.1 ? 'none' : 'parliament-scroll 30s linear infinite',
            transform: isDragging || Math.abs(velocity) > 0.1 ? `translateX(${scrollLeft}px)` : undefined,
            willChange: isDragging ? 'transform' : 'auto',
          }}
        >
          {duplicatedMembers.map((member, index) => (
            <div
              key={`member-${index}`}
              className={`flex-shrink-0 px-4 py-2 rounded-full font-medium text-sm whitespace-nowrap shadow-md hover:shadow-lg transition-all select-none ${
                member.isPresident 
                  ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white ring-2 ring-yellow-400' 
                  : member.isVice
                  ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-white ring-2 ring-yellow-300'
                  : member.role 
                  ? 'bg-gradient-to-r from-green-800 to-green-900 text-white ring-2 ring-green-600' 
                  : 'bg-gradient-to-r from-green-100 to-green-200 text-green-800'
              }`}
              title={member.role ? `${member.name} - ${member.role}` : member.name}
            >
              {member.name}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

