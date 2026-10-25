const sequelize = require('../util/database');
const User = require('../models/User');
const logger = require('../utils/logger');

const initDatabase = async () => {
  try {
    // Sync database
    await sequelize.sync({ force: false });
    logger.info('Database synchronized');

    // Check if admin user exists
    const adminUser = await User.findOne({ where: { username: 'admin' } });

    if (!adminUser) {
      // Create default admin user
      const newAdmin = await User.create({
        username: 'admin',
        email: 'admin@rikrikrerp.com',
        password: 'Admin123!', // This will be hashed automatically
        fullName: 'System Administrator',
        role: 'admin',
        isActive: true
      });

      logger.info('Default admin user created successfully');
      console.log('✅ Default admin user created:');
      console.log('   Username: admin');
      console.log('   Password: Admin123!');
      console.log('   ⚠️  Please change the password after first login!');
    } else {
      logger.info('Admin user already exists');
      console.log('ℹ️  Admin user already exists');
    }

    process.exit(0);
  } catch (error) {
    logger.error('Database initialization failed:', error);
    console.error('❌ Database initialization failed:', error.message);
    process.exit(1);
  }
};

// Run initialization
initDatabase();
