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
import DocViewer from 'react-doc-viewer';
import {Status} from "@prisma/client";
import DocxViewer from './docxViewer';
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

export default function FileDisplayer({file}:{
    file: {
    id: string;
    name: string;
    link: string;
    status: Status;
    createdAt: Date;
    updatedAt: Date;
    audioLink: string | null;
    extractedText: string | null;
    transcript: Transcript| null;
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
}| null

}) {
    const isVideo = file?.link.match(/\.(mp4|mov|avi|mkv|webm)$/i);
    const isDocument = file?.link.match(/\.(pdf|docx|doc|txt)$/i);
    const transcript = file?.transcript as Transcript | null;
    const dyslexiaFriendly = file?.dislexiaFriendly as DyslexiaFriendly | null;
    useEffect(() => {
      console.log('File data:', isDocument, isVideo);
    }, [file]);
  return (
    <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              {file?.name}
            </h1>
            <p className="text-gray-600">From {file?.class.name}</p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Main Content - Left Column */}
            <div className="lg:col-span-2 space-y-8">
              {/* Original File Viewer */}
              <motion.section
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden"
              >
                <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-4 text-white">
                  <div className="flex items-center gap-3">
                    {isVideo ? <Video size={24} /> : <FileText size={24} />}
                    <h2 className="text-xl font-semibold">
                      {isVideo ? 'Video Content' : 'Document Viewer'}
                    </h2>
                  </div>
                </div>
                
                <div className="p-6">
                  {isVideo ? (
                    <div className="aspect-video bg-black rounded-lg overflow-hidden">
                      <video
                        controls
                        className="w-full h-full"
                        src={file?.link}
                      >
                        Your browser does not support the video tag.
                      </video>
                    </div>
                  ) : isDocument ? (
                    <div className="h-96 rounded-lg border border-gray-200 overflow-hidden">
                      <DocxViewer fileUrl={`/api/download?url=${file?.link}`} />
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <FileText size={48} className="text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">Preview not available for this file type</p>
                      <a
                        href={file?.link}
                        download
                        className="inline-flex items-center gap-2 mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <Download size={20} />
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
                  transition={{ delay: 0.2 }}
                  className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden"
                >
                  <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-4 text-white">
                    <div className="flex items-center gap-3">
                      <BookOpen size={24} />
                      <h2 className="text-xl font-semibold">Extracted Content</h2>
                    </div>
                  </div>
                  <div className="p-6 max-h-96 overflow-y-auto">
                    <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                      {file?.extractedText
                      }
                    </p>
                  </div>
                </motion.section>
              )}
            </div>

            {/* Sidebar - Right Column */}
            <div className="space-y-8">
              {/* Audio Player for Blind Friendly */}
              {file?.blindFriendlyLink && (
                <motion.section
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden"
                >
                  <div className="bg-gradient-to-r from-orange-500 to-red-500 p-4 text-white">
                    <div className="flex items-center gap-3">
                      <Headphones size={24} />
                      <h2 className="text-xl font-semibold">Audio Description</h2>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="bg-orange-100 p-3 rounded-full">
                        <AudioLines className="text-orange-600" size={20} />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-800">Audio Version</p>
                        <p className="text-sm text-gray-500">Accessible content</p>
                      </div>
                    </div>
                    <audio
                      controls
                      className="w-full rounded-lg"
                      src={file?.blindFriendlyLink}
                    >
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
                  transition={{ delay: 0.4 }}
                  className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden"
                >
                  <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-4 text-white">
                    <div className="flex items-center gap-3">
                      <FileText size={24} />
                      <h2 className="text-xl font-semibold">Transcript</h2>
                    </div>
                  </div>
                  <div className="p-6 max-h-[41.7rem] overflow-y-auto">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                        <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs">
                          {transcript.detectedLanguage}
                        </span>
                        <span>{transcript.words.length} words</span>
                      </div>
                      <p className="text-gray-700 leading-relaxed">
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
  <motion.section
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.5 }}
    className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden mt-10"
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
      {/* Comic Scenes */}
      <div className="space-y-8">
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
      
      {/* Overall Summary */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1 }}
        className="mt-8 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200 shadow-lg"
      >
        <div className="flex items-center gap-4 mb-4">
          <div className="bg-green-100 p-3 rounded-xl">
            <Star className="text-green-600" size={24} />
          </div>
          <div>
            <h3 className="font-bold text-gray-800 text-xl">Story Complete! 🎉</h3>
            <p className="text-green-600">You've learned through {dyslexiaFriendly.scenes.length} visual scenes</p>
          </div>
        </div>
      </motion.div>
    </div>
  </motion.section>
)}
        </div>
  )
}
