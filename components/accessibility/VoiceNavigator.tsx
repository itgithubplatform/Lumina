'use client';

import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Volume2, VolumeX, HelpCircle } from 'lucide-react';
import { useAccessibility } from '@/lib/accessibility-context';
import { useVoiceAccessibility } from '@/lib/voice-accessibility';
import { Button } from '@/components/ui/Button';

export function VoiceNavigator() {
  const { profile, settings } = useAccessibility();
  const { 
    isListening, 
    isSpeaking, 
    startListening, 
    stopListening, 
    speak, 
    stopSpeaking,
    announceAction 
  } = useVoiceAccessibility();
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    if (profile === 'visual') {
      speak('Voice navigation is available. Use the microphone button or say "help" for commands.', 'medium');
    }
  }, [profile]);

  if (!settings.voiceNavigation && profile !== 'visual') return null;

  const handleVoiceToggle = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const handleSpeakToggle = () => {
    if (isSpeaking) {
      stopSpeaking();
    } else {
      speak('Text to speech is active. I will read content and provide audio feedback.');
    }
  };

  const showVoiceHelp = () => {
    setShowHelp(!showHelp);
    if (!showHelp) {
      speak('Voice commands: go home, go to dashboard, read page, stop reading, navigate, what is this, my profile, help', 'high');
    }
  };

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
        {/* Voice Commands */}
        <Button
          variant="accessibility"
          size="lg"
          onClick={handleVoiceToggle}
          className={`rounded-full p-4 ${isListening ? 'animate-pulse bg-red-500' : 'bg-blue-500'}`}
          aria-label={isListening ? 'Stop voice commands' : 'Start voice commands'}
          onFocus={() => speak(isListening ? 'Voice commands active' : 'Start voice commands')}
        >
          {isListening ? <MicOff size={24} /> : <Mic size={24} />}
        </Button>

        {/* Speech Control */}
        <Button
          variant="accessibility"
          size="lg"
          onClick={handleSpeakToggle}
          className={`rounded-full p-4 ${isSpeaking ? 'animate-bounce bg-orange-500' : 'bg-green-500'}`}
          aria-label={isSpeaking ? 'Stop speech' : 'Speech controls'}
          onFocus={() => speak(isSpeaking ? 'Currently speaking' : 'Speech controls')}
        >
          {isSpeaking ? <VolumeX size={24} /> : <Volume2 size={24} />}
        </Button>

        {/* Help */}
        <Button
          variant="accessibility"
          size="lg"
          onClick={showVoiceHelp}
          className="rounded-full p-4 bg-purple-500"
          aria-label="Voice help"
          onFocus={() => speak('Voice commands help')}
        >
          <HelpCircle size={24} />
        </Button>
      </div>
      
      {isListening && (
        <div className="fixed bottom-32 right-6 z-40 bg-red-600 text-white px-4 py-2 rounded-lg animate-pulse">
          🎤 Listening for commands...
        </div>
      )}

      {isSpeaking && (
        <div className="fixed bottom-44 right-6 z-40 bg-green-600 text-white px-4 py-2 rounded-lg">
          🔊 Speaking...
        </div>
      )}

      {showHelp && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md">
            <h3 className="text-xl font-bold mb-4">🎤 Voice Commands</h3>
            <div className="space-y-2 text-sm">
              <div><strong>"go home"</strong> - Main page</div>
              <div><strong>"go to dashboard"</strong> - Dashboard</div>
              <div><strong>"read page"</strong> - Read content</div>
              <div><strong>"stop reading"</strong> - Stop speech</div>
              <div><strong>"navigate"</strong> - Navigation options</div>
              <div><strong>"what is this"</strong> - Describe page</div>
              <div><strong>"help"</strong> - Repeat commands</div>
            </div>
            <Button
              onClick={() => setShowHelp(false)}
              className="mt-4 w-full"
            >
              Close
            </Button>
          </div>
        </div>
      )}
    </>
  );
}