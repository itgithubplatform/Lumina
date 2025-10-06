'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Brain, 
  BookOpen, 
  FileText, 
  Download, 
  Play,
  Lightbulb,
  Target,
  Smile,
  Search,
  Filter,
  Volume2
} from 'lucide-react';
import { useVoiceAccessibility } from '@/lib/voice-accessibility';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

interface AccessibleContent {
  id: string;
  title: string;
  simpleTitle: string;
  type: 'video' | 'pdf' | 'document';
  originalTitle: string;
  teacher: string;
  subject: string;
  duration?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  features: {
    simplified: boolean;
    summary: boolean;
    imageAids: boolean;
    focusMode: boolean;
  };
  uploadDate: string;
  description: string;
  simpleDescription: string;
}

export default function CognitiveRepository() {
  const { announceAction, speak, readContent } = useVoiceAccessibility();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [difficultyFilter, setDifficultyFilter] = useState('all');

  const [content] = useState<AccessibleContent[]>([
    {
      id: '1',
      title: 'Solar System Basics - Easy Learning',
      simpleTitle: 'Learn About Space',
      type: 'video',
      originalTitle: 'Solar System Basics',
      teacher: 'Dr. Smith',
      subject: 'Science',
      duration: '10:00',
      difficulty: 'easy',
      features: {
        simplified: true,
        summary: true,
        imageAids: true,
        focusMode: true
      },
      uploadDate: '2024-01-15',
      description: 'Learn about planets, stars, and space in simple words with pictures.',
      simpleDescription: 'Fun space learning with pictures! 🚀'
    },
    {
      id: '2',
      title: 'Math Made Simple - Numbers and Counting',
      simpleTitle: 'Easy Math',
      type: 'pdf',
      originalTitle: 'Mathematics Fundamentals',
      teacher: 'Prof. Johnson',
      subject: 'Mathematics',
      difficulty: 'easy',
      features: {
        simplified: true,
        summary: true,
        imageAids: true,
        focusMode: true
      },
      uploadDate: '2024-01-14',
      description: 'Learn numbers and counting with colorful pictures and simple steps.',
      simpleDescription: 'Count and learn numbers! 🔢'
    },
    {
      id: '3',
      title: 'Story Time - Easy Reading',
      simpleTitle: 'Fun Stories',
      type: 'document',
      originalTitle: 'English Literature Notes',
      teacher: 'Ms. Davis',
      subject: 'English',
      difficulty: 'easy',
      features: {
        simplified: true,
        summary: true,
        imageAids: true,
        focusMode: true
      },
      uploadDate: '2024-01-13',
      description: 'Read fun stories with simple words and colorful pictures.',
      simpleDescription: 'Read fun stories! 📚'
    }
  ]);

  useEffect(() => {
    readContent('Cognitive support repository loaded. All content is simplified with easy words, pictures, and focus mode. Everything is made easy to understand and learn.');
  }, []);

  const filteredContent = content.filter(item => {
    const matchesSearch = item.simpleTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.subject.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = selectedFilter === 'all' || 
                       (selectedFilter === 'video' && item.type === 'video') ||
                       (selectedFilter === 'document' && (item.type === 'pdf' || item.type === 'document'));
    
    const matchesDifficulty = difficultyFilter === 'all' || item.difficulty === difficultyFilter;
    
    return matchesSearch && matchesType && matchesDifficulty;
  });

  const handleContentSelect = (content: AccessibleContent) => {
    announceAction(`Opening ${content.simpleTitle}`);
    speak(`Loading ${content.simpleTitle}. This content is made simple and easy to understand with pictures and focus mode.`);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyEmoji = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return '😊';
      case 'medium': return '🤔';
      case 'hard': return '💪';
      default: return '📚';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 pt-16">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 text-white shadow-2xl">
            <motion.h1 
              className="text-4xl md:text-5xl font-black mb-4 flex items-center justify-center gap-3"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Brain size={48} />
              Easy Learning Space
            </motion.h1>
            <p className="text-xl md:text-2xl text-white/90 font-medium mb-6">
              Simple content made easy to understand with pictures and fun! 🎉
            </p>
            
            {/* Feature Indicators */}
            <div className="flex flex-wrap justify-center gap-4">
              <div className="flex items-center gap-2 bg-white/20 rounded-full px-4 py-2">
                <Lightbulb size={20} />
                <span className="text-sm font-medium">Simple Words</span>
              </div>
              <div className="flex items-center gap-2 bg-white/20 rounded-full px-4 py-2">
                <Smile size={20} />
                <span className="text-sm font-medium">Fun Pictures</span>
              </div>
              <div className="flex items-center gap-2 bg-white/20 rounded-full px-4 py-2">
                <Target size={20} />
                <span className="text-sm font-medium">Focus Mode</span>
              </div>
              <div className="flex items-center gap-2 bg-white/20 rounded-full px-4 py-2">
                <BookOpen size={20} />
                <span className="text-sm font-medium">Easy Summary</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Simple Instructions */}
        <Card className="p-6 mb-8 bg-purple-50 border-purple-200">
          <div className="flex items-center gap-3 mb-3">
            <Volume2 size={24} className="text-purple-600" />
            <h3 className="text-lg font-bold text-purple-800">How to Use This Page 📖</h3>
          </div>
          <div className="grid md:grid-cols-3 gap-4 text-sm text-purple-700">
            <div className="flex items-center gap-2">
              <span className="text-2xl">1️⃣</span>
              <span>Look for content you want to learn</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">2️⃣</span>
              <span>Click on the colorful cards</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">3️⃣</span>
              <span>Enjoy learning with pictures!</span>
            </div>
          </div>
        </Card>

        {/* Search and Filter */}
        <Card className="p-6 mb-8 shadow-lg">
          <div className="space-y-4">
            {/* Simple Search */}
            <div className="relative">
              <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="What do you want to learn? Type here... 🔍"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-lg"
                aria-label="Search for learning content"
              />
            </div>
            
            {/* Simple Filters */}
            <div className="flex flex-wrap gap-3">
              <div className="flex gap-2">
                <span className="text-sm font-medium text-gray-700 self-center">Show me:</span>
                {[
                  { key: 'all', label: 'Everything', emoji: '📚' },
                  { key: 'video', label: 'Videos', emoji: '🎬' },
                  { key: 'document', label: 'Reading', emoji: '📖' }
                ].map(({ key, label, emoji }) => (
                  <Button
                    key={key}
                    variant={selectedFilter === key ? 'primary' : 'secondary'}
                    onClick={() => {
                      setSelectedFilter(key);
                      announceAction(`Showing ${label} content`);
                    }}
                    className="text-sm"
                  >
                    {emoji} {label}
                  </Button>
                ))}
              </div>
              
              <div className="flex gap-2">
                <span className="text-sm font-medium text-gray-700 self-center">Level:</span>
                {[
                  { key: 'all', label: 'All Levels', emoji: '🌟' },
                  { key: 'easy', label: 'Easy', emoji: '😊' },
                  { key: 'medium', label: 'Medium', emoji: '🤔' }
                ].map(({ key, label, emoji }) => (
                  <Button
                    key={key}
                    variant={difficultyFilter === key ? 'primary' : 'secondary'}
                    onClick={() => {
                      setDifficultyFilter(key);
                      announceAction(`Showing ${label} content`);
                    }}
                    className="text-sm"
                  >
                    {emoji} {label}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* Content Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredContent.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02, y: -5 }}
            >
              <Card 
                className="p-6 cursor-pointer hover:shadow-xl transition-all duration-300 border-2 border-gray-100 hover:border-purple-300 focus:ring-4 focus:ring-purple-300"
                onClick={() => handleContentSelect(item)}
                tabIndex={0}
                role="button"
                aria-label={`Learn about ${item.simpleTitle}`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    handleContentSelect(item);
                  }
                }}
              >
                {/* Content Type Icon */}
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-3">
                    {item.type === 'video' ? (
                      <Play size={24} className="text-white" />
                    ) : (
                      <BookOpen size={24} className="text-white" />
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {item.duration && (
                      <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        {item.duration}
                      </span>
                    )}
                    <span className={`text-xs px-2 py-1 rounded-full ${getDifficultyColor(item.difficulty)}`}>
                      {getDifficultyEmoji(item.difficulty)} {item.difficulty}
                    </span>
                  </div>
                </div>

                {/* Content Info */}
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {item.simpleTitle}
                </h3>
                
                <p className="text-gray-600 mb-4 text-lg leading-relaxed">
                  {item.simpleDescription}
                </p>
                
                <div className="text-sm text-gray-500 mb-4">
                  <p className="font-medium">{item.subject}</p>
                  <p>Teacher: {item.teacher}</p>
                </div>

                {/* Simple Features */}
                <div className="space-y-2 mb-4">
                  <p className="text-xs font-medium text-gray-700 uppercase tracking-wide">
                    What You Get:
                  </p>
                  <div className="grid grid-cols-2 gap-1">
                    {[
                      { key: 'simplified', label: 'Easy Words', emoji: '✨' },
                      { key: 'summary', label: 'Short Summary', emoji: '📝' },
                      { key: 'imageAids', label: 'Fun Pictures', emoji: '🖼️' },
                      { key: 'focusMode', label: 'Focus Help', emoji: '🎯' }
                    ].map(({ key, label, emoji }) => (
                      <div
                        key={key}
                        className={`flex items-center gap-1 text-xs p-2 rounded-lg ${
                          item.features[key as keyof typeof item.features]
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-gray-100 text-gray-500'
                        }`}
                      >
                        <span>{emoji}</span>
                        <span>{label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Button
                    variant="primary"
                    size="sm"
                    className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-lg py-3"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleContentSelect(item);
                    }}
                    aria-label={`Start learning ${item.simpleTitle}`}
                  >
                    <Play size={16} className="mr-2" />
                    Start Learning! 🚀
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {filteredContent.length === 0 && (
          <Card className="p-12 text-center">
            <Brain size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-bold text-gray-600 mb-2">No learning content found 😔</h3>
            <p className="text-gray-500 text-lg">
              Try searching for something else or change the filters above!
            </p>
          </Card>
        )}

        {/* Help Guide */}
        <Card className="p-6 mt-8 bg-purple-50 border-purple-200">
          <h3 className="text-lg font-bold text-purple-800 mb-3 flex items-center gap-2">
            <Lightbulb size={20} />
            Learning Made Easy! 🌟
          </h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-purple-700">
            <div>
              <p className="font-medium mb-2 text-base">📚 What makes learning easy here:</p>
              <ul className="space-y-1">
                <li>• Simple words that are easy to understand</li>
                <li>• Colorful pictures to help you learn</li>
                <li>• Short summaries of big topics</li>
                <li>• Focus mode to help you concentrate</li>
              </ul>
            </div>
            <div>
              <p className="font-medium mb-2 text-base">🎯 How to learn better:</p>
              <ul className="space-y-1">
                <li>• Take breaks when you need them</li>
                <li>• Ask for help if you don't understand</li>
                <li>• Practice what you learn</li>
                <li>• Have fun while learning!</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-4 p-4 bg-purple-100 rounded-lg">
            <p className="text-purple-800 font-medium text-center">
              🎉 Remember: Learning should be fun! Take your time and enjoy discovering new things! 🎉
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}