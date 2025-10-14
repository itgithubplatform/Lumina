'use client';

import { useRouter } from 'nextjs-toploader/app';
import { motion } from 'framer-motion';
import { BookOpen, Shield, Clock, AudioWaveform, Eye, Brain, Users, Star, CheckCircle, Download } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import BubbleBlob from '@/components/ui/bubbleBlob';

export default function LandingPage() {
  const router = useRouter();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">

      <div className="container mx-auto px-4 py-8 pt-32">
        {/* Hero Section */}
        <BubbleBlob />
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center max-w-4xl mx-auto py-16 md:py-24 relative z-50"
        >
          <motion.h1
            variants={itemVariants}
            className="text-4xl md:text-6xl font-bold text-gray-900 mb-6"
          >
            Learning Made
            <span className="block text-blue-600">Accessible to All</span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed"
          >
            An inclusive education platform designed for every learner.
            Built-in accessibility features ensure everyone can learn in their own way.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
          >
            <Button
              onClick={() => router.push('/auth/signup')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg"
            >
              Start Learning Free
            </Button>
            <Button
              onClick={() => router.push('/auth/signin')}
              className="border !border-blue-600 !text-blue-600 hover:bg-blue-50 px-8 py-3 text-lg"
            >
              Sign In
            </Button>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            variants={itemVariants}
            className="flex flex-wrap justify-center gap-8 items-center text-gray-500"
          >
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-500" />
              <span>10,000+ learners</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-500" />
              <span>4.9/5 rating</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Features Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-6xl mx-auto py-16"
        >
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Built for Every Learner
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Our platform adapts to your needs with powerful accessibility features
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: AudioWaveform,
                title: 'Audio Support',
                description: 'Text-to-speech, audio descriptions, and voice commands for hands-free learning',
                features: ['Text-to-speech', 'Audio descriptions', 'Voice navigation']
              },
              {
                icon: Eye,
                title: 'Visual Support',
                description: 'High contrast modes, adjustable text sizes, and screen reader compatibility',
                features: ['High contrast', 'Large text', 'Screen reader ready']
              },
              {
                icon: Brain,
                title: 'Cognitive Support',
                description: 'Simplified layouts, focus mode, and step-by-step learning paths',
                features: ['Focus mode', 'Step-by-step', 'Simplified text']
              },
              {
                icon: Shield,
                title: 'Safe Environment',
                description: 'Inclusive, supportive learning space with privacy protection',
                features: ['Privacy focused', 'Inclusive', 'Supportive']
              },
              {
                icon: Clock,
                title: 'Self-Paced Learning',
                description: 'Learn at your own speed with flexible scheduling and progress tracking',
                features: ['Flexible scheduling', 'Progress tracking', 'Your own pace']
              },
              {
                icon: Download,
                title: 'Offline Access',
                description: 'Download materials and learn without internet connection',
                features: ['Download content', 'Learn offline', 'Sync progress']
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all"
              >
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-3">{feature.title}</h3>
                <p className="text-gray-600 text-sm mb-4 leading-relaxed">{feature.description}</p>
                <ul className="space-y-2">
                  {feature.features.map((item, idx) => (
                    <li key={idx} className="flex items-center text-sm text-gray-600">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto py-16 text-center"
        >
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-8 md:p-12 text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Start Learning?
            </h2>
            <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
              Join thousands of learners who are already experiencing accessible education
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => router.push('/auth/signup')}
                className="bg-white !text-blue-600 hover:bg-gray-100 px-8 py-3 text-lg font-semibold"
              >
                Create Free Account
              </Button>
              <Button
                onClick={() => router.push('/auth/signin')}
                className="border border-white/50 text-white hover:bg-white/10 px-8 py-3 text-lg !font-semibold"
              >
                Sign In
              </Button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-gray-600">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <div className="flex items-center">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center gap-3 cursor-pointer"
                  >
                    <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-base md:text-lg font-bold">L+</span>
                    </div>
                  </motion.div>
                </div>
              </div>
              <span className="text-xl font-bold text-gray-900">Lumina+</span>
            </div>
            <p className="mb-4">Making education accessible for all learners</p>
            <div className="flex justify-center gap-6 mt-4 flex-wrap">
              <button className="text-sm text-gray-500 hover:text-gray-700">Privacy Policy</button>
              <button className="text-sm text-gray-500 hover:text-gray-700">Terms of Service</button>
              <button className="text-sm text-gray-500 hover:text-gray-700">Support</button>
              <button className="text-sm text-gray-500 hover:text-gray-700">Contact</button>
            </div>
            <p className="mt-6 text-sm text-gray-500">© 2024 Lumina+. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}