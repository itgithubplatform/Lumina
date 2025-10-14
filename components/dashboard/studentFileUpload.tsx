"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, FileText, X, CloudUpload, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import axios from "axios";

interface FileUploadProps {
  userId?: string;
   onFileUpload?: (fileId: string) => void;
   setFiles: React.Dispatch<React.SetStateAction<any[]>>; // Adjust type as needed
}

export default function StudentFileUploader({ userId,onFileUpload, setFiles }: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showFullscreenDrop, setShowFullscreenDrop] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Allowed file types for students
  const allowedTypes = [".mp4", ".mov", ".avi", ".mkv", ".webm", ".flv", ".wmv", ".m4v", ".mpg", ".mpeg", ".3gp", ".docx"];

  // Fullscreen drag & drop handlers
  React.useEffect(() => {
    const handleGlobalDragOver = (e: DragEvent) => {
      e.preventDefault();
      if (!showFullscreenDrop) {
        setShowFullscreenDrop(true);
      }
    };

    const handleGlobalDragLeave = (e: DragEvent) => {
      if (!e.relatedTarget) {
        setShowFullscreenDrop(false);
      }
    };

    const handleGlobalDrop = (e: DragEvent) => {
      e.preventDefault();
      setShowFullscreenDrop(false);
    };

    document.addEventListener('dragover', handleGlobalDragOver);
    document.addEventListener('dragleave', handleGlobalDragLeave);
    document.addEventListener('drop', handleGlobalDrop);

    return () => {
      document.removeEventListener('dragover', handleGlobalDragOver);
      document.removeEventListener('dragleave', handleGlobalDragLeave);
      document.removeEventListener('drop', handleGlobalDrop);
    };
  }, [showFullscreenDrop]);

  // Validate file type
  const isValidFileType = (fileName: string): boolean => {
    const extension = fileName.toLowerCase().substring(fileName.lastIndexOf('.'));
    return allowedTypes.includes(extension);
  };

  // Drag & Drop handlers
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
    setMessage("");
    setIsDragging(false);
    setShowFullscreenDrop(false);
    
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      if (isValidFileType(droppedFile.name)) {
        setFile(droppedFile);
      } else {
        setMessage(`Invalid file type. Only ${allowedTypes.join(', ')} files are allowed.`);
      }
    }
  };

  const handleFileSelect = (selectedFile: File) => {
    if (isValidFileType(selectedFile.name)) {
      setFile(selectedFile);
      setMessage("");
    } else {
      setMessage(`Invalid file type. Only ${allowedTypes.join(', ')} files are allowed.`);
    }
  };

  // File Upload handler
  const handleUpload = async () => {
    if (!file || !userId) return;

    setLoading(true);
    setProgress(0);
    setMessage("");

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("userId", userId);

      const res = await axios.post("/api/files/student/upload", formData, {
        onUploadProgress: (progressEvent: any) => {
          if (progressEvent.total) {
            const percent = Math.round(
              (progressEvent.loaded / progressEvent.total) * 100
            );
            setProgress(percent);
          }
        },
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      } as any);

      setMessage("File uploaded successfully! Your teacher will review it.");
      setFile(null);
      // @ts-ignore
       setFiles(prev => [...prev, res.data.file]);

        
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (err: any) {
      if (err.response?.data?.error) {
        setMessage(err.response.data.error);
      } else {
        setMessage(err.message || "Something went wrong during upload");
      }
    } finally {
      setLoading(false);
      setProgress(0);
    }
  };

  return (
    <>
      {/* Fullscreen Drop Zone */}
      <AnimatePresence>
        {showFullscreenDrop && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-blue-500/20 backdrop-blur-sm z-50 flex items-center justify-center border-4 border-dashed border-blue-400"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center p-8 bg-white/90 rounded-3xl shadow-2xl max-w-md mx-4"
            >
              <CloudUpload size={64} className="text-blue-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Drop to Upload</h3>
              <p className="text-gray-600">Release your file here</p>
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-700 font-medium">
                  Supported: {allowedTypes.join(', ')}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-6">
        {/* Drag & Drop Area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`relative border-3 border-dashed rounded-2xl p-8 text-center transition-all duration-300 ${
            isDragging
              ? "border-blue-500 bg-blue-50 scale-105 shadow-lg"
              : "border-gray-300 bg-gradient-to-br from-white to-gray-50/50 hover:border-blue-400 hover:shadow-md"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            onChange={(e) => {
              setMessage("");
              const selectedFile = e.target.files?.[0];
              if (selectedFile) handleFileSelect(selectedFile);
            }}
            accept={allowedTypes.join(',')}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            disabled={loading}
            aria-label="Choose file to upload"
            id="file-upload"
          />

          <motion.div
            animate={{ scale: isDragging ? 1.05 : 1, y: isDragging ? -5 : 0 }}
            className="flex flex-col items-center justify-center space-y-4"
          >
            <div className={`p-5 rounded-2xl transition-all duration-300 ${
              isDragging 
                ? "bg-blue-100 text-blue-600 scale-110" 
                : "bg-gradient-to-br from-blue-50 to-purple-50 text-gray-600"
            }`}>
              <CloudUpload size={40} />
            </div>
            
            <div className="space-y-3">
              <h3 className="text-xl font-bold text-gray-800">
                {file ? file.name : "Drag & drop your files to learn better"}
              </h3>
              <p className="text-gray-500">
                {file ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : "or click to browse"}
              </p>
              
              {/* File Type Info */}
              <div className="flex flex-wrap justify-center gap-2 mt-3">
                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                  DOCX
                </span>
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                  Videos
                </span>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Selected File Preview */}
        <AnimatePresence>
          {file && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, height: 0 }}
              animate={{ opacity: 1, scale: 1, height: "auto" }}
              exit={{ opacity: 0, scale: 0.9, height: 0 }}
              className="bg-gradient-to-r from-blue-50/80 to-indigo-50/80 rounded-2xl p-6 border-2 border-blue-200/60 backdrop-blur-sm"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="bg-white p-3 rounded-xl shadow-sm border border-blue-100">
                    <FileText className="text-blue-600" size={20} />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 text-lg">{file.name}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-sm text-gray-500">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </span>
                      <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-medium">
                         File
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setFile(null)}
                  disabled={loading}
                  className="p-2 text-gray-400 hover:text-red-500 disabled:opacity-50 transition-all duration-200 hover:bg-red-50 rounded-lg"
                  aria-label="Remove selected file"
                >
                  <X size={20} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Upload Button with Progress */}
        <div className="space-y-4">
          <motion.button
            onClick={handleUpload}
            disabled={!file || loading || !userId}
            whileHover={(!file || loading || !userId) ? {} : { scale: 1.02, y: -2 }}
            whileTap={(!file || loading || !userId) ? {} : { scale: 0.98 }}
            className={`w-full py-4 px-6 rounded-2xl font-bold text-lg transition-all duration-300 flex items-center justify-center space-x-3 relative overflow-hidden ${
              !file || loading || !userId
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 hover:from-blue-700 hover:via-purple-700 hover:to-blue-800 text-white shadow-xl hover:shadow-2xl"
            }`}
            aria-label={!userId ? "Please sign in to upload" : "Upload file"}
          >
            {/* Animated background */}
            <span className="relative z-10 flex items-center gap-3">
              {loading ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-6 h-6 border-2 border-white border-t-transparent rounded-full"
                  />
                  <span>Uploading {progress}%</span>
                </>
              ) : !userId ? (
                <>
                  <AlertCircle size={22} />
                  <span>Sign In to Upload</span>
                </>
              ) : (
                <>
                  <Upload size={22} />
                  <span>Submit File</span>
                </>
              )}
            </span>
          </motion.button>

          {/* Progress Bar */}
          <AnimatePresence>
            {loading && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-2"
                aria-label={`Upload progress: ${progress}%`}
              >
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <motion.div
                    className="bg-gradient-to-r from-green-400 to-blue-500 h-full rounded-full shadow-inner"
                    initial={{ width: "0%" }}
                    animate={{ width: `${progress}%` }}
                    transition={{ ease: "easeOut", duration: 0.3 }}
                  />
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Uploading File...</span>
                  <span className="font-semibold text-blue-600">{progress}% Complete</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Message */}
        <AnimatePresence>
          {message && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className={`p-4 rounded-xl flex items-center space-x-3 border-l-4 ${
                message.includes("success")
                  ? "bg-green-50 text-green-800 border-green-400"
                  : "bg-red-50 text-red-800 border-red-400"
              }`}
              role="alert"
            >
              {message.includes("success") ? (
                <CheckCircle className="text-green-600 flex-shrink-0" size={22} />
              ) : (
                <AlertCircle className="text-red-600 flex-shrink-0" size={22} />
              )}
              <span className="font-medium">{message}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Accessibility Instructions */}
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
          <h4 className="font-semibold text-gray-800 mb-2 text-sm">Accessibility Tips:</h4>
          <ul className="text-xs text-gray-600 space-y-1 list-disc list-inside">
            <li>Use Tab to navigate to the file upload area</li>
            <li>Press Enter or Space to open file browser</li>
            <li>Screen readers will announce upload progress</li>
            <li>Keyboard users can drag files with assistive technology</li>
          </ul>
        </div>
      </div>
    </>
  );
}