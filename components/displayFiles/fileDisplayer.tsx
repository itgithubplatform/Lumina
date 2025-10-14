"use client"
import React, { useEffect } from 'react'
import { motion } from 'framer-motion';
import {
  FileText,
  Video,
  AudioLines,
  Eye,
  Headphones,
  BookOpen,
  Lightbulb,
  Play,
  Download,
  Star
} from 'lucide-react';
import { Status } from "@prisma/client";
import DocxViewer from './docxViewer';
import { useSession } from 'next-auth/react';
import Loader from '../ui/loader';

interface Transcript {
  transcription: string;
  words: {
    word: string | null | undefined;
    startTime: number;
    endTime: number;
  }[];
  detectedLanguage: string;
}

interface DyslexiaFriendly {
  scenes: {
    description: string;
    title: string;
    image: string;
    keyIdea: string;
  }[];
}

export default function FileDisplayer({ file }: {
  file: {
    id: string;
    name: string;
    link: string;
    status: Status;
    createdAt: Date;
    updatedAt: Date;
    audioLink: string | null;
    extractedText: string | null;
    transcript: Transcript | null;
    blindFriendlyLink: string | null;
    dislexiaFriendly: DyslexiaFriendly | null;
    classId: string;
    class: {
      id: string;
      name: string;
      teacherId: string;
      students: {
        id: string;
        name: string | null;
        email: string;
      }[];
    };
  } | null
}) {
  const isVideo = file?.link.match(/\.(mp4|mov|avi|mkv|webm)$/i);
  const isDocument = file?.link.match(/\.(pdf|docx|doc|txt)$/i);
  const { data: session, status } = useSession()
  const [accessiblityMode, setAccessibilityMode] = React.useState<'dyslexia' | 'visualImpairment' | 'hearingImpairment' | 'cognitiveDisability' | null>(null);
  const transcript = file?.transcript as Transcript | null;
  const [userRole, setUserRole] = React.useState<'teacher' | 'student' | null>(null);
  const dyslexiaFriendly = file?.dislexiaFriendly as DyslexiaFriendly | null;

  useEffect(() => {
    if (session) {
      setAccessibilityMode(session?.user.accessibility[0] as 'dyslexia' | 'visualImpairment' | 'hearingImpairment' | 'cognitiveDisability' | null);
      setUserRole(session?.user.role as 'teacher' | 'student' | null);
    }
  }, [session]);

  // Content display logic based on user role and accessibility
  const showForTeacher = userRole === 'teacher';
  const showForStudent = userRole === 'student';

  // Student accessibility modes
  const showDyslexiaContent = showForStudent && accessiblityMode === 'dyslexia';
  const showVisualImpairmentContent = showForStudent && accessiblityMode === 'visualImpairment';
  const showHearingImpairmentContent = showForStudent && accessiblityMode === 'hearingImpairment';
  const showCognitiveContent = showForStudent && accessiblityMode === 'cognitiveDisability';
  const showNormalStudent = showForStudent && !accessiblityMode;

  if (status === "loading") {
    return <Loader />
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-24 lg:px-8 py-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
          {file?.name}
        </h1>
        <p className="text-gray-600 text-sm sm:text-base">From {file?.class.name}</p>
        
        {/* Accessibility Badge */}
        {showForStudent && accessiblityMode && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 mt-3 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium"
          >
            <Eye size={14} />
            {accessiblityMode === 'dyslexia' && 'Dyslexia Friendly Mode'}
            {accessiblityMode === 'visualImpairment' && 'Visual Impairment Mode'}
            {accessiblityMode === 'hearingImpairment' && 'Hearing Impairment Mode'}
            {accessiblityMode === 'cognitiveDisability' && 'Cognitive Disability Mode'}
          </motion.div>
        )}
      </motion.div>

      {/* TEACHER VIEW - Show Everything */}
      {showForTeacher && (
        <div className="space-y-8">
          {/* Original Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              <motion.section
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden"
              >
                <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-4 text-white">
                  <div className="flex items-center gap-3">
                    {isVideo ? <Video size={20} /> : <FileText size={20} />}
                    <h2 className="text-lg font-semibold">
                      {isVideo ? 'Video Content' : 'Document Viewer'}
                    </h2>
                  </div>
                </div>
                <div className="p-4">
                  {isVideo ? (
                    <div className="aspect-video bg-black rounded-lg overflow-hidden">
                      <video controls className="w-full h-full" src={file?.link}>
                        Your browser does not support the video tag.
                      </video>
                    </div>
                  ) : isDocument ? (
                    <div className="h-80 rounded-lg border border-gray-200 overflow-hidden">
                      <DocxViewer fileUrl={`/api/download?url=${file?.link}`} />
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <FileText size={32} className="text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-500 text-sm">Preview not available</p>
                      <a href={file?.link} download className="inline-flex items-center gap-2 mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                        <Download size={16} />
                        Download File
                      </a>
                    </div>
                  )}
                </div>
              </motion.section>

              {/* Extracted Text */}
              {file?.extractedText && (
                <motion.section
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden"
                >
                  <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-4 text-white">
                    <div className="flex items-center gap-3">
                      <BookOpen size={20} />
                      <h2 className="text-lg font-semibold">Extracted Content</h2>
                    </div>
                  </div>
                  <div className="p-4 max-h-64 overflow-y-auto">
                    <p className="text-gray-700 leading-relaxed text-sm whitespace-pre-line">
                      {file.extractedText}
                    </p>
                  </div>
                </motion.section>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Audio Player */}
              {file?.blindFriendlyLink && (
                <motion.section
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden"
                >
                  <div className="bg-gradient-to-r from-orange-500 to-red-500 p-4 text-white">
                    <div className="flex items-center gap-3">
                      <Headphones size={20} />
                      <h2 className="text-lg font-semibold">Audio Description</h2>
                    </div>
                  </div>
                  <div className="p-4">
                    <audio controls className="w-full rounded-lg" src={file.blindFriendlyLink}>
                      Your browser does not support the audio element.
                    </audio>
                  </div>
                </motion.section>
              )}

              {/* Transcript */}
              {transcript && (
                <motion.section
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden"
                >
                  <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-4 text-white">
                    <div className="flex items-center gap-3">
                      <FileText size={20} />
                      <h2 className="text-lg font-semibold">Transcript</h2>
                    </div>
                  </div>
                  <div className="p-4 max-h-64 overflow-y-auto">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                          {transcript.detectedLanguage}
                        </span>
                        <span>{transcript.words.length} words</span>
                      </div>
                      <p className="text-gray-700 leading-relaxed text-sm">
                        {transcript.transcription}
                      </p>
                    </div>
                  </div>
                </motion.section>
              )}
            </div>
          </div>

          {/* Dyslexia Friendly Comic */}
          {dyslexiaFriendly && (
            <DyslexiaComicSection dyslexiaFriendly={dyslexiaFriendly} />
          )}
        </div>
      )}

      {/* STUDENT VIEW - Accessibility Based */}
      {showForStudent && (
        <div className="space-y-6">
          {/* DYSLEXIA - Audio + Story */}
          {showDyslexiaContent && (
            <div className="grid grid-cols-1 gap-6">
              {/* Audio Section */}
              {file?.blindFriendlyLink && (
                <motion.section
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden"
                >
                  <div className="bg-gradient-to-r from-orange-500 to-red-500 p-4 text-white">
                    <div className="flex items-center gap-3">
                      <Headphones size={20} />
                      <h2 className="text-lg font-semibold">Audio Learning</h2>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="text-center mb-4">
                      <AudioLines className="text-orange-500 mx-auto mb-2" size={32} />
                      <p className="text-gray-600 text-sm">Listen to the content</p>
                    </div>
                    <audio controls className="w-full rounded-lg" src={file.blindFriendlyLink}>
                      Your browser does not support the audio element.
                    </audio>
                  </div>
                </motion.section>
              )}

              {/* Story Section */}
              {dyslexiaFriendly && (
                <CompactDyslexiaComic dyslexiaFriendly={dyslexiaFriendly} />
              )}
            </div>
          )}

          {/* VISUAL IMPAIRMENT - Audio Only */}
          {showVisualImpairmentContent && file?.blindFriendlyLink && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden max-w-2xl mx-auto"
            >
              <div className="bg-gradient-to-r from-orange-500 to-red-500 p-6 text-white text-center">
                <Headphones size={32} className="mx-auto mb-3" />
                <h2 className="text-xl font-semibold">Audio Content</h2>
                <p className="text-orange-100 text-sm mt-1">Screen reader optimized</p>
              </div>
              <div className="p-6">
                <audio controls className="w-full rounded-lg" src={file.blindFriendlyLink}>
                  Your browser does not support the audio element.
                </audio>
                <p className="text-gray-600 text-sm text-center mt-4">
                  Use keyboard controls to navigate the audio player
                </p>
              </div>
            </motion.section>
          )}

          {/* HEARING IMPAIRMENT - Video + Transcript */}
          {showHearingImpairmentContent && (
            <div className="space-y-6">
              {isVideo && (
                <motion.section
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden"
                >
                  <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-4 text-white">
                    <div className="flex items-center gap-3">
                      <Video size={20} />
                      <h2 className="text-lg font-semibold">Video with Captions</h2>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="aspect-video bg-black rounded-lg overflow-hidden">
                      <video controls className="w-full h-full" src={file?.link}>
                        Your browser does not support the video tag.
                      </video>
                    </div>
                  </div>
                </motion.section>
              )}
              
              { file?.extractedText && (
                <motion.section
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden"
                >
                  <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-4 text-white">
                    <div className="flex items-center gap-3">
                      <FileText size={20} />
                      <h2 className="text-lg font-semibold">Full Transcript</h2>
                    </div>
                  </div>
                  <div className="p-4 max-h-80 overflow-y-auto">
                    <p className="text-gray-700 leading-relaxed text-sm">
                      {file.extractedText}
                    </p>
                  </div>
                </motion.section>
              )}
            </div>
          )}

          {/* COGNITIVE DISABILITY - Story Only */}
          {showCognitiveContent && dyslexiaFriendly && (
            <CompactDyslexiaComic dyslexiaFriendly={dyslexiaFriendly} />
          )}

          {/* NORMAL STUDENT - Original Content */}
          {showNormalStudent && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden max-w-4xl mx-auto"
            >
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-4 text-white">
                <div className="flex items-center gap-3">
                  {isVideo ? <Video size={20} /> : <FileText size={20} />}
                  <h2 className="text-lg font-semibold">
                    {isVideo ? 'Video Content' : 'Document Viewer'}
                  </h2>
                </div>
              </div>
              <div className="p-4">
                {isVideo ? (
                  <div className="aspect-video bg-black rounded-lg overflow-hidden">
                    <video controls className="w-full h-full" src={file?.link}>
                      Your browser does not support the video tag.
                    </video>
                  </div>
                ) : isDocument ? (
                  <div className="h-96 rounded-lg border border-gray-200 overflow-hidden">
                    <DocxViewer fileUrl={`/api/download?url=${file?.link}`} />
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <FileText size={32} className="text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500 text-sm">Preview not available</p>
                    <a href={file?.link} download className="inline-flex items-center gap-2 mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                      <Download size={16} />
                      Download File
                    </a>
                  </div>
                )}
              </div>
            </motion.section>
          )}

          {/* No Accessible Content Available */}
          {showForStudent && 
           !showDyslexiaContent && 
           !showVisualImpairmentContent && 
           !showHearingImpairmentContent && 
           !showCognitiveContent && 
           !showNormalStudent && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12 bg-gray-50 rounded-2xl border border-gray-200"
            >
              <FileText size={48} className="text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No Accessible Content Available</h3>
              <p className="text-gray-600">Please contact your teacher for accessible versions of this content.</p>
            </motion.div>
          )}
        </div>
      )}
    </div>
  )
}

// Compact Dyslexia Comic for Students
function CompactDyslexiaComic({ dyslexiaFriendly }: { dyslexiaFriendly: DyslexiaFriendly }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden"
    >
      <div className="bg-gradient-to-r from-indigo-500 to-blue-500 p-4 text-white">
        <div className="flex items-center gap-3">
          <Eye size={20} />
          <h2 className="text-lg font-semibold">Visual Learning Story</h2>
        </div>
      </div>
      
      <div className="p-4">
        <div className="space-y-4">
          {dyslexiaFriendly.scenes.map((scene, index) => (
              <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + index * 0.15 }}
                  className="group relative"
                >
                  {/* Scene Card */}
                  <div className="bg-white rounded-2xl shadow-lg border border-gray-200/80 overflow-hidden hover:shadow-xl transition-all duration-300 ">
                    <div className="p-6">
                      {/* Header with Number */}
                      <div className="flex items-start justify-between mb-6">
                        <div className="flex items-center gap-4">
                          <div className="relative">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                              <span className="text-white font-bold text-lg">
                                {index + 1}
                              </span>
                            </div>
                            <div className="absolute -inset-1 bg-blue-200 rounded-xl blur-sm opacity-50 group-hover:opacity-75 transition-opacity"></div>
                          </div>
                          <div>
                            <h3 className="text-xl font-bol bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                              {scene.title}
                            </h3>
                            <div className="flex items-center gap-2 mt-1">
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              <span className="text-sm text-gray-500">Scene {index + 1}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Image and Content Grid */}
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                        {/* Image Section */}
                        {scene.image && (
                          <motion.div
                            whileHover={{ scale: 1.01 }}
                            transition={{ type: "spring", stiffness: 300 }}
                            className="relative rounded-xl overflow-hidden shadow-md"
                          >
                            <img
                              src={scene.image}
                              alt={scene.title}
                              className="w-full h-full object-cover"
                            />
                            {/* <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div> */}
                            <div className="absolute bottom-3 left-3">
                              <span className="bg-white/90 backdrop-blur-sm text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
                                📸 Visual Aid
                              </span>
                            </div>
                          </motion.div>
                        )}

                        {/* Description Section */}
                        <div className="flex flex-col justify-center">
                          <div className="bg-blue-50/50 rounded-xl p-4 border border-blue-200/50">
                            <div className="flex items-center gap-3 mb-3">
                              <div className="">
                                <BookOpen size={20} className="text-blue-600" />
                              </div>
                            </div>
                            <p className="text-gray-700 leading-relaxed text-lg">
                              {scene.description}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Key Idea */}
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 + index * 0.1 }}
                        className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl p-5 border border-amber-200 shadow-sm"
                      >
                        <div className="flex items-center gap-4 mb-4">
                          <div className="bg-gradient-to-br from-amber-500 to-yellow-500 p-3 rounded-xl shadow-md">
                            <Lightbulb size={24} className="text-white" />
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-800 text-lg">Key Takeaway</h4>
                            <p className="text-amber-600 text-sm">Main learning point</p>
                          </div>
                        </div>
                        <p className="text-gray-800 leading-relaxed text-base font-medium pl-1">
                          {scene.keyIdea}
                        </p>
                      </motion.div>
                    </div>

                    {/* Decorative Bottom Border */}
                    <div className="h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
                  </div>

                  {/* Connector Line between scenes (except last) */}
                  {index < dyslexiaFriendly.scenes.length - 1 && (
                    <div className="absolute left-6 top-full w-0.5 h-8 bg-gradient-to-b from-blue-300 to-purple-300 ml-5"></div>
                  )}
                </motion.div>

          ))}
        </div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-4 bg-green-50 rounded-xl p-3 border border-green-200 text-center"
        >
          <p className="text-green-700 text-sm font-medium">🎉 Story Complete! You've learned through {dyslexiaFriendly.scenes.length} scenes</p>
        </motion.div>
      </div>
    </motion.section>
  )
}

// Full Dyslexia Comic for Teachers (original component)
function DyslexiaComicSection({ dyslexiaFriendly }: { dyslexiaFriendly: DyslexiaFriendly }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden"
    >
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 p-6 text-white">
        <div className="flex items-center gap-4">
          <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-sm">
            <Eye size={28} className="text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Visual Learning Story</h2>
            <p className="text-indigo-100 mt-1">Designed for better comprehension</p>
          </div>
        </div>
      </div>

      <div className="p-6 bg-gradient-to-br from-gray-50 to-blue-50/30">
        <div className="space-y-8">
          {dyslexiaFriendly.scenes.map((scene, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + index * 0.15 }}
              className="group relative"
            >
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200/80 overflow-hidden hover:shadow-xl transition-all duration-300">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                          <span className="text-white font-bold text-lg">{index + 1}</span>
                        </div>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                          {scene.title}
                        </h3>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    {scene.image && (
                      <motion.div whileHover={{ scale: 1.01 }} className="relative rounded-xl overflow-hidden shadow-md">
                        <img src={scene.image} alt={scene.title} className="w-full h-full object-cover" />
                      </motion.div>
                    )}
                    <div className="flex flex-col justify-center">
                      <div className="bg-blue-50/50 rounded-xl p-4 border border-blue-200/50">
                        <p className="text-gray-700 leading-relaxed">{scene.description}</p>
                      </div>
                    </div>
                  </div>

                  <motion.div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl p-5 border border-amber-200 shadow-sm">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="bg-gradient-to-br from-amber-500 to-yellow-500 p-3 rounded-xl shadow-md">
                        <Lightbulb size={24} className="text-white" />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-800 text-lg">Key Takeaway</h4>
                      </div>
                    </div>
                    <p className="text-gray-800 leading-relaxed text-base font-medium">{scene.keyIdea}</p>
                  </motion.div>
                </div>
                <div className="h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  )
}