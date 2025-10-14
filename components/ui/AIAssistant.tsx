"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MessageCircle, 
  X, 
  Mic, 
  Square, 
  Bot, 
  User,
  Volume2
} from "lucide-react";

interface Message {
  role: "user" | "bot";
  text: string;
  audioUrl?: string;
}

// VAD: Constants for silence detection
const SILENCE_DURATION = 3000; // ms
const SILENCE_THRESHOLD = 0.01; // RMS volume threshold

export default function VoiceAIAssistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [micPermissionGranted, setMicPermissionGranted] = useState(false);
  const router = useRouter();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // VAD: Refs for audio analysis
  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const audioStreamRef = useRef<MediaStream | null>(null);


  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  
  useEffect(() => {
    if (open) {
      speakText("Hello! I'm your AI assistant. How can I help you today?")
    } else {
        // Cleanup on close
        stopRecording();
        stopSpeaking();
    }
  },[open])

  const requestMicPermission = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      setMicPermissionGranted(true);
      return true;
    } catch (error) {
      console.error("Microphone permission denied:", error);
      alert("Microphone permission is required to use the voice assistant.");
      setOpen(false);
      return false;
    }
  };

  // VAD: Function to detect silence
  const detectSilence = () => {
    if (!analyserRef.current) return;
    
    const dataArray = new Uint8Array(analyserRef.current.fftSize);
    analyserRef.current.getByteTimeDomainData(dataArray);
    
    // Calculate RMS volume
    let sumSquares = 0.0;
    for (const amplitude of dataArray) {
        const normalizedAmp = (amplitude / 128.0) - 1.0; // convert to -1.0 to 1.0 range
        sumSquares += normalizedAmp * normalizedAmp;
    }
    const rms = Math.sqrt(sumSquares / dataArray.length);

    if (rms > SILENCE_THRESHOLD) {
        // User is speaking, clear any existing silence timer
        if (silenceTimerRef.current) {
            clearTimeout(silenceTimerRef.current);
            silenceTimerRef.current = null;
        }
    } else {
        // User is silent, start a timer if not already running
        if (!silenceTimerRef.current) {
            silenceTimerRef.current = setTimeout(() => {
                console.log("Silence detected, stopping recording.");
                stopRecording();
            }, SILENCE_DURATION);
        }
    }

    animationFrameRef.current = requestAnimationFrame(detectSilence);
  };

  const startRecording = async () => {
    if (!micPermissionGranted) {
        const permission = await requestMicPermission();
        if (!permission) return;
    }
    
    setIsProcessing(false); // Reset processing state

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { sampleRate: 48000, channelCount: 1, echoCancellation: true, noiseSuppression: true },
      });
      audioStreamRef.current = stream;

      // VAD: Setup Web Audio API for analysis
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 2048;
      source.connect(analyserRef.current);
      
      // Start the silence detection loop
      detectSilence();

      // Setup MediaRecorder
      audioChunksRef.current = [];
      const mediaRecorder = new MediaRecorder(stream, { mimeType: "audio/webm;codecs=opus" });

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        if (audioChunksRef.current.length > 0) {
            const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
            await sendAudioToServer(audioBlob);
        }
        // Stop all tracks on the stream
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error starting recording:", error);
      alert("Could not access microphone.");
    }
  };

  const stopRecording = () => {
    // VAD: Cleanup audio analysis components
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close();
    }
    if (audioStreamRef.current) {
        audioStreamRef.current.getTracks().forEach(track => track.stop());
        audioStreamRef.current = null;
    }

    // Stop MediaRecorder
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const sendAudioToServer = async (audioBlob: Blob) => {
    if (isProcessing) return; // Prevent double submissions
    setIsProcessing(true);
    setIsRecording(false); // Visually indicate that recording has stopped

    try {
      const formData = new FormData();
      formData.append("audio", audioBlob, "recording.webm");

      const currentUrl = window.location.pathname;
      const pageText = document.body.innerText;
      formData.append("url", currentUrl);
      formData.append("content", pageText);
      
      const userMsg: Message = {
        role: "user",
        text: "Voice message",
        audioUrl: URL.createObjectURL(audioBlob),
      };
      setMessages(prev => [...prev, userMsg]);

      const response = await fetch("/api/ai-assistant", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.response) {
        const botMsg: Message = { role: "bot", text: data.response };
        setMessages(prev => [...prev, botMsg]);
        speakText(data.response);
      }

      if (data.action === "navigate") {
        if (data.target.includes("signup")) router.push("/auth/signup");
        else if (data.target.includes("signin") || data.target.includes("login")) router.push("/auth/signin");
        else if (data.target.includes("visualize")) {
          // router.push("/visualize_lesson");
        }
      } else if (data.action === "summarize") {
        // router.push("/visualize_lesson");
      }

    } catch (error) {
      console.error("Error sending audio:", error);
      setMessages(prev => [...prev, { role: "bot", text: "Sorry, I couldn't process your voice message." }]);
    } finally {
      setIsProcessing(false);
    }
  };

  const speakText = (text: string) => {
    if ("speechSynthesis" in window) {
      stopSpeaking(); // Cancel any previous speech
      setIsSpeaking(true);
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = (e) => {
        console.error("SpeechSynthesis error:", e);
        setIsSpeaking(false);
      };
      speechSynthesis.speak(utterance);
    }
  };

  const stopSpeaking = () => {
    if ("speechSynthesis" in window && speechSynthesis.speaking) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const playAudio = (audioUrl: string) => {
    new Audio(audioUrl).play();
  };

  const toggleAssistant = () => {
    setOpen(prev => !prev);
  };
  
  const handleMicClick = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  }

  return (
    <>
      {/* Floating Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={toggleAssistant}
        className={`fixed bottom-6 right-6 z-50 rounded-2xl p-4 shadow-2xl transition-all duration-300 ${
          open 
            ? "bg-gradient-to-br from-red-500 to-pink-600" 
            : "bg-gradient-to-br from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
        }`}
      >
        <motion.div
          animate={{ rotate: open ? 90 : 0 }}
          transition={{ duration: 0.3 }}
        >
          {open ? <X size={24} className="text-white" /> : <MessageCircle size={24} className="text-white" />}
        </motion.div>
      </motion.button>

      {/* Chat UI */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-24 right-6 w-80 h-[500px] bg-white rounded-3xl shadow-2xl border border-gray-200/80 backdrop-blur-sm z-40 flex flex-col"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 rounded-t-3xl text-white flex justify-between items-center flex-shrink-0">
              <div className="flex items-center gap-2">
                <div className="bg-white/20 p-2 rounded-xl"><Bot size={20} /></div>
                <div>
                  <h3 className="font-bold text-lg">Voice Assistant</h3>
                  <p className="text-blue-100 text-xs">{isRecording ? "Listening..." : "Ready"}</p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-gray-50 to-white">
              {messages.map((msg, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    msg.role === "user" ? "bg-blue-500" : "bg-gradient-to-r from-purple-500 to-pink-500"
                  }`}>
                    {msg.role === "user" ? <User size={16} className="text-white" /> : <Bot size={16} className="text-white" />}
                  </div>
                  <div className={`max-w-[80%] rounded-2xl p-3 shadow-sm ${
                    msg.role === "user" ? "bg-blue-500 text-white rounded-br-none" : "bg-gray-100 text-gray-800 rounded-bl-none"
                  }`}>
                    {msg.audioUrl && (
                      <button onClick={() => playAudio(msg.audioUrl!)} className="p-1 bg-white/20 rounded-full mb-2 hover:bg-white/40 transition">
                        <Volume2 size={12} />
                      </button>
                    )}
                    <p className="text-sm break-words">{msg.text}</p>
                    {msg.role === "bot" && (
                      <button
                        onClick={() => isSpeaking ? stopSpeaking() : speakText(msg.text)}
                        className={`mt-2 p-1 rounded-full transition ${isSpeaking ? 'bg-red-100 text-red-600' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'}`}
                      >
                        <Volume2 size={12} />
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
              {isProcessing && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3 justify-start">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                    <Bot size={16} className="text-white" />
                  </div>
                  <div className="bg-gray-100 text-gray-800 rounded-2xl p-3 max-w-[80%]">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse delay-75"></div>
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse delay-150"></div>
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse delay-300"></div>
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Voice Control */}
            <div className="p-4 border-t bg-white rounded-b-3xl flex justify-center flex-shrink-0">
              <button
                onClick={handleMicClick}
                disabled={isProcessing}
                className={`p-4 rounded-full transition-all duration-300 transform active:scale-90 disabled:opacity-50 disabled:cursor-not-allowed ${
                  isRecording 
                    ? "bg-red-500 text-white shadow-lg animate-pulse" 
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {isRecording ? <Square size={24} /> : <Mic size={24} />}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}