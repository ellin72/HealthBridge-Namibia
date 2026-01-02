import { prisma } from './prisma';

/**
 * Check if a provider has a relationship with a patient
 * (i.e., patient has chosen this provider via appointments)
 */
export async function hasProviderPatientRelationship(
  providerId: string,
  patientId: string
): Promise<boolean> {
  const appointment = await prisma.appointment.findFirst({
    where: {
      providerId,
      patientId
    }
  });
  return !!appointment;
}

/**
 * Check if a wellness coach has a relationship with a user
 * (i.e., user has chosen this coach via wellness plans or challenges)
 */
export async function hasCoachUserRelationship(
  coachId: string,
  userId: string
): Promise<boolean> {
  // Check if user has wellness plans created by this coach
  const wellnessPlan = await prisma.wellnessPlan.findFirst({
    where: {
      userId,
      // Note: WellnessPlan doesn't have a coachId field in the schema
      // We might need to add this relationship or check via other means
    }
  });

  // For now, we'll check if there's any relationship via challenges
  // This is a simplified check - you may need to adjust based on your schema
  return false; // Placeholder - adjust based on actual relationships
}

/**
 * Get all patient IDs that have chosen a specific provider
 */
export async function getProviderPatients(providerId: string): Promise<string[]> {
  const appointments = await prisma.appointment.findMany({
    where: {
      providerId
    },
    select: {
      patientId: true
    },
    distinct: ['patientId']
  });
  return appointments.map(a => a.patientId);
}

/**
 * Check if a user can access another user's data
 * Returns true if:
 * - They are the same user
 * - The requester is a provider and the target is their patient
 * - The requester is a wellness coach and the target is their client
 */
export async function canAccessUserData(
  requesterId: string,
  requesterRole: string,
  targetUserId: string
): Promise<boolean> {
  // Same user can always access their own data
  if (requesterId === targetUserId) {
    return true;
  }

  // Providers can access data of patients who have chosen them
  if (requesterRole === 'HEALTHCARE_PROVIDER') {
    return await hasProviderPatientRelationship(requesterId, targetUserId);
  }

  // Wellness coaches can access data of users who have chosen them
  if (requesterRole === 'WELLNESS_COACH') {
    return await hasCoachUserRelationship(requesterId, targetUserId);
  }

  // All other cases: no access
  return false;
}

