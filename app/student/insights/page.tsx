'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { 
  Brain, 
  BookOpen, 
  Zap, 
  Target, 
  MessageCircle, 
  FileText, 
  Map, 
  Lightbulb,
  Play,
  Download,
  Share,
  Bookmark,
  Volume2,
  Eye,
  Headphones
} from 'lucide-react';
import { useAccessibility } from '@/lib/accessibility-context';
import { useVoiceAccessibility } from '@/lib/voice-accessibility';
import { VoiceEnabledButton, VoiceEnabledText } from '@/components/accessibility/VoiceEnabledContent';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

interface InsightTool {
  id: string;
  title: string;
  description: string;
  icon: any;
  gradient: string;
  accessibilityFeatures: string[];
  route: string;
}

export default function CareerInsights() {
  const router = useRouter();
  const { profile, speak } = useAccessibility();
  const { announceAction, announceNavigation, readContent } = useVoiceAccessibility();
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const [chatInput, setChatInput] = useState('');

  const insightTools: InsightTool[] = [
    {
      id: 'mindmap',
      title: '🧠 AI Mindmap',
      description: 'Visual career path exploration with audio descriptions',
      icon: Brain,
      gradient: 'from-purple-500 via-pink-500 to-red-500',
      accessibilityFeatures: ['Voice narration', 'High contrast mode', 'Screen reader support'],
      route: '/student/insights/mindmap'
    },
    {
      id: 'studyguide',
      title: '📚 Study Guide',
      description: 'Personalized learning materials with TTS support',
      icon: BookOpen,
      gradient: 'from-blue-500 via-cyan-500 to-teal-500',
      accessibilityFeatures: ['Text-to-speech', 'Simplified language', 'Large fonts'],
      route: '/student/insights/study-guide'
    },
    {
      id: 'flashcards',
      title: '⚡ Smart Flashcards',
      description: 'Interactive cards with voice commands and captions',
      icon: Zap,
      gradient: 'from-green-500 via-emerald-500 to-cyan-500',
      accessibilityFeatures: ['Voice commands', 'Visual captions', 'Audio feedback'],
      route: '/student/insights/flashcards'
    },
    {
      id: 'quiz',
      title: '🎯 Adaptive Quiz',
      description: 'Voice-enabled assessments with multiple formats',
      icon: Target,
      gradient: 'from-orange-500 via-red-500 to-pink-500',
      accessibilityFeatures: ['Voice input', 'Multiple choice formats', 'Progress tracking'],
      route: '/student/insights/quiz'
    }
  ];

  useEffect(() => {
    if (profile === 'visual') {
      readContent('Career Insights dashboard loaded. You have access to AI-powered learning tools with full voice support. Use voice commands to navigate or press Tab to explore options.');
    } else if (profile === 'hearing') {
      speak('Career Insights dashboard with visual captions and transcripts available.');
    } else if (profile === 'cognitive') {
      speak('Simplified career learning tools ready. All content is available in easy-to-understand format.');
    }
  }, [profile]);

  const handleToolSelect = (tool: InsightTool) => {
    setSelectedTool(tool.id);
    announceAction(`Selected ${tool.title}. ${tool.description}`);
    speak(`Opening ${tool.title}`);
  };

  const handleChatSubmit = () => {
    if (chatInput.trim()) {
      announceAction(`Sending message: ${chatInput}`);
      speak('Processing your question with AI assistant');
      setChatInput('');
    }
  };

  const getProfileConfig = () => {
    switch (profile) {
      case 'visual':
        return {
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
          accentGradient: 'from-blue-600 to-purple-600'
        };
      case 'hearing':
        return {
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          accentGradient: 'from-green-600 to-teal-600'
        };
      case 'cognitive':
        return {
          bgColor: 'bg-purple-50',
          borderColor: 'border-purple-200',
          accentGradient: 'from-purple-600 to-pink-600'
        };
      default:
        return {
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200',
          accentGradient: 'from-indigo-600 to-purple-600'
        };
    }
  };

  const config = getProfileConfig();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-16">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className={`bg-gradient-to-r ${config.accentGradient} rounded-2xl p-8 text-white shadow-2xl`}>
            <motion.h1 
              className="text-4xl md:text-5xl font-black mb-4"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              🚀 Career Insights & Actions
            </motion.h1>
            <VoiceEnabledText 
              autoRead={profile === 'visual'}
              className="text-xl md:text-2xl text-white/90 font-medium"
            >
              AI-powered learning tools designed for every learner
            </VoiceEnabledText>
            
            <div className="flex justify-center gap-4 mt-6">
              {profile === 'visual' && (
                <div className="flex items-center gap-2 bg-white/20 rounded-full px-4 py-2">
                  <Volume2 size={20} />
                  <span className="text-sm font-medium">Voice Enabled</span>
                </div>
              )}
              {profile === 'hearing' && (
                <div className="flex items-center gap-2 bg-white/20 rounded-full px-4 py-2">
                  <Eye size={20} />
                  <span className="text-sm font-medium">Visual Captions</span>
                </div>
              )}
              {profile === 'cognitive' && (
                <div className="flex items-center gap-2 bg-white/20 rounded-full px-4 py-2">
                  <Brain size={20} />
                  <span className="text-sm font-medium">Simplified Mode</span>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6 shadow-lg border-2 border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className={`bg-gradient-to-r ${config.accentGradient} rounded-lg p-2`}>
                  <Lightbulb size={24} className="text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Learning Tools</h2>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {insightTools.map((tool, index) => (
                  <motion.div
                    key={tool.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <VoiceEnabledButton
                      onClick={() => handleToolSelect(tool)}
                      description={`${tool.title}: ${tool.description}`}
                      className={`w-full p-6 rounded-xl border-2 transition-all duration-300 ${
                        selectedTool === tool.id 
                          ? `${config.borderColor} ${config.bgColor} shadow-lg` 
                          : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
                      }`}
                    >
                      <div className="text-left">
                        <div className={`bg-gradient-to-r ${tool.gradient} rounded-lg p-3 w-fit mb-4 shadow-lg`}>
                          <tool.icon size={24} className="text-white" />
                        </div>
                        
                        <h3 className="text-lg font-bold text-gray-800 mb-2">
                          {tool.title}
                        </h3>
                        
                        <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                          {tool.description}
                        </p>

                        <div className="space-y-1">
                          {tool.accessibilityFeatures.slice(0, 2).map((feature, i) => (
                            <div key={i} className="flex items-center gap-2 text-xs text-gray-500">
                              <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                              <span>{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </VoiceEnabledButton>
                  </motion.div>
                ))}
              </div>
            </Card>

            <Card className="p-6 shadow-lg border-2 border-gray-100">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Play size={20} className="text-blue-500" />
                Quick Actions
              </h3>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { icon: Download, label: 'Download', action: 'download-materials' },
                  { icon: Share, label: 'Share', action: 'share-progress' },
                  { icon: Bookmark, label: 'Save', action: 'bookmark-lesson' },
                  { icon: FileText, label: 'Notes', action: 'view-notes' }
                ].map((action, index) => (
                  <VoiceEnabledButton
                    key={action.action}
                    onClick={() => announceAction(`${action.label} selected`)}
                    description={`${action.label} learning materials`}
                    className="flex flex-col items-center gap-2 p-4 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all"
                  >
                    <action.icon size={20} className="text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">{action.label}</span>
                  </VoiceEnabledButton>
                ))}
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            
            <Card className="p-6 shadow-lg border-2 border-gray-100">
              <div className="flex items-center gap-3 mb-4">
                <div className={`bg-gradient-to-r ${config.accentGradient} rounded-lg p-2`}>
                  <MessageCircle size={20} className="text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-800">💬 AI Career Assistant</h3>
              </div>

              <VoiceEnabledText className="text-sm text-gray-600 mb-4">
                Ask questions about careers, skills, or learning paths. Voice input supported!
              </VoiceEnabledText>

              <div className="space-y-4">
                <textarea
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder={
                    profile === 'visual' 
                      ? "Type or speak your career question..."
                      : profile === 'cognitive'
                      ? "Ask a simple question about careers..."
                      : "What would you like to know about careers?"
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                  rows={4}
                  aria-label="Career question input"
                />
                
                <div className="flex gap-2">
                  <Button
                    onClick={handleChatSubmit}
                    disabled={!chatInput.trim()}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
                  >
                    Send Question
                  </Button>
                  
                  {profile === 'visual' && (
                    <Button
                      variant="secondary"
                      onClick={() => speak('Voice input activated. Please speak your question.')}
                      className="px-4"
                    >
                      <Volume2 size={16} />
                    </Button>
                  )}
                </div>
              </div>

              <div className="mt-6 space-y-2">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Sample Questions:
                </p>
                {[
                  "What skills do I need for web development?",
                  "How do I prepare for engineering entrance exams?",
                  "What are the best career paths in AI?"
                ].map((question, index) => (
                  <button
                    key={index}
                    onClick={() => setChatInput(question)}
                    className="block w-full text-left text-xs text-blue-600 hover:text-blue-800 hover:bg-blue-50 p-2 rounded transition-colors"
                  >
                    "{question}"
                  </button>
                ))}
              </div>
            </Card>

            <Card className="p-6 shadow-lg border-2 border-gray-100">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Map size={20} className="text-green-500" />
                Learning Progress
              </h3>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">Career Exploration</span>
                  <span className="text-sm font-bold text-green-600">75%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full" style={{ width: '75%' }}></div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">Skill Assessment</span>
                  <span className="text-sm font-bold text-blue-600">60%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-gradient-to-r from-blue-400 to-purple-500 h-2 rounded-full" style={{ width: '60%' }}></div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">Learning Goals</span>
                  <span className="text-sm font-bold text-purple-600">85%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-gradient-to-r from-purple-400 to-pink-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                </div>
              </div>

              <Button 
                variant="secondary" 
                className="w-full mt-4"
                onClick={() => announceNavigation('Detailed progress report')}
              >
                View Detailed Report
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}