/**
 * Database Cleanup Utilities
 * Removes test data after tests complete
 */

// Lazy-load Prisma client to ensure DATABASE_URL is set first
let prisma = null;
let dbConnectionFailed = false; // Track if we've already detected a connection issue

function getPrisma() {
  if (!prisma) {
    // Check if DATABASE_URL is set
    if (!process.env.DATABASE_URL) {
      if (!dbConnectionFailed) {
        console.warn('⚠️  DATABASE_URL not set - database cleanup will be skipped');
        dbConnectionFailed = true;
      }
      return null;
    }

    try {
      // Try to use shared Prisma instance from backend
      prisma = require('../../backend/src/utils/prisma').prisma;
    } catch (e) {
      try {
        // Fallback: create new Prisma client
        const { PrismaClient } = require('@prisma/client');
        prisma = new PrismaClient();
      } catch (err) {
        if (!dbConnectionFailed) {
          console.warn('⚠️  Could not initialize Prisma client - database cleanup will be skipped:', err.message);
          dbConnectionFailed = true;
        }
        return null;
      }
    }
  }
  return prisma;
}

/**
 * Check if error is a database connection/authentication error or schema missing
 */
function isDatabaseConnectionError(error) {
  const errorMessage = error.message || '';
  const errorCode = error.code || '';
  return (
    errorMessage.includes('Authentication failed') ||
    errorMessage.includes('Can\'t reach database server') ||
    errorMessage.includes('Connection refused') ||
    errorMessage.includes('does not exist') ||
    errorMessage.includes('table') && errorMessage.includes('does not exist') ||
    errorCode.includes('P1001') || // Prisma connection error code
    errorCode.includes('P1000') || // Prisma authentication error code
    errorCode.includes('P2001') || // Prisma table not found error
    errorCode.includes('P2021') || // Prisma table does not exist
    errorMessage.includes('ECONNREFUSED') ||
    errorMessage.includes('ENOTFOUND')
  );
}

/**
 * Track created test entities for cleanup
 */
class TestDataTracker {
  constructor() {
    this.entities = {
      users: [],
      payments: [],
      surveys: [],
      appointments: [],
      feedback: [],
      policies: [],
      medicalAid: []
    };
  }

  /**
   * Track a created entity
   */
  track(type, id) {
    if (this.entities[type] && !this.entities[type].includes(id)) {
      this.entities[type].push(id);
    }
  }

  /**
   * Track multiple entities
   */
  trackMultiple(type, ids) {
    ids.forEach(id => this.track(type, id));
  }

  /**
   * Clean up all tracked entities
   */
  async cleanup() {
    const prismaClient = getPrisma();
    if (!prismaClient) {
      return; // Already warned in getPrisma()
    }

    const cleanupOrder = [
      'payments',
      'appointments',
      'surveys',
      'feedback',
      'policies',
      'medicalAid',
      'users' // Users last due to foreign key constraints
    ];

    // Track if we encounter a database connection error
    let connectionErrorOccurred = false;

    for (const type of cleanupOrder) {
      const ids = this.entities[type];
      if (ids.length === 0) continue;

      try {
        switch (type) {
          case 'users':
            await prismaClient.user.deleteMany({
              where: { id: { in: ids } }
            });
            break;
          case 'payments':
            await prismaClient.payment.deleteMany({
              where: { id: { in: ids } }
            });
            break;
          case 'surveys':
            await prismaClient.survey.deleteMany({
              where: { id: { in: ids } }
            });
            break;
          case 'appointments':
            await prismaClient.appointment.deleteMany({
              where: { id: { in: ids } }
            });
            break;
          case 'feedback':
            await prismaClient.userFeedback.deleteMany({
              where: { id: { in: ids } }
            });
            break;
          case 'policies':
            await prismaClient.policy.deleteMany({
              where: { id: { in: ids } }
            });
            break;
          case 'medicalAid':
            await prismaClient.medicalAidInfo.deleteMany({
              where: { id: { in: ids } }
            });
            break;
        }
        console.log(`✅ Cleaned up ${ids.length} ${type}`);
      } catch (error) {
        // Check if this is a database connection error or schema missing
        if (isDatabaseConnectionError(error)) {
          if (!connectionErrorOccurred && !dbConnectionFailed) {
            // Provide specific message based on error type
            if (error.message && error.message.includes('does not exist')) {
              console.warn('⚠️  Database schema not found - skipping cleanup. Tests passed, but test data may remain in database.');
              console.warn('   Run migrations on the test database to enable cleanup.');
            } else {
              console.warn('⚠️  Database connection failed - skipping cleanup. Tests passed, but test data may remain in database.');
              console.warn('   To enable cleanup, ensure DATABASE_URL points to a valid database with correct credentials.');
            }
            dbConnectionFailed = true;
            connectionErrorOccurred = true;
          }
          // Stop trying to clean up if we can't connect or schema doesn't exist
          break;
        } else {
          // Other errors (e.g., foreign key constraints) - log but continue
          console.error(`❌ Error cleaning up ${type}:`, error.message);
        }
      }
    }

    // Reset tracker
    this.entities = {
      users: [],
      payments: [],
      surveys: [],
      appointments: [],
      feedback: [],
      policies: [],
      medicalAid: []
    };
  }

  /**
   * Clean up by email pattern (for test users)
   */
  async cleanupByEmailPattern(pattern) {
    const prismaClient = getPrisma();
    if (!prismaClient) {
      return; // Already warned in getPrisma()
    }

    try {
      const users = await prismaClient.user.findMany({
        where: {
          email: {
            contains: pattern
          }
        },
        select: { id: true }
      });

      const userIds = users.map(u => u.id);
      
      // Delete related data first
      await prismaClient.payment.deleteMany({
        where: { userId: { in: userIds } }
      });
      
      await prismaClient.appointment.deleteMany({
        where: {
          OR: [
            { patientId: { in: userIds } },
            { providerId: { in: userIds } }
          ]
        }
      });

      // Delete users
      await prismaClient.user.deleteMany({
        where: { id: { in: userIds } }
      });

      console.log(`✅ Cleaned up ${userIds.length} users matching pattern: ${pattern}`);
    } catch (error) {
      // Check if this is a database connection error or schema missing
      if (isDatabaseConnectionError(error)) {
        if (!dbConnectionFailed) {
          // Provide specific message based on error type
          if (error.message && error.message.includes('does not exist')) {
            console.warn('⚠️  Database schema not found - skipping cleanup by email pattern.');
            console.warn('   Run migrations on the test database to enable cleanup.');
          } else {
            console.warn('⚠️  Database connection failed - skipping cleanup by email pattern.');
            console.warn('   To enable cleanup, ensure DATABASE_URL points to a valid database with correct credentials.');
          }
          dbConnectionFailed = true;
        }
      } else {
        // Other errors - log but don't treat as fatal
        console.error(`❌ Error cleaning up by email pattern:`, error.message);
      }
    }
  }
}

// Global tracker instance
const tracker = new TestDataTracker();

/**
 * Cleanup test data created during test run
 */
async function cleanupTestData() {
  await tracker.cleanup();
}

/**
 * Cleanup test users by email pattern
 */
async function cleanupTestUsers(pattern = '@test.com') {
  await tracker.cleanupByEmailPattern(pattern);
}

/**
 * Get tracker instance for tracking entities
 */
function getTracker() {
  return tracker;
}

module.exports = {
  cleanupTestData,
  cleanupTestUsers,
  getTracker
};

