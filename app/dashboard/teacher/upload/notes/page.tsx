'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Upload, 
  FileText, 
  File, 
  CheckCircle,
  Clock,
  Zap,
  Eye,
  Ear,
  Brain,
  X
} from 'lucide-react';
import { useVoiceAccessibility } from '@/lib/voice-accessibility';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  status: 'uploading' | 'processing' | 'completed' | 'error';
  progress: number;
  aiFeatures: {
    tts: boolean;
    braille: boolean;
    simplified: boolean;
    captions: boolean;
  };
}

export default function NotesUpload() {
  const router = useRouter();
  const { announceAction, speak } = useVoiceAccessibility();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;

    Array.from(files).forEach(file => {
      const newFile: UploadedFile = {
        id: Date.now().toString() + Math.random(),
        name: file.name,
        size: file.size,
        type: file.type,
        status: 'uploading',
        progress: 0,
        aiFeatures: {
          tts: false,
          braille: false,
          simplified: false,
          captions: false
        }
      };

      setUploadedFiles(prev => [...prev, newFile]);
      announceAction(`Uploading ${file.name}`);
      speak(`Starting upload and AI processing for ${file.name}`);

      simulateUploadProcess(newFile.id);
    });
  };

  const simulateUploadProcess = (fileId: string) => {
    const uploadInterval = setInterval(() => {
      setUploadedFiles(prev => prev.map(file => {
        if (file.id === fileId && file.status === 'uploading') {
          const newProgress = Math.min(file.progress + 10, 100);
          if (newProgress === 100) {
            clearInterval(uploadInterval);
            setTimeout(() => startAIProcessing(fileId), 500);
            return { ...file, progress: newProgress, status: 'processing' };
          }
          return { ...file, progress: newProgress };
        }
        return file;
      }));
    }, 200);
  };

  const startAIProcessing = (fileId: string) => {
    const file = uploadedFiles.find(f => f.id === fileId);
    if (file) {
      speak(`AI processing started for ${file.name}. Generating accessibility features.`);
    }

    const features = ['tts', 'braille', 'simplified', 'captions'] as const;
    
    features.forEach((feature, index) => {
      setTimeout(() => {
        setUploadedFiles(prev => prev.map(file => {
          if (file.id === fileId) {
            const updatedFeatures = { ...file.aiFeatures, [feature]: true };
            const completedFeatures = Object.values(updatedFeatures).filter(Boolean).length;
            
            if (completedFeatures === features.length) {
              speak(`AI processing completed for ${file.name}. All accessibility features generated.`);
              return { ...file, aiFeatures: updatedFeatures, status: 'completed' };
            }
            
            return { ...file, aiFeatures: updatedFeatures };
          }
          return file;
        }));
      }, (index + 1) * 1000);
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-16">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="secondary"
            onClick={() => router.back()}
            className="flex items-center gap-2"
          >
            <ArrowLeft size={20} />
            Back
          </Button>
          
          <div>
            <h1 className="text-3xl font-bold text-gray-800">📄 Upload Notes & PDFs</h1>
            <p className="text-gray-600">Upload documents for automatic accessibility processing</p>
          </div>
        </div>

        <Card className="p-8 mb-8 border-2 border-dashed border-gray-300 hover:border-blue-400 transition-colors">
          <div
            className={`text-center ${isDragging ? 'bg-blue-50 border-blue-400' : ''} rounded-lg p-8 transition-all`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-full p-4 w-fit mx-auto mb-4">
              <Upload size={32} className="text-white" />
            </div>
            
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              Drop files here or click to upload
            </h3>
            
            <p className="text-gray-600 mb-6">
              Supports PDF, DOCX, DOC, TXT files up to 50MB
            </p>

            <Button
              variant="primary"
              onClick={() => fileInputRef.current?.click()}
              className="mb-4"
            >
              <FileText size={20} className="mr-2" />
              Choose Files
            </Button>

            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".pdf,.docx,.doc,.txt"
              onChange={(e) => handleFileSelect(e.target.files)}
              className="hidden"
            />

            <div className="text-sm text-gray-500 mb-4">
              Files will be automatically processed with Google Cloud AI for:
            </div>
            
            <div className="flex flex-wrap justify-center gap-4">
              <div className="flex items-center gap-2 text-sm text-blue-600">
                <Eye size={16} />
                <span>Text-to-Speech</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-green-600">
                <Ear size={16} />
                <span>Braille Ready</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-purple-600">
                <Brain size={16} />
                <span>Simplified Text</span>
              </div>
            </div>
          </div>
        </Card>

        {uploadedFiles.length > 0 && (
          <Card className="p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Zap size={20} className="text-yellow-500" />
              Processing Queue
            </h3>

            <div className="space-y-4">
              {uploadedFiles.map((file) => (
                <motion.div
                  key={file.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-100 rounded-lg p-2">
                        <File size={20} className="text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{file.name}</p>
                        <p className="text-sm text-gray-500">{formatFileSize(file.size)}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {file.status === 'completed' && (
                        <CheckCircle size={20} className="text-green-500" />
                      )}
                      {file.status === 'processing' && (
                        <Clock size={20} className="text-yellow-500 animate-spin" />
                      )}
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => setUploadedFiles(prev => prev.filter(f => f.id !== file.id))}
                        className="p-1"
                      >
                        <X size={16} />
                      </Button>
                    </div>
                  </div>

                  {file.status === 'uploading' && (
                    <div className="mb-3">
                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>Uploading...</span>
                        <span>{file.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${file.progress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {[
                      { key: 'tts', label: 'Text-to-Speech', icon: Eye },
                      { key: 'braille', label: 'Braille Ready', icon: FileText },
                      { key: 'simplified', label: 'Simplified', icon: Brain },
                      { key: 'captions', label: 'Captions', icon: Ear }
                    ].map(({ key, label, icon: Icon }) => (
                      <div
                        key={key}
                        className={`flex items-center gap-2 p-2 rounded text-sm ${
                          file.aiFeatures[key as keyof typeof file.aiFeatures]
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        <Icon size={14} />
                        <span>{label}</span>
                        {file.aiFeatures[key as keyof typeof file.aiFeatures] && (
                          <CheckCircle size={14} className="text-green-600" />
                        )}
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}