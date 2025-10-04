'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, ArrowLeft } from 'lucide-react';
import { useAccessibility } from '@/lib/accessibility-context';
import { Button } from '@/components/ui/Button';

export default function SignIn() {
  const router = useRouter();
  const { speak, settings } = useAccessibility();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    speak('Signing in...');
    // Mock authentication
    setTimeout(() => {
      speak('Sign in successful. Redirecting to dashboard.');
      router.push('/dashboard');
    }, 1000);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (settings.voiceNavigation) {
      speak(`${field} field updated`);
    }
  };
  
  // Enhanced accessibility for visually impaired
  React.useEffect(() => {
    // Auto-announce page content for screen readers
    if (settings.voiceNavigation) {
      speak('Sign in page loaded. Fill in your email and password, then press Enter to sign in. Or use Tab to navigate between fields.');
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
            
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
            <p className="text-gray-600">Sign in to continue your learning journey</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
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
                  onFocus={() => speak('Email address field focused. Enter your email address.')}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-lg"
                  placeholder="Enter your email"
                  aria-label="Email address input field"
                  aria-describedby="email-help"
                  autoComplete="email"
                />
                <div id="email-help" className="sr-only">
                  Enter your email address to sign in to your Lumina Plus account
                </div>
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
                  onFocus={() => speak('Password field focused. Enter your password.')}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-lg"
                  placeholder="Enter your password"
                  aria-label="Password input field"
                  aria-describedby="password-help"
                  autoComplete="current-password"
                />
                <div id="password-help" className="sr-only">
                  Enter your password. Use the show password button to reveal or hide your password.
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setShowPassword(!showPassword);
                    speak(showPassword ? 'Password hidden' : 'Password revealed');
                  }}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 p-2"
                  aria-label={showPassword ? 'Hide password text' : 'Show password text'}
                  aria-pressed={showPassword}
                  type="button"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500 w-4 h-4"
                  aria-describedby="remember-help"
                  onChange={(e) => speak(e.target.checked ? 'Remember me enabled' : 'Remember me disabled')}
                />
                <span className="ml-2 text-sm text-gray-600">Remember me</span>
                <div id="remember-help" className="sr-only">
                  Check this box to stay signed in on this device
                </div>
              </label>
              <Link href="/auth/forgot-password" className="text-sm text-primary-600 hover:text-primary-700">
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              voiceCommand="Sign in"
            >
              Sign In
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
                speak('Signing in with Google');
                // Mock Google OAuth
                setTimeout(() => {
                  speak('Google sign in successful. Redirecting to dashboard.');
                  router.push('/dashboard');
                }, 2000);
              }}
              voiceCommand="Sign in with Google"
              aria-label="Sign in with Google account"
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
                speak('Signing in with LinkedIn');
                // Mock LinkedIn OAuth
                setTimeout(() => {
                  speak('LinkedIn sign in successful. Redirecting to dashboard.');
                  router.push('/dashboard');
                }, 2000);
              }}
              voiceCommand="Sign in with LinkedIn"
              aria-label="Sign in with LinkedIn account"
            >
              <svg className="w-5 h-5" fill="#0077B5" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
              Continue with LinkedIn
            </Button>
          </div>

          {/* Sign Up Link */}
          <p className="text-center text-sm text-gray-600 mt-6">
            Don't have an account?{' '}
            <Link href="/auth/signup" className="text-primary-600 hover:text-primary-700 font-medium">
              Sign up
            </Link>
          </p>

          {/* Accessibility Note */}
          <div className="mt-6 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-xs text-blue-800 text-center">
              🎯 <strong>Accessibility:</strong> Use Tab to navigate, Enter to submit, or voice commands if enabled
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}