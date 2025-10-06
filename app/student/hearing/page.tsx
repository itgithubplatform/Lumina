'use client';

import { useState, useEffect, useRef } from 'react';
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
  Ear,
  Captions,
  FileText,
  MessageCircle,
  Search,
  Volume2,
  Download,
  Lightbulb,
  Filter,
  Contrast,
  Type,
  Focus,
  MessageSquare,
  Pause,
  SkipForward,
  RotateCcw,
  Upload,
  Youtube,
  Video,
  Eye,
  TrendingUp,
  Zap
} from 'lucide-react';
import { useAccessibility } from '@/lib/accessibility-context';
import { useVoiceAccessibility } from '@/lib/voice-accessibility';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

interface HearingContent {
  id: string;
  title: string;
  type: 'video' | 'pdf' | 'document' | 'youtube';
  subject: string;
  duration: string;
  progress: number;
  features: {
    captions: boolean;
    transcript: boolean;
    signLanguage: boolean;
    visualAlerts: boolean;
    simplifiedSummary: boolean;
    glossaryHelper: boolean;
  };
  transcriptPreview: string;
  keyTerms: string[];
  teacher: string;
  uploadDate: string;
}

export default function HearingStudentDashboard() {
  const { speak, settings } = useAccessibility();
  const { announceAction, announceNavigation, readContent } = useVoiceAccessibility();
  const [activeTab, setActiveTab] = useState('lessons');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [showTranscript, setShowTranscript] = useState(true);
  const [showCaptions, setShowCaptions] = useState(true);
  const [highContrast, setHighContrast] = useState(false);
  const [focusMode, setFocusMode] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<Array<{role: 'user' | 'assistant', content: string}>>([]);

  const hearingContent: HearingContent[] = [
    {
      id: '1',
      title: 'Solar System Basics - With Full Accessibility',
      type: 'video',
      subject: 'Science',
      duration: '15:30',
      progress: 65,
      features: {
        captions: true,
        transcript: true,
        signLanguage: true,
        visualAlerts: true,
        simplifiedSummary: true,
        glossaryHelper: true
      },
      transcriptPreview: '[00:00] Welcome to our lesson about the Solar System. [00:05] The Solar System consists of the Sun and all objects that orbit around it...',
      keyTerms: ['Solar System', 'Planet', 'Orbit'],
      teacher: 'Dr. Smith',
      uploadDate: '2024-01-15'
    },
    {
      id: '2',
      title: 'Mathematics Fundamentals - Visual Guide',
      type: 'pdf',
      subject: 'Mathematics',
      duration: '12:00',
      progress: 80,
      features: {
        captions: false,
        transcript: true,
        signLanguage: true,
        visualAlerts: true,
        simplifiedSummary: true,
        glossaryHelper: true
      },
      transcriptPreview: 'Mathematics is the study of numbers, shapes, and patterns. Basic operations include addition, subtraction...',
      keyTerms: ['Addition', 'Equation', 'Variable'],
      teacher: 'Prof. Johnson',
      uploadDate: '2024-01-14'
    },
    {
      id: '3',
      title: 'English Literature - Interactive Reading',
      type: 'document',
      subject: 'English',
      duration: '18:45',
      progress: 45,
      features: {
        captions: true,
        transcript: true,
        signLanguage: true,
        visualAlerts: true,
        simplifiedSummary: true,
        glossaryHelper: true
      },
      transcriptPreview: 'Literature is the art of written works. It includes poetry, novels, short stories, and plays...',
      keyTerms: ['Metaphor', 'Theme', 'Character'],
      teacher: 'Ms. Davis',
      uploadDate: '2024-01-13'
    }
  ];

  useEffect(() => {
    readContent('Hearing accessibility dashboard loaded. All content includes captions, transcripts, sign language support, and visual alerts optimized for hearing-impaired students.');
  }, []);

  const tabs = [
    { id: 'lessons', label: 'Accessible Lessons', icon: BookOpen },
    { id: 'progress', label: 'Learning Analytics', icon: BarChart3 },
    { id: 'notifications', label: 'Visual Alerts', icon: Bell },
    { id: 'activities', label: 'Interactive Practice', icon: Target }
  ];

  const handleChatSubmit = () => {
    if (chatInput.trim()) {
      setChatMessages(prev => [
        ...prev,
        { role: 'user', content: chatInput },
        { role: 'assistant', content: 'I understand your question about the lesson. Let me provide a visual explanation with diagrams and text-based examples.' }
      ]);
      setChatInput('');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 pt-16">
      <div className="container mx-auto px-4 py-8">
        
        {/* Header with Logo */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-8 text-white shadow-2xl relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-4 left-4 w-16 h-16 border-2 border-white/30 rounded-full"></div>
              <div className="absolute bottom-4 right-4 w-12 h-12 border-2 border-white/20 rounded-full"></div>
              <div className="absolute top-1/2 right-8 w-8 h-8 border border-white/25 rounded-full"></div>
            </div>
            
            {/* Logo and Branding */}
            <div className="relative z-10">
              <motion.div 
                className="flex items-center justify-center gap-4 mb-4"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 border border-white/30">
                  <div className="w-16 h-16 bg-gradient-to-br from-white to-white/80 rounded-xl flex items-center justify-center shadow-lg">
                    <span className="text-green-600 text-2xl font-black">L+</span>
                  </div>
                </div>
                <div className="text-left">
                  <h1 className="text-4xl md:text-5xl font-black text-white">
                    Lumina+
                  </h1>
                  <p className="text-white/80 text-sm font-medium italic">
                    "Lighting the way for every learner"
                  </p>
                </div>
              </motion.div>
              
              <motion.div
                className="flex items-center justify-center gap-3 mb-4"
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                <div className="bg-white/20 rounded-full p-2">
                  <Ear size={24} />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold">
                  Hearing Support Dashboard
                </h2>
              </motion.div>
              
              <p className="text-xl text-white/90 font-medium mb-6">
                Complete learning experience with visual accessibility
              </p>
            </div>
            
            {/* Feature Indicators */}
            <div className="flex flex-wrap justify-center gap-4">
              {[
                { icon: Captions, label: 'Auto Captions' },
                { icon: FileText, label: 'Full Transcripts' },
                { icon: MessageCircle, label: 'Sign Language' },
                { icon: Eye, label: 'Visual Alerts' },
                { icon: Search, label: 'Searchable Text' },
                { icon: Lightbulb, label: 'Visual Summaries' },
                { icon: Focus, label: 'Focus Mode' },
                { icon: Contrast, label: 'High Contrast' }
              ].map((feature, index) => (
                <div key={index} className="flex items-center gap-2 bg-white/20 rounded-full px-4 py-2">
                  <feature.icon size={20} />
                  <span className="text-sm font-medium">{feature.label}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Accessibility Toolbar */}
        <Card className="p-4 mb-6 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 shadow-lg">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-xs font-bold">L+</span>
              </div>
              <h3 className="font-semibold text-green-800 flex items-center gap-2">
                <Ear size={20} />
                Quick Accessibility Controls
              </h3>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={showCaptions ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => setShowCaptions(!showCaptions)}
              >
                <Captions size={16} className="mr-1" />
                Captions {showCaptions ? 'ON' : 'OFF'}
              </Button>
              <Button
                variant={showTranscript ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => setShowTranscript(!showTranscript)}
              >
                <FileText size={16} className="mr-1" />
                Transcript {showTranscript ? 'ON' : 'OFF'}
              </Button>
              <Button
                variant={highContrast ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => setHighContrast(!highContrast)}
              >
                <Contrast size={16} className="mr-1" />
                High Contrast
              </Button>
              <Button
                variant={focusMode ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => setFocusMode(!focusMode)}
              >
                <Focus size={16} className="mr-1" />
                Focus Mode
              </Button>
            </div>
          </div>
        </Card>

        {/* Navigation Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex justify-center mb-8"
        >
          <div className="bg-white rounded-xl shadow-lg p-2 flex gap-2 border border-green-100">
            {tabs.map((tab) => (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? 'primary' : 'secondary'}
                onClick={() => {
                  setActiveTab(tab.id);
                  announceNavigation(`${tab.label} section for hearing accessibility`);
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
          {activeTab === 'lessons' && (
            <HearingLessonsSection 
              content={hearingContent}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              selectedFilter={selectedFilter}
              setSelectedFilter={setSelectedFilter}
              showTranscript={showTranscript}
              showCaptions={showCaptions}
            />
          )}
          {activeTab === 'progress' && <HearingProgressSection />}
          {activeTab === 'notifications' && <HearingNotificationsSection />}
          {activeTab === 'activities' && (
            <HearingActivitiesSection 
              chatInput={chatInput}
              setChatInput={setChatInput}
              chatMessages={chatMessages}
              handleChatSubmit={handleChatSubmit}
            />
          )}
        </motion.div>
      </div>
    </div>
  );
}

// Hearing-Specific Lessons Section
function HearingLessonsSection({ 
  content, 
  searchTerm, 
  setSearchTerm, 
  selectedFilter, 
  setSelectedFilter,
  showTranscript,
  showCaptions 
}: {
  content: HearingContent[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedFilter: string;
  setSelectedFilter: (filter: string) => void;
  showTranscript: boolean;
  showCaptions: boolean;
}) {
  const filteredContent = content.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.subject.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (selectedFilter === 'all') return matchesSearch;
    if (selectedFilter === 'video') return matchesSearch && item.type === 'video';
    if (selectedFilter === 'document') return matchesSearch && (item.type === 'pdf' || item.type === 'document');
    
    return matchesSearch;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      
      {/* Search and Filter */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search lessons by title or subject..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div className="flex gap-2">
            {['all', 'video', 'document'].map((filter) => (
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

      {/* Current Lesson - Enhanced for Hearing */}
      <Card className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-3">
            <Play size={24} className="text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Continue Learning</h2>
            <p className="text-gray-600">Resume with full accessibility features</p>
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <div className="bg-gradient-to-br from-green-100 to-green-200 rounded-xl h-40 flex items-center justify-center mb-4 relative">
              <Play size={32} className="text-green-600" />
              {showCaptions && (
                <div className="absolute bottom-2 left-2 right-2 bg-black/80 text-white text-sm p-2 rounded">
                  [Captions: Welcome to our lesson about the Solar System...]
                </div>
              )}
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Solar System Basics</h3>
            <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
              <span className="flex items-center gap-1">
                <Clock size={14} />
                15:30 min
              </span>
              <span className="flex items-center gap-1">
                <Captions size={14} />
                Captions Available
              </span>
              <span className="flex items-center gap-1">
                <FileText size={14} />
                Full Transcript
              </span>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Progress</span>
                <span>65%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all duration-500" style={{ width: '65%' }} />
              </div>
            </div>
            
            {showTranscript && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                  <FileText size={16} />
                  Transcript Preview
                </h4>
                <p className="text-sm text-gray-600 line-clamp-3">
                  [00:00] Welcome to our lesson about the Solar System. [00:05] The Solar System consists of the Sun and all objects that orbit around it...
                </p>
                <Button variant="secondary" size="sm" className="mt-2">
                  View Full Transcript
                </Button>
              </div>
            )}
            
            <div className="flex gap-2">
              <Button variant="primary" className="flex-1">
                <Play size={16} className="mr-2" />
                Continue with Captions
              </Button>
              <Button variant="secondary">
                <Download size={16} />
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Lesson Library */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredContent.map((lesson) => (
          <Card key={lesson.id} className="p-4 hover:shadow-lg transition-all cursor-pointer">
            <div className="flex items-center justify-between mb-3">
              <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-2">
                {lesson.type === 'video' ? <Play size={20} className="text-white" /> : <FileText size={20} className="text-white" />}
              </div>
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">{lesson.duration}</span>
            </div>
            
            <h4 className="font-semibold text-gray-800 mb-2 line-clamp-2">{lesson.title}</h4>
            <p className="text-sm text-gray-600 mb-3">{lesson.subject}</p>
            
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-xs text-gray-500">
                <span>Progress</span>
                <span>{lesson.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1">
                <div className="bg-green-500 h-1 rounded-full" style={{ width: `${lesson.progress}%` }} />
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-1 mb-3">
              {[
                { key: 'captions', icon: Captions, label: 'CC' },
                { key: 'transcript', icon: FileText, label: 'TXT' },
                { key: 'signLanguage', icon: MessageCircle, label: 'SL' }
              ].map(({ key, icon: Icon, label }) => (
                <div
                  key={key}
                  className={`flex items-center justify-center gap-1 text-xs p-1 rounded ${
                    lesson.features[key as keyof typeof lesson.features]
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  <Icon size={10} />
                  <span>{label}</span>
                </div>
              ))}
            </div>
            
            <Button variant="primary" size="sm" className="w-full">
              <Play size={14} className="mr-1" />
              Start Learning
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}

// Hearing Progress Section
function HearingProgressSection() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card className="p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <BarChart3 size={24} />
          Hearing Accessibility Usage
        </h3>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Captions Used', value: '98%', icon: Captions, color: 'bg-green-500' },
            { label: 'Transcripts Read', value: '85%', icon: FileText, color: 'bg-blue-500' },
            { label: 'Visual Alerts', value: '92%', icon: Bell, color: 'bg-purple-500' },
            { label: 'Sign Language', value: '76%', icon: MessageCircle, color: 'bg-orange-500' }
          ].map((stat) => (
            <div key={stat.label} className="bg-gray-50 rounded-lg p-4 text-center">
              <div className={`${stat.color} rounded-full p-2 w-fit mx-auto mb-2`}>
                <stat.icon size={20} className="text-white" />
              </div>
              <div className="text-2xl font-bold text-gray-800">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
        
        <div className="bg-green-50 rounded-lg p-4">
          <h4 className="font-semibold text-green-800 mb-2">Accessibility Impact</h4>
          <p className="text-sm text-green-700">
            Your use of hearing accessibility features has improved comprehension by 40% and reduced learning time by 25%.
          </p>
        </div>
      </Card>
    </div>
  );
}

// Hearing Notifications Section
function HearingNotificationsSection() {
  const [visualAlerts, setVisualAlerts] = useState(true);
  
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card className="p-6 bg-green-50 border-green-200">
        <h3 className="text-lg font-bold text-green-800 mb-4 flex items-center gap-2">
          <Bell size={20} />
          Visual Alert Preferences
        </h3>
        <div className="flex items-center justify-between">
          <span className="text-green-700">Enable visual notifications and alerts</span>
          <Button
            variant={visualAlerts ? 'primary' : 'secondary'}
            onClick={() => setVisualAlerts(!visualAlerts)}
          >
            {visualAlerts ? 'ON' : 'OFF'}
          </Button>
        </div>
      </Card>
      
      <Card className="p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-6">Recent Updates</h3>
        <div className="space-y-4">
          {[
            { type: 'lesson', message: 'New lesson available: Photosynthesis with full captions', color: 'bg-blue-100 border-blue-300', icon: BookOpen },
            { type: 'assignment', message: 'Assignment due tomorrow - Visual format available', color: 'bg-orange-100 border-orange-300', icon: Clock },
            { type: 'achievement', message: 'Achievement unlocked: Caption Master!', color: 'bg-green-100 border-green-300', icon: Trophy }
          ].map((alert, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`${alert.color} border-l-4 p-4 rounded-r-lg flex items-center gap-3`}
            >
              <alert.icon size={20} className="text-gray-600" />
              <span className="text-gray-800">{alert.message}</span>
              {visualAlerts && (
                <div className="ml-auto">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </Card>
    </div>
  );
}

// Hearing Activities Section
function HearingActivitiesSection({ 
  chatInput, 
  setChatInput, 
  chatMessages, 
  handleChatSubmit 
}: {
  chatInput: string;
  setChatInput: (input: string) => void;
  chatMessages: Array<{role: 'user' | 'assistant', content: string}>;
  handleChatSubmit: () => void;
}) {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      
      {/* Text-Based AI Chat Assistant */}
      <Card className="p-6 border-green-100">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
            <MessageSquare size={20} className="text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              Lumina+ AI Assistant
            </h3>
            <p className="text-sm text-gray-600">Text-only learning support</p>
          </div>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-4 h-64 overflow-y-auto mb-4">
          {chatMessages.length === 0 ? (
            <div className="text-center text-gray-500 mt-20">
              <MessageCircle size={32} className="mx-auto mb-2" />
              <p>Ask me anything about your lessons!</p>
              <p className="text-sm">I'll respond with text, diagrams, and visual explanations.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {chatMessages.map((msg, index) => (
                <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xs p-3 rounded-lg ${
                    msg.role === 'user' 
                      ? 'bg-green-500 text-white' 
                      : 'bg-white border border-gray-200 text-gray-800'
                  }`}>
                    {msg.content}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="flex gap-2">
          <input
            type="text"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleChatSubmit()}
            placeholder="Type your question here..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
          />
          <Button variant="primary" onClick={handleChatSubmit}>
            Send
          </Button>
        </div>
      </Card>
      
      {/* Visual Quiz Mode */}
      <Card className="p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Target size={24} />
          Visual Quiz Mode
        </h3>
        
        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">Question 1: Solar System</h4>
          <p className="text-gray-700 mb-4">Which planet is closest to the Sun?</p>
          
          <div className="grid grid-cols-2 gap-3 mb-4">
            {['Mercury ☿️', 'Venus ♀️', 'Earth 🌍', 'Mars ♂️'].map((option, index) => (
              <Button key={index} variant="secondary" className="text-left justify-start h-12">
                {option}
              </Button>
            ))}
          </div>
          
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Lightbulb size={16} />
            <span>Visual hints and diagrams available for each question</span>
          </div>
        </div>
      </Card>
      
      {/* Visual Diagram Generator */}
      <Card className="p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Eye size={24} />
          Visual Learning Tools
        </h3>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="font-semibold text-blue-800 mb-2">📊 Concept Diagrams</h4>
            <p className="text-sm text-blue-700 mb-3">Auto-generated visual diagrams for complex concepts</p>
            <Button variant="primary" size="sm">Generate Diagram</Button>
          </div>
          
          <div className="bg-purple-50 rounded-lg p-4">
            <h4 className="font-semibold text-purple-800 mb-2">📖 Glossary Helper</h4>
            <p className="text-sm text-purple-700 mb-3">Hover over highlighted terms for instant definitions</p>
            <Button variant="primary" size="sm">Enable Glossary</Button>
          </div>
        </div>
      </Card>
    </div>
  );
}