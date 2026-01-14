import React from 'react';
interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  icon?: React.ReactNode;
}
export function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  onClick,
  type = 'button',
  disabled = false,
  icon
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200';
  const variantStyles = {
    primary: 'bg-gradient-to-r from-green-800 to-green-900 text-white hover:from-green-900 hover:to-black shadow-lg shadow-green-600/50 hover:shadow-xl hover:shadow-green-600/60 focus:ring-green-700',
    secondary: 'bg-gradient-to-r from-green-100 to-green-200 text-green-800 hover:from-green-200 hover:to-green-300 shadow-md hover:shadow-lg focus:ring-green-500',
    outline: 'border-2 border-green-400 text-green-700 hover:bg-white hover:border-green-800 hover:text-green-900 shadow-sm hover:shadow-md focus:ring-green-600'
  };
  const sizeStyles = {
    sm: 'text-xs px-3 py-2',
    md: 'text-sm px-5 py-2.5',
    lg: 'text-base px-7 py-3.5'
  };
  const disabledStyles = disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer';
  return <button type={type} className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${disabledStyles} ${className}`} onClick={onClick} disabled={disabled}>
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </button>;
}