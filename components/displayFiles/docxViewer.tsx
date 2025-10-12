"use client";

import React, { useEffect, useState } from "react";
import mammoth from "mammoth";
import { motion } from "framer-motion";
import { FileText, Loader2, AlertCircle } from "lucide-react";

interface DocxViewerProps {
  fileUrl: string;
}

export default function DocxViewer({ fileUrl }: DocxViewerProps) {
  const [htmlContent, setHtmlContent] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAndRenderDocx = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(fileUrl);
        if (!res.ok) throw new Error(`Failed to fetch document: ${res.status}`);
        const arrayBuffer = await res.arrayBuffer();

        const { value: html } = await mammoth.convertToHtml({ arrayBuffer });
        
        // Debug: Check what Mammoth outputs
        console.log("Mammoth output:", html);

        
        // Enhanced HTML processing
        let cleanedHtml = html
          .replace(/<p><br><\/p>/g, '')
          .replace(/<p>\s*<\/p>/g, '')
          .replace(/<h1>/g, '<h1 class="text-3xl font-bold text-gray-800 mb-4">')
          .replace(/<h2>/g, '<h2 class="text-2xl font-bold mb-3 text-gray-800">')
          .replace(/<h3>/g, '<h3 class="text-xl font-bold mb-2 text-gray-800">')
          .replace(/<p>/g, '<p class="mb-4 leading-relaxed text-gray-800">')
          .replace(/<ul>/g, '<ul class="list-disc pl-6 mb-4 text-gray-800">')
          .replace(/<ol>/g, '<ol class="list-decimal pl-6 mb-4 text-gray-800">')
          .replace(/<li>/g, '<li class="mb-1 text-gray-800">');

        // If no proper HTML tags, wrap in paragraphs
        if (!cleanedHtml.includes('<p') && !cleanedHtml.includes('<h')) {
          console.log("No HTML structure found, wrapping in paragraphs");
          cleanedHtml = cleanedHtml
            .split('\n')
            .filter(line => line.trim())
            .map(line => `<p class="mb-4 leading-relaxed text-gray-800">${line}</p>`)
            .join('');
        }
        
        setHtmlContent(cleanedHtml);
      } catch (err: any) {
        console.error("DOCX rendering error:", err);
        setError("Failed to load document. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchAndRenderDocx();
  }, [fileUrl]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 bg-gray-50 rounded-lg">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="mb-4"
        >
          <Loader2 size={32} className="text-blue-600" />
        </motion.div>
        <p className="text-gray-600 font-medium">Loading document...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 bg-red-50 rounded-lg border border-red-200">
        <AlertCircle size={32} className="text-red-600 mb-4" />
        <p className="text-red-700 font-medium text-center">{error}</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden"
    >
      
      <div className="p-6 max-h-[70vh] overflow-y-auto">
        {/* Option 1: Try prose with manual classes as fallback */}
        <div className={`
          prose prose-lg max-w-none
          ${htmlContent.includes('<h1') || htmlContent.includes('<p') ? 'prose-slate' : ''}
        `}>
          <div 
            dangerouslySetInnerHTML={{ __html: htmlContent }}
            className={`
              min-h-[200px]
              ${!htmlContent.includes('<h1') && !htmlContent.includes('<p') 
                ? 'space-y-4 text-gray-700 leading-relaxed' 
                : ''
              }
            `}
          />
        </div>

        {/* Fallback if no content */}
        {(!htmlContent || htmlContent.trim().length === 0) && (
          <div className="text-center py-8 text-gray-500">
            <FileText size={48} className="mx-auto mb-4 opacity-50" />
            <p>No content found in document</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}