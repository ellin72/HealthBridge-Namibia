import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Clear all existing data
  console.log('🗑️  Clearing existing data...');
  
  // Delete in order to respect foreign key constraints
  // New dashboard enhancement models
  await prisma.medicationLog.deleteMany();
  await prisma.medicationReminder.deleteMany();
  await prisma.remoteMonitoringData.deleteMany();
  await prisma.billingInvoice.deleteMany();
  await prisma.clinicalTemplate.deleteMany();
  
  // Phase 3 models
  await prisma.offlineSyncQueue.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.medicalAidClaim.deleteMany();
  await prisma.medicalAidInfo.deleteMany();
  await prisma.triageAssessment.deleteMany();
  await prisma.fHIRResource.deleteMany();
  
  // Phase 2 models
  await prisma.researchCollaboration.deleteMany();
  await prisma.researchMilestone.deleteMany();
  await prisma.supervisorMatch.deleteMany();
  await prisma.researchResource.deleteMany();
  await prisma.researchProposal.deleteMany();
  await prisma.researchTopic.deleteMany();
  await prisma.challengeParticipation.deleteMany();
  await prisma.wellnessChallenge.deleteMany();
  await prisma.habitEntry.deleteMany();
  await prisma.habitTracker.deleteMany();
  await prisma.wellnessPlan.deleteMany();
  await prisma.patientHistory.deleteMany();
  await prisma.videoConsultation.deleteMany();
  
  // Phase 1 models
  await prisma.assignmentSubmission.deleteMany();
  await prisma.assignment.deleteMany();
  await prisma.consultationNote.deleteMany();
  await prisma.appointment.deleteMany();
  await prisma.wellnessContent.deleteMany();
  await prisma.learningResource.deleteMany();
  await prisma.user.deleteMany();

  console.log('✅ Database cleared');

  // Create admin user
  console.log('👤 Creating admin user...');
  
  const hashedPassword = await bcrypt.hash('Elcorpnamibia@2025', 10);

  const admin = await prisma.user.create({
    data: {
      email: 'elcorpnamibia@gmail.com',
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: 'ADMIN',
      isActive: true,
    },
  });

  console.log('✅ Admin user created successfully!');
  console.log('\n📋 Admin Credentials:');
  console.log('   Email: elcorpnamibia@gmail.com');
  console.log('   Password: Elcorpnamibia@2025');
  console.log('   Name: Admin User');
  console.log('   Role: ADMIN');
  console.log(`   ID: ${admin.id}\n`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

