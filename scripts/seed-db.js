const LuminaDatabase = require('../lib/db/database.js');

console.log('🌱 Seeding Lumina+ Database with sample data...');

try {
  const db = new LuminaDatabase();
  
  // Create sample users
  console.log('👥 Creating sample users...');
  
  // Teacher user
  const teacher = db.createUser({
    email: 'teacher@lumina.com',
    name: 'Sarah Johnson',
    passwordHash: 'hashed_password_123', // In real app, use proper hashing
    role: 'teacher',
    accessibilityProfile: 'none',
    settings: {
      highContrast: false,
      dyslexiaFriendly: false,
      fontSize: 'medium',
      voiceNavigation: false
    }
  });
  
  // Student users with different accessibility profiles
  const visualStudent = db.createUser({
    email: 'riya@student.com',
    name: 'Riya Sharma',
    passwordHash: 'hashed_password_456',
    role: 'student',
    accessibilityProfile: 'visual',
    settings: {
      highContrast: true,
      dyslexiaFriendly: false,
      fontSize: 'large',
      voiceNavigation: true
    }
  });
  
  const hearingStudent = db.createUser({
    email: 'aarav@student.com',
    name: 'Aarav Patel',
    passwordHash: 'hashed_password_789',
    role: 'student',
    accessibilityProfile: 'hearing',
    settings: {
      highContrast: false,
      dyslexiaFriendly: false,
      fontSize: 'medium',
      captions: true
    }
  });
  
  const cognitiveStudent = db.createUser({
    email: 'meena@student.com',
    name: 'Meena Kumar',
    passwordHash: 'hashed_password_101',
    role: 'student',
    accessibilityProfile: 'cognitive',
    settings: {
      highContrast: false,
      dyslexiaFriendly: true,
      fontSize: 'large',
      focusMode: true
    }
  });
  
  // Create sample classrooms
  console.log('🏫 Creating sample classrooms...');
  
  const scienceClassroom = db.createClassroom({
    name: 'Class 7 Science',
    subject: 'Science',
    description: 'General Science for Grade 7 students',
    teacherId: teacher.lastInsertRowid
  });
  
  const mathClassroom = db.createClassroom({
    name: 'Class 8 Mathematics',
    subject: 'Mathematics',
    description: 'Advanced Mathematics for Grade 8',
    teacherId: teacher.lastInsertRowid
  });
  
  // Create sample content
  console.log('📚 Creating sample content...');
  
  const solarSystemContent = db.createContent({
    title: 'Introduction to Solar System',
    type: 'video',
    originalFilePath: '/uploads/solar-system.mp4',
    classroomId: scienceClassroom.lastInsertRowid,
    teacherId: teacher.lastInsertRowid,
    durationMinutes: 15,
    difficulty: 'beginner'
  });
  
  const algebraContent = db.createContent({
    title: 'Algebra Basics',
    type: 'pdf',
    originalFilePath: '/uploads/algebra-basics.pdf',
    classroomId: mathClassroom.lastInsertRowid,
    teacherId: teacher.lastInsertRowid,
    durationMinutes: 20,
    difficulty: 'intermediate'
  });
  
  const photosynthesisContent = db.createContent({
    title: 'Photosynthesis Process',
    type: 'youtube',
    youtubeUrl: 'https://youtube.com/watch?v=example',
    classroomId: scienceClassroom.lastInsertRowid,
    teacherId: teacher.lastInsertRowid,
    durationMinutes: 12,
    difficulty: 'beginner'
  });
  
  // Create processed content for accessibility
  console.log('🤖 Creating AI processed content...');
  
  const contentIds = [
    solarSystemContent.lastInsertRowid,
    algebraContent.lastInsertRowid,
    photosynthesisContent.lastInsertRowid
  ];
  
  contentIds.forEach(contentId => {
    // Visual accessibility processing
    db.createProcessedContent({
      contentId: contentId,
      accessibilityType: 'visual',
      processedData: {
        ttsAudioPath: `/processed/tts_${contentId}.mp3`,
        imageDescriptions: ['Diagram of solar system with planets orbiting the sun'],
        highContrastVersion: `/processed/high_contrast_${contentId}.pdf`,
        largeTextVersion: `/processed/large_text_${contentId}.pdf`
      },
      processingCompleted: true
    });
    
    // Hearing accessibility processing
    db.createProcessedContent({
      contentId: contentId,
      accessibilityType: 'hearing',
      processedData: {
        captionsPath: `/processed/captions_${contentId}.vtt`,
        transcriptPath: `/processed/transcript_${contentId}.txt`,
        signLanguageVideoPath: `/processed/sign_${contentId}.mp4`,
        visualIndicators: true
      },
      processingCompleted: true
    });
    
    // Cognitive accessibility processing
    db.createProcessedContent({
      contentId: contentId,
      accessibilityType: 'cognitive',
      processedData: {
        simplifiedTextPath: `/processed/simplified_${contentId}.txt`,
        summaryPath: `/processed/summary_${contentId}.txt`,
        bulletPointsPath: `/processed/bullets_${contentId}.txt`,
        dyslexiaFontVersion: `/processed/dyslexia_${contentId}.pdf`
      },
      processingCompleted: true
    });
    
    // Motor accessibility processing
    db.createProcessedContent({
      contentId: contentId,
      accessibilityType: 'motor',
      processedData: {
        voiceNavigationEnabled: true,
        largeButtonsEnabled: true,
        keyboardShortcuts: ['1', '2', '3', 'space', 'enter'],
        touchOptimized: true
      },
      processingCompleted: true
    });
  });
  
  // Create sample student progress
  console.log('📈 Creating sample student progress...');
  
  const studentIds = [
    visualStudent.lastInsertRowid,
    hearingStudent.lastInsertRowid,
    cognitiveStudent.lastInsertRowid
  ];
  
  studentIds.forEach((studentId, index) => {
    contentIds.forEach((contentId, contentIndex) => {
      const progress = Math.floor(Math.random() * 100);
      const timeSpent = Math.floor(Math.random() * 60) + 10;
      
      db.updateStudentProgress({
        studentId: studentId,
        contentId: contentId,
        progressPercentage: progress,
        timeSpentMinutes: timeSpent,
        completed: progress === 100,
        bookmarks: [120, 300, 450], // timestamp bookmarks
        notes: `Notes for content ${contentId} by student ${studentId}`
      });
    });
  });
  
  // Create sample activities
  console.log('🎯 Creating sample activities...');
  
  contentIds.forEach(contentId => {
    // Quiz activity
    db.createActivity({
      contentId: contentId,
      title: `Quiz: Content ${contentId}`,
      type: 'quiz',
      difficulty: 'easy',
      priority: 'high',
      activityData: {
        questions: [
          {
            question: 'What is the largest planet in our solar system?',
            options: ['Earth', 'Jupiter', 'Saturn', 'Mars'],
            correctAnswer: 1
          },
          {
            question: 'How many planets are in our solar system?',
            options: ['7', '8', '9', '10'],
            correctAnswer: 1
          }
        ],
        timeLimit: 300 // 5 minutes
      }
    });
    
    // Experiment activity
    db.createActivity({
      contentId: contentId,
      title: `Experiment: Content ${contentId}`,
      type: 'experiment',
      difficulty: 'medium',
      priority: 'medium',
      activityData: {
        instructions: 'Create a model of the solar system using household items',
        materials: ['Balls of different sizes', 'Paint', 'String'],
        steps: [
          'Paint the largest ball yellow for the sun',
          'Paint smaller balls different colors for planets',
          'Arrange in order from the sun'
        ]
      }
    });
  });
  
  // Create sample notifications
  console.log('🔔 Creating sample notifications...');
  
  studentIds.forEach(studentId => {
    db.createNotification({
      userId: studentId,
      type: 'motivational',
      title: 'Great Progress!',
      message: 'You\'re doing amazing! Keep up the great work! 🌟'
    });
    
    db.createNotification({
      userId: studentId,
      type: 'reminder',
      title: 'New Lesson Available',
      message: 'A new lesson on Photosynthesis has been added to your Science class.'
    });
    
    db.createNotification({
      userId: studentId,
      type: 'achievement',
      title: 'Achievement Unlocked!',
      message: 'You\'ve earned the "Week Warrior" badge for studying 7 days in a row!'
    });
  });
  
  // Create sample achievements
  console.log('🏆 Creating sample achievements...');
  
  studentIds.forEach(studentId => {
    db.awardAchievement({
      userId: studentId,
      achievementType: 'streak',
      achievementName: 'Week Warrior',
      description: 'Study for 7 consecutive days'
    });
    
    db.awardAchievement({
      userId: studentId,
      achievementType: 'completion',
      achievementName: 'Quick Learner',
      description: 'Complete a lesson in under 10 minutes'
    });
    
    db.awardAchievement({
      userId: studentId,
      achievementType: 'accessibility',
      achievementName: 'Accessibility Champion',
      description: 'Use accessibility features for better learning'
    });
  });
  
  // Create sample learning streaks
  console.log('🔥 Creating sample learning streaks...');
  
  studentIds.forEach(studentId => {
    const currentStreak = Math.floor(Math.random() * 15) + 1;
    db.updateLearningStreak(studentId, currentStreak);
  });
  
  // Track sample accessibility usage
  console.log('♿ Creating sample accessibility usage data...');
  
  const accessibilityFeatures = ['tts', 'captions', 'simplified', 'focus_mode', 'high_contrast', 'voice_navigation'];
  
  studentIds.forEach(studentId => {
    accessibilityFeatures.forEach(feature => {
      const usageCount = Math.floor(Math.random() * 50) + 1;
      const sessionDuration = Math.floor(Math.random() * 300) + 60;
      
      db.trackAccessibilityUsage({
        userId: studentId,
        contentId: contentIds[Math.floor(Math.random() * contentIds.length)],
        featureType: feature,
        usageCount: usageCount,
        sessionDurationSeconds: sessionDuration
      });
    });
  });
  
  // Log sample user interactions
  console.log('👆 Creating sample user interactions...');
  
  const interactionTypes = ['play', 'pause', 'seek', 'speed_change', 'view_change', 'tts_used', 'caption_toggle'];
  
  studentIds.forEach(studentId => {
    for (let i = 0; i < 20; i++) {
      db.logUserInteraction({
        userId: studentId,
        contentId: contentIds[Math.floor(Math.random() * contentIds.length)],
        interactionType: interactionTypes[Math.floor(Math.random() * interactionTypes.length)],
        interactionData: {
          timestamp: Date.now(),
          value: Math.random() * 100
        }
      });
    }
  });
  
  console.log('✅ Database seeded successfully!');
  console.log('📊 Sample data created:');
  console.log('   - 4 Users (1 teacher, 3 students)');
  console.log('   - 2 Classrooms');
  console.log('   - 3 Content items');
  console.log('   - 12 AI processed versions');
  console.log('   - 9 Student progress records');
  console.log('   - 6 Activities');
  console.log('   - 9 Notifications');
  console.log('   - 9 Achievements');
  console.log('   - 3 Learning streaks');
  console.log('   - Multiple accessibility usage records');
  console.log('   - Multiple user interaction logs');
  
  // Close database connection
  db.close();
  
} catch (error) {
  console.error('❌ Database seeding failed:', error.message);
  console.error(error.stack);
  process.exit(1);
}