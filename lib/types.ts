export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'teacher';
  accessibilityProfile: 'visual' | 'hearing' | 'cognitive' | 'none';
  settings: AccessibilitySettings;
}

export interface AccessibilitySettings {
  highContrast: boolean;
  dyslexiaFriendly: boolean;
  fontSize: 'small' | 'medium' | 'large' | 'xl';
  voiceNavigation: boolean;
  captions: boolean;
  focusMode: boolean;
  readingSpeed: 'slow' | 'medium' | 'fast';
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  type: 'pdf' | 'video' | 'youtube' | 'doc' | 'text';
  content: {
    original: string;
    simplified: string;
    transcript: string;
  };
  accessibility: {
    captions: boolean;
    transcript: boolean;
    simplified: boolean;
    audio: boolean;
    signLanguage: boolean;
  };
  metadata: {
    duration: number;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    subject: string;
    grade: string;
    uploadDate: string;
    lastModified: string;
  };
  progress?: {
    userId: string;
    completed: boolean;
    timeSpent: number;
    lastAccessed: string;
    bookmarks: number[];
  };
}

export interface Chapter {
  id: string;
  title: string;
  startTime: number;
  endTime: number;
  content: string;
  simplified: string;
}

export interface Analytics {
  userId: string;
  lessonId: string;
  accessibilityFeaturesUsed: string[];
  timeSpent: number;
  completionRate: number;
  interactionEvents: InteractionEvent[];
}

export interface InteractionEvent {
  timestamp: string;
  type: 'play' | 'pause' | 'seek' | 'speed_change' | 'view_change' | 'tts_used' | 'caption_toggle';
  data: any;
}