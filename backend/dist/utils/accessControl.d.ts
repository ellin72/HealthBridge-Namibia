/**
 * Check if a provider has a relationship with a patient
 * (i.e., patient has chosen this provider via appointments)
 */
export declare function hasProviderPatientRelationship(providerId: string, patientId: string): Promise<boolean>;
/**
 * Check if a wellness coach has a relationship with a user
 * (i.e., user has chosen this coach via wellness plans or challenges)
 */
export declare function hasCoachUserRelationship(coachId: string, userId: string): Promise<boolean>;
/**
 * Get all patient IDs that have chosen a specific provider
 */
export declare function getProviderPatients(providerId: string): Promise<string[]>;
/**
 * Check if a user can access another user's data
 * Returns true if:
 * - They are the same user
 * - The requester is a provider and the target is their patient
 * - The requester is a wellness coach and the target is their client
 */
export declare function canAccessUserData(requesterId: string, requesterRole: string, targetUserId: string): Promise<boolean>;
//# sourceMappingURL=accessControl.d.ts.map