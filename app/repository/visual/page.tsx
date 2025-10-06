'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Eye, 
  Volume2, 
  FileText, 
  Download, 
  Play,
  Headphones,
  Type,
  Contrast,
  Search,
  Filter
} from 'lucide-react';
import { useVoiceAccessibility } from '@/lib/voice-accessibility';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

interface AccessibleContent {
  id: string;
  title: string;
  type: 'video' | 'pdf' | 'document';
  originalTitle: string;
  teacher: string;
  subject: string;
  duration?: string;
  features: {
    tts: boolean;
    braille: boolean;
    highContrast: boolean;
    audioDescription: boolean;
  };
  uploadDate: string;
  audioUrl?: string;
}

export default function VisualRepository() {
  const { announceAction, speak, readContent } = useVoiceAccessibility();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  const [content] = useState<AccessibleContent[]>([
    {
      id: '1',
      title: 'Solar System Basics - Audio Narrated',
      type: 'video',
      originalTitle: 'Solar System Basics',
      teacher: 'Dr. Smith',
      subject: 'Science',
      duration: '15:30',
      features: {
        tts: true,
        braille: true,
        highContrast: true,
        audioDescription: true
      },
      uploadDate: '2024-01-15',
      audioUrl: '/audio/solar-system.mp3'
    },
    {
      id: '2',
      title: 'Mathematics Fundamentals - Braille Ready',
      type: 'pdf',
      originalTitle: 'Mathematics Fundamentals',
      teacher: 'Prof. Johnson',
      subject: 'Mathematics',
      features: {
        tts: true,
        braille: true,
        highContrast: true,
        audioDescription: false
      },
      uploadDate: '2024-01-14'
    },
    {
      id: '3',
      title: 'English Literature - Full Audio',
      type: 'document',
      originalTitle: 'English Literature Notes',
      teacher: 'Ms. Davis',
      subject: 'English',
      features: {
        tts: true,
        braille: false,
        highContrast: true,
        audioDescription: true
      },
      uploadDate: '2024-01-13'
    }
  ]);

  useEffect(() => {
    readContent('Visual accessibility repository loaded. All content includes text-to-speech narration, braille-ready formats, high contrast modes, and audio descriptions. Navigate using voice commands or keyboard shortcuts.');
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
    speak(`Loading ${content.title} with full visual accessibility features including text-to-speech narration and high contrast display`);
  };

  const playAudioDescription = (content: AccessibleContent) => {
    announceAction(`Playing audio description for ${content.title}`);
    speak(`Starting audio narration: ${content.title}. This content includes detailed audio descriptions of all visual elements.`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 pt-16">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white shadow-2xl">
            <motion.h1 
              className="text-4xl md:text-5xl font-black mb-4 flex items-center justify-center gap-3"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Eye size={48} />
              Visual Accessibility Repository
            </motion.h1>
            <p className="text-xl md:text-2xl text-white/90 font-medium mb-6">
              Content optimized with audio narration, braille support, and high contrast
            </p>
            
            {/* Feature Indicators */}
            <div className="flex flex-wrap justify-center gap-4">
              <div className="flex items-center gap-2 bg-white/20 rounded-full px-4 py-2">
                <Volume2 size={20} />
                <span className="text-sm font-medium">Text-to-Speech</span>
              </div>
              <div className="flex items-center gap-2 bg-white/20 rounded-full px-4 py-2">
                <Type size={20} />
                <span className="text-sm font-medium">Braille Ready</span>
              </div>
              <div className="flex items-center gap-2 bg-white/20 rounded-full px-4 py-2">
                <Contrast size={20} />
                <span className="text-sm font-medium">High Contrast</span>
              </div>
              <div className="flex items-center gap-2 bg-white/20 rounded-full px-4 py-2">
                <Headphones size={20} />
                <span className="text-sm font-medium">Audio Description</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Voice Navigation Help */}
        <Card className="p-4 mb-8 bg-blue-50 border-blue-200">
          <div className="flex items-center gap-3">
            <Volume2 size={20} className="text-blue-600" />
            <div className="text-sm text-blue-800">
              <strong>Voice Navigation:</strong> Say "play content", "search for [topic]", "filter videos", or "read description" to navigate hands-free.
            </div>
          </div>
        </Card>

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
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                aria-label="Search accessible content"
              />
            </div>
            
            <div className="flex gap-2">
              {['all', 'video', 'document'].map((filter) => (
                <Button
                  key={filter}
                  variant={selectedFilter === filter ? 'primary' : 'secondary'}
                  onClick={() => {
                    setSelectedFilter(filter);
                    announceAction(`Filter set to ${filter} content`);
                  }}
                  className="capitalize"
                  aria-label={`Filter by ${filter} content`}
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
                className="p-6 cursor-pointer hover:shadow-xl transition-all duration-300 border-2 border-gray-100 hover:border-blue-300 focus:ring-4 focus:ring-blue-300"
                onClick={() => handleContentSelect(item)}
                tabIndex={0}
                role="button"
                aria-label={`Open ${item.title} with audio narration and accessibility features`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    handleContentSelect(item);
                  }
                }}
              >
                {/* Content Type Icon */}
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg p-3">
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
                      { key: 'tts', label: 'Text-to-Speech', icon: Volume2 },
                      { key: 'braille', label: 'Braille Ready', icon: Type },
                      { key: 'highContrast', label: 'High Contrast', icon: Contrast },
                      { key: 'audioDescription', label: 'Audio Desc', icon: Headphones }
                    ].map(({ key, label, icon: Icon }) => (
                      <div
                        key={key}
                        className={`flex items-center gap-1 text-xs p-1 rounded ${
                          item.features[key as keyof typeof item.features]
                            ? 'bg-blue-100 text-blue-800'
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
                    className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-500"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleContentSelect(item);
                    }}
                    aria-label={`View ${item.title} with accessibility features`}
                  >
                    <Play size={14} className="mr-1" />
                    View
                  </Button>
                  
                  {item.features.audioDescription && (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        playAudioDescription(item);
                      }}
                      aria-label={`Play audio description for ${item.title}`}
                    >
                      <Headphones size={14} />
                    </Button>
                  )}
                  
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      announceAction(`Downloading ${item.title} in accessible format`);
                    }}
                    aria-label={`Download ${item.title} in accessible format`}
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
            <Eye size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-bold text-gray-600 mb-2">No content found</h3>
            <p className="text-gray-500">
              Try adjusting your search terms or filters to find accessible content.
            </p>
          </Card>
        )}

        {/* Accessibility Guide */}
        <Card className="p-6 mt-8 bg-blue-50 border-blue-200">
          <h3 className="text-lg font-bold text-blue-800 mb-3 flex items-center gap-2">
            <Headphones size={20} />
            Visual Accessibility Features Guide
          </h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-blue-700">
            <div>
              <p className="font-medium mb-1">🎧 Audio Features:</p>
              <ul className="space-y-1 text-xs">
                <li>• Full text-to-speech narration</li>
                <li>• Detailed audio descriptions</li>
                <li>• Adjustable playback speed</li>
                <li>• Voice navigation commands</li>
              </ul>
            </div>
            <div>
              <p className="font-medium mb-1">📄 Text Features:</p>
              <ul className="space-y-1 text-xs">
                <li>• Braille-ready document formats</li>
                <li>• High contrast display modes</li>
                <li>• Large font options</li>
                <li>• Screen reader optimization</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-blue-100 rounded-lg">
            <p className="text-xs text-blue-800">
              <strong>Keyboard Navigation:</strong> Use Tab to navigate, Enter to select, Space to play/pause, and Arrow keys to control playback.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}