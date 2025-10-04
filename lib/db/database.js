const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');

class LuminaDatabase {
  constructor() {
    // Create database directory if it doesn't exist
    const dbDir = path.join(process.cwd(), 'database');
    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true });
    }

    // Initialize SQLite database
    this.db = new Database(path.join(dbDir, 'lumina.db'));
    this.db.pragma('journal_mode = WAL');
    this.db.pragma('foreign_keys = ON');
    
    this.initializeDatabase();
  }

  initializeDatabase() {
    // Read and execute schema
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    this.db.exec(schema);
    console.log('✅ Database initialized successfully');
  }

  // User Management
  createUser(userData) {
    const stmt = this.db.prepare(`
      INSERT INTO users (email, name, password_hash, role, accessibility_profile, settings)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    return stmt.run(
      userData.email,
      userData.name,
      userData.passwordHash,
      userData.role,
      userData.accessibilityProfile || 'none',
      JSON.stringify(userData.settings || {})
    );
  }

  getUserByEmail(email) {
    const stmt = this.db.prepare('SELECT * FROM users WHERE email = ?');
    return stmt.get(email);
  }

  getUserById(id) {
    const stmt = this.db.prepare('SELECT * FROM users WHERE id = ?');
    return stmt.get(id);
  }

  updateUserSettings(userId, settings) {
    const stmt = this.db.prepare('UPDATE users SET settings = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?');
    return stmt.run(JSON.stringify(settings), userId);
  }

  // Classroom Management
  createClassroom(classroomData) {
    const stmt = this.db.prepare(`
      INSERT INTO classrooms (name, subject, description, teacher_id)
      VALUES (?, ?, ?, ?)
    `);
    return stmt.run(
      classroomData.name,
      classroomData.subject,
      classroomData.description || '',
      classroomData.teacherId
    );
  }

  getClassroomsByTeacher(teacherId) {
    const stmt = this.db.prepare('SELECT * FROM classrooms WHERE teacher_id = ? ORDER BY created_at DESC');
    return stmt.all(teacherId);
  }

  getClassroomById(id) {
    const stmt = this.db.prepare('SELECT * FROM classrooms WHERE id = ?');
    return stmt.get(id);
  }

  // Content Management
  createContent(contentData) {
    const stmt = this.db.prepare(`
      INSERT INTO content (title, type, original_file_path, youtube_url, classroom_id, teacher_id, duration_minutes, difficulty)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
    return stmt.run(
      contentData.title,
      contentData.type,
      contentData.originalFilePath || null,
      contentData.youtubeUrl || null,
      contentData.classroomId,
      contentData.teacherId,
      contentData.durationMinutes || null,
      contentData.difficulty || 'beginner'
    );
  }

  getContentByClassroom(classroomId) {
    const stmt = this.db.prepare('SELECT * FROM content WHERE classroom_id = ? ORDER BY upload_date DESC');
    return stmt.all(classroomId);
  }

  updateContentProcessingStatus(contentId, status) {
    const stmt = this.db.prepare('UPDATE content SET processing_status = ? WHERE id = ?');
    return stmt.run(status, contentId);
  }

  // AI Processed Content
  createProcessedContent(processedData) {
    const stmt = this.db.prepare(`
      INSERT INTO processed_content (content_id, accessibility_type, processed_data, processing_completed)
      VALUES (?, ?, ?, ?)
    `);
    return stmt.run(
      processedData.contentId,
      processedData.accessibilityType,
      JSON.stringify(processedData.processedData),
      processedData.processingCompleted || false
    );
  }

  getProcessedContent(contentId, accessibilityType = null) {
    let query = 'SELECT * FROM processed_content WHERE content_id = ?';
    let params = [contentId];
    
    if (accessibilityType) {
      query += ' AND accessibility_type = ?';
      params.push(accessibilityType);
    }
    
    const stmt = this.db.prepare(query);
    return accessibilityType ? stmt.get(...params) : stmt.all(...params);
  }

  // Student Progress
  updateStudentProgress(progressData) {
    const stmt = this.db.prepare(`
      INSERT OR REPLACE INTO student_progress 
      (student_id, content_id, progress_percentage, time_spent_minutes, completed, last_accessed, bookmarks, notes)
      VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP, ?, ?)
    `);
    return stmt.run(
      progressData.studentId,
      progressData.contentId,
      progressData.progressPercentage,
      progressData.timeSpentMinutes,
      progressData.completed || false,
      JSON.stringify(progressData.bookmarks || []),
      progressData.notes || null
    );
  }

  getStudentProgress(studentId, contentId = null) {
    let query = 'SELECT * FROM student_progress WHERE student_id = ?';
    let params = [studentId];
    
    if (contentId) {
      query += ' AND content_id = ?';
      params.push(contentId);
    }
    
    const stmt = this.db.prepare(query);
    return contentId ? stmt.get(...params) : stmt.all(...params);
  }

  // Accessibility Usage Tracking
  trackAccessibilityUsage(usageData) {
    const stmt = this.db.prepare(`
      INSERT INTO accessibility_usage (user_id, content_id, feature_type, usage_count, session_duration_seconds)
      VALUES (?, ?, ?, ?, ?)
    `);
    return stmt.run(
      usageData.userId,
      usageData.contentId || null,
      usageData.featureType,
      usageData.usageCount || 1,
      usageData.sessionDurationSeconds || 0
    );
  }

  getAccessibilityUsageStats(userId) {
    const stmt = this.db.prepare(`
      SELECT feature_type, SUM(usage_count) as total_usage, AVG(session_duration_seconds) as avg_duration
      FROM accessibility_usage 
      WHERE user_id = ? 
      GROUP BY feature_type
    `);
    return stmt.all(userId);
  }

  // User Interactions
  logUserInteraction(interactionData) {
    const stmt = this.db.prepare(`
      INSERT INTO user_interactions (user_id, content_id, interaction_type, interaction_data)
      VALUES (?, ?, ?, ?)
    `);
    return stmt.run(
      interactionData.userId,
      interactionData.contentId || null,
      interactionData.interactionType,
      JSON.stringify(interactionData.interactionData || {})
    );
  }

  // Notifications
  createNotification(notificationData) {
    const stmt = this.db.prepare(`
      INSERT INTO notifications (user_id, type, title, message)
      VALUES (?, ?, ?, ?)
    `);
    return stmt.run(
      notificationData.userId,
      notificationData.type,
      notificationData.title,
      notificationData.message
    );
  }

  getUserNotifications(userId, unreadOnly = false) {
    let query = 'SELECT * FROM notifications WHERE user_id = ?';
    if (unreadOnly) {
      query += ' AND read_status = FALSE';
    }
    query += ' ORDER BY created_at DESC';
    
    const stmt = this.db.prepare(query);
    return stmt.all(userId);
  }

  markNotificationAsRead(notificationId) {
    const stmt = this.db.prepare('UPDATE notifications SET read_status = TRUE WHERE id = ?');
    return stmt.run(notificationId);
  }

  // Achievements
  awardAchievement(achievementData) {
    const stmt = this.db.prepare(`
      INSERT INTO achievements (user_id, achievement_type, achievement_name, description)
      VALUES (?, ?, ?, ?)
    `);
    return stmt.run(
      achievementData.userId,
      achievementData.achievementType,
      achievementData.achievementName,
      achievementData.description || null
    );
  }

  getUserAchievements(userId) {
    const stmt = this.db.prepare('SELECT * FROM achievements WHERE user_id = ? ORDER BY earned_at DESC');
    return stmt.all(userId);
  }

  // Learning Streaks
  updateLearningStreak(userId, currentStreak) {
    const stmt = this.db.prepare(`
      INSERT OR REPLACE INTO learning_streaks (user_id, current_streak, longest_streak, last_activity_date, updated_at)
      VALUES (?, ?, MAX(?, COALESCE((SELECT longest_streak FROM learning_streaks WHERE user_id = ?), 0)), DATE('now'), CURRENT_TIMESTAMP)
    `);
    return stmt.run(userId, currentStreak, currentStreak, userId);
  }

  getLearningStreak(userId) {
    const stmt = this.db.prepare('SELECT * FROM learning_streaks WHERE user_id = ?');
    return stmt.get(userId);
  }

  // Activities
  createActivity(activityData) {
    const stmt = this.db.prepare(`
      INSERT INTO activities (content_id, title, type, difficulty, priority, activity_data)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    return stmt.run(
      activityData.contentId,
      activityData.title,
      activityData.type,
      activityData.difficulty || 'easy',
      activityData.priority || 'medium',
      JSON.stringify(activityData.activityData)
    );
  }

  getActivitiesByContent(contentId) {
    const stmt = this.db.prepare('SELECT * FROM activities WHERE content_id = ?');
    return stmt.all(contentId);
  }

  // Activity Completions
  completeActivity(completionData) {
    const stmt = this.db.prepare(`
      INSERT OR REPLACE INTO activity_completions 
      (student_id, activity_id, completed, score, time_taken_seconds, answers, completed_at)
      VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    `);
    return stmt.run(
      completionData.studentId,
      completionData.activityId,
      completionData.completed || false,
      completionData.score || null,
      completionData.timeTakenSeconds || null,
      JSON.stringify(completionData.answers || {})
    );
  }

  getStudentActivityCompletions(studentId) {
    const stmt = this.db.prepare(`
      SELECT ac.*, a.title, a.type, a.difficulty 
      FROM activity_completions ac
      JOIN activities a ON ac.activity_id = a.id
      WHERE ac.student_id = ?
      ORDER BY ac.completed_at DESC
    `);
    return stmt.all(studentId);
  }

  // Analytics and Reports
  getStudentAnalytics(studentId) {
    const analytics = {};
    
    // Overall progress
    const progressStmt = this.db.prepare(`
      SELECT 
        COUNT(*) as total_lessons,
        SUM(CASE WHEN completed = 1 THEN 1 ELSE 0 END) as completed_lessons,
        AVG(progress_percentage) as avg_progress,
        SUM(time_spent_minutes) as total_time_spent
      FROM student_progress 
      WHERE student_id = ?
    `);
    analytics.progress = progressStmt.get(studentId);
    
    // Accessibility usage
    analytics.accessibilityUsage = this.getAccessibilityUsageStats(studentId);
    
    // Recent achievements
    analytics.achievements = this.getUserAchievements(studentId);
    
    // Learning streak
    analytics.streak = this.getLearningStreak(studentId);
    
    return analytics;
  }

  getTeacherAnalytics(teacherId) {
    const analytics = {};
    
    // Classroom stats
    const classroomStmt = this.db.prepare(`
      SELECT COUNT(*) as total_classrooms, SUM(student_count) as total_students
      FROM classrooms 
      WHERE teacher_id = ?
    `);
    analytics.classrooms = classroomStmt.get(teacherId);
    
    // Content stats
    const contentStmt = this.db.prepare(`
      SELECT COUNT(*) as total_content, 
             SUM(CASE WHEN processing_status = 'completed' THEN 1 ELSE 0 END) as processed_content
      FROM content 
      WHERE teacher_id = ?
    `);
    analytics.content = contentStmt.get(teacherId);
    
    return analytics;
  }

  // Cleanup and maintenance
  close() {
    this.db.close();
  }

  // Backup database
  backup(backupPath) {
    this.db.backup(backupPath);
  }
}

module.exports = LuminaDatabase;