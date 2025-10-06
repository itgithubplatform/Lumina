'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  Ear, 
  Play, 
  FileText, 
  Download, 
  Eye, 
  Volume2,
  Captions,
  MessageCircle,
  Search,
  Filter,
  Lightbulb,
  BookOpen,
  Zap,
  Target,
  SkipForward,
  Pause,
  RotateCcw,
  MessageSquare,
  Contrast,
  Type,
  Focus
} from 'lucide-react';
import { useVoiceAccessibility } from '@/lib/voice-accessibility';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

interface AccessibleContent {
  id: string;
  title: string;
  type: 'video' | 'pdf' | 'document' | 'youtube';
  originalTitle: string;
  teacher: string;
  subject: string;
  duration?: string;
  features: {
    captions: boolean;
    transcript: boolean;
    signLanguage: boolean;
    visualAlerts: boolean;
    simplifiedSummary: boolean;
    glossaryHelper: boolean;
    visualDiagrams: boolean;
    searchableTranscript: boolean;
  };
  uploadDate: string;
  thumbnail?: string;
  transcriptText?: string;
  summaryText?: string;
  keyTerms?: Array<{ term: string; definition: string; signIcon?: string }>;
  videoUrl?: string;
  captionsUrl?: string;
}

export default function HearingRepository() {
  const { announceAction, speak, readContent } = useVoiceAccessibility();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedContent, setSelectedContent] = useState<AccessibleContent | null>(null);
  const [showTranscript, setShowTranscript] = useState(true);
  const [showCaptions, setShowCaptions] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [highlightedTerm, setHighlightedTerm] = useState('');
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<Array<{role: 'user' | 'assistant', content: string}>>([]);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [content] = useState<AccessibleContent[]>([
    {
      id: '1',
      title: 'Solar System Basics - With Full Accessibility',
      type: 'video',
      originalTitle: 'Solar System Basics',
      teacher: 'Dr. Smith',
      subject: 'Science',
      duration: '15:30',
      features: {
        captions: true,
        transcript: true,
        signLanguage: true,
        visualAlerts: true,
        simplifiedSummary: true,
        glossaryHelper: true,
        visualDiagrams: true,
        searchableTranscript: true
      },
      uploadDate: '2024-01-15',
      transcriptText: '[00:00] Welcome to our lesson about the Solar System. [00:05] The Solar System consists of the Sun and all objects that orbit around it. [00:15] There are eight planets in our Solar System. [00:25] The inner planets are Mercury, Venus, Earth, and Mars.',
      summaryText: '🌟 Key Points: 1) Solar System has Sun + planets 2) 8 planets total 3) Inner planets: Mercury, Venus, Earth, Mars 4) Outer planets are gas giants',
      keyTerms: [
        { term: 'Solar System', definition: 'The Sun and all objects that orbit around it', signIcon: '☀️🪐' },
        { term: 'Planet', definition: 'A large object that orbits around a star', signIcon: '🪐' },
        { term: 'Orbit', definition: 'The path an object takes around another object in space', signIcon: '🔄' }
      ],
      videoUrl: '/videos/solar-system.mp4',
      captionsUrl: '/captions/solar-system.vtt'
    },
    {
      id: '2',
      title: 'Mathematics Fundamentals - Visual & Text Guide',
      type: 'pdf',
      originalTitle: 'Mathematics Fundamentals',
      teacher: 'Prof. Johnson',
      subject: 'Mathematics',
      features: {
        captions: false,
        transcript: true,
        signLanguage: true,
        visualAlerts: true,
        simplifiedSummary: true,
        glossaryHelper: true,
        visualDiagrams: true,
        searchableTranscript: true
      },
      uploadDate: '2024-01-14',
      transcriptText: 'Mathematics is the study of numbers, shapes, and patterns. Basic operations include addition, subtraction, multiplication, and division.',
      summaryText: '📊 Key Points: 1) Math = numbers + shapes + patterns 2) Basic operations: +, -, ×, ÷ 3) Used in daily life 4) Foundation for science',
      keyTerms: [
        { term: 'Addition', definition: 'Combining numbers to get a larger number', signIcon: '➕' },
        { term: 'Equation', definition: 'A mathematical statement showing two things are equal', signIcon: '=' },
        { term: 'Variable', definition: 'A letter that represents an unknown number', signIcon: '❓' }
      ]
    },
    {
      id: '3',
      title: 'English Literature - Interactive Reading',
      type: 'document',
      originalTitle: 'English Literature Notes',
      teacher: 'Ms. Davis',
      subject: 'English',
      features: {
        captions: true,
        transcript: true,
        signLanguage: true,
        visualAlerts: true,
        simplifiedSummary: true,
        glossaryHelper: true,
        visualDiagrams: false,
        searchableTranscript: true
      },
      uploadDate: '2024-01-13',
      transcriptText: 'Literature is the art of written works. It includes poetry, novels, short stories, and plays. Authors use literary devices to create meaning.',
      summaryText: '📚 Key Points: 1) Literature = written art 2) Types: poetry, novels, stories, plays 3) Authors use special techniques 4) Creates deeper meaning',
      keyTerms: [
        { term: 'Metaphor', definition: 'Comparing two things without using like or as', signIcon: '🔄' },
        { term: 'Theme', definition: 'The main message or lesson in a story', signIcon: '💡' },
        { term: 'Character', definition: 'A person or being in a story', signIcon: '👤' }
      ]
    }
  ]);

  useEffect(() => {
    readContent('Hearing accessibility repository loaded. Content includes captions, transcripts, sign language support, and visual alerts. All materials are optimized for hearing-impaired students.');
  }, []);

  const filteredContent = content.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.subject.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (selectedFilter === 'all') return matchesSearch;
    if (selectedFilter === 'video') return matchesSearch && item.type === 'video';
    if (selectedFilter === 'document') return matchesSearch && (item.type === 'pdf' || item.type === 'document');
    
    return matchesSearch;
  });

  const handleContentSelect = (content: AccessibleContent) => {
    announceAction(`Opening ${content.title}`);
    speak(`Loading ${content.title} with full hearing accessibility features including captions and transcripts`);
    // Navigate to content viewer
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 pt-16">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-8 text-white shadow-2xl">
            <motion.h1 
              className="text-4xl md:text-5xl font-black mb-4 flex items-center justify-center gap-3"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Ear size={48} />
              Hearing Accessibility Repository
            </motion.h1>
            <p className="text-xl md:text-2xl text-white/90 font-medium mb-6">
              Content optimized with captions, transcripts, and visual cues
            </p>
            
            {/* Feature Indicators */}
            <div className="flex flex-wrap justify-center gap-4">
              <div className="flex items-center gap-2 bg-white/20 rounded-full px-4 py-2">
                <Captions size={20} />
                <span className="text-sm font-medium">Auto Captions</span>
              </div>
              <div className="flex items-center gap-2 bg-white/20 rounded-full px-4 py-2">
                <FileText size={20} />
                <span className="text-sm font-medium">Full Transcripts</span>
              </div>
              <div className="flex items-center gap-2 bg-white/20 rounded-full px-4 py-2">
                <MessageCircle size={20} />
                <span className="text-sm font-medium">Sign Language</span>
              </div>
              <div className="flex items-center gap-2 bg-white/20 rounded-full px-4 py-2">
                <Eye size={20} />
                <span className="text-sm font-medium">Visual Alerts</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Search and Filter */}
        <Card className="p-6 mb-8 shadow-lg">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search content by title or subject..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
            
            <div className="flex gap-2">
              {['all', 'video', 'document'].map((filter) => (
                <Button
                  key={filter}
                  variant={selectedFilter === filter ? 'primary' : 'secondary'}
                  onClick={() => {
                    setSelectedFilter(filter);
                    announceAction(`Filter set to ${filter}`);
                  }}
                  className="capitalize"
                >
                  <Filter size={16} className="mr-2" />
                  {filter}
                </Button>
              ))}
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
                className="p-6 cursor-pointer hover:shadow-xl transition-all duration-300 border-2 border-gray-100 hover:border-green-300"
                onClick={() => handleContentSelect(item)}
              >
                {/* Content Type Icon */}
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg p-3">
                    {item.type === 'video' ? (
                      <Play size={24} className="text-white" />
                    ) : (
                      <FileText size={24} className="text-white" />
                    )}
                  </div>
                  
                  {item.duration && (
                    <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      {item.duration}
                    </span>
                  )}
                </div>

                {/* Content Info */}
                <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2">
                  {item.title}
                </h3>
                
                <div className="text-sm text-gray-600 mb-4">
                  <p className="font-medium">{item.subject}</p>
                  <p>By {item.teacher}</p>
                  <p className="text-xs text-gray-500">Uploaded {item.uploadDate}</p>
                </div>

                {/* Accessibility Features */}
                <div className="space-y-2 mb-4">
                  <p className="text-xs font-medium text-gray-700 uppercase tracking-wide">
                    Accessibility Features:
                  </p>
                  <div className="grid grid-cols-2 gap-1">
                    {[
                      { key: 'captions', label: 'Captions', icon: Captions },
                      { key: 'transcript', label: 'Transcript', icon: FileText },
                      { key: 'signLanguage', label: 'Sign Lang', icon: MessageCircle },
                      { key: 'visualAlerts', label: 'Visual Cues', icon: Eye }
                    ].map(({ key, label, icon: Icon }) => (
                      <div
                        key={key}
                        className={`flex items-center gap-1 text-xs p-1 rounded ${
                          item.features[key as keyof typeof item.features]
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-500'
                        }`}
                      >
                        <Icon size={12} />
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
                    className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500"
                    onClick={(e) => {
                      e.stopPropagation();
                      announceAction(`Playing ${item.title} with captions`);
                    }}
                  >
                    <Play size={14} className="mr-1" />
                    View
                  </Button>
                  
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      announceAction(`Downloading ${item.title}`);
                    }}
                  >
                    <Download size={14} />
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {filteredContent.length === 0 && (
          <Card className="p-12 text-center">
            <Ear size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-bold text-gray-600 mb-2">No content found</h3>
            <p className="text-gray-500">
              Try adjusting your search terms or filters to find accessible content.
            </p>
          </Card>
        )}

        {/* Help Section */}
        <Card className="p-6 mt-8 bg-green-50 border-green-200">
          <h3 className="text-lg font-bold text-green-800 mb-3 flex items-center gap-2">
            <Volume2 size={20} />
            Accessibility Features Guide
          </h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-green-700">
            <div>
              <p className="font-medium mb-1">🎬 Video Content:</p>
              <ul className="space-y-1 text-xs">
                <li>• Auto-generated captions with timing</li>
                <li>• Full video transcripts</li>
                <li>• Sign language interpretation (when available)</li>
                <li>• Visual sound indicators</li>
              </ul>
            </div>
            <div>
              <p className="font-medium mb-1">📄 Document Content:</p>
              <ul className="space-y-1 text-xs">
                <li>• Interactive text with visual cues</li>
                <li>• Structured content with clear headings</li>
                <li>• Image descriptions and alt-text</li>
                <li>• Downloadable formats</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}