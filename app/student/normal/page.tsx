'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BookOpen, Play, FileText, Download, Star, Trophy, MessageCircle, Search, Filter, 
  BarChart3, Target, Clock, CheckCircle, Bookmark, Settings, Bell, User, Zap, 
  Brain, TrendingUp, Award, Calendar, Video, Youtube, Upload, Eye, ThumbsUp, 
  Share, Lightbulb, ChevronRight, Flame, Users, PenTool, Highlighter
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

interface LearningResource {
  id: string;
  title: string;
  type: 'video' | 'pdf' | 'document' | 'youtube' | 'quiz';
  subject: string;
  teacher: string;
  duration: string;
  progress: number;
  difficulty: 'easy' | 'medium' | 'hard';
  rating: number;
  views: number;
  uploadDate: string;
  description: string;
  tags: string[];
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  earned: boolean;
  progress: number;
  maxProgress: number;
}

interface AIMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function NormalStudentDashboard() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [darkMode, setDarkMode] = useState(false);
  const [aiChatOpen, setAiChatOpen] = useState(false);
  const [aiMessages, setAiMessages] = useState<AIMessage[]>([]);
  const [aiInput, setAiInput] = useState('');
  const [selectedResource, setSelectedResource] = useState<LearningResource | null>(null);
  const [bookmarks, setBookmarks] = useState<string[]>([]);

  const learningResources: LearningResource[] = [
    {
      id: '1',
      title: 'Advanced Mathematics: Calculus Fundamentals',
      type: 'video',
      subject: 'Mathematics',
      teacher: 'Dr. Sarah Johnson',
      duration: '45:30',
      progress: 75,
      difficulty: 'hard',
      rating: 4.8,
      views: 1250,
      uploadDate: '2024-01-15',
      description: 'Comprehensive introduction to differential and integral calculus with real-world applications.',
      tags: ['calculus', 'derivatives', 'integrals', 'mathematics']
    },
    {
      id: '2',
      title: 'Physics: Quantum Mechanics Basics',
      type: 'pdf',
      subject: 'Physics',
      teacher: 'Prof. Michael Chen',
      duration: '2h read',
      progress: 45,
      difficulty: 'hard',
      rating: 4.6,
      views: 890,
      uploadDate: '2024-01-12',
      description: 'Introduction to quantum mechanics principles, wave functions, and uncertainty principle.',
      tags: ['quantum', 'physics', 'mechanics', 'waves']
    },
    {
      id: '3',
      title: 'Chemistry Lab: Organic Reactions',
      type: 'youtube',
      subject: 'Chemistry',
      teacher: 'Dr. Emily Rodriguez',
      duration: '32:15',
      progress: 100,
      difficulty: 'medium',
      rating: 4.9,
      views: 2100,
      uploadDate: '2024-01-10',
      description: 'Hands-on demonstration of common organic chemistry reactions and mechanisms.',
      tags: ['organic', 'chemistry', 'reactions', 'lab']
    },
    {
      id: '4',
      title: 'Biology Quiz: Cell Structure',
      type: 'quiz',
      subject: 'Biology',
      teacher: 'Ms. Lisa Park',
      duration: '15 min',
      progress: 0,
      difficulty: 'easy',
      rating: 4.3,
      views: 567,
      uploadDate: '2024-01-08',
      description: 'Interactive quiz covering cell organelles, functions, and cellular processes.',
      tags: ['biology', 'cells', 'organelles', 'quiz']
    }
  ];

  const achievements: Achievement[] = [
    {
      id: '1',
      title: 'Quick Learner',
      description: 'Complete 5 lessons in one day',
      icon: '⚡',
      earned: true,
      progress: 5,
      maxProgress: 5
    },
    {
      id: '2',
      title: 'Math Master',
      description: 'Score 90% or higher on 3 math quizzes',
      icon: '🧮',
      earned: false,
      progress: 2,
      maxProgress: 3
    },
    {
      id: '3',
      title: 'Streak Champion',
      description: 'Study for 7 consecutive days',
      icon: '🔥',
      earned: true,
      progress: 7,
      maxProgress: 7
    }
  ];

  const studentStats = {
    totalLessons: 24,
    completedLessons: 18,
    averageScore: 87,
    studyStreak: 12,
    totalStudyTime: 156,
    level: 8,
    xp: 2450,
    nextLevelXp: 3000
  };

  const handleAIChat = async () => {
    if (!aiInput.trim()) return;

    const userMessage: AIMessage = {
      role: 'user',
      content: aiInput,
      timestamp: new Date()
    };

    setAiMessages(prev => [...prev, userMessage]);
    setAiInput('');

    // Simulate Google Cloud AI integration
    setTimeout(() => {
      const aiResponse: AIMessage = {
        role: 'assistant',
        content: `I understand you're asking about "${aiInput}". Let me help you with that. Based on your current studies, here's what I can explain...`,
        timestamp: new Date()
      };
      setAiMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  const toggleBookmark = (resourceId: string) => {
    setBookmarks(prev => 
      prev.includes(resourceId) 
        ? prev.filter(id => id !== resourceId)
        : [...prev, resourceId]
    );
  };

  const filteredResources = learningResources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.subject.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (selectedFilter === 'all') return matchesSearch;
    return matchesSearch && resource.type === selectedFilter;
  });

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gradient-to-br from-blue-50 via-white to-purple-50'}`}>
      
      {/* Header */}
      <header className={`sticky top-0 z-50 backdrop-blur-md border-b transition-colors duration-300 ${darkMode ? 'bg-gray-800/80 border-gray-700' : 'bg-white/80 border-gray-200'}`}>
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">L+</span>
              </div>
              <div>
                <h1 className="text-xl font-bold">Student Dashboard</h1>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Welcome back, Alex!</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <Button variant="secondary" size="sm" onClick={() => setDarkMode(!darkMode)}>
                {darkMode ? '☀️' : '🌙'}
              </Button>
              <Button variant="secondary" size="sm" onClick={() => setAiChatOpen(!aiChatOpen)}>
                <Brain size={16} className="mr-1" />
                AI Assistant
              </Button>
              <div className="relative">
                <Bell size={20} className={darkMode ? 'text-gray-400' : 'text-gray-600'} />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
              </div>
              <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                <User size={16} className="text-white" />
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            
            {/* Quick Stats */}
            <div className="grid md:grid-cols-4 gap-4">
              {[
                { label: 'Lessons Completed', value: `${studentStats.completedLessons}/${studentStats.totalLessons}`, icon: CheckCircle, color: 'text-green-500' },
                { label: 'Average Score', value: `${studentStats.averageScore}%`, icon: Trophy, color: 'text-yellow-500' },
                { label: 'Study Streak', value: `${studentStats.studyStreak} days`, icon: Flame, color: 'text-orange-500' },
                { label: 'Study Time', value: `${studentStats.totalStudyTime}h`, icon: Clock, color: 'text-blue-500' }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className={`p-4 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
                    <div className="flex items-center gap-3">
                      <stat.icon size={24} className={stat.color} />
                      <div>
                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{stat.label}</p>
                        <p className="text-xl font-bold">{stat.value}</p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Search and Filters */}
            <Card className={`p-6 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search size={20} className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                  <input
                    type="text"
                    placeholder="Search lessons, subjects, or teachers..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                  />
                </div>
                <div className="flex gap-2">
                  {['all', 'video', 'pdf', 'quiz', 'youtube'].map((filter) => (
                    <Button
                      key={filter}
                      variant={selectedFilter === filter ? 'primary' : 'secondary'}
                      onClick={() => setSelectedFilter(filter)}
                      className="capitalize"
                    >
                      <Filter size={16} className="mr-1" />
                      {filter}
                    </Button>
                  ))}
                </div>
              </div>
            </Card>

            {/* Learning Resources */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Your Learning Materials</h2>
                <Button variant="primary">
                  <Upload size={16} className="mr-2" />
                  Request Content
                </Button>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {filteredResources.map((resource, index) => (
                  <motion.div
                    key={resource.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className={`p-6 hover:shadow-lg transition-all cursor-pointer ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${
                            resource.type === 'video' ? 'bg-red-100 text-red-600' :
                            resource.type === 'pdf' ? 'bg-blue-100 text-blue-600' :
                            resource.type === 'youtube' ? 'bg-red-100 text-red-600' :
                            'bg-green-100 text-green-600'
                          }`}>
                            {resource.type === 'video' && <Play size={20} />}
                            {resource.type === 'pdf' && <FileText size={20} />}
                            {resource.type === 'youtube' && <Youtube size={20} />}
                            {resource.type === 'quiz' && <Target size={20} />}
                          </div>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            resource.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                            resource.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {resource.difficulty}
                          </span>
                        </div>
                        <Button variant="secondary" size="sm" onClick={() => toggleBookmark(resource.id)}>
                          <Bookmark size={16} className={bookmarks.includes(resource.id) ? 'fill-current text-yellow-500' : ''} />
                        </Button>
                      </div>

                      <h3 className="text-lg font-semibold mb-2">{resource.title}</h3>
                      <p className={`text-sm mb-3 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{resource.description}</p>
                      
                      <div className="flex items-center gap-4 text-sm mb-4">
                        <span>By {resource.teacher}</span>
                        <span className="flex items-center gap-1">
                          <Clock size={14} />
                          {resource.duration}
                        </span>
                        <span className="flex items-center gap-1">
                          <Star size={14} className="text-yellow-500" />
                          {resource.rating}
                        </span>
                      </div>

                      <div className="mb-4">
                        <div className="flex justify-between text-sm mb-1">
                          <span>Progress</span>
                          <span>{resource.progress}%</span>
                        </div>
                        <div className={`w-full bg-gray-200 rounded-full h-2 ${darkMode ? 'bg-gray-700' : ''}`}>
                          <div
                            className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full"
                            style={{ width: `${resource.progress}%` }}
                          />
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button variant="primary" className="flex-1" onClick={() => setSelectedResource(resource)}>
                          <Play size={16} className="mr-2" />
                          {resource.progress > 0 ? 'Continue' : 'Start'}
                        </Button>
                        <Button variant="secondary">
                          <Download size={16} />
                        </Button>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Performance Dashboard */}
            <Card className={`p-6 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <BarChart3 size={24} />
                Performance Analytics
              </h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold">Weekly Progress</h4>
                  <div className="space-y-2">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
                      <div key={day} className="flex items-center gap-3">
                        <span className="w-8 text-sm">{day}</span>
                        <div className={`flex-1 h-2 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                          <div
                            className="h-2 bg-gradient-to-r from-green-400 to-blue-500 rounded-full"
                            style={{ width: `${Math.random() * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold">Level Progress</h4>
                  <div className="text-center">
                    <div className="relative w-24 h-24 mx-auto mb-4">
                      <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="40" stroke={darkMode ? '#374151' : '#e5e7eb'} strokeWidth="8" fill="none" />
                        <circle 
                          cx="50" 
                          cy="50" 
                          r="40" 
                          stroke="url(#gradient)" 
                          strokeWidth="8" 
                          fill="none"
                          strokeDasharray={`${(studentStats.xp / studentStats.nextLevelXp) * 251} 251`}
                        />
                        <defs>
                          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#3b82f6" />
                            <stop offset="100%" stopColor="#8b5cf6" />
                          </linearGradient>
                        </defs>
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-xl font-bold">{studentStats.level}</span>
                      </div>
                    </div>
                    <p className="text-sm">Level {studentStats.level}</p>
                    <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {studentStats.xp}/{studentStats.nextLevelXp} XP
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            
            {/* Achievements */}
            <Card className={`p-6 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Award size={20} />
                Achievements
              </h3>
              <div className="space-y-3">
                {achievements.map((achievement) => (
                  <div key={achievement.id} className={`p-3 rounded-lg border ${achievement.earned ? 'bg-yellow-50 border-yellow-200' : darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{achievement.icon}</span>
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm">{achievement.title}</h4>
                        <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{achievement.description}</p>
                        <div className={`w-full bg-gray-200 rounded-full h-1 mt-2 ${darkMode ? 'bg-gray-600' : ''}`}>
                          <div
                            className="bg-gradient-to-r from-yellow-400 to-orange-500 h-1 rounded-full"
                            style={{ width: `${(achievement.progress / achievement.maxProgress) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Quick Actions */}
            <Card className={`p-6 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
              <h3 className="text-lg font-bold mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Button variant="secondary" className="w-full justify-start">
                  <Calendar size={16} className="mr-3" />
                  View Schedule
                </Button>
                <Button variant="secondary" className="w-full justify-start">
                  <Users size={16} className="mr-3" />
                  Join Discussion
                </Button>
                <Button variant="secondary" className="w-full justify-start">
                  <MessageCircle size={16} className="mr-3" />
                  Ask Teacher
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* AI Chat Assistant */}
      {aiChatOpen && (
        <div className={`fixed bottom-4 right-4 w-96 h-96 rounded-lg shadow-2xl border flex flex-col ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <div className={`p-4 border-b flex items-center justify-between ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <h3 className="font-semibold flex items-center gap-2">
              <Brain size={20} className="text-blue-500" />
              AI Study Assistant
            </h3>
            <Button variant="secondary" size="sm" onClick={() => setAiChatOpen(false)}>
              ✕
            </Button>
          </div>
          
          <div className="flex-1 p-4 overflow-y-auto">
            {aiMessages.length === 0 ? (
              <div className={`text-center mt-8 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                <Lightbulb size={32} className="mx-auto mb-2" />
                <p>Ask me anything about your studies!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {aiMessages.map((message, index) => (
                  <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-xs p-3 rounded-lg ${
                      message.role === 'user' 
                        ? 'bg-blue-500 text-white' 
                        : darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {message.content}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className={`p-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <div className="flex gap-2">
              <input
                type="text"
                value={aiInput}
                onChange={(e) => setAiInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAIChat()}
                placeholder="Ask me anything..."
                className={`flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
              />
              <Button variant="primary" onClick={handleAIChat}>
                Send
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Resource Viewer Modal */}
      {selectedResource && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`w-full max-w-4xl h-full max-h-[90vh] rounded-lg shadow-2xl flex flex-col ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className={`p-4 border-b flex items-center justify-between ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <h3 className="font-semibold">{selectedResource.title}</h3>
              <div className="flex items-center gap-2">
                <Button variant="secondary" size="sm">
                  <PenTool size={16} className="mr-1" />
                  Annotate
                </Button>
                <Button variant="secondary" size="sm" onClick={() => setSelectedResource(null)}>
                  ✕
                </Button>
              </div>
            </div>
            
            <div className="flex-1 p-4">
              <div className={`w-full h-full rounded-lg flex items-center justify-center ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                <div className="text-center">
                  {selectedResource.type === 'video' && <Play size={64} className="mx-auto mb-4" />}
                  {selectedResource.type === 'pdf' && <FileText size={64} className="mx-auto mb-4" />}
                  {selectedResource.type === 'quiz' && <Target size={64} className="mx-auto mb-4" />}
                  <p className="text-lg font-semibold">Interactive {selectedResource.type.toUpperCase()} Player</p>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Smart viewer with bookmarks, annotations, and progress tracking
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}