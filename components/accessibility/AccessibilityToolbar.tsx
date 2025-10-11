'use client';
import { Eye, Volume2, Focus, Type, Palette, Settings } from 'lucide-react';
import { useAccessibility } from '@/lib/accessibility-context';
import { Button } from '@/components/ui/Button';

export function AccessibilityToolbar() {
  const { settings, updateSettings, speak } = useAccessibility();

  const toggleHighContrast = () => {
    updateSettings({ highContrast: !settings.highContrast });
    speak(settings.highContrast ? 'High contrast disabled' : 'High contrast enabled');
  };

  const toggleDyslexiaFriendly = () => {
    updateSettings({ dyslexiaFriendly: !settings.dyslexiaFriendly });
    speak(settings.dyslexiaFriendly ? 'Dyslexia friendly font disabled' : 'Dyslexia friendly font enabled');
  };

  const toggleFocusMode = () => {
    updateSettings({ focusMode: !settings.focusMode });
    speak(settings.focusMode ? 'Focus mode disabled' : 'Focus mode enabled');
  };

  const cycleFontSize = () => {
    const sizes = ['small', 'medium', 'large', 'xl'] as const;
    const currentIndex = sizes.indexOf(settings.fontSize);
    const nextSize = sizes[(currentIndex + 1) % sizes.length];
    updateSettings({ fontSize: nextSize });
    speak(`Font size changed to ${nextSize}`);
  };

  const toggleVoiceNavigation = () => {
    updateSettings({ voiceNavigation: !settings.voiceNavigation });
    speak(settings.voiceNavigation ? 'Voice navigation disabled' : 'Voice navigation enabled');
  };
  
  return (
    <div className="fixed top-20 left-4 bg-white shadow-lg  p-2 px-3 flex gap-2 z-50 border rounded-xl">
      <div className='flex flex-col items-center'>
    <h3 className='text-sm font-bold text-black'>Tool Bar</h3>
    <div className='flex flex-row gap-2 mt-1'>

      <Button
        variant={settings.highContrast ? 'accessibility' : 'secondary'}
        size="sm"
        onClick={toggleHighContrast}
        voiceCommand="Toggle high contrast"
        title="Toggle High Contrast"
        >
        <Palette size={16} />
      </Button>

      <Button
        variant={settings.dyslexiaFriendly ? 'accessibility' : 'secondary'}
        size="sm"
        onClick={toggleDyslexiaFriendly}
        voiceCommand="Toggle dyslexia friendly font"
        title="Toggle Dyslexia Friendly Font"
        >
        <Type size={16} />
      </Button>

      {/* <Button
        variant={settings.focusMode ? 'accessibility' : 'secondary'}
        size="sm"
        onClick={toggleFocusMode}
        voiceCommand="Toggle focus mode"
        title="Toggle Focus Mode"
      >
      <Focus size={16} />
      </Button> */}

      <Button
        variant="secondary"
        size="sm"
        onClick={cycleFontSize}
        voiceCommand="Change font size"
        title={`Font Size: ${settings.fontSize}`}
      >
        <span className="text-xs font-bold">A</span>
      </Button>

      {/* <Button
        variant={settings.voiceNavigation ? 'accessibility' : 'secondary'}
        size="sm"
        onClick={toggleVoiceNavigation}
        voiceCommand="Toggle voice navigation"
        title="Toggle Voice Navigation"
      >
      <Volume2 size={16} />
      </Button> */}
    </div>
        </div>
      </div>
  );
}