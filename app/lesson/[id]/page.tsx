'use client';

import { useState, useEffect, useRef, type ChangeEvent } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  SkipBack,
  SkipForward,
  Download,
  FileText,
  Eye,
  Brain,
  Settings,
  ArrowLeft,
  Maximize,
  Minimize,
  RotateCcw,
  Search,
  Bookmark,
  Share,
  MessageCircle
} from 'lucide-react';
import { useAccessibility } from '@/lib/accessibility-context';
import { Button } from '@/components/ui/Button';

interface LessonContent {
  id: string;
  title: string;
  type: 'video' | 'pdf' | 'text';
  originalContent: string;
  simplifiedContent: string;
  transcript: string;
  audioUrl?: string;
  videoUrl?: string;
  duration: number;
  chapters: Array<{
    title: string;
    startTime: number;
    content: string;
  }>;
}

export default function LessonViewer() {
  const router = useRouter();
  const params = useParams();
  const { profile, settings, speak, updateSettings } = useAccessibility();
  const [lesson, setLesson] = useState<LessonContent | null>(null);
  const [currentView, setCurrentView] = useState<'original' | 'simplified' | 'transcript'>('original');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(1);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [focusedParagraph, setFocusedParagraph] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [highlightedText, setHighlightedText] = useState('');
  const [showCaptions, setShowCaptions] = useState(settings.captions);
  const [showTranscript, setShowTranscript] = useState(true);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Mock lesson data
  useEffect(() => {
    const mockLesson: LessonContent = {
      id: params.id as string,
      title: 'Introduction to Solar System',
      type: 'video',
      originalContent: `
        The Solar System is a gravitationally bound system of the Sun and the objects that orbit it, either directly or indirectly. 
        Of the objects that orbit the Sun directly, the largest are the eight planets, with the remainder being smaller objects, 
        the dwarf planets and small Solar System bodies. The Solar System formed 4.6 billion years ago from the gravitational 
        collapse of a giant interstellar molecular cloud. The vast majority of the system's mass is in the Sun, with the 
        majority of the remaining mass contained in Jupiter.
        
        The four smaller inner planets, Mercury, Venus, Earth and Mars, are terrestrial planets, being primarily composed 
        of rock and metal. The four outer planets are giant planets, being substantially more massive than the terrestrials. 
        The two largest planets, Jupiter and Saturn, are gas giants, being composed mainly of hydrogen and helium.
      `,
      simplifiedContent: `
        The Solar System is our space neighborhood. It has the Sun in the middle and planets that go around it.
        
        There are 8 planets:
        • Mercury - closest to the Sun
        • Venus - very hot
        • Earth - where we live
        • Mars - the red planet
        • Jupiter - biggest planet
        • Saturn - has rings
        • Uranus - tilted sideways
        • Neptune - farthest away
        
        The Sun is like a big ball of fire that gives us light and heat. All planets move around the Sun in circles.
      `,
      transcript: `
        [00:00] Welcome to today's lesson about the Solar System.
        [00:05] The Solar System is a gravitationally bound system of the Sun and the objects that orbit it.
        [00:15] Let's start with the Sun, which is at the center of our Solar System.
        [00:25] The Sun is a star that provides light and heat to all the planets.
        [00:35] There are eight planets in our Solar System, divided into two groups.
        [00:45] The inner planets are Mercury, Venus, Earth, and Mars.
        [00:55] These are called terrestrial planets because they're made of rock and metal.
        [01:05] The outer planets are Jupiter, Saturn, Uranus, and Neptune.
        [01:15] These are much larger and are called gas giants.
      `,
      audioUrl: '/audio/solar-system.mp3',
      videoUrl: '/video/solar-system.mp4',
      duration: 900, // 15 minutes
      chapters: [
        { title: 'Introduction', startTime: 0, content: 'Welcome to the Solar System lesson' },
        { title: 'The Sun', startTime: 120, content: 'Learning about our star' },
        { title: 'Inner Planets', startTime: 300, content: 'Mercury, Venus, Earth, Mars' },
        { title: 'Outer Planets', startTime: 600, content: 'Jupiter, Saturn, Uranus, Neptune' },
      ]
    };
    setLesson(mockLesson);
    
    // Auto-configure based on accessibility profile
    if (profile === 'visual') {
      setCurrentView('transcript');
      setShowTranscript(true);
    } else if (profile === 'cognitive') {
      setCurrentView('simplified');
    }
  }, [params.id, profile]);

  // Text-to-Speech for content
  const speakContent = (text: string) => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = settings.readingSpeed === 'slow' ? 0.7 : settings.readingSpeed === 'fast' ? 1.3 : 1;
      speechSynthesis.speak(utterance);
    }
  };

  // Auto-play audio for visual impairment
  useEffect(() => {
    if (profile === 'visual' && lesson) {
      speakContent(lesson.title + '. ' + getCurrentContent());
    }
  }, [lesson, currentView, profile]);

  const getCurrentContent = () => {
    if (!lesson) return '';
    switch (currentView) {
      case 'simplified': return lesson.simplifiedContent;
      case 'transcript': return lesson.transcript;
      default: return lesson.originalContent;
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSeek = (time: number) => {
    setCurrentTime(time);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
    }
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
    if (videoRef.current) {
      isPlaying ? videoRef.current.pause() : videoRef.current.play();
    }
    if (audioRef.current) {
      isPlaying ? audioRef.current.pause() : audioRef.current.play();
    }
    speak(isPlaying ? 'Paused' : 'Playing');
  };

  const handleSpeedChange = (speed: number) => {
    setPlaybackSpeed(speed);
    if (videoRef.current) videoRef.current.playbackRate = speed;
    if (audioRef.current) audioRef.current.playbackRate = speed;
    speak(`Playback speed set to ${speed}x`);
  };

  if (!lesson) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading lesson...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => router.back()}
                voiceCommand="Go back"
              >
                <ArrowLeft size={16} className="mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-xl font-bold text-gray-900">{lesson.title}</h1>
                <p className="text-sm text-gray-500">
                  Duration: {formatTime(lesson.duration)} • 
                  {profile === 'visual' && ' Audio narration enabled'}
                  {profile === 'hearing' && ' Captions enabled'}
                  {profile === 'cognitive' && ' Simplified mode'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="secondary" size="sm">
                <Bookmark size={16} className="mr-2" />
                Save
              </Button>
              <Button variant="secondary" size="sm">
                <Share size={16} className="mr-2" />
                Share
              </Button>
              <Button variant="secondary" size="sm">
                <Download size={16} className="mr-2" />
                Download
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Left Panel - Original Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* Video Player */}
            {lesson.type === 'video' && (
              <div className="bg-black rounded-xl overflow-hidden relative">
                <div className="w-full aspect-video bg-gradient-to-br from-blue-900 to-purple-900 flex items-center justify-center">
                  <div className="text-center text-white">
                    <Play size={48} className="mx-auto mb-4 opacity-75" />
                    <p className="text-lg font-medium">Solar System Video</p>
                    <p className="text-sm opacity-75">Click to play</p>
                  </div>
                </div>
                
                {/* Video Controls */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                  <div className="flex items-center gap-4 text-white">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={togglePlayPause}
                      className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                    >
                      {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                    </Button>
                    
                    <div className="flex-1">
                      <input
                        type="range"
                        min="0"
                        max={lesson.duration}
                        value={currentTime}
                        onChange={(e) => handleSeek(Number(e.target.value))}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs mt-1">
                        <span>{formatTime(currentTime)}</span>
                        <span>{formatTime(lesson.duration)}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <select
                        value={playbackSpeed}
                        onChange={(e) => handleSpeedChange(Number(e.target.value))}
                        className="bg-white/20 border border-white/30 rounded px-2 py-1 text-sm"
                      >
                        <option value={0.5}>0.5x</option>
                        <option value={0.75}>0.75x</option>
                        <option value={1}>1x</option>
                        <option value={1.25}>1.25x</option>
                        <option value={1.5}>1.5x</option>
                        <option value={2}>2x</option>
                      </select>
                      
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => setIsFullscreen(!isFullscreen)}
                        className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                      >
                        {isFullscreen ? <Minimize size={16} /> : <Maximize size={16} />}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Original Content */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-800">Original Content</h2>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => speakContent(lesson.originalContent)}
                  voiceCommand="Read original content"
                >
                  <Volume2 size={16} className="mr-2" />
                  Listen
                </Button>
              </div>
              
              <div className={`prose max-w-none ${settings.focusMode ? 'focus-mode' : ''}`}>
                {lesson.originalContent.split('\n\n').map((paragraph, index) => (
                  <p
                    key={index}
                    className={`mb-4 leading-relaxed ${
                      settings.focusMode && focusedParagraph === index ? 'focused' : ''
                    } ${highlightedText && paragraph.includes(highlightedText) ? 'bg-yellow-200' : ''}`}
                    onClick={() => settings.focusMode && setFocusedParagraph(index)}
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

            {/* Chapter Navigation */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Chapters</h3>
              <div className="space-y-2">
                {lesson.chapters.map((chapter, index) => (
                  <button
                    key={index}
                    onClick={() => handleSeek(chapter.startTime)}
                    className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">{chapter.title}</p>
                        <p className="text-sm text-gray-500">{chapter.content}</p>
                      </div>
                      <span className="text-sm text-gray-400">
                        {formatTime(chapter.startTime)}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right Panel - Adaptive Content */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* View Selector */}
            <div className="bg-white rounded-xl shadow-sm border p-4">
              <div className="flex items-center gap-2 mb-4">
                <h2 className="text-lg font-semibold text-gray-800">Adaptive View</h2>
                {profile === 'visual' && <Eye size={16} className="text-blue-500" />}
                {profile === 'hearing' && <Volume2 size={16} className="text-green-500" />}
                {profile === 'cognitive' && <Brain size={16} className="text-purple-500" />}
              </div>
              
              <div className="flex gap-2">
                <Button
                  variant={currentView === 'original' ? 'primary' : 'secondary'}
                  size="sm"
                  onClick={() => setCurrentView('original')}
                  voiceCommand="Show original content"
                >
                  <FileText size={16} className="mr-2" />
                  Original
                </Button>
                <Button
                  variant={currentView === 'simplified' ? 'primary' : 'secondary'}
                  size="sm"
                  onClick={() => setCurrentView('simplified')}
                  voiceCommand="Show simplified content"
                >
                  <Brain size={16} className="mr-2" />
                  Simplified
                </Button>
                <Button
                  variant={currentView === 'transcript' ? 'primary' : 'secondary'}
                  size="sm"
                  onClick={() => setCurrentView('transcript')}
                  voiceCommand="Show transcript"
                >
                  <MessageCircle size={16} className="mr-2" />
                  Transcript
                </Button>
              </div>
            </div>

            {/* Search in Content */}
            <div className="bg-white rounded-xl shadow-sm border p-4">
              <div className="relative">
                <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search in content..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setHighlightedText(e.target.value);
                  }}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>

            {/* Adaptive Content Display */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  {currentView === 'simplified' && 'Simplified Version'}
                  {currentView === 'transcript' && 'Interactive Transcript'}
                  {currentView === 'original' && 'Original Content'}
                </h3>
                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => speakContent(getCurrentContent())}
                    voiceCommand="Read current content"
                  >
                    <Volume2 size={16} />
                  </Button>
                  <Button variant="secondary" size="sm">
                    <Download size={16} />
                  </Button>
                </div>
              </div>

              <div className={`${settings.focusMode ? 'focus-mode' : ''}`}>
                {currentView === 'simplified' && (
                  <div className="space-y-4">
                    {lesson.simplifiedContent.split('\n\n').map((section, index) => (
                      <div
                        key={index}
                        className={`p-4 rounded-lg bg-blue-50 border-l-4 border-blue-400 ${
                          settings.focusMode && focusedParagraph === index ? 'focused' : ''
                        }`}
                        onClick={() => settings.focusMode && setFocusedParagraph(index)}
                      >
                        {section.includes('•') ? (
                          <ul className="space-y-2">
                            {section.split('•').filter(item => item.trim()).map((item, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <span className="text-blue-600 mt-1">•</span>
                                <span>{item.trim()}</span>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-lg leading-relaxed">{section}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {currentView === 'transcript' && (
                  <div className="space-y-2">
                    {lesson.transcript.split('\n').filter(line => line.trim()).map((line, index) => {
                      const timeMatch = line.match(/\[(\d{2}:\d{2})\]/);
                      const time = timeMatch ? timeMatch[1] : '';
                      const text = line.replace(/\[\d{2}:\d{2}\]/, '').trim();
                      
                      return (
                        <div
                          key={index}
                          className={`p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors ${
                            Math.floor(currentTime / 60) === parseInt(time.split(':')[0]) ? 'bg-primary-50 border-l-4 border-primary-400' : ''
                          }`}
                          onClick={() => {
                            const [mins, secs] = time.split(':').map(Number);
                            handleSeek(mins * 60 + secs);
                          }}
                        >
                          <div className="flex items-start gap-3">
                            <span className="text-sm text-primary-600 font-mono bg-primary-100 px-2 py-1 rounded">
                              {time}
                            </span>
                            <p className="flex-1 leading-relaxed">{text}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {currentView === 'original' && (
                  <div className="prose max-w-none">
                    {lesson.originalContent.split('\n\n').map((paragraph, index) => (
                      <p
                        key={index}
                        className={`mb-4 leading-relaxed ${
                          settings.focusMode && focusedParagraph === index ? 'focused' : ''
                        }`}
                        onClick={() => settings.focusMode && setFocusedParagraph(index)}
                      >
                        {paragraph}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Interactive Glossary */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Interactive Glossary</h3>
              <div className="space-y-3">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="font-medium text-gray-900">Solar System</p>
                  <p className="text-sm text-gray-600">A collection of planets, moons, and other objects that orbit around a star (the Sun).</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="font-medium text-gray-900">Terrestrial Planets</p>
                  <p className="text-sm text-gray-600">Rocky planets like Earth, Mars, Venus, and Mercury.</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="font-medium text-gray-900">Gas Giants</p>
                  <p className="text-sm text-gray-600">Large planets made mostly of gas, like Jupiter and Saturn.</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Hidden Audio Element for TTS */}
      <audio ref={audioRef} className="hidden" />
    </div>
  );
}