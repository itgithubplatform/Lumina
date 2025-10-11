import { Plus, Sparkles, BookOpen, Users } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "nextjs-toploader/app";

export default function CreateClassroomSection({setReload}:{
  setReload: React.Dispatch<React.SetStateAction<boolean>>
}) {
  const [classroomName, setClassroomName] = useState("");
  const [subject, setSubject] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const handleCreate = async () => {
    if (!classroomName.trim() || !subject.trim()) {
      setError("Please fill in both fields");
      return;
    }
    setIsCreating(true);
    try {
      const res = await fetch("/api/classroom/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: classroomName, subject }),
        cache: "no-store",
      });
  
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Something went wrong");
        return;
      }
      setReload(e=>!e);
      router.push(`/classroom/${data.classroom.id}`);
    } catch (error) {
      console.log(error);
      if(error instanceof Error) setError(error.message);
      setError("Something went wrong");
      return;
      
    }finally {
      setIsCreating(false);
    }
    setClassroomName("");
    setSubject("");
    setIsCreating(false);

  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 rounded-3xl shadow-xl border border-gray-100/80 p-6 sm:p-8 mb-8 max-w-4xl mx-auto relative overflow-hidden"
    >
      {/* Background decorative elements */}
      <div className="absolute -top-10 -right-10 w-20 h-20 bg-blue-200/20 rounded-full blur-xl"></div>
      <div className="absolute -bottom-8 -left-8 w-16 h-16 bg-purple-200/20 rounded-full blur-xl"></div>
      
      {/* Header */}
      <div className="flex items-start gap-4 mb-8 relative z-10">
        <motion.div 
          className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-3 shadow-lg"
          whileHover={{ scale: 1.05, rotate: 5 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Plus size={28} className="text-white" />
        </motion.div>
        <div className="flex-1">
          <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            Create New Classroom
          </h2>
          <p className="text-gray-500 text-sm sm:text-base mt-2 leading-relaxed">
            Set up a classroom to share lessons and resources with students.
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8 relative z-10">
        {/* Classroom Name Field */}
        <motion.div 
          className="relative"
          whileFocus={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 400 }}
        >
          <div className="absolute z-50 left-4 top-1/2 transform -translate-y-1/2">
            <BookOpen size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            id="classroomName"
            value={classroomName}
            onChange={(e) => {
              setError(null);
              setClassroomName(e.target.value)}}
            className="peer w-full pl-10 pr-4 py-4 bg-white/80 border border-gray-200 rounded-2xl focus:ring-0 focus:outline-0 focus:ring-green-500/50 focus:border-green-500 text-gray-900 placeholder-transparent shadow-sm transition-all duration-200 backdrop-blur-sm"
            placeholder="Classroom Name"
          />
          <label
            htmlFor="classroomName"
            className="absolute left-10 -top-2 text-gray-500 text-sm transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:-top-2 peer-focus:text-sm peer-focus:text-gray-600 bg-white/80 backdrop-blur-sm px-2 rounded-lg"
          >
            Classroom Name
          </label>
        </motion.div>

        {/* Subject Field */}
        <motion.div 
          className="relative"
          whileFocus={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 400 }}
        >
          <div className="absolute z-50 left-4 top-1/2 transform -translate-y-1/2">
            <Users size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            id="subject"
            value={subject}
            onChange={(e) => {
              setError(null);
              setSubject(e.target.value)}}
            className="peer w-full pl-10 pr-4 py-4 bg-white/80 border border-gray-200 rounded-2xl focus:ring-0 focus:outline-0 focus:ring-green-500/50 focus:border-green-500 text-gray-900 placeholder-transparent shadow-sm transition-all duration-200 backdrop-blur-sm"
            placeholder="Subject"
          />
          <label
            htmlFor="subject"
            className="absolute left-10 -top-2 text-gray-500 text-sm transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:-top-2 peer-focus:text-sm peer-focus:text-gray-600 bg-white/80 backdrop-blur-sm px-2 rounded-lg"
          >
            Subject
          </label>
        </motion.div>
      </div>

        {/* Success/Error Messages */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="my-2 text-red-700 text-base text-center"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>
      {/* Action Button */}
      <div className="flex justify-center relative z-10">
        <motion.button
          onClick={handleCreate}
          disabled={isCreating}
          whileHover={{ scale: isCreating ? 1 : 1.01 }}
          className={`flex items-center gap-3 text-base font-semibold px-8 py-4 rounded-2xl shadow-lg transition-all duration-300 ${
            isCreating 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-blue-600 hover:to-indigo-500 transform '
          } text-white focus:ring-4 focus:ring-green-500/30 focus:outline-none`}
         
          >
          <AnimatePresence mode="wait">
            {isCreating ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0, rotate: -180 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: 180 }}
                className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"
              />
            ) : (
              <motion.div
                key="sparkles"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
              >
                <Sparkles size={20} />
              </motion.div>
            )}
          </AnimatePresence>
          
          <AnimatePresence mode="wait">
            <motion.span
              key={isCreating ? "creating" : "create"}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              {isCreating ? "Creating..." : "Create Classroom"}
            </motion.span>
          </AnimatePresence>
        </motion.button>
      </div>

    </motion.div>
  );
}