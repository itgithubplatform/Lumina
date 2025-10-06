'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { GraduationCap, Users, Eye, Ear, Brain, ArrowRight, Play, Volume2, Sparkles, Zap, Star } from 'lucide-react';
import { useAccessibility } from '@/lib/accessibility-context';
import { useVoiceAccessibility } from '@/lib/voice-accessibility';
import { Button } from '@/components/ui/Button';

export default function LandingPage() {
  const router = useRouter();
  const { profile, role, setProfile, setRole, speak, settings } = useAccessibility();
  const { announceAction, announceNavigation, registerVoiceCommand } = useVoiceAccessibility();
  const [showAccessibilitySetup, setShowAccessibilitySetup] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleRoleSelection = (selectedRole: 'student' | 'teacher') => {
    setRole(selectedRole);
    setShowAccessibilitySetup(true);
    speak(`${selectedRole} role selected.`);
  };

  const handleAccessibilitySelection = (selectedProfile: typeof profile) => {
    setProfile(selectedProfile);
    speak(`${selectedProfile} accessibility profile selected.`);
    setTimeout(() => {
      router.push('/dashboard');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-900 to-teal-800 relative overflow-hidden">
      
      {/* Dynamic Mouse-Following Gradient */}
      <div 
        className="absolute w-96 h-96 bg-gradient-to-r from-emerald-400/30 to-teal-400/30 rounded-full blur-3xl transition-all duration-1000 ease-out"
        style={{
          left: mousePosition.x - 192,
          top: mousePosition.y - 192,
        }}
      />
      
      {/* Geometric Background Pattern */}
      <div className="absolute inset-0">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-32 h-32 border border-emerald-400/20 rotate-45"
            style={{
              left: `${(i % 4) * 25}%`,
              top: `${Math.floor(i / 4) * 33}%`,
            }}
            animate={{
              rotate: [45, 225, 45],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 8 + i,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      {/* Floating Orbs */}
      <div className="absolute inset-0">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-4 h-4 bg-gradient-to-r from-emerald-300 to-teal-300 rounded-full shadow-lg"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [-20, 20, -20],
              x: [-10, 10, -10],
              opacity: [0.3, 1, 0.3],
            }}
            transition={{
              duration: 4 + Math.random() * 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.5
            }}
          />
        ))}
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="text-center mb-20"
        >
          
          {/* Logo */}
          <motion.div 
            className="flex justify-center mb-8"
            initial={{ scale: 0, rotateY: 180 }}
            animate={{ scale: 1, rotateY: 0 }}
            transition={{ duration: 1, delay: 0.3, type: "spring" }}
          >
            <div className="relative">
              <motion.div 
                className="w-24 h-24 bg-gradient-to-br from-emerald-400 via-teal-400 to-cyan-400 rounded-2xl flex items-center justify-center shadow-2xl"
                whileHover={{ 
                  scale: 1.1, 
                  rotateY: 180,
                  boxShadow: "0 25px 50px -12px rgba(16, 185, 129, 0.5)"
                }}
                transition={{ duration: 0.6 }}
              >
                <span className="text-white text-3xl font-black">L+</span>
              </motion.div>
              <motion.div
                className="absolute -inset-2 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-2xl opacity-20 blur-xl"
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              />
            </div>
          </motion.div>
          
          {/* Title */}
          <motion.h1 
            className="text-7xl md:text-8xl font-black mb-6 text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-teal-300 to-cyan-300"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            Lumina<motion.span 
              className="inline-block text-yellow-400"
              animate={{ rotate: [0, 15, -15, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >+</motion.span>
          </motion.h1>
          
          {/* Tagline */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="mb-12"
          >
            <p className="text-2xl md:text-3xl text-emerald-100 font-light mb-6 leading-relaxed">
              Where <span className="font-bold text-yellow-400">accessibility</span> meets <span className="font-bold text-teal-300">innovation</span>
            </p>
            
            <div className="max-w-3xl mx-auto bg-slate-800/40 backdrop-blur-xl rounded-3xl p-6 border border-emerald-400/20">
              <p className="text-lg text-emerald-50/90">
                🌟 Transforming education through AI-powered accessibility tools that adapt to every learner's unique needs
              </p>
            </div>
          </motion.div>

          {/* Feature Pills */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="flex flex-wrap justify-center gap-4 mb-12"
          >
            {[
              { icon: '🎯', text: 'Smart AI', color: 'from-emerald-400 to-teal-400' },
              { icon: '🎧', text: 'Audio First', color: 'from-teal-400 to-cyan-400' },
              { icon: '👁️', text: 'Visual Support', color: 'from-cyan-400 to-blue-400' },
              { icon: '🧠', text: 'Cognitive Aid', color: 'from-blue-400 to-indigo-400' }
            ].map((item, index) => (
              <motion.div
                key={index}
                className={`px-6 py-3 bg-gradient-to-r ${item.color} rounded-full text-white font-semibold shadow-lg`}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1 + index * 0.1 }}
              >
                <span className="mr-2">{item.icon}</span>
                {item.text}
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {!showAccessibilitySetup ? (
          /* Role Selection */
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="max-w-6xl mx-auto"
          >
            <motion.h2 
              className="text-4xl md:text-5xl font-bold text-center mb-16 text-emerald-100"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.4 }}
            >
              Choose Your Learning Journey
            </motion.h2>
            
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              
              {/* Student Card */}
              <motion.div
                whileHover={{ 
                  scale: 1.02, 
                  y: -8,
                  boxShadow: "0 25px 50px -12px rgba(16, 185, 129, 0.3)"
                }}
                whileTap={{ scale: 0.98 }}
                className="group relative bg-gradient-to-br from-slate-800/60 to-emerald-900/60 backdrop-blur-xl rounded-3xl p-8 border border-emerald-400/30 cursor-pointer overflow-hidden"
                onClick={() => handleRoleSelection('student')}
              >
                {/* Animated Background */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-emerald-400/10 to-teal-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                />
                
                <div className="relative z-10">
                  <motion.div 
                    className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl"
                    whileHover={{ rotateY: 180 }}
                    transition={{ duration: 0.6 }}
                  >
                    <GraduationCap size={40} className="text-white" />
                  </motion.div>
                  
                  <h3 className="text-3xl font-bold text-center mb-4 text-emerald-100 group-hover:text-emerald-300 transition-colors">
                    Student Portal
                  </h3>
                  
                  <p className="text-emerald-100/80 text-center mb-6 leading-relaxed">
                    Access personalized learning with adaptive accessibility features tailored to your unique needs
                  </p>
                  
                  <div className="space-y-3 mb-8">
                    {[
                      '📚 Interactive Learning Materials',
                      '🎧 AI-Powered Audio Narration', 
                      '📝 Smart Transcription Tools',
                      '🎯 Personalized Study Plans'
                    ].map((feature, i) => (
                      <motion.div
                        key={i}
                        className="flex items-center text-emerald-100/90"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1.6 + i * 0.1 }}
                      >
                        <span className="mr-3">{feature.split(' ')[0]}</span>
                        <span>{feature.substring(feature.indexOf(' ') + 1)}</span>
                      </motion.div>
                    ))}
                  </div>
                  
                  <Button 
                    variant="primary" 
                    className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 border-0 py-4 text-lg font-semibold"
                  >
                    Start Learning <ArrowRight size={20} className="ml-2" />
                  </Button>
                </div>
              </motion.div>

              {/* Teacher Card */}
              <motion.div
                whileHover={{ 
                  scale: 1.02, 
                  y: -8,
                  boxShadow: "0 25px 50px -12px rgba(20, 184, 166, 0.3)"
                }}
                whileTap={{ scale: 0.98 }}
                className="group relative bg-gradient-to-br from-slate-800/60 to-teal-900/60 backdrop-blur-xl rounded-3xl p-8 border border-teal-400/30 cursor-pointer overflow-hidden"
                onClick={() => handleRoleSelection('teacher')}
              >
                {/* Animated Background */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-teal-400/10 to-cyan-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                />
                
                <div className="relative z-10">
                  <motion.div 
                    className="w-20 h-20 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl"
                    whileHover={{ rotateY: 180 }}
                    transition={{ duration: 0.6 }}
                  >
                    <Users size={40} className="text-white" />
                  </motion.div>
                  
                  <h3 className="text-3xl font-bold text-center mb-4 text-teal-100 group-hover:text-teal-300 transition-colors">
                    Teacher Hub
                  </h3>
                  
                  <p className="text-teal-100/80 text-center mb-6 leading-relaxed">
                    Create and manage accessible content with AI-powered tools that automatically adapt for all learners
                  </p>
                  
                  <div className="space-y-3 mb-8">
                    {[
                      '📤 Smart Content Upload',
                      '🤖 Auto-Generate Accessibility', 
                      '📊 Student Progress Analytics',
                      '🎨 Customizable Learning Paths'
                    ].map((feature, i) => (
                      <motion.div
                        key={i}
                        className="flex items-center text-teal-100/90"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1.6 + i * 0.1 }}
                      >
                        <span className="mr-3">{feature.split(' ')[0]}</span>
                        <span>{feature.substring(feature.indexOf(' ') + 1)}</span>
                      </motion.div>
                    ))}
                  </div>
                  
                  <Button 
                    variant="primary" 
                    className="w-full bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 border-0 py-4 text-lg font-semibold"
                  >
                    Create Content <ArrowRight size={20} className="ml-2" />
                  </Button>
                </div>
              </motion.div>
            </div>

            {/* Auth Links */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2 }}
              className="text-center mt-16"
            >
              <p className="text-emerald-100/80 mb-6">Already have an account?</p>
              <div className="flex gap-4 justify-center">
                <Button
                  variant="secondary"
                  onClick={() => router.push('/auth/signin')}
                  className="bg-slate-800/60 border-emerald-400/30 text-emerald-100 hover:bg-slate-700/60"
                >
                  Sign In
                </Button>
                <Button
                  variant="primary"
                  onClick={() => router.push('/auth/signup')}
                  className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 border-0"
                >
                  Sign Up
                </Button>
              </div>
            </motion.div>
          </motion.div>
        ) : (
          /* Accessibility Setup */
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="max-w-5xl mx-auto"
          >
            <h2 className="text-3xl font-bold text-center mb-8 text-emerald-100">
              Customize Your Experience
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { id: 'visual', title: 'Visual Support', icon: Eye, desc: 'Audio narration & high contrast', color: 'from-blue-400 to-indigo-500' },
                { id: 'hearing', title: 'Hearing Support', icon: Ear, desc: 'Captions & visual alerts', color: 'from-emerald-400 to-teal-500' },
                { id: 'cognitive', title: 'Cognitive Support', icon: Brain, desc: 'Simplified text & focus mode', color: 'from-purple-400 to-pink-500' },
                { id: 'none', title: 'Standard Mode', icon: Users, desc: 'Full-featured interface', color: 'from-gray-400 to-slate-500' }
              ].map((option, index) => (
                <motion.div
                  key={option.id}
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-slate-800/60 backdrop-blur-xl rounded-2xl p-6 border border-emerald-400/20 cursor-pointer text-center"
                  onClick={() => handleAccessibilitySelection(option.id as any)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className={`w-16 h-16 bg-gradient-to-r ${option.color} rounded-xl flex items-center justify-center mx-auto mb-4`}>
                    <option.icon size={28} className="text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-emerald-100 mb-2">{option.title}</h3>
                  <p className="text-emerald-100/70 text-sm">{option.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Bottom Features */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 2.5 }}
          className="mt-24 text-center"
        >
          <h3 className="text-2xl font-bold text-emerald-100 mb-8">Powered by Advanced AI</h3>
          <div className="flex justify-center gap-8 flex-wrap">
            {[
              { icon: Play, title: 'Speech-to-Text' },
              { icon: Volume2, title: 'Text-to-Speech' },
              { icon: Brain, title: 'Smart Summaries' }
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="flex items-center gap-3 bg-slate-800/40 rounded-full px-6 py-3"
                whileHover={{ scale: 1.05 }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 2.7 + index * 0.1 }}
              >
                <feature.icon size={20} className="text-emerald-400" />
                <span className="text-emerald-100">{feature.title}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}