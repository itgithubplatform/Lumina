'use client';

import { useState, useRef, useEffect, type ChangeEvent, type RefObject } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Upload,
  FileText,
  Video,
  Youtube,
  BookOpen,
  Play,
  Download,
  Search,
  Plus,
  Eye,
  Ear,
  Brain,
  Users,
  FolderPlus,
  Sparkles,
  Wand2,
  GraduationCap,
  Accessibility
} from 'lucide-react';
import { useAccessibility } from '@/lib/accessibility-context';
import { useVoiceAccessibility } from '@/lib/voice-accessibility';
import { Button } from '@/components/ui/Button';
import CreateClassroomSection from '@/components/dashboard/createClassRoom';
import TeacherDashboardHeader from '@/components/dashboard/teacherDashboardHeader';
import ClassroomCard from '@/components/dashboard/classroomCard';
import { useSession } from 'next-auth/react';
import Loader from '@/components/ui/loader';

interface Classroom {
  id: string;
  name: string;
  subject: string;
  _count: { students: number };
  folders: {
    normal: Content[];
    visual: Content[];
    hearing: Content[];
    cognitive: Content[];
    motor: Content[];
  };
}

interface Content {
  id: string;
  title: string;
  type: 'pdf' | 'video' | 'youtube' | 'doc';
  originalFile: string;
  aiProcessed: {
    visual: { tts: boolean; imageDesc: boolean; };
    hearing: { captions: boolean; signLanguage: boolean; };
    cognitive: { simplified: boolean; summary: boolean; };
    motor: { voiceNav: boolean; largeButtons: boolean; };
  };
  uploadDate: string;
}

export default function Dashboard() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { profile, speak, settings } = useAccessibility();
  const role = session?.user?.role // Change to 'student' to test student view
  const { announceAction, announceNavigation, registerVoiceCommand, readContent } = useVoiceAccessibility();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [classrooms, setClassrooms] = useState<Classroom[]>([])
  const [selectedClassroom, setSelectedClassroom] = useState<string | null>(null);
  const [showCreateClassroom, setShowCreateClassroom] = useState(false);
  const [newClassroomName, setNewClassroomName] = useState('');
  const [newClassroomSubject, setNewClassroomSubject] = useState('');
  const [processingFiles, setProcessingFiles] = useState<string[]>([]);
  const [reload,setReload] = useState(false);

  const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && selectedClassroom) {
      Array.from(files).forEach(file => {
        const fileId = Date.now().toString();
        const newContent: Content = {
          id: fileId,
          title: file.name.replace(/\.[^/.]+$/, ""),
          type: file.type.includes('pdf') ? 'pdf' : file.type.includes('video') ? 'video' : 'doc',
          originalFile: file.name,
          aiProcessed: {
            visual: { tts: false, imageDesc: false },
            hearing: { captions: false, signLanguage: false },
            cognitive: { simplified: false, summary: false },
            motor: { voiceNav: false, largeButtons: false }
          },
          uploadDate: new Date().toISOString().split('T')[0]
        };

        // Add to normal folder first
        setClassrooms(prev => prev.map(classroom =>
          classroom.id === selectedClassroom
            ? { ...classroom, folders: { ...classroom.folders, normal: [...classroom.folders.normal, newContent] } }
            : classroom
        ));

        setProcessingFiles(prev => [...prev, fileId]);
        speak(`${file.name} uploaded successfully. AI is processing accessibility features for all student categories.`);
        announceAction(`File uploaded: ${file.name}. AI processing started.`);

        // Simulate AI processing
        setTimeout(() => {
          setClassrooms(prev => prev.map(classroom => {
            if (classroom.id === selectedClassroom) {
              const processedContent = {
                ...newContent,
                aiProcessed: {
                  visual: { tts: true, imageDesc: true },
                  hearing: { captions: true, signLanguage: true },
                  cognitive: { simplified: true, summary: true },
                  motor: { voiceNav: true, largeButtons: true }
                }
              };

              return {
                ...classroom,
                folders: {
                  normal: classroom.folders.normal.map(c => c.id === fileId ? processedContent : c),
                  visual: [...classroom.folders.visual, { ...processedContent, id: `${fileId}-visual` }],
                  hearing: [...classroom.folders.hearing, { ...processedContent, id: `${fileId}-hearing` }],
                  cognitive: [...classroom.folders.cognitive, { ...processedContent, id: `${fileId}-cognitive` }],
                  motor: [...classroom.folders.motor, { ...processedContent, id: `${fileId}-motor` }]
                }
              };
            }
            return classroom;
          }));

          setProcessingFiles(prev => prev.filter(id => id !== fileId));
          speak(`${file.name} AI processing complete. Content is now available in all accessibility folders with TTS narration, captions, simplified summaries, and motor support.`);
          announceAction(`AI processing complete for ${file.name}. All accessibility versions ready.`);
        }, 4000);
      });
    }
  };

  const getClassrooms = async () => {
    try {
      const res = await fetch('/api/classroom');
      const data = await res.json();
      if (res.ok) {
        setClassrooms(data.classrooms);
      } else {
        speak('Error fetching classrooms. Please try again later.');
        announceAction('Error fetching classrooms from server.');
      }
    } catch (error) {
      console.error('Fetch error:', error);
      speak('Network error while fetching classrooms. Please check your connection.');
      announceAction('Network error while fetching classrooms.');
    }
  };

  useEffect(() => {
    getClassrooms();
  }, [reload]);
  if (status === 'loading') {
    return <Loader />;
  }
  if(status === 'unauthenticated'){
    return router.push('/auth/signin')
  }
  if (role === 'teacher') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 pt-16">
        <div className="container mx-auto px-4 py-8">
          {/* Teacher Header */}
          <TeacherDashboardHeader />

          {!selectedClassroom ? (
            /* Classroom Selection */
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-7xl mx-auto"
            >
              {/* Create New Classroom */}
              <CreateClassroomSection setReload={setReload} />

              {/* Existing Classrooms */}
              <h2 className="text-2xl text-gray-700 font-semibold mt-20 mb-8">Existing Classrooms</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 ">
                {classrooms.length > 0 && classrooms.map((classroom, index) => (
                  <ClassroomCard
                    key={classroom.id}
                    classroom={classroom}
                    index={index}
                    speak={speak}
                    announceNavigation={announceNavigation}
                  />
                ))}
              </div>
            </motion.div>
          ) : (
            /* Classroom Content Management */
            <ClassroomContent
              classroom={classrooms.find(c => c.id === selectedClassroom)!}
              onBack={() => setSelectedClassroom(null)}
              onUpload={handleFileUpload}
              processingFiles={processingFiles}
              // @ts-ignore
              fileInputRef={fileInputRef}
            />
          )}
        </div>
      </div>
    );
  }
  if (session?.user.role === "student") {
    return (
      <StudentDashboard profile={profile} />
    );
  }
}

// Classroom Content Component
function ClassroomContent({ classroom, onBack, onUpload, processingFiles, fileInputRef }: {
  classroom: Classroom;
  onBack: () => void;
  onUpload: (event: ChangeEvent<HTMLInputElement>) => void;
  processingFiles: string[];
  fileInputRef: RefObject<HTMLInputElement>;
}) {
  const { speak } = useAccessibility();
  const { announceAction, readContent } = useVoiceAccessibility();

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="max-w-6xl mx-auto"
    >
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Button variant="secondary" onClick={onBack}>
          ← Back to Classrooms
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-800">{classroom.name}</h1>
          <p className="text-gray-600">{classroom.subject} • {classroom._count.students} students</p>
        </div>
      </div>

      {/* Upload Section */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-purple-100 rounded-full p-2">
            <Wand2 size={24} className="text-purple-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-800">Upload & AI Process</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <Button
            variant="primary"
            className="h-20 flex-col"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload size={24} className="mb-2" />
            Upload Files
            <span className="text-xs opacity-75">PDF, DOCX, Video</span>
          </Button>

          <Button variant="secondary" className="h-20 flex-col">
            <Youtube size={24} className="mb-2" />
            YouTube URL
            <span className="text-xs opacity-75">Paste link</span>
          </Button>

          <Button variant="secondary" className="h-20 flex-col">
            <Video size={24} className="mb-2" />
            Record Video
            <span className="text-xs opacity-75">Live recording</span>
          </Button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".pdf,.docx,.doc,.mp4,.mov,.avi"
          onChange={onUpload}
          className="hidden"
        />

        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4">
          <h3 className="font-semibold text-gray-800 mb-2 flex items-center">
            <Sparkles size={16} className="mr-2" />
            AI Auto-Processing
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
            <div className="flex items-center gap-2">
              <Eye size={14} className="text-blue-500" />
              <span>Visual: TTS + Image Desc</span>
            </div>
            <div className="flex items-center gap-2">
              <Ear size={14} className="text-green-500" />
              <span>Hearing: Captions + Signs</span>
            </div>
            <div className="flex items-center gap-2">
              <Brain size={14} className="text-purple-500" />
              <span>Cognitive: Simplified</span>
            </div>
            <div className="flex items-center gap-2">
              <Accessibility size={14} className="text-orange-500" />
              <span>Motor: Voice Nav</span>
            </div>
          </div>
        </div>
      </div>

      {/* Folder Structure */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <FolderCard title="Normal Students" icon={Users} count={classroom.folders.normal.length} color="gray" />
        <FolderCard title="Visual Impairments" icon={Eye} count={classroom.folders.visual.length} color="blue" />
        <FolderCard title="Hearing Impairments" icon={Ear} count={classroom.folders.hearing.length} color="green" />
        <FolderCard title="Cognitive Support" icon={Brain} count={classroom.folders.cognitive.length} color="purple" />
        <FolderCard title="Motor Disabilities" icon={Accessibility} count={classroom.folders.motor.length} color="orange" />
      </div>
    </motion.div>
  );
}

// Folder Card Component
function FolderCard({ title, icon: Icon, count, color }: {
  title: string;
  icon: any;
  count: number;
  color: string;
}) {
  const colorClasses = {
    gray: 'from-gray-400 to-gray-600 bg-gray-50 text-gray-700',
    blue: 'from-blue-400 to-blue-600 bg-blue-50 text-blue-700',
    green: 'from-green-400 to-green-600 bg-green-50 text-green-700',
    purple: 'from-purple-400 to-purple-600 bg-purple-50 text-purple-700',
    orange: 'from-orange-400 to-orange-600 bg-orange-50 text-orange-700'
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={`bg-white rounded-xl shadow-lg p-6 border cursor-pointer hover:shadow-xl transition-all duration-300`}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className={`bg-gradient-to-r ${colorClasses[color as keyof typeof colorClasses].split(' ')[0]} ${colorClasses[color as keyof typeof colorClasses].split(' ')[1]} rounded-lg p-3`}>
          <Icon size={24} className="text-white" />
        </div>
        <div>
          <h3 className="font-bold text-gray-800">{title}</h3>
          <p className="text-sm text-gray-600">{count} items</p>
        </div>
      </div>

      <div className={`${colorClasses[color as keyof typeof colorClasses].split(' ')[2]} ${colorClasses[color as keyof typeof colorClasses].split(' ')[3]} rounded-lg p-3 text-center`}>
        <div className="text-lg font-bold">{count}</div>
        <div className="text-xs">Content Items</div>
      </div>
    </motion.div>
  );
}

// Student Dashboard Component
function StudentDashboard({ profile }: { profile: string }) {
  const router = useRouter();
  const { speak } = useAccessibility();
  const { announceAction, announceNavigation, registerVoiceCommand, readContent } = useVoiceAccessibility();

  useEffect(() => {
    // Register voice commands for student dashboard
    registerVoiceCommand('visual support', () => {
      if (profile === 'visual' || profile === 'none') {
        announceNavigation('Visual support learning materials');
        router.push('/student/visual');
      }
    });
    registerVoiceCommand('hearing support', () => {
      if (profile === 'hearing' || profile === 'none') {
        announceNavigation('Hearing support learning materials');
        router.push('/student/hearing');
      }
    });
    registerVoiceCommand('cognitive support', () => {
      if (profile === 'cognitive' || profile === 'none') {
        announceNavigation('Cognitive support learning materials');
        router.push('/student/cognitive');
      }
    });
    registerVoiceCommand('standard learning', () => {
      announceNavigation('Standard learning materials');
      router.push('/student/normal');
    });

    if (profile === 'visual') {
      readContent('Student dashboard loaded. You have access to visual support materials with audio narration, screen reader support, and high contrast display. Say "visual support" to access your materials.');
    }
  }, [profile]);

  const studentSections = [
    {
      id: 'normal',
      title: 'Standard Learning',
      description: 'Original content with optional accessibility features',
      icon: Users,
      color: 'from-gray-400 to-gray-600',
      bgColor: 'bg-gray-50',
      available: true
    },
    {
      id: 'visual',
      title: 'Visual Support',
      description: 'Audio narration, screen reader support, high contrast',
      icon: Eye,
      color: 'from-blue-400 to-blue-600',
      bgColor: 'bg-blue-50',
      available: profile === 'visual' || profile === 'none'
    },
    {
      id: 'hearing',
      title: 'Hearing Support',
      description: 'Captions, transcripts, visual indicators, sign language',
      icon: Ear,
      color: 'from-green-400 to-green-600',
      bgColor: 'bg-green-50',
      available: profile === 'hearing' || profile === 'none'
    },
    {
      id: 'cognitive',
      title: 'Cognitive Support',
      description: 'Simplified text, focus mode, dyslexia-friendly design',
      icon: Brain,
      color: 'from-purple-400 to-purple-600',
      bgColor: 'bg-purple-50',
      available: profile === 'cognitive' || profile === 'none'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-16">
      <div className="container mx-auto px-4 py-8">
        {/* Student Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="bg-gradient-to-r from-green-500 to-blue-600 rounded-full p-3">
              <BookOpen size={32} className="text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              Learning Hub
            </h1>
          </div>
          <p className="text-xl text-gray-600">Choose your learning experience</p>
        </motion.div>

        {/* Student Sections */}
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6">
          {studentSections.map((section, index) => (
            <motion.div
              key={section.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: section.available ? 1.02 : 1 }}
              className={`bg-white rounded-xl shadow-lg p-6 border transition-all duration-300 ${section.available
                  ? 'cursor-pointer hover:shadow-xl'
                  : 'opacity-50 cursor-not-allowed'
                }`}
              onClick={() => {
                if (section.available) {
                  speak(`Accessing ${section.title} learning materials`);
                  announceNavigation(`${section.title} section with specialized accessibility features`);
                  router.push(`/student/${section.id}`);
                }
              }}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className={`bg-gradient-to-r ${section.color} rounded-lg p-3`}>
                  <section.icon size={24} className="text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">{section.title}</h3>
                  <p className="text-gray-600">{section.description}</p>
                </div>
              </div>

              {section.available ? (
                <div className={`${section.bgColor} rounded-lg p-3 text-center`}>
                  <div className="text-sm font-medium text-gray-700">Available Content</div>
                  <div className="text-2xl font-bold text-gray-800">12 Lessons</div>
                </div>
              ) : (
                <div className="bg-gray-100 rounded-lg p-3 text-center">
                  <div className="text-sm text-gray-500">Not available for your profile</div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );












}