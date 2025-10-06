'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  BarChart3, 
  Bell, 
  Target,
  Play,
  Clock,
  CheckCircle,
  Trophy,
  Flame,
  Star,
  Eye,
  Ear,
  Brain,
  Users,
  ArrowRight,
  TrendingUp,
  Calendar,
  Zap
} from 'lucide-react';
import { useAccessibility } from '@/lib/accessibility-context';
import { useVoiceAccessibility } from '@/lib/voice-accessibility';
import { VoiceEnabledContent, VoiceEnabledButton, VoiceEnabledText } from '@/components/accessibility/VoiceEnabledContent';
import { Button } from '@/components/ui/Button';

interface StudentData {
  currentLesson: {
    id: string;
    title: string;
    type: 'video' | 'pdf' | 'text';
    progress: number;
    timeSpent: number;
    thumbnail: string;
  };
  analytics: {
    overallProgress: number;
    lessonsCompleted: number;
    totalLessons: number;
    timeSpent: number;
    accessibilityUsage: {
      tts: number;
      captions: number;
      simplified: number;
      focusMode: number;
    };
  };
  notifications: {
    alerts: string[];
    streak: number;
    achievements: string[];
    motivational: string;
  };
  activities: {
    completed: number;
    remaining: number;
    tasks: Array<{
      id: string;
      title: string;
      type: 'quiz' | 'experiment' | 'exercise';
      difficulty: 'easy' | 'medium' | 'hard';
      completed: boolean;
      priority: 'high' | 'medium' | 'low';
    }>;
  };
}

export default function StudentDashboard() {
  const params = useParams();
  const { speak, settings } = useAccessibility();
  const { announceAction, announceNavigation, registerVoiceCommand, readContent } = useVoiceAccessibility();
  const studentType = params.type as string;
  
  const [activeTab, setActiveTab] = useState('lessons');
  
  useEffect(() => {
    // Register voice commands for student dashboard navigation
    registerVoiceCommand('lessons', () => {
      setActiveTab('lessons');
      announceNavigation('Lessons section');
    });
    registerVoiceCommand('progress', () => {
      setActiveTab('progress');
      announceNavigation('Progress analytics section');
    });
    registerVoiceCommand('notifications', () => {
      setActiveTab('notifications');
      announceNavigation('Updates and notifications section');
    });
    registerVoiceCommand('activities', () => {
      setActiveTab('activities');
      announceNavigation('Practice activities section');
    });
    registerVoiceCommand('practice', () => {
      setActiveTab('activities');
      announceNavigation('Practice activities section');
    });
    
    // Welcome message for visually impaired users
    if (studentType === 'visual') {
      setTimeout(() => {
        readContent('Welcome to your visual support dashboard. You can navigate using voice commands: say "lessons", "progress", "notifications", or "activities" to switch sections. All content includes audio narration and screen reader support.');
      }, 1000);
    }
  }, [studentType]);
  
  // Mock student data
  const studentData: StudentData = {
    currentLesson: {
      id: '1',
      title: 'Introduction to Solar System',
      type: 'video',
      progress: 65,
      timeSpent: 18,
      thumbnail: '/lesson-thumb.jpg'
    },
    analytics: {
      overallProgress: 78,
      lessonsCompleted: 12,
      totalLessons: 15,
      timeSpent: 240,
      accessibilityUsage: {
        tts: studentType === 'visual' ? 95 : 20,
        captions: studentType === 'hearing' ? 100 : 30,
        simplified: studentType === 'cognitive' ? 85 : 15,
        focusMode: studentType === 'cognitive' ? 70 : 10
      }
    },
    notifications: {
      alerts: ['New lesson available: Photosynthesis', 'Assignment due tomorrow'],
      streak: 7,
      achievements: ['Week Warrior', 'Focus Master', 'Quick Learner'],
      motivational: 'You\'re doing amazing! Keep up the great work! 🌟'
    },
    activities: {
      completed: 8,
      remaining: 4,
      tasks: [
        { id: '1', title: 'Solar System Quiz', type: 'quiz', difficulty: 'easy', completed: true, priority: 'high' },
        { id: '2', title: 'Planet Experiment', type: 'experiment', difficulty: 'medium', completed: false, priority: 'high' },
        { id: '3', title: 'Math Practice', type: 'exercise', difficulty: 'hard', completed: false, priority: 'medium' },
        { id: '4', title: 'Reading Comprehension', type: 'exercise', difficulty: 'easy', completed: true, priority: 'low' }
      ]
    }
  };

  const getProfileConfig = () => {
    switch (studentType) {
      case 'visual':
        return {
          title: 'Visual Support Dashboard',
          icon: Eye,
          color: 'from-blue-500 to-blue-600',
          bgColor: 'bg-blue-50',
          features: ['🎧 Audio Narration', '🔊 Text-to-Speech', '⚫ High Contrast', '🔍 Large Text']
        };
      case 'hearing':
        return {
          title: 'Hearing Support Dashboard',
          icon: Ear,
          color: 'from-green-500 to-green-600',
          bgColor: 'bg-green-50',
          features: ['📝 Auto Captions', '📄 Transcripts', '👋 Sign Language', '💬 Visual Alerts']
        };
      case 'cognitive':
        return {
          title: 'Cognitive Support Dashboard',
          icon: Brain,
          color: 'from-purple-500 to-purple-600',
          bgColor: 'bg-purple-50',
          features: ['✍️ Simple Text', '🎯 Focus Mode', '📖 Dyslexia Font', '🐌 Slow Reading']
        };
      default:
        return {
          title: 'Standard Learning Dashboard',
          icon: Users,
          color: 'from-gray-500 to-gray-600',
          bgColor: 'bg-gray-50',
          features: ['📱 Standard UI', '⚙️ Custom Settings', '🔧 Optional Tools', '🚀 Full Features']
        };
    }
  };

  const config = getProfileConfig();

  const tabs = [
    { id: 'lessons', label: 'Lessons', icon: BookOpen },
    { id: 'progress', label: 'Progress', icon: BarChart3 },
    { id: 'notifications', label: 'Updates', icon: Bell },
    { id: 'activities', label: 'Practice', icon: Target }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-16">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className={`bg-gradient-to-r ${config.color} rounded-full p-3`}>
              <config.icon size={32} className="text-white" />
            </div>
            <h1 className={`text-4xl font-bold bg-gradient-to-r ${config.color} bg-clip-text text-transparent`}>
              {config.title}
            </h1>
          </div>
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            {config.features.map((feature, index) => (
              <span key={index} className="px-3 py-1 bg-white rounded-full text-sm text-gray-600 shadow-sm">
                {feature}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Navigation Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex justify-center mb-8"
        >
          <div className="bg-white rounded-xl shadow-lg p-2 flex gap-2">
            {tabs.map((tab) => (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? 'primary' : 'secondary'}
                onClick={() => {
                  setActiveTab(tab.id);
                  speak(`${tab.label} section selected`);
                  announceNavigation(`${tab.label} section for ${config.title}`);
                }}
                className="flex items-center gap-2"
              >
                <tab.icon size={16} />
                {tab.label}
              </Button>
            ))}
          </div>
        </motion.div>

        {/* Content Sections */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'lessons' && <LessonsSection data={studentData} config={config} />}
          {activeTab === 'progress' && <ProgressSection data={studentData} config={config} />}
          {activeTab === 'notifications' && <NotificationsSection data={studentData} config={config} />}
          {activeTab === 'activities' && <ActivitiesSection data={studentData} config={config} />}
        </motion.div>
      </div>
    </div>
  );
}

// Lessons Overview Section
function LessonsSection({ data, config }: { data: StudentData; config: any }) {
  const { speak } = useAccessibility();
  const { announceAction, readContent } = useVoiceAccessibility();
  
  useEffect(() => {
    if (config.title.includes('Visual')) {
      readContent(`Lessons section loaded. Current lesson: ${data.currentLesson.title} at ${data.currentLesson.progress}% progress. You have ${data.currentLesson.timeSpent} minutes of watch time. All lessons include audio narration and screen reader support.`);
    }
  }, []);
  
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Hero Section */}
      <div className="bg-white rounded-2xl shadow-xl p-8 border">
        <div className="flex items-center gap-4 mb-6">
          <div className={`bg-gradient-to-r ${config.color} rounded-lg p-3`}>
            <Play size={24} className="text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Current Lesson</h2>
            <p className="text-gray-600">Continue where you left off</p>
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl h-32 flex items-center justify-center mb-4">
              <Play size={32} className="text-gray-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">{data.currentLesson.title}</h3>
            <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
              <span className="flex items-center gap-1">
                <Clock size={14} />
                {data.currentLesson.timeSpent} min
              </span>
              <span className="capitalize">{data.currentLesson.type}</span>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Progress</span>
                <span>{data.currentLesson.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className={`bg-gradient-to-r ${config.color} h-3 rounded-full transition-all duration-500`}
                  style={{ width: `${data.currentLesson.progress}%` }}
                />
              </div>
            </div>
            
            <div className={`${config.bgColor} rounded-lg p-4 text-center`}>
              <div className="text-2xl font-bold mb-1">Keep going! 🚀</div>
              <div className="text-sm text-gray-600">You're {100 - data.currentLesson.progress}% away from completion</div>
            </div>
            
            <Button
              variant="primary"
              size="lg"
              className="w-full"
              onClick={() => {
                speak('Continuing lesson');
                announceAction(`Starting ${data.currentLesson.title} lesson`);
              }}
            >
              <Play size={20} className="mr-2" />
              Continue Learning
            </Button>
          </div>
        </div>
      </div>

      {/* Recent Lessons */}
      <div className="grid md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-xl shadow-lg p-4 border">
            <div className="bg-gray-100 rounded-lg h-20 mb-3 flex items-center justify-center">
              <BookOpen size={20} className="text-gray-500" />
            </div>
            <h4 className="font-semibold text-gray-800 mb-2">Lesson {i + 1}</h4>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">Completed</span>
              <CheckCircle size={16} className="text-green-500" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Progress & Analytics Section
function ProgressSection({ data, config }: { data: StudentData; config: any }) {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Hero Section */}
      <div className="bg-white rounded-2xl shadow-xl p-8 border">
        <div className="flex items-center gap-4 mb-6">
          <div className={`bg-gradient-to-r ${config.color} rounded-lg p-3`}>
            <TrendingUp size={24} className="text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Your Progress</h2>
            <p className="text-gray-600">Track your learning journey</p>
          </div>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          {/* Overall Progress */}
          <div className="text-center">
            <div className="relative w-24 h-24 mx-auto mb-4">
              <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" stroke="#e5e7eb" strokeWidth="8" fill="none" />
                <circle 
                  cx="50" 
                  cy="50" 
                  r="40" 
                  stroke="url(#gradient)" 
                  strokeWidth="8" 
                  fill="none"
                  strokeDasharray={`${data.analytics.overallProgress * 2.51} 251`}
                  className="transition-all duration-500"
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#8b5cf6" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xl font-bold text-gray-800">{data.analytics.overallProgress}%</span>
              </div>
            </div>
            <h3 className="font-semibold text-gray-800">Overall Progress</h3>
          </div>
          
          {/* Lessons Stats */}
          <div className={`${config.bgColor} rounded-lg p-4 text-center`}>
            <div className="text-3xl font-bold text-gray-800 mb-1">{data.analytics.lessonsCompleted}</div>
            <div className="text-sm text-gray-600">Lessons Completed</div>
            <div className="text-xs text-gray-500 mt-1">out of {data.analytics.totalLessons}</div>
          </div>
          
          {/* Time Stats */}
          <div className={`${config.bgColor} rounded-lg p-4 text-center`}>
            <div className="text-3xl font-bold text-gray-800 mb-1">{Math.floor(data.analytics.timeSpent / 60)}h</div>
            <div className="text-sm text-gray-600">Time Spent</div>
            <div className="text-xs text-gray-500 mt-1">{data.analytics.timeSpent % 60}m this week</div>
          </div>
        </div>
      </div>

      {/* Accessibility Usage */}
      <div className="bg-white rounded-xl shadow-lg p-6 border">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Zap size={20} />
          Accessibility Features Usage
        </h3>
        <div className="space-y-3">
          {Object.entries(data.analytics.accessibilityUsage).map(([feature, usage]) => (
            <div key={feature} className="flex items-center justify-between">
              <span className="capitalize text-gray-700">{feature.replace(/([A-Z])/g, ' $1')}</span>
              <div className="flex items-center gap-3">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div
                    className={`bg-gradient-to-r ${config.color} h-2 rounded-full transition-all duration-500`}
                    style={{ width: `${usage}%` }}
                  />
                </div>
                <span className="text-sm font-medium text-gray-600 w-10">{usage}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Notifications & Motivation Section
function NotificationsSection({ data, config }: { data: StudentData; config: any }) {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Hero Section */}
      <div className="bg-white rounded-2xl shadow-xl p-8 border">
        <div className="flex items-center gap-4 mb-6">
          <div className={`bg-gradient-to-r ${config.color} rounded-lg p-3`}>
            <Bell size={24} className="text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Updates & Motivation</h2>
            <p className="text-gray-600">Stay motivated and informed</p>
          </div>
        </div>
        
        {/* Motivational Banner */}
        <div className={`bg-gradient-to-r ${config.color} rounded-xl p-6 text-white mb-6`}>
          <div className="flex items-center gap-3 mb-2">
            <Star size={24} />
            <h3 className="text-xl font-bold">Daily Motivation</h3>
          </div>
          <p className="text-lg">{data.notifications.motivational}</p>
        </div>
        
        {/* Streak Tracker */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className={`${config.bgColor} rounded-lg p-6 text-center`}>
            <div className="flex items-center justify-center gap-2 mb-2">
              <Flame size={24} className="text-orange-500" />
              <span className="text-2xl font-bold text-gray-800">{data.notifications.streak}</span>
            </div>
            <h4 className="font-semibold text-gray-800">Day Streak</h4>
            <p className="text-sm text-gray-600">Keep it up!</p>
          </div>
          
          <div className={`${config.bgColor} rounded-lg p-6 text-center`}>
            <div className="flex items-center justify-center gap-2 mb-2">
              <Trophy size={24} className="text-yellow-500" />
              <span className="text-2xl font-bold text-gray-800">{data.notifications.achievements.length}</span>
            </div>
            <h4 className="font-semibold text-gray-800">Achievements</h4>
            <p className="text-sm text-gray-600">Badges earned</p>
          </div>
        </div>
      </div>

      {/* Alerts & Achievements */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6 border">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Recent Alerts</h3>
          <div className="space-y-3">
            {data.notifications.alerts.map((alert, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                <Bell size={16} className="text-blue-500" />
                <span className="text-sm text-gray-700">{alert}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-6 border">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Latest Achievements</h3>
          <div className="space-y-3">
            {data.notifications.achievements.map((achievement, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
                <Trophy size={16} className="text-yellow-500" />
                <span className="text-sm text-gray-700">{achievement}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Practice & Interactive Activities Section
function ActivitiesSection({ data, config }: { data: StudentData; config: any }) {
  const { speak } = useAccessibility();
  const { announceAction, readContent } = useVoiceAccessibility();
  
  useEffect(() => {
    if (config.title.includes('Visual')) {
      readContent(`Activities section loaded. You have ${data.activities.completed} completed activities and ${data.activities.remaining} remaining activities. All activities are voice-enabled with audio instructions.`);
    }
  }, []);
  
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Hero Section */}
      <div className="bg-white rounded-2xl shadow-xl p-8 border">
        <div className="flex items-center gap-4 mb-6">
          <div className={`bg-gradient-to-r ${config.color} rounded-lg p-3`}>
            <Target size={24} className="text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Practice Activities</h2>
            <p className="text-gray-600">Interactive exercises and experiments</p>
          </div>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div className={`${config.bgColor} rounded-lg p-6 text-center`}>
            <div className="text-3xl font-bold text-gray-800 mb-1">{data.activities.completed}</div>
            <div className="text-sm text-gray-600">Completed</div>
            <CheckCircle size={20} className="text-green-500 mx-auto mt-2" />
          </div>
          
          <div className={`${config.bgColor} rounded-lg p-6 text-center`}>
            <div className="text-3xl font-bold text-gray-800 mb-1">{data.activities.remaining}</div>
            <div className="text-sm text-gray-600">Remaining</div>
            <Clock size={20} className="text-orange-500 mx-auto mt-2" />
          </div>
          
          <div className={`${config.bgColor} rounded-lg p-6 text-center`}>
            <div className="text-3xl font-bold text-gray-800 mb-1">
              {Math.round((data.activities.completed / (data.activities.completed + data.activities.remaining)) * 100)}%
            </div>
            <div className="text-sm text-gray-600">Progress</div>
            <TrendingUp size={20} className="text-blue-500 mx-auto mt-2" />
          </div>
        </div>
      </div>

      {/* Task Cards */}
      <div className="grid md:grid-cols-2 gap-4">
        {data.activities.tasks.map((task) => (
          <div key={task.id} className="bg-white rounded-xl shadow-lg p-6 border">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold text-gray-800">{task.title}</h4>
              <div className="flex items-center gap-2">
                {task.completed ? (
                  <CheckCircle size={20} className="text-green-500" />
                ) : (
                  <div className="w-5 h-5 border-2 border-gray-300 rounded"></div>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-4 mb-4">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                task.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                task.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {task.difficulty}
              </span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                task.priority === 'high' ? 'bg-red-100 text-red-800' :
                task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {task.priority} priority
              </span>
              <span className="capitalize text-xs text-gray-500">{task.type}</span>
            </div>
            
            {!task.completed && (
              <Button
                variant="primary"
                size="sm"
                className="w-full"
                onClick={() => {
                  speak(`Starting ${task.title}`);
                  announceAction(`Beginning ${task.type} activity: ${task.title}`);
                }}
              >
                <Play size={16} className="mr-2" />
                Start Activity
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}