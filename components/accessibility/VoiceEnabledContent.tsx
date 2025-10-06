'use client';

import { useEffect, useRef, type ReactNode, type FormEvent } from 'react';
import { useVoiceAccessibility } from '@/lib/voice-accessibility';
import { useAccessibility } from '@/lib/accessibility-context';

interface VoiceEnabledContentProps {
  children: ReactNode;
  contentType?: 'lesson' | 'navigation' | 'form' | 'button' | 'text';
  autoRead?: boolean;
  priority?: 'low' | 'medium' | 'high';
  description?: string;
  voiceCommands?: { [key: string]: () => void };
}

export function VoiceEnabledContent({
  children,
  contentType = 'text',
  autoRead = false,
  priority = 'medium',
  description,
  voiceCommands = {}
}: VoiceEnabledContentProps) {
  const { profile } = useAccessibility();
  const { speak, registerVoiceCommand, readContent, announceAction } = useVoiceAccessibility();
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Register custom voice commands for this content
    Object.entries(voiceCommands).forEach(([command, callback]) => {
      registerVoiceCommand(command, callback);
    });

    // Auto-read content for visually impaired users
    if (autoRead && profile === 'visual' && contentRef.current) {
      const textContent = contentRef.current.textContent || '';
      if (textContent.trim()) {
        setTimeout(() => {
          readContent(textContent);
        }, 500);
      }
    }
  }, [autoRead, profile, voiceCommands]);

  const handleFocus = () => {
    if (profile === 'visual' && description) {
      speak(description, priority);
    }
  };

  const handleClick = () => {
    if (contentType === 'button' && description) {
      announceAction(description);
    }
  };

  return (
    <div
      ref={contentRef}
      onFocus={handleFocus}
      onClick={handleClick}
      tabIndex={profile === 'visual' ? 0 : -1}
      className={`${profile === 'visual' ? 'focus:outline-2 focus:outline-blue-500 focus:outline-offset-2' : ''}`}
      aria-label={description}
      role={contentType === 'button' ? 'button' : contentType === 'navigation' ? 'navigation' : undefined}
    >
      {children}
    </div>
  );
}

// Specialized components for different content types
export function VoiceEnabledButton({
  children,
  onClick,
  description,
  className = '',
  ...props
}: {
  children: ReactNode;
  onClick?: () => void;
  description: string;
  className?: string;
  [key: string]: any;
}) {
  const { profile } = useAccessibility();
  const { speak, announceAction } = useVoiceAccessibility();

  const handleClick = () => {
    announceAction(description);
    onClick?.();
  };

  const handleFocus = () => {
    if (profile === 'visual') {
      speak(`Button: ${description}`, 'low');
    }
  };

  return (
    <button
      {...props}
      onClick={handleClick}
      onFocus={handleFocus}
      className={`${className} ${profile === 'visual' ? 'focus:ring-4 focus:ring-blue-300' : ''}`}
      aria-label={description}
    >
      {children}
    </button>
  );
}

export function VoiceEnabledText({
  children,
  autoRead = false,
  priority = 'low',
  className = ''
}: {
  children: ReactNode;
  autoRead?: boolean;
  priority?: 'low' | 'medium' | 'high';
  className?: string;
}) {
  const { profile } = useAccessibility();
  const { readContent } = useVoiceAccessibility();
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (autoRead && profile === 'visual' && textRef.current) {
      const textContent = textRef.current.textContent || '';
      if (textContent.trim()) {
        setTimeout(() => {
          readContent(textContent);
        }, 300);
      }
    }
  }, [autoRead, profile]);

  const handleFocus = () => {
    if (profile === 'visual' && textRef.current) {
      const textContent = textRef.current.textContent || '';
      readContent(textContent);
    }
  };

  return (
    <div
      ref={textRef}
      onFocus={handleFocus}
      tabIndex={profile === 'visual' ? 0 : -1}
      className={`${className} ${profile === 'visual' ? 'focus:outline-2 focus:outline-blue-500 focus:outline-offset-1 cursor-pointer' : ''}`}
      role="text"
    >
      {children}
    </div>
  );
}

export function VoiceEnabledNavigation({
  children,
  navigationDescription,
  className = ''
}: {
  children: ReactNode;
  navigationDescription: string;
  className?: string;
}) {
  const { profile } = useAccessibility();
  const { announceNavigation, registerVoiceCommand } = useVoiceAccessibility();

  useEffect(() => {
    if (profile === 'visual') {
      announceNavigation(navigationDescription);
    }
  }, [profile, navigationDescription]);

  return (
    <nav
      className={`${className} ${profile === 'visual' ? 'focus-within:ring-2 focus-within:ring-blue-500' : ''}`}
      aria-label={navigationDescription}
      role="navigation"
    >
      {children}
    </nav>
  );
}

export function VoiceEnabledForm({
  children,
  formDescription,
  onSubmit,
  className = ''
}: {
  children: ReactNode;
  formDescription: string;
  onSubmit?: (e: FormEvent) => void;
  className?: string;
}) {
  const { profile } = useAccessibility();
  const { speak, announceAction } = useVoiceAccessibility();

  useEffect(() => {
    if (profile === 'visual') {
      speak(`Form: ${formDescription}. Use tab to navigate between fields.`, 'medium');
    }
  }, [profile, formDescription]);

  const handleSubmit = (e: FormEvent) => {
    announceAction('Form submitted');
    onSubmit?.(e);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`${className} ${profile === 'visual' ? 'focus-within:ring-2 focus-within:ring-blue-500' : ''}`}
      aria-label={formDescription}
    >
      {children}
    </form>
  );
}

// Hook for easy voice integration in any component
export function useVoiceEnabled(contentDescription: string, autoAnnounce = false) {
  const { profile } = useAccessibility();
  const { speak, readContent, announceAction } = useVoiceAccessibility();

  useEffect(() => {
    if (autoAnnounce && profile === 'visual') {
      speak(contentDescription, 'medium');
    }
  }, [autoAnnounce, profile, contentDescription]);

  return {
    announceContent: () => readContent(contentDescription),
    announceAction: (action: string) => announceAction(action),
    speakText: (text: string, priority: 'low' | 'medium' | 'high' = 'medium') => speak(text, priority),
    isVoiceEnabled: profile === 'visual'
  };
}