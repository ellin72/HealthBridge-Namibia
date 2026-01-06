"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteWellnessContent = exports.updateWellnessContent = exports.getWellnessContentById = exports.getWellnessContent = exports.createWellnessContent = void 0;
const prisma_1 = require("../utils/prisma");
const createWellnessContent = async (req, res) => {
    try {
        const { title, description, category, content, imageUrl, videoUrl, isPublished } = req.body;
        const authorId = req.user.id;
        if (!title || !description || !category || !content) {
            return res.status(400).json({ message: 'Title, description, category, and content are required' });
        }
        // Only wellness coaches and admins can create content
        if (req.user.role !== 'WELLNESS_COACH' && req.user.role !== 'ADMIN') {
            return res.status(403).json({ message: 'Only wellness coaches can create content' });
        }
        const wellnessContent = await prisma_1.prisma.wellnessContent.create({
            data: {
                title,
                description,
                category: category,
                content,
                imageUrl,
                videoUrl,
                authorId,
                // Handle null/undefined: coerce null to false, undefined defaults to false
                // This ensures null-safety with Prisma's non-nullable Boolean field
                isPublished: isPublished === null || isPublished === undefined ? false : Boolean(isPublished)
            },
            include: {
                author: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true
                    }
                }
            }
        });
        res.status(201).json({ message: 'Wellness content created successfully', wellnessContent });
    }
    catch (error) {
        console.error('Create wellness content error:', error);
        res.status(500).json({ message: 'Failed to create wellness content', error: error.message });
    }
};
exports.createWellnessContent = createWellnessContent;
const getWellnessContent = async (req, res) => {
    try {
        const { category, publishedOnly } = req.query;
        const userRole = req.user.role;
        const where = {};
        if (category) {
            where.category = category;
        }
        // Non-coaches and non-admins can only see published content
        if (publishedOnly === 'true' || (userRole !== 'WELLNESS_COACH' && userRole !== 'ADMIN')) {
            where.isPublished = true;
        }
        const wellnessContent = await prisma_1.prisma.wellnessContent.findMany({
            where,
            include: {
                author: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
        res.json(wellnessContent);
    }
    catch (error) {
        console.error('Get wellness content error:', error);
        res.status(500).json({ message: 'Failed to get wellness content', error: error.message });
    }
};
exports.getWellnessContent = getWellnessContent;
const getWellnessContentById = async (req, res) => {
    try {
        const { id } = req.params;
        const userRole = req.user.role;
        const wellnessContent = await prisma_1.prisma.wellnessContent.findUnique({
            where: { id },
            include: {
                author: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true
                    }
                }
            }
        });
        if (!wellnessContent) {
            return res.status(404).json({ message: 'Wellness content not found' });
        }
        // Non-coaches and non-admins can only see published content
        if (!wellnessContent.isPublished && userRole !== 'WELLNESS_COACH' && userRole !== 'ADMIN') {
            return res.status(403).json({ message: 'Content not published' });
        }
        res.json(wellnessContent);
    }
    catch (error) {
        console.error('Get wellness content error:', error);
        res.status(500).json({ message: 'Failed to get wellness content', error: error.message });
    }
};
exports.getWellnessContentById = getWellnessContentById;
const updateWellnessContent = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, category, content, imageUrl, videoUrl, isPublished } = req.body;
        const userId = req.user.id;
        const userRole = req.user.role;
        const wellnessContent = await prisma_1.prisma.wellnessContent.findUnique({
            where: { id }
        });
        if (!wellnessContent) {
            return res.status(404).json({ message: 'Wellness content not found' });
        }
        // Only the author or admin can update
        if (userRole !== 'ADMIN' && wellnessContent.authorId !== userId) {
            return res.status(403).json({ message: 'Access denied' });
        }
        const updateData = {};
        if (title)
            updateData.title = title;
        if (description)
            updateData.description = description;
        if (category)
            updateData.category = category;
        if (content)
            updateData.content = content;
        if (imageUrl !== undefined)
            updateData.imageUrl = imageUrl;
        if (videoUrl !== undefined)
            updateData.videoUrl = videoUrl;
        if (isPublished !== undefined)
            updateData.isPublished = isPublished;
        const updatedContent = await prisma_1.prisma.wellnessContent.update({
            where: { id },
            data: updateData,
            include: {
                author: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true
                    }
                }
            }
        });
        res.json({ message: 'Wellness content updated successfully', wellnessContent: updatedContent });
    }
    catch (error) {
        console.error('Update wellness content error:', error);
        res.status(500).json({ message: 'Failed to update wellness content', error: error.message });
    }
};
exports.updateWellnessContent = updateWellnessContent;
const deleteWellnessContent = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const userRole = req.user.role;
        const wellnessContent = await prisma_1.prisma.wellnessContent.findUnique({
            where: { id }
        });
        if (!wellnessContent) {
            return res.status(404).json({ message: 'Wellness content not found' });
        }
        // Only the author or admin can delete
        if (userRole !== 'ADMIN' && wellnessContent.authorId !== userId) {
            return res.status(403).json({ message: 'Access denied' });
        }
        await prisma_1.prisma.wellnessContent.delete({
            where: { id }
        });
        res.json({ message: 'Wellness content deleted successfully' });
    }
    catch (error) {
        console.error('Delete wellness content error:', error);
        res.status(500).json({ message: 'Failed to delete wellness content', error: error.message });
    }
};
exports.deleteWellnessContent = deleteWellnessContent;
//# sourceMappingURL=wellnessController.js.map