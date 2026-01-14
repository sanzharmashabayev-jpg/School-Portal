import React, { useEffect, useState } from 'react';
import MetallicPaint, { parseLogoImage } from './MetallicPaint';
const LOGO_URL = "/O-removebg-preview.png";
export function MetallicLogo() {
  const [imageData, setImageData] = useState<ImageData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    async function loadLogo() {
      try {
        const response = await fetch(LOGO_URL);
        const blob = await response.blob();
        const result = await parseLogoImage(blob);
        setImageData(result.imageData);
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to load logo:', error);
        setIsLoading(false);
      }
    }
    loadLogo();
  }, []);
  if (isLoading || !imageData) {
    return <div className="h-28 w-56 flex items-center justify-center">
        <div className="text-transparent bg-clip-text bg-gradient-to-r from-green-800 to-green-900 font-bold text-2xl">
          Shoqan Portal
        </div>
      </div>;
  }
  return <div className="h-28 w-56">
      <MetallicPaint imageData={imageData} />
    </div>;
}