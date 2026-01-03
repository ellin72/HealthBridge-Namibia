/**
 * Database Cleanup Utilities
 * Removes test data after tests complete
 */

// Import Prisma client - handle both direct import and dynamic require
let prisma;
try {
  prisma = require('../../backend/src/utils/prisma').prisma;
} catch (e) {
  // Fallback: try to import from @prisma/client directly
  const { PrismaClient } = require('@prisma/client');
  prisma = new PrismaClient();
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
    const cleanupOrder = [
      'payments',
      'appointments',
      'surveys',
      'feedback',
      'policies',
      'medicalAid',
      'users' // Users last due to foreign key constraints
    ];

    for (const type of cleanupOrder) {
      const ids = this.entities[type];
      if (ids.length === 0) continue;

      try {
        switch (type) {
          case 'users':
            await prisma.user.deleteMany({
              where: { id: { in: ids } }
            });
            break;
          case 'payments':
            await prisma.payment.deleteMany({
              where: { id: { in: ids } }
            });
            break;
          case 'surveys':
            await prisma.survey.deleteMany({
              where: { id: { in: ids } }
            });
            break;
          case 'appointments':
            await prisma.appointment.deleteMany({
              where: { id: { in: ids } }
            });
            break;
          case 'feedback':
            await prisma.userFeedback.deleteMany({
              where: { id: { in: ids } }
            });
            break;
          case 'policies':
            await prisma.policy.deleteMany({
              where: { id: { in: ids } }
            });
            break;
          case 'medicalAid':
            await prisma.medicalAidInfo.deleteMany({
              where: { id: { in: ids } }
            });
            break;
        }
        console.log(`✅ Cleaned up ${ids.length} ${type}`);
      } catch (error) {
        console.error(`❌ Error cleaning up ${type}:`, error.message);
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
    try {
      const users = await prisma.user.findMany({
        where: {
          email: {
            contains: pattern
          }
        },
        select: { id: true }
      });

      const userIds = users.map(u => u.id);
      
      // Delete related data first
      await prisma.payment.deleteMany({
        where: { userId: { in: userIds } }
      });
      
      await prisma.appointment.deleteMany({
        where: {
          OR: [
            { patientId: { in: userIds } },
            { providerId: { in: userIds } }
          ]
        }
      });

      // Delete users
      await prisma.user.deleteMany({
        where: { id: { in: userIds } }
      });

      console.log(`✅ Cleaned up ${userIds.length} users matching pattern: ${pattern}`);
    } catch (error) {
      console.error(`❌ Error cleaning up by email pattern:`, error.message);
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

