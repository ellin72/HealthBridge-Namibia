"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserChallenges = exports.updateChallengeProgress = exports.joinChallenge = exports.getChallenges = exports.createChallenge = exports.getHabitEntries = exports.addHabitEntry = exports.getHabitTrackers = exports.createHabitTracker = exports.deleteWellnessPlan = exports.updateWellnessPlan = exports.getWellnessPlans = exports.createWellnessPlan = void 0;
const prisma_1 = require("../utils/prisma");
// ========== WELLNESS PLANS ==========
const createWellnessPlan = async (req, res) => {
    try {
        const { title, description, goals, startDate, endDate } = req.body;
        const userId = req.user.id;
        if (!title || !description || !goals || !startDate) {
            return res.status(400).json({ message: 'Title, description, goals, and start date are required' });
        }
        const plan = await prisma_1.prisma.wellnessPlan.create({
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
            } });
    }
    catch (error) {
        console.error('Create wellness plan error:', error);
        res.status(500).json({ message: 'Failed to create wellness plan', error: error.message });
    }
};
exports.createWellnessPlan = createWellnessPlan;
const getWellnessPlans = async (req, res) => {
    try {
        const userId = req.user.id;
        const { isActive } = req.query;
        const where = { userId };
        if (isActive !== undefined) {
            where.isActive = isActive === 'true';
        }
        const plans = await prisma_1.prisma.wellnessPlan.findMany({
            where,
            orderBy: { createdAt: 'desc' }
        });
        const parsedPlans = plans.map(plan => ({
            ...plan,
            goals: JSON.parse(plan.goals)
        }));
        res.json(parsedPlans);
    }
    catch (error) {
        console.error('Get wellness plans error:', error);
        res.status(500).json({ message: 'Failed to get wellness plans', error: error.message });
    }
};
exports.getWellnessPlans = getWellnessPlans;
const updateWellnessPlan = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, goals, startDate, endDate, isActive } = req.body;
        const userId = req.user.id;
        const plan = await prisma_1.prisma.wellnessPlan.findUnique({
            where: { id }
        });
        if (!plan) {
            return res.status(404).json({ message: 'Wellness plan not found' });
        }
        if (plan.userId !== userId) {
            return res.status(403).json({ message: 'Access denied' });
        }
        const updateData = {};
        if (title)
            updateData.title = title;
        if (description)
            updateData.description = description;
        if (goals)
            updateData.goals = JSON.stringify(goals);
        if (startDate)
            updateData.startDate = new Date(startDate);
        if (endDate !== undefined)
            updateData.endDate = endDate ? new Date(endDate) : null;
        if (isActive !== undefined)
            updateData.isActive = isActive;
        const updated = await prisma_1.prisma.wellnessPlan.update({
            where: { id },
            data: updateData
        });
        res.json({ message: 'Wellness plan updated successfully', plan: {
                ...updated,
                goals: JSON.parse(updated.goals)
            } });
    }
    catch (error) {
        console.error('Update wellness plan error:', error);
        res.status(500).json({ message: 'Failed to update wellness plan', error: error.message });
    }
};
exports.updateWellnessPlan = updateWellnessPlan;
const deleteWellnessPlan = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const plan = await prisma_1.prisma.wellnessPlan.findUnique({
            where: { id }
        });
        if (!plan) {
            return res.status(404).json({ message: 'Wellness plan not found' });
        }
        if (plan.userId !== userId) {
            return res.status(403).json({ message: 'Access denied' });
        }
        await prisma_1.prisma.wellnessPlan.delete({
            where: { id }
        });
        res.json({ message: 'Wellness plan deleted successfully' });
    }
    catch (error) {
        console.error('Delete wellness plan error:', error);
        res.status(500).json({ message: 'Failed to delete wellness plan', error: error.message });
    }
};
exports.deleteWellnessPlan = deleteWellnessPlan;
// ========== HABIT TRACKING ==========
const createHabitTracker = async (req, res) => {
    try {
        const { habitType, habitName, targetValue, unit } = req.body;
        const userId = req.user.id;
        if (!habitType || !habitName) {
            return res.status(400).json({ message: 'Habit type and name are required' });
        }
        const tracker = await prisma_1.prisma.habitTracker.create({
            data: {
                userId,
                habitType,
                habitName,
                targetValue,
                unit
            }
        });
        res.status(201).json({ message: 'Habit tracker created successfully', tracker });
    }
    catch (error) {
        console.error('Create habit tracker error:', error);
        res.status(500).json({ message: 'Failed to create habit tracker', error: error.message });
    }
};
exports.createHabitTracker = createHabitTracker;
const getHabitTrackers = async (req, res) => {
    try {
        const userId = req.user.id;
        const { isActive, habitType } = req.query;
        const where = { userId };
        if (isActive !== undefined) {
            where.isActive = isActive === 'true';
        }
        if (habitType) {
            where.habitType = habitType;
        }
        const trackers = await prisma_1.prisma.habitTracker.findMany({
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
    }
    catch (error) {
        console.error('Get habit trackers error:', error);
        res.status(500).json({ message: 'Failed to get habit trackers', error: error.message });
    }
};
exports.getHabitTrackers = getHabitTrackers;
const addHabitEntry = async (req, res) => {
    try {
        const { habitTrackerId, date, value, notes } = req.body;
        const userId = req.user.id;
        if (!habitTrackerId || value === undefined) {
            return res.status(400).json({ message: 'Habit tracker ID and value are required' });
        }
        const tracker = await prisma_1.prisma.habitTracker.findUnique({
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
        const entry = await prisma_1.prisma.habitEntry.upsert({
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
            const recentEntries = await prisma_1.prisma.habitEntry.findMany({
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
                }
                else {
                    break;
                }
            }
            const longestStreak = Math.max(tracker.longestStreak, currentStreak);
            await prisma_1.prisma.habitTracker.update({
                where: { id: habitTrackerId },
                data: {
                    currentStreak,
                    longestStreak
                }
            });
        }
        res.status(201).json({ message: 'Habit entry added successfully', entry });
    }
    catch (error) {
        console.error('Add habit entry error:', error);
        res.status(500).json({ message: 'Failed to add habit entry', error: error.message });
    }
};
exports.addHabitEntry = addHabitEntry;
const getHabitEntries = async (req, res) => {
    try {
        const { habitTrackerId } = req.params;
        const { startDate, endDate } = req.query;
        const userId = req.user.id;
        const tracker = await prisma_1.prisma.habitTracker.findUnique({
            where: { id: habitTrackerId }
        });
        if (!tracker) {
            return res.status(404).json({ message: 'Habit tracker not found' });
        }
        if (tracker.userId !== userId) {
            return res.status(403).json({ message: 'Access denied' });
        }
        const where = { habitTrackerId };
        if (startDate || endDate) {
            where.date = {};
            if (startDate)
                where.date.gte = new Date(startDate);
            if (endDate)
                where.date.lte = new Date(endDate);
        }
        const entries = await prisma_1.prisma.habitEntry.findMany({
            where,
            orderBy: { date: 'desc' }
        });
        res.json(entries);
    }
    catch (error) {
        console.error('Get habit entries error:', error);
        res.status(500).json({ message: 'Failed to get habit entries', error: error.message });
    }
};
exports.getHabitEntries = getHabitEntries;
// ========== COMMUNITY CHALLENGES ==========
const createChallenge = async (req, res) => {
    try {
        const { title, description, category, startDate, endDate, targetGoal, reward } = req.body;
        const userId = req.user.id;
        const userRole = req.user.role;
        // Only admins and wellness coaches can create challenges
        if (userRole !== 'ADMIN' && userRole !== 'WELLNESS_COACH') {
            return res.status(403).json({ message: 'Access denied' });
        }
        if (!title || !description || !category || !startDate || !endDate || !targetGoal) {
            return res.status(400).json({ message: 'All required fields must be provided' });
        }
        const challenge = await prisma_1.prisma.wellnessChallenge.create({
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
    }
    catch (error) {
        console.error('Create challenge error:', error);
        res.status(500).json({ message: 'Failed to create challenge', error: error.message });
    }
};
exports.createChallenge = createChallenge;
const getChallenges = async (req, res) => {
    try {
        const { status, category } = req.query;
        const where = {};
        if (status) {
            where.status = status;
        }
        if (category) {
            where.category = category;
        }
        const challenges = await prisma_1.prisma.wellnessChallenge.findMany({
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
    }
    catch (error) {
        console.error('Get challenges error:', error);
        res.status(500).json({ message: 'Failed to get challenges', error: error.message });
    }
};
exports.getChallenges = getChallenges;
const joinChallenge = async (req, res) => {
    try {
        const { challengeId } = req.params;
        const userId = req.user.id;
        const challenge = await prisma_1.prisma.wellnessChallenge.findUnique({
            where: { id: challengeId }
        });
        if (!challenge) {
            return res.status(404).json({ message: 'Challenge not found' });
        }
        if (challenge.status !== 'ACTIVE' && challenge.status !== 'UPCOMING') {
            return res.status(400).json({ message: 'Challenge is not available for joining' });
        }
        const participation = await prisma_1.prisma.challengeParticipation.upsert({
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
    }
    catch (error) {
        console.error('Join challenge error:', error);
        res.status(500).json({ message: 'Failed to join challenge', error: error.message });
    }
};
exports.joinChallenge = joinChallenge;
const updateChallengeProgress = async (req, res) => {
    try {
        const { challengeId } = req.params;
        const { progress, completed } = req.body;
        const userId = req.user.id;
        const participation = await prisma_1.prisma.challengeParticipation.findUnique({
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
        const updateData = {};
        if (progress !== undefined)
            updateData.progress = progress;
        if (completed !== undefined) {
            updateData.completed = completed;
            if (completed) {
                updateData.completedAt = new Date();
            }
        }
        const updated = await prisma_1.prisma.challengeParticipation.update({
            where: {
                challengeId_userId: {
                    challengeId,
                    userId
                }
            },
            data: updateData
        });
        res.json({ message: 'Challenge progress updated successfully', participation: updated });
    }
    catch (error) {
        console.error('Update challenge progress error:', error);
        res.status(500).json({ message: 'Failed to update challenge progress', error: error.message });
    }
};
exports.updateChallengeProgress = updateChallengeProgress;
const getUserChallenges = async (req, res) => {
    try {
        const userId = req.user.id;
        const participations = await prisma_1.prisma.challengeParticipation.findMany({
            where: { userId },
            include: {
                challenge: true
            },
            orderBy: { joinedAt: 'desc' }
        });
        res.json(participations);
    }
    catch (error) {
        console.error('Get user challenges error:', error);
        res.status(500).json({ message: 'Failed to get user challenges', error: error.message });
    }
};
exports.getUserChallenges = getUserChallenges;
//# sourceMappingURL=wellnessToolsController.js.map