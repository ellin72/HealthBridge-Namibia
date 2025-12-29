import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { PrismaClient, HabitType, WellnessCategory, ChallengeStatus } from '@prisma/client';

const prisma = new PrismaClient();

// ========== WELLNESS PLANS ==========

export const createWellnessPlan = async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, goals, startDate, endDate } = req.body;
    const userId = req.user!.id;

    if (!title || !description || !goals || !startDate) {
      return res.status(400).json({ message: 'Title, description, goals, and start date are required' });
    }

    const plan = await prisma.wellnessPlan.create({
      data: {
        userId,
        title,
        description,
        goals: JSON.stringify(goals),
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null
      }
    });

    res.status(201).json({ message: 'Wellness plan created successfully', plan: {
      ...plan,
      goals: JSON.parse(plan.goals)
    }});
  } catch (error: any) {
    console.error('Create wellness plan error:', error);
    res.status(500).json({ message: 'Failed to create wellness plan', error: error.message });
  }
};

export const getWellnessPlans = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { isActive } = req.query;

    const where: any = { userId };
    if (isActive !== undefined) {
      where.isActive = isActive === 'true';
    }

    const plans = await prisma.wellnessPlan.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });

    const parsedPlans = plans.map(plan => ({
      ...plan,
      goals: JSON.parse(plan.goals)
    }));

    res.json(parsedPlans);
  } catch (error: any) {
    console.error('Get wellness plans error:', error);
    res.status(500).json({ message: 'Failed to get wellness plans', error: error.message });
  }
};

export const updateWellnessPlan = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, goals, startDate, endDate, isActive } = req.body;
    const userId = req.user!.id;

    const plan = await prisma.wellnessPlan.findUnique({
      where: { id }
    });

    if (!plan) {
      return res.status(404).json({ message: 'Wellness plan not found' });
    }

    if (plan.userId !== userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const updateData: any = {};
    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (goals) updateData.goals = JSON.stringify(goals);
    if (startDate) updateData.startDate = new Date(startDate);
    if (endDate !== undefined) updateData.endDate = endDate ? new Date(endDate) : null;
    if (isActive !== undefined) updateData.isActive = isActive;

    const updated = await prisma.wellnessPlan.update({
      where: { id },
      data: updateData
    });

    res.json({ message: 'Wellness plan updated successfully', plan: {
      ...updated,
      goals: JSON.parse(updated.goals)
    }});
  } catch (error: any) {
    console.error('Update wellness plan error:', error);
    res.status(500).json({ message: 'Failed to update wellness plan', error: error.message });
  }
};

export const deleteWellnessPlan = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    const plan = await prisma.wellnessPlan.findUnique({
      where: { id }
    });

    if (!plan) {
      return res.status(404).json({ message: 'Wellness plan not found' });
    }

    if (plan.userId !== userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    await prisma.wellnessPlan.delete({
      where: { id }
    });

    res.json({ message: 'Wellness plan deleted successfully' });
  } catch (error: any) {
    console.error('Delete wellness plan error:', error);
    res.status(500).json({ message: 'Failed to delete wellness plan', error: error.message });
  }
};

// ========== HABIT TRACKING ==========

export const createHabitTracker = async (req: AuthRequest, res: Response) => {
  try {
    const { habitType, habitName, targetValue, unit } = req.body;
    const userId = req.user!.id;

    if (!habitType || !habitName) {
      return res.status(400).json({ message: 'Habit type and name are required' });
    }

    const tracker = await prisma.habitTracker.create({
      data: {
        userId,
        habitType,
        habitName,
        targetValue,
        unit
      }
    });

    res.status(201).json({ message: 'Habit tracker created successfully', tracker });
  } catch (error: any) {
    console.error('Create habit tracker error:', error);
    res.status(500).json({ message: 'Failed to create habit tracker', error: error.message });
  }
};

export const getHabitTrackers = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { isActive, habitType } = req.query;

    const where: any = { userId };
    if (isActive !== undefined) {
      where.isActive = isActive === 'true';
    }
    if (habitType) {
      where.habitType = habitType;
    }

    const trackers = await prisma.habitTracker.findMany({
      where,
      include: {
        entries: {
          orderBy: { date: 'desc' },
          take: 30 // Last 30 entries
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(trackers);
  } catch (error: any) {
    console.error('Get habit trackers error:', error);
    res.status(500).json({ message: 'Failed to get habit trackers', error: error.message });
  }
};

export const addHabitEntry = async (req: AuthRequest, res: Response) => {
  try {
    const { habitTrackerId, date, value, notes } = req.body;
    const userId = req.user!.id;

    if (!habitTrackerId || value === undefined) {
      return res.status(400).json({ message: 'Habit tracker ID and value are required' });
    }

    const tracker = await prisma.habitTracker.findUnique({
      where: { id: habitTrackerId }
    });

    if (!tracker) {
      return res.status(404).json({ message: 'Habit tracker not found' });
    }

    if (tracker.userId !== userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const entryDate = date ? new Date(date) : new Date();
    entryDate.setHours(0, 0, 0, 0);

    const entry = await prisma.habitEntry.upsert({
      where: {
        habitTrackerId_date: {
          habitTrackerId,
          date: entryDate
        }
      },
      update: {
        value,
        notes
      },
      create: {
        habitTrackerId,
        date: entryDate,
        value,
        notes
      }
    });

    // Update streak if target is met
    if (tracker.targetValue && value >= tracker.targetValue) {
      const recentEntries = await prisma.habitEntry.findMany({
        where: {
          habitTrackerId,
          date: {
            lte: entryDate
          },
          value: {
            gte: tracker.targetValue
          }
        },
        orderBy: { date: 'desc' },
        take: 100
      });

      let currentStreak = 0;
      let expectedDate = new Date(entryDate);
      
      for (const e of recentEntries) {
        const entryDateOnly = new Date(e.date);
        entryDateOnly.setHours(0, 0, 0, 0);
        const expectedDateOnly = new Date(expectedDate);
        expectedDateOnly.setHours(0, 0, 0, 0);

        if (entryDateOnly.getTime() === expectedDateOnly.getTime()) {
          currentStreak++;
          expectedDate.setDate(expectedDate.getDate() - 1);
        } else {
          break;
        }
      }

      const longestStreak = Math.max(tracker.longestStreak, currentStreak);

      await prisma.habitTracker.update({
        where: { id: habitTrackerId },
        data: {
          currentStreak,
          longestStreak
        }
      });
    }

    res.status(201).json({ message: 'Habit entry added successfully', entry });
  } catch (error: any) {
    console.error('Add habit entry error:', error);
    res.status(500).json({ message: 'Failed to add habit entry', error: error.message });
  }
};

export const getHabitEntries = async (req: AuthRequest, res: Response) => {
  try {
    const { habitTrackerId } = req.params;
    const { startDate, endDate } = req.query;
    const userId = req.user!.id;

    const tracker = await prisma.habitTracker.findUnique({
      where: { id: habitTrackerId }
    });

    if (!tracker) {
      return res.status(404).json({ message: 'Habit tracker not found' });
    }

    if (tracker.userId !== userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const where: any = { habitTrackerId };
    if (startDate || endDate) {
      where.date = {};
      if (startDate) where.date.gte = new Date(startDate as string);
      if (endDate) where.date.lte = new Date(endDate as string);
    }

    const entries = await prisma.habitEntry.findMany({
      where,
      orderBy: { date: 'desc' }
    });

    res.json(entries);
  } catch (error: any) {
    console.error('Get habit entries error:', error);
    res.status(500).json({ message: 'Failed to get habit entries', error: error.message });
  }
};

// ========== COMMUNITY CHALLENGES ==========

export const createChallenge = async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, category, startDate, endDate, targetGoal, reward } = req.body;
    const userId = req.user!.id;
    const userRole = req.user!.role;

    // Only admins and wellness coaches can create challenges
    if (userRole !== 'ADMIN' && userRole !== 'WELLNESS_COACH') {
      return res.status(403).json({ message: 'Access denied' });
    }

    if (!title || !description || !category || !startDate || !endDate || !targetGoal) {
      return res.status(400).json({ message: 'All required fields must be provided' });
    }

    const challenge = await prisma.wellnessChallenge.create({
      data: {
        title,
        description,
        category,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        targetGoal,
        reward,
        createdBy: userId
      }
    });

    res.status(201).json({ message: 'Challenge created successfully', challenge });
  } catch (error: any) {
    console.error('Create challenge error:', error);
    res.status(500).json({ message: 'Failed to create challenge', error: error.message });
  }
};

export const getChallenges = async (req: AuthRequest, res: Response) => {
  try {
    const { status, category } = req.query;

    const where: any = {};
    if (status) {
      where.status = status;
    }
    if (category) {
      where.category = category;
    }

    const challenges = await prisma.wellnessChallenge.findMany({
      where,
      include: {
        participations: {
          select: {
            id: true,
            userId: true,
            progress: true,
            completed: true
          }
        }
      },
      orderBy: { startDate: 'desc' }
    });

    res.json(challenges);
  } catch (error: any) {
    console.error('Get challenges error:', error);
    res.status(500).json({ message: 'Failed to get challenges', error: error.message });
  }
};

export const joinChallenge = async (req: AuthRequest, res: Response) => {
  try {
    const { challengeId } = req.params;
    const userId = req.user!.id;

    const challenge = await prisma.wellnessChallenge.findUnique({
      where: { id: challengeId }
    });

    if (!challenge) {
      return res.status(404).json({ message: 'Challenge not found' });
    }

    if (challenge.status !== 'ACTIVE' && challenge.status !== 'UPCOMING') {
      return res.status(400).json({ message: 'Challenge is not available for joining' });
    }

    const participation = await prisma.challengeParticipation.upsert({
      where: {
        challengeId_userId: {
          challengeId,
          userId
        }
      },
      update: {},
      create: {
        challengeId,
        userId
      }
    });

    res.status(201).json({ message: 'Joined challenge successfully', participation });
  } catch (error: any) {
    console.error('Join challenge error:', error);
    res.status(500).json({ message: 'Failed to join challenge', error: error.message });
  }
};

export const updateChallengeProgress = async (req: AuthRequest, res: Response) => {
  try {
    const { challengeId } = req.params;
    const { progress, completed } = req.body;
    const userId = req.user!.id;

    const participation = await prisma.challengeParticipation.findUnique({
      where: {
        challengeId_userId: {
          challengeId,
          userId
        }
      }
    });

    if (!participation) {
      return res.status(404).json({ message: 'Participation not found' });
    }

    const updateData: any = {};
    if (progress !== undefined) updateData.progress = progress;
    if (completed !== undefined) {
      updateData.completed = completed;
      if (completed) {
        updateData.completedAt = new Date();
      }
    }

    const updated = await prisma.challengeParticipation.update({
      where: {
        challengeId_userId: {
          challengeId,
          userId
        }
      },
      data: updateData
    });

    res.json({ message: 'Challenge progress updated successfully', participation: updated });
  } catch (error: any) {
    console.error('Update challenge progress error:', error);
    res.status(500).json({ message: 'Failed to update challenge progress', error: error.message });
  }
};

export const getUserChallenges = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;

    const participations = await prisma.challengeParticipation.findMany({
      where: { userId },
      include: {
        challenge: true
      },
      orderBy: { joinedAt: 'desc' }
    });

    res.json(participations);
  } catch (error: any) {
    console.error('Get user challenges error:', error);
    res.status(500).json({ message: 'Failed to get user challenges', error: error.message });
  }
};

