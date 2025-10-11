'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type AccessibilityProfile = 'visual' | 'hearing' | 'cognitive' | 'none';
export type UserRole = 'student' | 'teacher' | null;

interface AccessibilitySettings {
  highContrast: boolean;
  dyslexiaFriendly: boolean;
  fontSize: 'small' | 'medium' | 'large' | 'xl';
  voiceNavigation: boolean;
  captions: boolean;
  focusMode: boolean;
  readingSpeed: 'slow' | 'medium' | 'fast';
}

interface AccessibilityContextType {
  profile: AccessibilityProfile;
  role: UserRole;
  settings: AccessibilitySettings;
  setProfile: (profile: AccessibilityProfile) => void;
  setRole: (role: UserRole) => void;
  updateSettings: (settings: Partial<AccessibilitySettings>) => void;
  speak: (text: string) => void;
  isListening: boolean;
  startListening: () => void;
  stopListening: () => void;
}

const defaultSettings: AccessibilitySettings = {
  highContrast: false,
  dyslexiaFriendly: false,
  fontSize: 'medium',
  voiceNavigation: false,
  captions: true,
  focusMode: false,
  readingSpeed: 'medium',
};

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export function AccessibilityProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<AccessibilityProfile>('none');
  const [role, setRole] = useState<UserRole>(null);
  const [settings, setSettings] = useState<AccessibilitySettings>(defaultSettings);
  const [isListening, setIsListening] = useState(false);

  // Text-to-Speech
  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = settings.readingSpeed === 'slow' ? 0.7 : settings.readingSpeed === 'fast' ? 1.3 : 1;
      speechSynthesis.speak(utterance);
    }
  };

  // Speech-to-Text
  const startListening = () => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new (window as any).webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript.toLowerCase();
        handleVoiceCommand(transcript);
      };

      recognition.start();
    }
  };

  const stopListening = () => {
    setIsListening(false);
  };

  const handleVoiceCommand = (command: string) => {
    if (command.includes('student')) {
      setRole('student');
    } else if (command.includes('teacher')) {
      setRole('teacher');
    } else if (command.includes('high contrast')) {
      updateSettings({ highContrast: !settings.highContrast });
    } else if (command.includes('focus mode')) {
      updateSettings({ focusMode: !settings.focusMode });
    }
  };

  const updateSettings = (newSettings: Partial<AccessibilitySettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  // Apply accessibility settings to document
  useEffect(() => {
    const body = document.body;
    
    // High contrast
    if (settings.highContrast) {
      body.classList.add('high-contrast');
    } else {
      body.classList.remove('high-contrast');
    }

    // Dyslexia friendly
    if (settings.dyslexiaFriendly) {
      body.classList.add('dyslexia-friendly');
    } else {
      body.classList.remove('dyslexia-friendly');
    }

    // Font size
    document.documentElement.style.fontSize = {
      small: '14px',
      medium: '16px',
      large: '20px',
      xl: '24px'
    }[settings.fontSize];

  }, [settings]);

  // Auto-configure based on profile
  useEffect(() => {
    switch (profile) {
      case 'visual':
        updateSettings({
          highContrast: true,
          fontSize: 'large',
          voiceNavigation: true,
          dyslexiaFriendly: false,
        });
        break;
      case 'hearing':
        updateSettings({
          captions: true,
          highContrast: false,
          voiceNavigation: false,
        });
        break;
      case 'cognitive':
        updateSettings({
          dyslexiaFriendly: true,
          focusMode: true,
          fontSize: 'large',
          readingSpeed: 'slow',
        });
        break;
    }
  }, [profile]);

  return (
    <AccessibilityContext.Provider value={{
      profile,
      role,
      settings,
      setProfile,
      setRole,
      updateSettings,
      speak,
      isListening,
      startListening,
      stopListening,
    }}>
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (context === undefined) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
}