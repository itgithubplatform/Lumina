'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, User, ArrowLeft, GraduationCap, Users } from 'lucide-react';
import { useAccessibility } from '@/lib/accessibility-context';
import { Button } from '@/components/ui/Button';

export default function SignUp() {
  const router = useRouter();
  const { speak, settings } = useAccessibility();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: '' as 'student' | 'teacher' | '',
    agreeToTerms: false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      speak('Passwords do not match. Please check and try again.');
      return;
    }
    
    if (!formData.agreeToTerms) {
      speak('Please agree to the terms and conditions.');
      return;
    }

    speak('Creating your account...');
    // Mock registration
    setTimeout(() => {
      speak('Account created successfully. Redirecting to accessibility setup.');
      router.push('/');
    }, 1000);
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (settings.voiceNavigation && typeof value === 'string') {
      speak(`${field} field updated`);
    }
  };
  
  // Enhanced accessibility for visually impaired
  React.useEffect(() => {
    // Auto-announce page content for screen readers
    if (settings.voiceNavigation) {
      speak('Sign up page loaded. Fill in your details to create a new Lumina Plus account. Use Tab to navigate between fields, or press Enter to move to the next field.');
    }
    
    // Keyboard navigation enhancement
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'Enter' && event.target instanceof HTMLInputElement) {
        const form = event.target.closest('form');
        if (form) {
          const inputs = Array.from(form.querySelectorAll('input[required]')) as HTMLInputElement[];
          const currentIndex = inputs.indexOf(event.target);
          
          if (currentIndex < inputs.length - 1) {
            inputs[currentIndex + 1].focus();
            speak(`Moved to ${inputs[currentIndex + 1].getAttribute('aria-label')} field`);
          }
        }
      }
    };
    
    document.addEventListener('keypress', handleKeyPress);
    return () => document.removeEventListener('keypress', handleKeyPress);
  }, [settings.voiceNavigation]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-2xl shadow-xl p-8 border">
          {/* Header */}
          <div className="text-center mb-8">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => router.back()}
              className="mb-4"
              voiceCommand="Go back"
            >
              <ArrowLeft size={16} className="mr-2" />
              Back
            </Button>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Join Lumina+</h1>
            <p className="text-gray-600">Create your account to start learning</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <div className="relative">
                <User size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  id="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  onFocus={() => speak('Full name field focused. Enter your first and last name.')}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-lg"
                  placeholder="Enter your full name"
                  aria-label="Full name input field"
                  aria-describedby="name-help"
                  autoComplete="name"
                />
                <div id="name-help" className="sr-only">
                  Enter your full name as you would like it to appear in your Lumina Plus account
                </div>
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  onFocus={() => speak('Email address field focused. Enter a valid email address.')}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-lg"
                  placeholder="Enter your email"
                  aria-label="Email address input field"
                  aria-describedby="email-help"
                  autoComplete="email"
                />
                <div id="email-help" className="sr-only">
                  Enter your email address. This will be used to sign in to your account and receive important updates.
                </div>
              </div>
            </div>

            {/* Role Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                I am a...
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    handleInputChange('role', 'student');
                    speak('Student role selected. You will access personalized learning materials.');
                  }}
                  className={`p-4 border-2 rounded-lg transition-all ${
                    formData.role === 'student' 
                      ? 'border-primary-500 bg-primary-50 text-primary-700' 
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                  aria-label="Select student role - access personalized learning materials"
                  aria-pressed={formData.role === 'student'}
                  aria-describedby="student-help"
                >
                  <GraduationCap size={24} className="mx-auto mb-2" />
                  <span className="text-sm font-medium">Student</span>
                  <div id="student-help" className="sr-only">
                    Choose this if you are a student who wants to access learning materials with accessibility features
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleInputChange('role', 'teacher');
                    speak('Teacher role selected. You will be able to upload and manage educational content.');
                  }}
                  className={`p-4 border-2 rounded-lg transition-all ${
                    formData.role === 'teacher' 
                      ? 'border-green-500 bg-green-50 text-green-700' 
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                  aria-label="Select teacher role - upload and manage educational content"
                  aria-pressed={formData.role === 'teacher'}
                  aria-describedby="teacher-help"
                >
                  <Users size={24} className="mx-auto mb-2" />
                  <span className="text-sm font-medium">Teacher</span>
                  <div id="teacher-help" className="sr-only">
                    Choose this if you are a teacher who wants to upload lessons and create accessible content for students
                  </div>
                </button>
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Create a password"
                  aria-label="Password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Confirm your password"
                  aria-label="Confirm password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Terms Agreement */}
            <div className="flex items-start">
              <input
                id="agreeToTerms"
                type="checkbox"
                required
                checked={formData.agreeToTerms}
                onChange={(e) => {
                  handleInputChange('agreeToTerms', e.target.checked);
                  speak(e.target.checked ? 'Terms and conditions accepted' : 'Terms and conditions unchecked');
                }}
                onFocus={() => speak('Terms and conditions checkbox. You must agree to continue.')}
                className="mt-1 rounded border-gray-300 text-primary-600 focus:ring-primary-500 w-4 h-4"
                aria-describedby="terms-help"
              />
              <div id="terms-help" className="sr-only">
                You must agree to the Terms of Service and Privacy Policy to create an account
              </div>
              <label htmlFor="agreeToTerms" className="ml-3 text-sm text-gray-600">
                I agree to the{' '}
                <Link href="/terms" className="text-primary-600 hover:text-primary-700">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="/privacy" className="text-primary-600 hover:text-primary-700">
                  Privacy Policy
                </Link>
              </label>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              voiceCommand="Create account"
            >
              Create Account
            </Button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="px-4 text-sm text-gray-500">or</span>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>

          {/* Social Login */}
          <div className="space-y-3">
            <Button 
              variant="secondary" 
              size="lg" 
              className="w-full flex items-center justify-center gap-3"
              onClick={() => {
                speak('Creating account with Google');
                // Mock Google OAuth
                setTimeout(() => {
                  speak('Google account created successfully. Redirecting to accessibility setup.');
                  router.push('/');
                }, 2000);
              }}
              voiceCommand="Sign up with Google"
              aria-label="Create account with Google"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </Button>
            
            <Button 
              variant="secondary" 
              size="lg" 
              className="w-full flex items-center justify-center gap-3"
              onClick={() => {
                speak('Creating account with LinkedIn');
                // Mock LinkedIn OAuth
                setTimeout(() => {
                  speak('LinkedIn account created successfully. Redirecting to accessibility setup.');
                  router.push('/');
                }, 2000);
              }}
              voiceCommand="Sign up with LinkedIn"
              aria-label="Create account with LinkedIn"
            >
              <svg className="w-5 h-5" fill="#0077B5" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
              Continue with LinkedIn
            </Button>
          </div>

          {/* Sign In Link */}
          <p className="text-center text-sm text-gray-600 mt-6">
            Already have an account?{' '}
            <Link href="/auth/signin" className="text-primary-600 hover:text-primary-700 font-medium">
              Sign in
            </Link>
          </p>

          {/* Accessibility Note */}
          <div className="mt-6 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-xs text-blue-800 text-center">
              🎯 <strong>Accessibility:</strong> Use Tab to navigate, Space to select, or voice commands if enabled
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}