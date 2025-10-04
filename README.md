# Lumina+ 🌟

**Lighting the way for every learner**

Bridging barriers in education through technology, making learning accessible, engaging, and empowering for differently-abled students.

## 🚀 Features

### 🎯 Core Accessibility Features
- **🎙️ Speech-to-Text (STT)** - Auto-generate transcripts & captions from videos/YouTube lectures
- **🔊 Text-to-Speech (TTS)** - Narration for notes, books, transcripts with adjustable speed & voice
- **✍️ Simplified Summaries** - Easy-to-read versions for students with cognitive challenges
- **🖼️ Image Alt-Text Generation** - AI-generated descriptions for images in books/notes
- **📖 Multiple Reading Levels** - Original, summarized, and simplified modes

### 🎨 Personalized Accessibility
- High contrast & dyslexia-friendly fonts
- Font size, spacing, and color theme adjustments
- Voice navigation & keyboard navigation support
- Captions toggle for videos & live lectures
- Downloadable transcripts, audio versions, and braille-ready text

### 📚 Content Support
- Upload Notes, Docs, PDFs, eBooks (EPUB, DOCX, PDF)
- Upload Recorded Videos (MP4, etc.)
- Add YouTube Lecture URLs
- Real-time processing with AI accessibility features

### 👥 User Roles

#### 🎓 Students
- Unified viewer with Original + Accessible Versions side by side
- Play narration, read transcript, or see simplified version
- Interactive notes with focus mode (distraction-free reading)
- Offline mode (download and study without internet)

#### 👨‍🏫 Teachers
- Upload lessons in multiple formats
- Auto-generated accessible resources (captions, narration, summaries)
- Ability to tag lessons with accessibility presets
- Share lessons with classes easily
- Analytics & progress tracking

## 🏗️ Architecture

### Frontend (Next.js 14 + TypeScript)
```
app/
├── page.tsx                 # Landing Page - Role & Accessibility Selection
├── dashboard/
│   └── page.tsx            # Dashboard - Upload & Lesson Management
└── lesson/[id]/
    └── page.tsx            # Lesson Viewer - Split Screen Learning

components/
├── ui/
│   └── Button.tsx          # Accessible Button Component
└── accessibility/
    ├── AccessibilityToolbar.tsx
    └── VoiceNavigator.tsx

lib/
├── accessibility-context.tsx  # Global Accessibility State
├── types.ts                  # TypeScript Definitions
└── utils.ts                  # Utility Functions
```

### Key Technologies
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety and better DX
- **Tailwind CSS** - Utility-first styling with accessibility focus
- **Framer Motion** - Smooth animations (respects reduced motion)
- **Web Speech API** - Browser-native TTS/STT
- **ARIA Standards** - Full screen reader compatibility

## 🎯 Accessibility Profiles

### 👁️ Visual Impairment
- **Auto-enabled**: High contrast, large fonts, voice navigation
- **Features**: Screen reader support, keyboard navigation, audio narration
- **Voice Commands**: "Student", "Teacher", "High Contrast", "Focus Mode"

### 👂 Hearing Impairment  
- **Auto-enabled**: Captions, transcripts, visual indicators
- **Features**: Real-time captions, downloadable transcripts, emoji-enhanced text
- **Visual Cues**: Color-coded interactions, progress indicators

### 🧠 Cognitive Support
- **Auto-enabled**: Simplified text, focus mode, dyslexia-friendly fonts
- **Features**: Distraction-free reading, slower pace, gamified progress
- **Simplified UI**: "I am a learner" vs "I am a guide"

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd lumina-plus
```

2. **Install dependencies**
```bash
npm install
```

3. **Run development server**
```bash
npm run dev
```

4. **Open in browser**
```
http://localhost:3000
```

### Project Structure
```
Lumina/
├── app/                    # Next.js App Router pages
├── components/             # Reusable React components
├── lib/                    # Utilities and context
├── public/                 # Static assets (logo, etc.)
├── styles/                 # Global CSS with accessibility features
├── package.json           # Dependencies and scripts
├── tailwind.config.js     # Tailwind with accessibility colors
└── tsconfig.json          # TypeScript configuration
```

## 🎨 Design System

### Accessibility Colors
```css
--primary: #0ea5e9          /* High contrast blue */
--accessibility-high: #000  /* Maximum contrast */
--dyslexia-bg: #fef3c7      /* Dyslexia-friendly yellow */
```

### Typography
- **OpenDyslexic** - For dyslexia-friendly reading
- **Inter** - Clean, readable system font
- **Scalable sizes** - 14px to 32px with proper line height

### Focus Management
- **Focus Mode** - Blur non-active content
- **Keyboard Navigation** - Full tab order support
- **Screen Reader** - Proper ARIA labels and landmarks

## 🔧 Key Components

### AccessibilityProvider
Global context managing user preferences and TTS/STT functionality.

### VoiceNavigator  
Floating microphone button for hands-free navigation.

### AccessibilityToolbar
Quick toggles for contrast, fonts, focus mode, and voice features.

### Lesson Viewer
Split-screen interface with original content (left) and adaptive content (right).

## 🎯 Real-World Use Case

**Scenario**: Class 7 Science - "Solar System" lesson

1. **Teacher uploads** video lecture
2. **AI processes** content:
   - Generates captions (STT)
   - Creates simplified summary
   - Produces audio narration (TTS)
3. **Students access** personalized versions:
   - **Riya (Visual)**: Audio narration + transcript
   - **Aarav (Hearing)**: Captions + sign language avatar
   - **Meena (Cognitive)**: Simplified text + focus mode

## 🏆 Hackathon Highlights

### Innovation
- **One lesson, three experiences** - Same content, personalized delivery
- **Voice-first onboarding** - Say "Student" or "Teacher" to begin
- **Real-time adaptation** - Content transforms based on accessibility needs

### Technical Excellence
- **3 clean pages** - Landing, Dashboard, Lesson Viewer
- **Full TypeScript** - Type-safe development
- **WCAG Compliant** - Meets accessibility standards
- **Performance Optimized** - Fast loading, smooth interactions

### Impact
- **Inclusive Education** - No student left behind
- **Teacher Efficiency** - Auto-generated accessibility features
- **Scalable Solution** - Works for any educational content

## 🔮 Future Enhancements

- **Sign Language Avatar** - Real-time sign language interpretation
- **AI Tutoring** - Personalized learning assistance
- **Offline Mode** - Download lessons for offline study
- **Parent Dashboard** - Progress tracking for guardians
- **Multi-language** - Support for regional languages

## 📊 Analytics & Tracking

- Student progress tracking (time spent, lessons completed)
- Accessibility features usage analytics
- Reports for teachers & parents
- Learning outcome measurements

## 🤝 Contributing

We welcome contributions! Please see our contributing guidelines for more details.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**Lumina+** - Because every learner deserves to shine ✨