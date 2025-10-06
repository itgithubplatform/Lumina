'use client';

import { type ButtonHTMLAttributes, type ReactNode, type MouseEvent } from 'react';
import { useAccessibility } from '@/lib/accessibility-context';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accessibility';
  size?: 'sm' | 'md' | 'lg';
  voiceCommand?: string;
  children: ReactNode;
}

export function Button({ 
  variant = 'primary', 
  size = 'md', 
  voiceCommand,
  children, 
  className = '',
  ...props 
}: ButtonProps) {
  const { settings, speak } = useAccessibility();

  const baseClasses = 'font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-opacity-50';
  
  const variants = {
    primary: 'bg-primary-600 hover:bg-primary-700 text-white focus:ring-primary-300',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-900 focus:ring-gray-300',
    accessibility: 'bg-yellow-400 hover:bg-yellow-500 text-black focus:ring-yellow-300 border-2 border-black',
  };

  const sizes = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    if (settings.voiceNavigation) {
      speak(`${children} button clicked`);
    }
    props.onClick?.(e);
  };

  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${settings.voiceNavigation ? 'voice-command' : ''} ${className}`}
      onClick={handleClick}
      aria-label={voiceCommand || children?.toString()}
      {...props}
    >
      {children}
    </button>
  );
}