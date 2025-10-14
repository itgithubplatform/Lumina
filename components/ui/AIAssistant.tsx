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
  id?: string;
  role: "user" | "bot";
  text: string;
  audioUrl?: string;
}

// VAD: Constants for silence detection
const SILENCE_DURATION = 2000; // ms
const SILENCE_THRESHOLD = 0.01; // RMS volume threshold

export default function VoiceAIAssistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [micPermissionGranted, setMicPermissionGranted] = useState<boolean | null>(null);
  const router = useRouter();
  
  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const audioStreamRef = useRef<MediaStream | null>(null);
  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);
  // FIX: Ref to hold the utterance object and prevent garbage collection
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  
  useEffect(() => {
    if (open) {
      // Clear previous conversation and give a greeting
      setMessages([]);
      // Use a small timeout to ensure the speech engine is ready
      setTimeout(() => {
          const greeting = "Hello! How can I assist you?";
          setMessages([{ role: 'bot', text: greeting }]);
          speakText(greeting);
          
      }, 100);
      setTimeout(()=>{
        startRecording();
      },4000)
    } else {
      // Cleanup on close
      stopRecording();
      stopSpeaking();
    }
  },[open]);

  const requestMicPermission = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      setMicPermissionGranted(true);
      return true;
    } catch (error) {
      console.error("Microphone permission denied:", error);
      alert("Microphone permission is required to use the voice assistant.");
      setMicPermissionGranted(false);
      setOpen(false);
      return false;
    }
  };

  const startRecording = async () => {
    try {
      window.speechSynthesis.cancel();
    } catch (error) {
      
    }
    if (micPermissionGranted === null) {
      const permission = await requestMicPermission();
      if (!permission) return;
    } else if (micPermissionGranted === false) {
      alert("Please grant microphone permission in your browser settings.");
      return;
    }
    
    setIsProcessing(false);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { sampleRate: 48000, echoCancellation: true, noiseSuppression: true },
      });
      audioStreamRef.current = stream;

      const context = new (window.AudioContext || (window as any).webkitAudioContext)();
      const source = context.createMediaStreamSource(stream);
      const analyser = context.createAnalyser();
      analyser.fftSize = 2048;
      source.connect(analyser);
      
      audioContextRef.current = context;
      analyserRef.current = analyser;
      detectSilence();

      audioChunksRef.current = [];
      const mediaRecorder = new MediaRecorder(stream, { mimeType: "audio/webm;codecs=opus" });
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        if (audioBlob.size > 100) { // Only send if there's actual audio
            await sendAudioToServer(audioBlob);
        }
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.log("Error starting recording:", error);
    }
  };

  const stopRecording = () => {
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    audioContextRef.current?.close().catch(console.error);

    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
  };

  const detectSilence = () => {
    if (!analyserRef.current) return;
    
    const dataArray = new Float32Array(analyserRef.current.fftSize);
    analyserRef.current.getFloatTimeDomainData(dataArray);
    let sumSquares = 0.0;
    for (const amplitude of dataArray) {
        sumSquares += amplitude * amplitude;
    }
    const rms = Math.sqrt(sumSquares / dataArray.length);

    if (rms > SILENCE_THRESHOLD) {
        if (silenceTimerRef.current) {
            clearTimeout(silenceTimerRef.current);
            silenceTimerRef.current = null;
        }
    } else {
        if (!silenceTimerRef.current) {
            silenceTimerRef.current = setTimeout(() => {
                stopRecording();
            }, SILENCE_DURATION);
        }
    }
    animationFrameRef.current = requestAnimationFrame(detectSilence);
  };

  // NEW: Central handler for actions returned by the API
  const handleApiAction = (data: { action?: string; target?: string }) => {
    if (!data.action || !data.target) return;

    switch (data.action) {
      case 'navigate':
        router.push(data.target);
        setOpen(false); // Close assistant on navigation
        break;

      case 'navigate_to_file':
      case 'navigate_to_class':
        router.push(data.target);
        setOpen(false);
        break;

      case 'download':
        const link = document.createElement('a');
        link.href = data.target;
        link.setAttribute('download', ''); // This attribute triggers the download
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        break;
      
      // Other actions like 'summarize', 'myFiles', etc., are handled by displaying the 'response' text.
      default:
        break;
    }
  };

  const sendAudioToServer = async (audioBlob: Blob) => {
    if (isProcessing) return;
    setIsProcessing(true);
    setIsRecording(false);

    const userMsg: Message = {
      role: "user",
      text: "(Your voice message)",
      audioUrl: URL.createObjectURL(audioBlob),
    };
    
    const tempBotMessageId = `bot-loading-${Date.now()}`;
    const tempBotMsg: Message = {
      id: tempBotMessageId,
      role: "bot",
      text: "...", // Placeholder for loader
    };
    setMessages(prev => [...prev, userMsg, tempBotMsg]);

    try {
      const formData = new FormData();
      formData.append("audio", audioBlob, "recording.webm");
      formData.append("url", window.location.pathname);
      formData.append("content", document.body.innerText.slice(0, 4000));

      const response = await fetch("/api/ai-assistant", { method: "POST", body: formData });
      if (!response.ok) throw new Error(`Server error: ${response.statusText}`);

      const data = await response.json();

      const finalBotMsg: Message = { role: "bot", text: data.response || "I'm not sure how to respond to that." };
      setMessages(prev => prev.map(msg => msg.id === tempBotMessageId ? finalBotMsg : msg));
      
      if(data.response) speakText(data.response);
      
      // FIX: Call the new action handler
      handleApiAction(data);

    } catch (error) {
      console.error("Error sending audio:", error);
      const errorMsgText = "Sorry, I had trouble processing that.";
      setMessages(prev => prev.map(msg => msg.id === tempBotMessageId ? { role: 'bot', text: errorMsgText } : msg));
      speakText(errorMsgText);
    } finally {
      setIsProcessing(false);
    }
  };

  // FIX: More robust speech synthesis function
  const speakText = (text: string) => {
    if (!text || typeof window === 'undefined' || !window.speechSynthesis) return;

    stopSpeaking(); // Ensure any previous speech is stopped

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1;
    utterance.pitch = 1;

    utterance.onend = () => {
      setIsSpeaking(false);
      utteranceRef.current = null;
    };
    utterance.onerror = (e) => {
      console.error("SpeechSynthesis Error:", e);
      setIsSpeaking(false);
      utteranceRef.current = null;
    };
    
    // Hold a reference to prevent premature garbage collection
    utteranceRef.current = utterance;
    
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  };

  const toggleAssistant = () => setOpen(prev => !prev);
  const handleMicClick = () => isRecording ? stopRecording() : startRecording();
  
  return (
    <>
      <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={toggleAssistant}
        className={`fixed bottom-6 right-6 z-50 rounded-2xl p-4 shadow-2xl transition-all duration-300 ${open ? "bg-gradient-to-br from-red-500 to-pink-600" : "bg-gradient-to-br from-blue-500 to-purple-600"}`}>
        <motion.div animate={{ rotate: open ? 90 : 0 }} transition={{ duration: 0.3 }}>
          {open ? <X size={24} className="text-white" /> : <MessageCircle size={24} className="text-white" />}
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-24 right-6 w-80 h-[500px] bg-white rounded-3xl shadow-2xl border flex flex-col z-40">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 rounded-t-3xl text-white flex items-center gap-2 flex-shrink-0">
                <div className="bg-white/20 p-2 rounded-xl"><Bot size={20} /></div>
                <div>
                    <h3 className="font-bold text-lg">AI Assistant</h3>
                    <p className="text-blue-100 text-xs">{isProcessing ? "Thinking..." : isRecording ? "Listening..." : "Ready"}</p>
                </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, index) => (
                <motion.div key={index} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === "user" ? "bg-blue-500" : "bg-purple-500"}`}>
                    {msg.role === "user" ? <User size={16} className="text-white" /> : <Bot size={16} className="text-white" />}
                  </div>
                  <div className={`max-w-[80%] rounded-2xl p-3 shadow-sm ${msg.role === "user" ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-800"}`}>
                    {msg.text === "..." ? (
                        <div className="flex items-center gap-1 p-1">
                          <span className="h-2 w-2 animate-bounce rounded-full bg-gray-500 [animation-delay:-0.3s]"></span>
                          <span className="h-2 w-2 animate-bounce rounded-full bg-gray-500 [animation-delay:-0.15s]"></span>
                          <span className="h-2 w-2 animate-bounce rounded-full bg-gray-500"></span>
                        </div>
                    ) : (
                        <p className="text-sm break-words">{msg.text}</p>
                    )}
                    {msg.role === "bot" && msg.text !== "..." && (
                      <button onClick={() => isSpeaking ? stopSpeaking() : speakText(msg.text)} className={`mt-2 p-1 rounded-full ${isSpeaking ? 'bg-red-100' : 'bg-gray-200'}`}>
                        <Volume2 size={12} />
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            <div className="p-4 border-t bg-white rounded-b-3xl flex justify-center flex-shrink-0">
              <button onClick={handleMicClick} disabled={isProcessing}
                className={`p-4 rounded-full transition-all ${isRecording ? "bg-red-500 text-white animate-pulse" : "bg-gray-200"}`}>
                {isRecording ? <Square size={24} /> : <Mic size={24} />}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}