'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  RotateCcw, 
  Volume2, 
  ChevronLeft, 
  ChevronRight,
  Play,
  Pause,
  Shuffle,
  Target,
  CheckCircle,
  X,
  Brain
} from 'lucide-react';
import { useAccessibility } from '@/lib/accessibility-context';
import { useVoiceAccessibility } from '@/lib/voice-accessibility';
import { VoiceEnabledButton, VoiceEnabledText } from '@/components/accessibility/VoiceEnabledContent';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

interface Flashcard {
  id: string;
  front: string;
  back: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  visualCues?: string[];
  simplifiedVersion?: {
    front: string;
    back: string;
  };
}

export default function SmartFlashcards() {
  const router = useRouter();
  const { profile, speak } = useAccessibility();
  const { announceAction, readContent } = useVoiceAccessibility();
  
  const [currentCard, setCurrentCard] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isAutoPlay, setIsAutoPlay] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState<string[]>([]);
  const [incorrectAnswers, setIncorrectAnswers] = useState<string[]>([]);

  const flashcards: Flashcard[] = [
    {
      id: '1',
      front: 'What is Machine Learning?',
      back: 'A type of artificial intelligence that enables computers to learn and make decisions from data without being explicitly programmed.',
      category: 'Technology',
      difficulty: 'medium',
      visualCues: ['🤖', '📊', '🧠'],
      simplifiedVersion: {
        front: 'What is Machine Learning?',
        back: 'It helps computers learn from information to make smart choices, like how you learn from practice.'
      }
    },
    {
      id: '2',
      front: 'What does a Software Engineer do?',
      back: 'Designs, develops, tests, and maintains software applications and systems to solve problems and meet user needs.',
      category: 'Careers',
      difficulty: 'easy',
      visualCues: ['💻', '⚙️', '🔧'],
      simplifiedVersion: {
        front: 'What does a Software Engineer do?',
        back: 'They build computer programs and apps that people use every day.'
      }
    },
    {
      id: '3',
      front: 'What is Data Science?',
      back: 'The field that uses scientific methods, algorithms, and systems to extract knowledge and insights from structured and unstructured data.',
      category: 'Technology',
      difficulty: 'hard',
      visualCues: ['📈', '🔍', '💡'],
      simplifiedVersion: {
        front: 'What is Data Science?',
        back: 'Finding useful information and patterns in lots of data to help make better decisions.'
      }
    }
  ];

  useEffect(() => {
    if (profile === 'visual') {
      readContent(`Smart Flashcards loaded. ${flashcards.length} cards available. Current card: ${currentCard + 1}. Use voice commands: next, previous, flip, or read card.`);
    }
  }, [profile]);

  const getCurrentCard = () => flashcards[currentCard];
  
  const getCardContent = (card: Flashcard, side: 'front' | 'back') => {
    if (profile === 'cognitive' && card.simplifiedVersion) {
      return card.simplifiedVersion[side];
    }
    return card[side];
  };

  const handleFlip = () => {
    setShowAnswer(!showAnswer);
    const card = getCurrentCard();
    const content = showAnswer ? getCardContent(card, 'front') : getCardContent(card, 'back');
    announceAction(`Card flipped. ${showAnswer ? 'Question' : 'Answer'}: ${content}`);
    speak(content);
  };

  const handleNext = () => {
    if (currentCard < flashcards.length - 1) {
      setCurrentCard(currentCard + 1);
      setShowAnswer(false);
      const nextCard = flashcards[currentCard + 1];
      announceAction(`Next card: ${currentCard + 2} of ${flashcards.length}`);
      speak(getCardContent(nextCard, 'front'));
    }
  };

  const handlePrevious = () => {
    if (currentCard > 0) {
      setCurrentCard(currentCard - 1);
      setShowAnswer(false);
      const prevCard = flashcards[currentCard - 1];
      announceAction(`Previous card: ${currentCard} of ${flashcards.length}`);
      speak(getCardContent(prevCard, 'front'));
    }
  };

  const handleCorrect = () => {
    const cardId = getCurrentCard().id;
    setCorrectAnswers([...correctAnswers, cardId]);
    announceAction('Marked as correct. Great job!');
    speak('Correct! Moving to next card.');
    setTimeout(handleNext, 1000);
  };

  const handleIncorrect = () => {
    const cardId = getCurrentCard().id;
    setIncorrectAnswers([...incorrectAnswers, cardId]);
    announceAction('Marked as incorrect. Keep practicing!');
    speak('Incorrect. Review this card again later.');
    setTimeout(handleNext, 1000);
  };

  const getProfileConfig = () => {
    switch (profile) {
      case 'visual':
        return {
          cardBg: 'bg-gradient-to-br from-blue-50 to-indigo-100',
          cardBorder: 'border-blue-300',
          accentColor: 'text-blue-600',
          buttonGradient: 'from-blue-500 to-indigo-600'
        };
      case 'hearing':
        return {
          cardBg: 'bg-gradient-to-br from-green-50 to-emerald-100',
          cardBorder: 'border-green-300',
          accentColor: 'text-green-600',
          buttonGradient: 'from-green-500 to-emerald-600'
        };
      case 'cognitive':
        return {
          cardBg: 'bg-gradient-to-br from-purple-50 to-pink-100',
          cardBorder: 'border-purple-300',
          accentColor: 'text-purple-600',
          buttonGradient: 'from-purple-500 to-pink-600'
        };
      default:
        return {
          cardBg: 'bg-gradient-to-br from-gray-50 to-slate-100',
          cardBorder: 'border-gray-300',
          accentColor: 'text-gray-600',
          buttonGradient: 'from-gray-500 to-slate-600'
        };
    }
  };

  const config = getProfileConfig();
  const card = getCurrentCard();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-16">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <VoiceEnabledButton
              onClick={() => router.back()}
              description="Go back to insights"
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <ArrowLeft size={20} />
              <span>Back</span>
            </VoiceEnabledButton>
            
            <div>
              <h1 className="text-3xl font-bold text-gray-800">⚡ Smart Flashcards</h1>
              <p className="text-gray-600">
                Card {currentCard + 1} of {flashcards.length} • {card.category} • {card.difficulty}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {profile === 'visual' && (
              <div className="flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                <Volume2 size={16} />
                <span>Voice Enabled</span>
              </div>
            )}
            {profile === 'cognitive' && (
              <div className="flex items-center gap-2 bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">
                <Brain size={16} />
                <span>Simplified</span>
              </div>
            )}
          </div>
        </div>

        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Progress</span>
            <span>{Math.round(((currentCard + 1) / flashcards.length) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`bg-gradient-to-r ${config.buttonGradient} h-2 rounded-full transition-all duration-300`}
              style={{ width: `${((currentCard + 1) / flashcards.length) * 100}%` }}
            />
          </div>
        </div>

        <div className="flex justify-center mb-8">
          <div className="relative w-full max-w-2xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={`${currentCard}-${showAnswer}`}
                initial={{ rotateY: 90, opacity: 0 }}
                animate={{ rotateY: 0, opacity: 1 }}
                exit={{ rotateY: -90, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className={`${config.cardBg} ${config.cardBorder} border-2 shadow-2xl min-h-[400px] p-8 cursor-pointer`}>
                  <VoiceEnabledButton
                    onClick={handleFlip}
                    description={showAnswer ? 'Show question' : 'Show answer'}
                    className="w-full h-full text-left"
                  >
                    <div className="flex flex-col justify-center items-center h-full text-center">
                      
                      <div className="absolute top-4 right-4">
                        <span className={`${config.accentColor} text-sm font-medium px-3 py-1 bg-white rounded-full`}>
                          {showAnswer ? 'Answer' : 'Question'}
                        </span>
                      </div>

                      {profile === 'hearing' && card.visualCues && (
                        <div className="flex gap-2 mb-4">
                          {card.visualCues.map((cue, index) => (
                            <span key={index} className="text-2xl">{cue}</span>
                          ))}
                        </div>
                      )}

                      <VoiceEnabledText
                        autoRead={profile === 'visual'}
                        className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 leading-relaxed"
                      >
                        {showAnswer 
                          ? getCardContent(card, 'back')
                          : getCardContent(card, 'front')
                        }
                      </VoiceEnabledText>

                      <div className="flex items-center gap-2 mt-4">
                        <Target size={16} className={config.accentColor} />
                        <span className={`${config.accentColor} text-sm font-medium capitalize`}>
                          {card.difficulty} Level
                        </span>
                      </div>

                      <p className="text-gray-500 text-sm mt-6">
                        {profile === 'visual' 
                          ? 'Say "flip" or click to reveal'
                          : 'Click to flip card'
                        }
                      </p>
                    </div>
                  </VoiceEnabledButton>
                </Card>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <div className="flex justify-center gap-4 mb-8">
          <VoiceEnabledButton
            onClick={handlePrevious}
            disabled={currentCard === 0}
            description="Previous card"
            className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            <ChevronLeft size={20} />
            <span>Previous</span>
          </VoiceEnabledButton>

          <VoiceEnabledButton
            onClick={handleFlip}
            description="Flip card"
            className={`flex items-center gap-2 px-8 py-3 bg-gradient-to-r ${config.buttonGradient} text-white rounded-lg hover:shadow-lg`}
          >
            <RotateCcw size={20} />
            <span>Flip Card</span>
          </VoiceEnabledButton>

          <VoiceEnabledButton
            onClick={handleNext}
            disabled={currentCard === flashcards.length - 1}
            description="Next card"
            className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            <span>Next</span>
            <ChevronRight size={20} />
          </VoiceEnabledButton>
        </div>

        {showAnswer && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center gap-4 mb-8"
          >
            <VoiceEnabledButton
              onClick={handleCorrect}
              description="Mark as correct"
              className="flex items-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg"
            >
              <CheckCircle size={20} />
              <span>Got it right!</span>
            </VoiceEnabledButton>

            <VoiceEnabledButton
              onClick={handleIncorrect}
              description="Mark as incorrect"
              className="flex items-center gap-2 px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg"
            >
              <X size={20} />
              <span>Need practice</span>
            </VoiceEnabledButton>
          </motion.div>
        )}

        <Card className="p-6 shadow-lg border border-gray-200">
          <div className="flex flex-wrap justify-center gap-4">
            
            <VoiceEnabledButton
              onClick={() => {
                setIsAutoPlay(!isAutoPlay);
                announceAction(isAutoPlay ? 'Auto-play stopped' : 'Auto-play started');
              }}
              description={isAutoPlay ? 'Stop auto-play' : 'Start auto-play'}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${
                isAutoPlay 
                  ? 'bg-blue-500 text-white border-blue-500' 
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              {isAutoPlay ? <Pause size={16} /> : <Play size={16} />}
              <span>{isAutoPlay ? 'Stop Auto' : 'Auto Play'}</span>
            </VoiceEnabledButton>

            <VoiceEnabledButton
              onClick={() => {
                const content = getCardContent(card, showAnswer ? 'back' : 'front');
                speak(content);
                announceAction('Reading card content');
              }}
              description="Read current card aloud"
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <Volume2 size={16} />
              <span>Read Aloud</span>
            </VoiceEnabledButton>

            <VoiceEnabledButton
              onClick={() => {
                const randomIndex = Math.floor(Math.random() * flashcards.length);
                setCurrentCard(randomIndex);
                setShowAnswer(false);
                announceAction(`Shuffled to random card: ${randomIndex + 1}`);
              }}
              description="Shuffle to random card"
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <Shuffle size={16} />
              <span>Shuffle</span>
            </VoiceEnabledButton>
          </div>

          <div className="flex justify-center gap-8 mt-6 pt-6 border-t border-gray-200">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{correctAnswers.length}</div>
              <div className="text-sm text-gray-600">Correct</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{incorrectAnswers.length}</div>
              <div className="text-sm text-gray-600">Review</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {Math.round((correctAnswers.length / (correctAnswers.length + incorrectAnswers.length || 1)) * 100) || 0}%
              </div>
              <div className="text-sm text-gray-600">Accuracy</div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}