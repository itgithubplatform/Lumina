'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { GraduationCap, Users, Eye, Ear, Brain, ArrowRight, Play, Volume2 } from 'lucide-react';
import { useAccessibility } from '@/lib/accessibility-context';
import { useVoiceAccessibility } from '@/lib/voice-accessibility';
import { Button } from '@/components/ui/Button';

export default function LandingPage() {
  const router = useRouter();
  const { profile, role, setProfile, setRole, speak, settings } = useAccessibility();
  const { announceAction, announceNavigation, registerVoiceCommand } = useVoiceAccessibility();
  const [showAccessibilitySetup, setShowAccessibilitySetup] = useState(false);
  const [keyboardListening, setKeyboardListening] = useState(false);

  useEffect(() => {
    // Auto-speak welcome message for voice navigation users
    if (settings.voiceNavigation) {
      speak('Welcome to Lumina Plus. Say Student or Teacher to select your role.');
    }
    
    // Register voice commands for this page
    registerVoiceCommand('student', () => handleRoleSelection('student'));
    registerVoiceCommand('teacher', () => handleRoleSelection('teacher'));
    registerVoiceCommand('narration', () => handleAccessibilitySelection('visual'));
    registerVoiceCommand('visual', () => handleAccessibilitySelection('visual'));
    registerVoiceCommand('captions', () => handleAccessibilitySelection('hearing'));
    registerVoiceCommand('hearing', () => handleAccessibilitySelection('hearing'));
    registerVoiceCommand('simplified', () => handleAccessibilitySelection('cognitive'));
    registerVoiceCommand('cognitive', () => handleAccessibilitySelection('cognitive'));
    registerVoiceCommand('standard', () => handleAccessibilitySelection('none'));
    registerVoiceCommand('none', () => handleAccessibilitySelection('none'));
  }, [settings.voiceNavigation]);

  const handleRoleSelection = (selectedRole: 'student' | 'teacher') => {
    setRole(selectedRole);
    setShowAccessibilitySetup(true);
    setKeyboardListening(true);
    speak(`${selectedRole} role selected. How can we support your learning? Press 1 for Narration support, Press 2 for Captions, Press 3 for Simplified Text. Or say Narration, Captions, or Simplified.`);
    announceAction(`Role selected: ${selectedRole}. Now choose accessibility profile.`);
  };

  // Keyboard shortcuts for accessibility
  useEffect(() => {
    if (!keyboardListening) return;
    
    const handleKeyPress = (event: KeyboardEvent) => {
      switch(event.key) {
        case '1':
          handleAccessibilitySelection('visual');
          break;
        case '2':
          handleAccessibilitySelection('hearing');
          break;
        case '3':
          handleAccessibilitySelection('cognitive');
          break;
        case '4':
          handleAccessibilitySelection('none');
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [keyboardListening]);

  // Enhanced voice commands
  useEffect(() => {
    if (!keyboardListening) return;
    
    const handleVoiceCommands = () => {
      if ('webkitSpeechRecognition' in window) {
        const recognition = new (window as any).webkitSpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = false;
        
        recognition.onresult = (event: any) => {
          const transcript = event.results[event.results.length - 1][0].transcript.toLowerCase();
          
          if (transcript.includes('narration') || transcript.includes('visual')) {
            handleAccessibilitySelection('visual');
          } else if (transcript.includes('captions') || transcript.includes('hearing')) {
            handleAccessibilitySelection('hearing');
          } else if (transcript.includes('simplified') || transcript.includes('cognitive')) {
            handleAccessibilitySelection('cognitive');
          } else if (transcript.includes('standard') || transcript.includes('none')) {
            handleAccessibilitySelection('none');
          }
        };
        
        recognition.start();
        
        return () => recognition.stop();
      }
    };
    
    const cleanup = handleVoiceCommands();
    return cleanup;
  }, [keyboardListening]);

  const handleAccessibilitySelection = (selectedProfile: typeof profile) => {
    setProfile(selectedProfile);
    setKeyboardListening(false);
    speak(`${selectedProfile} accessibility profile selected. Redirecting to dashboard.`);
    announceNavigation(`${role} dashboard with ${selectedProfile} accessibility`);
    setTimeout(() => {
      router.push('/dashboard');
    }, 1000);
  };

  const accessibilityOptions = [
    {
      id: 'visual' as const,
      title: 'Visual Impairment',
      description: 'Voice navigation, high contrast, screen reader support',
      icon: Eye,
      features: ['🎧 Voice Navigation', '🔊 Text-to-Speech', '⚫ High Contrast', '🔍 Large Text'],
      color: 'bg-blue-500',
    },
    {
      id: 'hearing' as const,
      title: 'Hearing Impairment',
      description: 'Captions, transcripts, visual indicators',
      icon: Ear,
      features: ['📝 Auto Captions', '📄 Transcripts', '👋 Sign Language', '💬 Visual Alerts'],
      color: 'bg-green-500',
    },
    {
      id: 'cognitive' as const,
      title: 'Cognitive Support',
      description: 'Simplified text, focus mode, dyslexia-friendly fonts',
      icon: Brain,
      features: ['✍️ Simple Text', '🎯 Focus Mode', '📖 Dyslexia Font', '🐌 Slow Reading'],
      color: 'bg-purple-500',
    },
    {
      id: 'none' as const,
      title: 'No Special Needs',
      description: 'Standard interface with optional accessibility features',
      icon: Users,
      features: ['📱 Standard UI', '⚙️ Custom Settings', '🔧 Optional Tools', '🚀 Full Features'],
      color: 'bg-gray-500',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 right-4 w-72 h-72 bg-yellow-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
        <div className="absolute bottom-20 right-20 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-6000"></div>
      </div>
      
      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 4}s`
            }}
          >
            <div className="w-2 h-2 bg-white rounded-full opacity-30"></div>
          </div>
        ))}
      </div>

      {/* Hero Section */}
      <div className="relative z-10 container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="text-center mb-16"
        >
          <motion.div 
            className="flex justify-center mb-8"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 1, delay: 0.2, type: "spring", stiffness: 200 }}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 rounded-full blur-lg opacity-75 animate-pulse"></div>
              <Image
                src="/logo.png"
                alt="Lumina+ Logo"
                width={140}
                height={140}
                className="relative rounded-full shadow-2xl border-4 border-white/20 backdrop-blur-sm"
              />
            </div>
          </motion.div>
          
          <motion.h1 
            className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-300 bg-clip-text text-transparent drop-shadow-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Lumina<span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent animate-pulse">+</span>
          </motion.h1>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mb-8"
          >
            <p className="text-2xl md:text-3xl lg:text-4xl text-white font-bold mb-4 drop-shadow-lg">
              ✨ Lighting the way for every learner ✨
            </p>
            
            <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-2xl">
              <p className="text-lg md:text-xl text-white/90 leading-relaxed">
                🚀 Bridging barriers in education through technology, making learning accessible, 
                engaging, and empowering for differently-abled students.
              </p>
            </div>
          </motion.div>
          
          {/* Animated Feature Icons */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex justify-center gap-8 mb-8"
          >
            {[
              { icon: '🎧', label: 'Audio' },
              { icon: '📝', label: 'Captions' },
              { icon: '🧠', label: 'Smart AI' },
              { icon: '♿', label: 'Accessible' }
            ].map((item, index) => (
              <motion.div
                key={index}
                className="flex flex-col items-center"
                whileHover={{ scale: 1.2, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="text-4xl mb-2 filter drop-shadow-lg">{item.icon}</div>
                <span className="text-white/80 text-sm font-medium">{item.label}</span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {!showAccessibilitySetup ? (
          /* Role Selection */
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="max-w-5xl mx-auto"
          >
            <motion.h2 
              className="text-4xl md:text-5xl font-black text-center mb-12 text-white drop-shadow-2xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.2 }}
            >
              🎯 Choose Your Role
            </motion.h2>
            
            <div className="grid md:grid-cols-2 gap-10">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 1.4 }}
                whileHover={{ scale: 1.05, y: -10 }}
                whileTap={{ scale: 0.95 }}
                className="group bg-gradient-to-br from-blue-500/20 to-purple-600/20 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/30 cursor-pointer transition-all duration-500 hover:shadow-blue-500/25 hover:border-blue-400/50"
                onClick={() => handleRoleSelection('student')}
              >
                <div className="text-center">
                  <motion.div 
                    className="bg-gradient-to-r from-blue-400 to-purple-500 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6 shadow-2xl group-hover:shadow-blue-500/50 transition-all duration-300"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <GraduationCap size={48} className="text-white drop-shadow-lg" />
                  </motion.div>
                  <h3 className="text-3xl font-black mb-4 text-white drop-shadow-lg group-hover:text-blue-300 transition-colors duration-300">
                    🎓 I am a Student
                  </h3>
                  <p className="text-white/90 mb-6 leading-relaxed text-lg">
                    Access personalized learning materials with adaptive accessibility features 
                    tailored to your needs.
                  </p>
                  <div className="space-y-3 text-white/80 mb-8">
                    <div className="flex items-center justify-center gap-2 text-lg">
                      <span className="text-2xl">📚</span> View accessible lessons
                    </div>
                    <div className="flex items-center justify-center gap-2 text-lg">
                      <span className="text-2xl">🎧</span> Audio narration
                    </div>
                    <div className="flex items-center justify-center gap-2 text-lg">
                      <span className="text-2xl">📝</span> Interactive transcripts
                    </div>
                    <div className="flex items-center justify-center gap-2 text-lg">
                      <span className="text-2xl">🎯</span> Focus mode
                    </div>
                  </div>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button variant="primary" size="lg" className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-4 text-lg shadow-2xl border-0">
                      Continue as Student <ArrowRight size={24} className="ml-2" />
                    </Button>
                  </motion.div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 1.6 }}
                whileHover={{ scale: 1.05, y: -10 }}
                whileTap={{ scale: 0.95 }}
                className="group bg-gradient-to-br from-green-500/20 to-emerald-600/20 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/30 cursor-pointer transition-all duration-500 hover:shadow-green-500/25 hover:border-green-400/50"
                onClick={() => handleRoleSelection('teacher')}
              >
                <div className="text-center">
                  <motion.div 
                    className="bg-gradient-to-r from-green-400 to-emerald-500 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6 shadow-2xl group-hover:shadow-green-500/50 transition-all duration-300"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <Users size={48} className="text-white drop-shadow-lg" />
                  </motion.div>
                  <h3 className="text-3xl font-black mb-4 text-white drop-shadow-lg group-hover:text-green-300 transition-colors duration-300">
                    👨‍🏫 I am a Teacher
                  </h3>
                  <p className="text-white/90 mb-6 leading-relaxed text-lg">
                    Upload and manage educational content with automatic accessibility 
                    features for all students.
                  </p>
                  <div className="space-y-3 text-white/80 mb-8">
                    <div className="flex items-center justify-center gap-2 text-lg">
                      <span className="text-2xl">📤</span> Upload lessons
                    </div>
                    <div className="flex items-center justify-center gap-2 text-lg">
                      <span className="text-2xl">🤖</span> Auto-generate captions
                    </div>
                    <div className="flex items-center justify-center gap-2 text-lg">
                      <span className="text-2xl">📊</span> Track student progress
                    </div>
                    <div className="flex items-center justify-center gap-2 text-lg">
                      <span className="text-2xl">🎨</span> Accessibility presets
                    </div>
                  </div>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button variant="primary" size="lg" className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-4 text-lg shadow-2xl border-0">
                      Continue as Teacher <ArrowRight size={24} className="ml-2" />
                    </Button>
                  </motion.div>
                </div>
              </motion.div>
            </div>

            {/* Voice Command Hint */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.8 }}
              className="text-center mt-12 p-6 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 backdrop-blur-xl rounded-2xl border border-yellow-300/30 shadow-2xl"
            >
              <p className="text-white text-lg">
                🎤 <strong>Voice Navigation:</strong> Say "Student" or "Teacher" to select your role
              </p>
            </motion.div>
            
            {/* Authentication Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2 }}
              className="text-center mt-8"
            >
              <p className="text-white/90 mb-6 text-lg">Already have an account?</p>
              <div className="flex gap-6 justify-center">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="secondary"
                    onClick={() => router.push('/auth/signin')}
                    voiceCommand="Sign in"
                    className="bg-white/20 backdrop-blur-md border-white/30 text-white hover:bg-white/30 px-8 py-3 text-lg font-semibold"
                  >
                    Sign In
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="primary"
                    onClick={() => router.push('/auth/signup')}
                    voiceCommand="Sign up"
                    className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-8 py-3 text-lg font-semibold border-0 shadow-2xl"
                  >
                    Sign Up
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        ) : (
          /* Accessibility Setup */
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-6xl mx-auto"
          >
            <h2 className="text-3xl font-bold text-center mb-4 text-gray-800">
              How can we support your learning?
            </h2>
            <p className="text-center text-gray-600 mb-4">
              Choose your accessibility needs to personalize your experience
            </p>
            
            {/* Keyboard & Voice Instructions */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-center">
              <p className="text-blue-800 font-medium mb-2">🎯 Quick Selection Options:</p>
              <div className="grid md:grid-cols-2 gap-4 text-sm text-blue-700">
                <div>
                  <p><strong>Keyboard:</strong> Press 1, 2, 3, or 4</p>
                  <p>1️⃣ Narration • 2️⃣ Captions • 3️⃣ Simplified • 4️⃣ Standard</p>
                </div>
                <div>
                  <p><strong>Voice:</strong> Say your preference</p>
                  <p>"Narration" • "Captions" • "Simplified" • "Standard"</p>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {accessibilityOptions.map((option) => (
                <motion.div
                  key={option.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`bg-white rounded-xl shadow-lg p-6 cursor-pointer border-2 transition-all duration-300 ${
                    profile === option.id ? 'border-primary-500 ring-4 ring-primary-200' : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => handleAccessibilitySelection(option.id)}
                >
                  <div className="text-center">
                    <div className={`${option.color} rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 relative`}>
                      <option.icon size={32} className="text-white" />
                      <span className="absolute -top-2 -right-2 bg-white text-gray-800 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold border-2">
                        {option.id === 'visual' ? '1' : option.id === 'hearing' ? '2' : option.id === 'cognitive' ? '3' : '4'}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold mb-2 text-gray-800">{option.title}</h3>
                    <p className="text-sm text-gray-600 mb-4">{option.description}</p>
                    <div className="space-y-1">
                      {option.features.map((feature, index) => (
                        <div key={index} className="text-xs text-gray-500">{feature}</div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="text-center mt-8">
              <p className="text-gray-500 mb-4">You can change these settings anytime from the accessibility toolbar</p>
              <Button
                variant="secondary"
                onClick={() => setShowAccessibilitySetup(false)}
              >
                ← Back to Role Selection
              </Button>
            </div>
          </motion.div>
        )}

        {/* Features Preview */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 2.2 }}
          className="mt-20 max-w-6xl mx-auto"
        >
          <motion.h2 
            className="text-4xl md:text-5xl font-black text-center mb-16 text-white drop-shadow-2xl"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 2.4 }}
          >
            🤖 Powered by AI Accessibility
          </motion.h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Play,
                title: 'Speech-to-Text',
                description: 'Auto-generate transcripts from videos and lectures',
                gradient: 'from-blue-400 to-cyan-400',
                delay: 2.6
              },
              {
                icon: Volume2,
                title: 'Text-to-Speech',
                description: 'Narration for all content with adjustable speed',
                gradient: 'from-green-400 to-emerald-400',
                delay: 2.8
              },
              {
                icon: Brain,
                title: 'AI Simplification',
                description: 'Simplified summaries for cognitive accessibility',
                gradient: 'from-purple-400 to-pink-400',
                delay: 3.0
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6, delay: feature.delay }}
                whileHover={{ scale: 1.05, y: -10 }}
                className="group text-center p-8 bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 hover:border-white/40 transition-all duration-300"
              >
                <motion.div 
                  className={`bg-gradient-to-r ${feature.gradient} rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 shadow-2xl group-hover:shadow-lg transition-all duration-300`}
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <feature.icon size={32} className="text-white drop-shadow-lg" />
                </motion.div>
                <h3 className="font-black mb-4 text-white text-xl group-hover:text-yellow-300 transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-white/80 leading-relaxed group-hover:text-white transition-colors duration-300">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
      
      {/* Bottom Gradient Overlay */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
    </div>
  );
}