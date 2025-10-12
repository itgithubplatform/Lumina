"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, FileText, X, CloudUpload, CheckCircle, Video, FileType, AlertCircle } from "lucide-react";
import axios from "axios";
import { useRouter } from "nextjs-toploader/app";
import { classroom } from "./showClassRoom";
import { Status } from "@prisma/client";

interface FileUploadProps {
  classroomId: string;
  setClassroom: React.Dispatch<React.SetStateAction<classroom>>
}
interface fileResponse {
file: {
    id: string;
    name: string;
    link: string;
    status: Status;
    createdAt: Date;
    updatedAt: Date;
    audioLink: string | null;
    extractedText: string | null;
    transcript: null;
    blindFriendlyLink: string | null;
    dislexiaFriendly:  null;
    classId: string;
}
}
export default function FileUpload({ classroomId, setClassroom }: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showFullscreenDrop, setShowFullscreenDrop] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const router = useRouter();

  // Allowed file types
  const allowedVideoTypes = [".mp4", ".mov", ".avi", ".mkv", ".webm", ".flv", ".wmv", ".m4v", ".mpg", ".mpeg", ".3gp"];
  const allowedDocTypes = [".docx"];
  const allowedTypes = [...allowedVideoTypes, ...allowedDocTypes];

  // Fullscreen drag & drop handlers
  useEffect(() => {
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

  const getFileTypeIcon = (fileName: string) => {
    const extension = fileName.toLowerCase().substring(fileName.lastIndexOf('.'));
    return allowedVideoTypes.includes(extension) ? <Video size={20} /> : <FileType size={20} />;
  };

  const getFileTypeLabel = (fileName: string) => {
    const extension = fileName.toLowerCase().substring(fileName.lastIndexOf('.'));
    return allowedVideoTypes.includes(extension) ? "Video File" : "Document File";
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
    if (!file) return;

    setLoading(true);
    setProgress(0);
    setMessage("");

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("classroomId", classroomId);

      const response = await axios.post<fileResponse>("/api/files/upload", formData, {
        onUploadProgress: (progressEvent: any) => {
          if (progressEvent.total) {
            const percent = Math.round(
              (progressEvent.loaded / progressEvent.total) * 100
            );
            setProgress(percent);
          }
        },
      } as any);

      setMessage("File uploaded successfully!");
      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      setClassroom(prev => ({
        ...prev,
        files: [...(prev.files || []), response.data.file],
      }));
    } catch (err: any) {
      if (err.response?.data?.error) setMessage(err.response.data.error);
      else setMessage(err.message || "Something went wrong");
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
              <p className="text-gray-600">Release your file here to upload</p>
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
          className={`relative border-3 border-dashed rounded-2xl p-8 text-center transition-all duration-300 ${isDragging
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
          />

          <motion.div
            animate={{ scale: isDragging ? 1.05 : 1, y: isDragging ? -5 : 0 }}
            className="flex flex-col items-center justify-center space-y-4"
          >
            <div className={`p-5 rounded-2xl transition-all duration-300 ${isDragging
                ? "bg-blue-100 text-blue-600 scale-110"
                : "bg-gradient-to-br from-blue-50 to-purple-50 text-gray-600"
              }`}>
              <CloudUpload size={40} />
            </div>

            <div className="space-y-3">
              <h3 className="text-xl font-bold text-gray-800">
                {file ? file.name : "Drag & drop your file"}
              </h3>
              <p className="text-gray-500">
                {file ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : "or click to browse"}
              </p>

              {/* File Type Info */}
              <div className="flex flex-wrap justify-center gap-2 mt-3">
                {allowedVideoTypes.map((type, index) => (
                  <span key={type} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                    <Video size={14} />
                    {type}
                  </span>
                ))}
                {allowedDocTypes.map((type) => (
                  <span key={type} className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                    <FileType size={14} />
                    {type}
                  </span>
                ))}
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
                    {getFileTypeIcon(file.name)}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 text-lg">{file.name}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-sm text-gray-500">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </span>
                      <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-medium">
                        {getFileTypeLabel(file.name)}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setFile(null)}
                  disabled={loading}
                  className="p-2 text-gray-400 hover:text-red-500 disabled:opacity-50 transition-all duration-200 hover:bg-red-50 rounded-lg"
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
            disabled={!file || loading}
            whileHover={!file || loading ? {} : { scale: 1.02, y: -2 }}
            whileTap={!file || loading ? {} : { scale: 0.98 }}
            className={`w-full py-4 px-6 rounded-2xl font-bold text-lg transition-all duration-300 flex items-center justify-center space-x-3 relative overflow-hidden ${!file || loading
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 hover:from-blue-700 hover:via-purple-700 hover:to-blue-800 text-white shadow-xl hover:shadow-2xl"
              }`}
          >
            {/* Animated background */}
            {loading && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500"
                initial={{ x: "-100%" }}
                animate={{ x: "100%" }}
                transition={{
                  repeat: Infinity,
                  duration: 1.5,
                  ease: "easeInOut"
                }}
              />
            )}

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
              ) : (
                <>
                  <Upload size={22} />
                  <span>Upload File</span>
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
                  <span className="text-gray-600">Uploading...</span>
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
              className={`p-4 rounded-xl flex items-center space-x-3 border-l-4 ${message.includes("success")
                  ? "bg-green-50 text-green-800 border-green-400"
                  : "bg-red-50 text-red-800 border-red-400"
                }`}
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
      </div>
    </>
  );
}