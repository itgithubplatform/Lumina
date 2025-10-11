import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { AccessibilityProvider } from '@/lib/accessibility-context';
import { VoiceAccessibilityProvider } from '@/lib/voice-accessibility';
import { AccessibilityToolbar } from '@/components/accessibility/AccessibilityToolbar';
import { VoiceNavigator } from '@/components/accessibility/VoiceNavigator';
import '@/styles/globals.css';
import { AuthProvider } from '@/components/providers/authProvider';
import NextTopLoader from 'nextjs-toploader';
import Navbar from '@/components/common/navbar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Lumina+ | Lighting the way for every learner',
  description: 'Bridging barriers in education through technology, making learning accessible, engaging, and empowering for differently-abled students.',
  keywords: 'accessibility, education, inclusive learning, assistive technology',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className + " !bg-gradient-to-b from-indigo-50 to-blue-50"}>
        <NextTopLoader height={3} showSpinner={false} />
        <AuthProvider>
          <Navbar />
        <VoiceAccessibilityProvider>
          <AccessibilityProvider>
            <AccessibilityToolbar />
            <VoiceNavigator />
            <main className="min-h-screen">
              {children}
            </main>
          </AccessibilityProvider>
        </VoiceAccessibilityProvider>
        </AuthProvider>
      </body>
    </html>
  );
}