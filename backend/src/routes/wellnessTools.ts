import express from 'express';
import {
  createWellnessPlan,
  getWellnessPlans,
  updateWellnessPlan,
  deleteWellnessPlan,
  createHabitTracker,
  getHabitTrackers,
  addHabitEntry,
  getHabitEntries,
  createChallenge,
  getChallenges,
  joinChallenge,
  updateChallengeProgress,
  getUserChallenges
} from '../controllers/wellnessToolsController';
import { authenticate } from '../middleware/auth';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Wellness Plans
router.post('/plans', createWellnessPlan);
router.get('/plans', getWellnessPlans);
router.put('/plans/:id', updateWellnessPlan);
router.delete('/plans/:id', deleteWellnessPlan);

// Habit Tracking
router.post('/habits', createHabitTracker);
router.get('/habits', getHabitTrackers);
router.post('/habits/entries', addHabitEntry);
router.get('/habits/:habitTrackerId/entries', getHabitEntries);

// Community Challenges
router.post('/challenges', createChallenge);
router.get('/challenges', getChallenges);
router.post('/challenges/:challengeId/join', joinChallenge);
router.put('/challenges/:challengeId/progress', updateChallengeProgress);
router.get('/challenges/my-challenges', getUserChallenges);

export default router;

