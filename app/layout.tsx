import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import { AccessibilityProvider } from '@/lib/accessibility-context';
import { VoiceAccessibilityProvider } from '@/lib/voice-accessibility';
import { AccessibilityToolbar } from '@/components/accessibility/AccessibilityToolbar';
import { VoiceNavigator } from '@/components/accessibility/VoiceNavigator';
import '@/styles/globals.css';
import { AuthProvider } from '@/components/providers/authProvider';
import NextTopLoader from 'nextjs-toploader';
import Navbar from '@/components/common/navbar';
import AIAssistant from '@/components/ui/AIAssistant';

const poppins = Poppins({
  subsets: ['latin'],
  variable: '--font-body',
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Lumina+ | Lighting the way for every learner',
  description:
    'Bridging barriers in education through technology, making learning accessible, engaging, and empowering for differently-abled students.',
  keywords:
    'accessibility, education, inclusive learning, assistive technology',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={poppins.variable}>
      <body className="font-sans !bg-gradient-to-b from-indigo-50 to-blue-50">
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
          <AIAssistant />
      </body>
    </html>
  );
}
