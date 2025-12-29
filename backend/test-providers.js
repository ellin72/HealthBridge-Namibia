// Quick test script to check providers
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testProviders() {
  try {
    console.log('Testing provider query...');
    
    // Check all users
    const allUsers = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true
      }
    });
    
    console.log('\nAll users:');
    allUsers.forEach(user => {
      console.log(`- ${user.firstName} ${user.lastName} (${user.email})`);
      console.log(`  Role: ${user.role}, Active: ${user.isActive}`);
    });
    
    // Check providers specifically
    const providers = await prisma.user.findMany({
      where: {
        role: 'HEALTHCARE_PROVIDER',
        isActive: true
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true
      }
    });
    
    console.log(`\n\nFound ${providers.length} active healthcare providers:`);
    providers.forEach(provider => {
      console.log(`- Dr. ${provider.firstName} ${provider.lastName} (${provider.email})`);
    });
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testProviders();

