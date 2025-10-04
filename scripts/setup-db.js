const LuminaDatabase = require('../lib/db/database.js');

console.log('🚀 Setting up Lumina+ Database...');

try {
  // Initialize database
  const db = new LuminaDatabase();
  
  console.log('✅ Database setup completed successfully!');
  console.log('📊 Database location: ./database/lumina.db');
  
  // Close database connection
  db.close();
  
} catch (error) {
  console.error('❌ Database setup failed:', error.message);
  process.exit(1);
}