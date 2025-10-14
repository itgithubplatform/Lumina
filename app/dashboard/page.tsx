'use client';

import { useState, useRef, useEffect, type ChangeEvent, type RefObject } from 'react';
import { useRouter } from 'nextjs-toploader/app';
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
import StudentDashboard from '@/components/dashboard/StudentDashboard';

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
    if (status === 'authenticated') {
      getClassrooms();
    } else if (status === 'unauthenticated') {
      router.replace('/auth/signin');
    }
  }, [reload, status]);

  if (status === 'loading') {
    return <Loader />;
  }
  
  if (status === 'unauthenticated') {
    return null;
  }
  
  if (!session?.user) {
    return <Loader />;
  }
  if (role === 'teacher') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 pt-16">
        <div className="container mx-auto px-4 py-8">
          {/* Teacher Header */}
          <TeacherDashboardHeader />
          
          {/* Quick Upload Button */}
          <motion.button
            onClick={() => router.push('/teacher/upload')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="mb-8 bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-8 py-4 rounded-2xl font-semibold flex items-center gap-3 shadow-lg hover:shadow-xl transition-all"
          >
            <Upload className="w-5 h-5" />
            Upload New Lesson
          </motion.button>
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
        </div>
      </div>
    );
  }
  if (session?.user.role === "student") {
    return (
     <StudentDashboard />
    );
  }
}
