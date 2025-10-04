'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface VoiceAccessibilityContextType {
  isListening: boolean;
  isSpeaking: boolean;
  startListening: () => void;
  stopListening: () => void;
  speak: (text: string, priority?: 'low' | 'medium' | 'high') => void;
  stopSpeaking: () => void;
  announceNavigation: (location: string) => void;
  announceAction: (action: string) => void;
  describeElement: (element: string, description: string) => void;
  readContent: (content: string) => void;
  voiceCommands: { [key: string]: () => void };
  registerVoiceCommand: (command: string, callback: () => void) => void;
}

const VoiceAccessibilityContext = createContext<VoiceAccessibilityContextType | undefined>(undefined);

export function VoiceAccessibilityProvider({ children }: { children: ReactNode }) {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
  const [synthesis, setSynthesis] = useState<SpeechSynthesis | null>(null);
  const [voiceCommands, setVoiceCommands] = useState<{ [key: string]: () => void }>({});
  const [speechQueue, setSpeechQueue] = useState<Array<{ text: string; priority: 'low' | 'medium' | 'high' }>>([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Initialize Speech Recognition
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognitionInstance = new SpeechRecognition();
        recognitionInstance.continuous = true;
        recognitionInstance.interimResults = false;
        recognitionInstance.lang = 'en-US';
        
        recognitionInstance.onresult = (event) => {
          const command = event.results[event.results.length - 1][0].transcript.toLowerCase().trim();
          handleVoiceCommand(command);
        };
        
        recognitionInstance.onerror = () => setIsListening(false);
        recognitionInstance.onend = () => setIsListening(false);
        
        setRecognition(recognitionInstance);
      }

      // Initialize Speech Synthesis
      if (window.speechSynthesis) {
        setSynthesis(window.speechSynthesis);
      }

      // Register default voice commands
      registerDefaultCommands();
    }
  }, []);

  const registerDefaultCommands = () => {
    const defaultCommands = {
      'go home': () => window.location.href = '/',
      'go to dashboard': () => window.location.href = '/dashboard',
      'read page': () => readPageContent(),
      'stop reading': () => stopSpeaking(),
      'help': () => announceHelp(),
      'what is this': () => describeCurrentPage(),
      'navigate': () => announceNavigationOptions(),
      'sign out': () => handleSignOut(),
      'my profile': () => window.location.href = '/profile',
      'settings': () => announceSettings(),
    };
    
    setVoiceCommands(defaultCommands);
  };

  const handleVoiceCommand = (command: string) => {
    // Find matching command
    const matchedCommand = Object.keys(voiceCommands).find(cmd => 
      command.includes(cmd) || cmd.includes(command)
    );
    
    if (matchedCommand && voiceCommands[matchedCommand]) {
      announceAction(`Executing ${matchedCommand}`);
      voiceCommands[matchedCommand]();
    } else {
      speak("Command not recognized. Say 'help' for available commands.");
    }
  };

  const startListening = () => {
    if (recognition && !isListening) {
      setIsListening(true);
      recognition.start();
      speak("Voice commands activated. I'm listening.");
    }
  };

  const stopListening = () => {
    if (recognition && isListening) {
      setIsListening(false);
      recognition.stop();
      speak("Voice commands deactivated.");
    }
  };

  const speak = (text: string, priority: 'low' | 'medium' | 'high' = 'medium') => {
    if (!synthesis) return;

    // Handle priority queue
    if (priority === 'high') {
      synthesis.cancel();
      setSpeechQueue([]);
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 1;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => {
      setIsSpeaking(false);
      processNextInQueue();
    };

    if (priority === 'high' || !isSpeaking) {
      synthesis.speak(utterance);
    } else {
      setSpeechQueue(prev => [...prev, { text, priority }]);
    }
  };

  const processNextInQueue = () => {
    setSpeechQueue(prev => {
      if (prev.length > 0) {
        const next = prev[0];
        const remaining = prev.slice(1);
        speak(next.text, next.priority);
        return remaining;
      }
      return prev;
    });
  };

  const stopSpeaking = () => {
    if (synthesis) {
      synthesis.cancel();
      setSpeechQueue([]);
      setIsSpeaking(false);
    }
  };

  const announceNavigation = (location: string) => {
    speak(`Navigated to ${location}`, 'high');
  };

  const announceAction = (action: string) => {
    speak(action, 'medium');
  };

  const describeElement = (element: string, description: string) => {
    speak(`${element}: ${description}`, 'low');
  };

  const readContent = (content: string) => {
    speak(content, 'low');
  };

  const registerVoiceCommand = (command: string, callback: () => void) => {
    setVoiceCommands(prev => ({ ...prev, [command]: callback }));
  };

  // Helper functions
  const readPageContent = () => {
    const mainContent = document.querySelector('main')?.textContent || 
                      document.querySelector('[role="main"]')?.textContent ||
                      document.body.textContent;
    if (mainContent) {
      speak(`Reading page content: ${mainContent.slice(0, 500)}...`);
    }
  };

  const announceHelp = () => {
    const commands = Object.keys(voiceCommands).join(', ');
    speak(`Available voice commands: ${commands}. You can also say 'read page' to hear the content, or 'stop reading' to stop.`);
  };

  const describeCurrentPage = () => {
    const title = document.title;
    const heading = document.querySelector('h1')?.textContent;
    speak(`You are on ${title}. ${heading ? `Main heading: ${heading}` : ''}`);
  };

  const announceNavigationOptions = () => {
    const links = Array.from(document.querySelectorAll('a, button')).slice(0, 5);
    const options = links.map(link => link.textContent?.trim()).filter(Boolean).join(', ');
    speak(`Navigation options: ${options}`);
  };

  const handleSignOut = () => {
    speak("Signing out...");
    // Add sign out logic here
  };

  const announceSettings = () => {
    speak("Opening accessibility settings. You can adjust voice speed, contrast, font size, and other preferences.");
  };

  return (
    <VoiceAccessibilityContext.Provider value={{
      isListening,
      isSpeaking,
      startListening,
      stopListening,
      speak,
      stopSpeaking,
      announceNavigation,
      announceAction,
      describeElement,
      readContent,
      voiceCommands,
      registerVoiceCommand,
    }}>
      {children}
    </VoiceAccessibilityContext.Provider>
  );
}

export function useVoiceAccessibility() {
  const context = useContext(VoiceAccessibilityContext);
  if (context === undefined) {
    throw new Error('useVoiceAccessibility must be used within a VoiceAccessibilityProvider');
  }
  return context;
}

// Voice-enabled components
export function VoiceButton({ 
  children, 
  onClick, 
  description, 
  ...props 
}: { 
  children: ReactNode; 
  onClick?: () => void; 
  description?: string;
  [key: string]: any;
}) {
  const { speak, announceAction } = useVoiceAccessibility();

  const handleClick = () => {
    if (description) announceAction(description);
    onClick?.();
  };

  const handleFocus = () => {
    if (description) speak(description, 'low');
  };

  return (
    <button 
      {...props}
      onClick={handleClick}
      onFocus={handleFocus}
      aria-label={description}
    >
      {children}
    </button>
  );
}

export function VoiceLink({ 
  children, 
  href, 
  description, 
  ...props 
}: { 
  children: ReactNode; 
  href: string; 
  description?: string;
  [key: string]: any;
}) {
  const { speak, announceNavigation } = useVoiceAccessibility();

  const handleClick = () => {
    if (description) announceNavigation(description);
  };

  const handleFocus = () => {
    if (description) speak(`Link: ${description}`, 'low');
  };

  return (
    <a 
      {...props}
      href={href}
      onClick={handleClick}
      onFocus={handleFocus}
      aria-label={description}
    >
      {children}
    </a>
  );
}