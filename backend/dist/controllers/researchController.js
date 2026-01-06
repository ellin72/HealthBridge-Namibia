"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCollaboration = exports.updateCollaboration = exports.getCollaborations = exports.createCollaboration = exports.updateMilestone = exports.getMilestones = exports.createMilestone = exports.respondToSupervisorRequest = exports.getSupervisorRequests = exports.requestSupervisor = exports.getResources = exports.createResource = exports.updateProposal = exports.getProposals = exports.createProposal = exports.getResearchTopics = exports.createResearchTopic = exports.generateResearchTopic = void 0;
const prisma_1 = require("../utils/prisma");
// ========== RESEARCH TOPIC GENERATOR ==========
const generateResearchTopic = async (req, res) => {
    try {
        const { field, keywords, description } = req.body;
        const userId = req.user.id;
        if (!field) {
            return res.status(400).json({ message: 'Research field is required' });
        }
        // AI-powered topic generation (simplified - in production, integrate with OpenAI/Claude)
        const topicSuggestions = [
            `Exploring ${field.toLowerCase()} interventions in Namibian communities`,
            `Impact of digital health solutions on ${field.toLowerCase()} outcomes in Namibia`,
            `Community-based approaches to ${field.toLowerCase()} in rural Namibia`,
            `Policy analysis of ${field.toLowerCase()} programs in Namibia`,
            `Cross-cultural perspectives on ${field.toLowerCase()} in Namibian context`
        ];
        // Create a research topic record
        const topic = await prisma_1.prisma.researchTopic.create({
            data: {
                userId,
                field,
                topic: topicSuggestions[0],
                description: description || `AI-generated research topic in ${field}`,
                keywords: keywords ? JSON.stringify(keywords) : JSON.stringify([field]),
                isGenerated: true
            }
        });
        res.status(201).json({
            message: 'Research topic generated successfully',
            topic: {
                ...topic,
                keywords: topic.keywords ? JSON.parse(topic.keywords) : []
            },
            suggestions: topicSuggestions
        });
    }
    catch (error) {
        console.error('Generate research topic error:', error);
        res.status(500).json({ message: 'Failed to generate research topic', error: error.message });
    }
};
exports.generateResearchTopic = generateResearchTopic;
const createResearchTopic = async (req, res) => {
    try {
        const { field, topic, description, keywords } = req.body;
        const userId = req.user.id;
        if (!field || !topic) {
            return res.status(400).json({ message: 'Research field and topic are required' });
        }
        const researchTopic = await prisma_1.prisma.researchTopic.create({
            data: {
                userId,
                field,
                topic,
                description,
                keywords: keywords ? JSON.stringify(keywords) : null
            }
        });
        res.status(201).json({
            message: 'Research topic created successfully',
            topic: {
                ...researchTopic,
                keywords: researchTopic.keywords ? JSON.parse(researchTopic.keywords) : []
            }
        });
    }
    catch (error) {
        console.error('Create research topic error:', error);
        res.status(500).json({ message: 'Failed to create research topic', error: error.message });
    }
};
exports.createResearchTopic = createResearchTopic;
const getResearchTopics = async (req, res) => {
    try {
        const userId = req.user.id;
        const { field } = req.query;
        const where = { userId };
        if (field) {
            where.field = field;
        }
        const topics = await prisma_1.prisma.researchTopic.findMany({
            where,
            include: {
                proposals: {
                    select: {
                        id: true,
                        title: true,
                        status: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
        const parsedTopics = topics.map(t => ({
            ...t,
            keywords: t.keywords ? JSON.parse(t.keywords) : []
        }));
        res.json(parsedTopics);
    }
    catch (error) {
        console.error('Get research topics error:', error);
        res.status(500).json({ message: 'Failed to get research topics', error: error.message });
    }
};
exports.getResearchTopics = getResearchTopics;
// ========== PROPOSAL BUILDER ==========
const createProposal = async (req, res) => {
    try {
        const { topicId, title, abstract, objectives, methodology, expectedOutcomes, fileUrl } = req.body;
        const userId = req.user.id;
        if (!title || !abstract || !objectives || !methodology) {
            return res.status(400).json({ message: 'Title, abstract, objectives, and methodology are required' });
        }
        const proposal = await prisma_1.prisma.researchProposal.create({
            data: {
                topicId: topicId || null,
                userId,
                title,
                abstract,
                objectives: JSON.stringify(objectives),
                methodology,
                expectedOutcomes,
                fileUrl,
                status: 'DRAFT'
            },
            include: {
                topic: true
            }
        });
        res.status(201).json({
            message: 'Proposal created successfully',
            proposal: {
                ...proposal,
                objectives: JSON.parse(proposal.objectives)
            }
        });
    }
    catch (error) {
        console.error('Create proposal error:', error);
        res.status(500).json({ message: 'Failed to create proposal', error: error.message });
    }
};
exports.createProposal = createProposal;
const getProposals = async (req, res) => {
    try {
        const userId = req.user.id;
        const { status } = req.query;
        const where = { userId };
        if (status) {
            where.status = status;
        }
        const proposals = await prisma_1.prisma.researchProposal.findMany({
            where,
            include: {
                topic: true,
                milestones: {
                    orderBy: { createdAt: 'asc' }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
        const parsedProposals = proposals.map(p => ({
            ...p,
            objectives: JSON.parse(p.objectives)
        }));
        res.json(parsedProposals);
    }
    catch (error) {
        console.error('Get proposals error:', error);
        res.status(500).json({ message: 'Failed to get proposals', error: error.message });
    }
};
exports.getProposals = getProposals;
const updateProposal = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, abstract, objectives, methodology, expectedOutcomes, fileUrl, status } = req.body;
        const userId = req.user.id;
        const proposal = await prisma_1.prisma.researchProposal.findUnique({
            where: { id }
        });
        if (!proposal) {
            return res.status(404).json({ message: 'Proposal not found' });
        }
        if (proposal.userId !== userId) {
            return res.status(403).json({ message: 'Access denied' });
        }
        const updateData = {};
        if (title)
            updateData.title = title;
        if (abstract)
            updateData.abstract = abstract;
        if (objectives)
            updateData.objectives = JSON.stringify(objectives);
        if (methodology)
            updateData.methodology = methodology;
        if (expectedOutcomes !== undefined)
            updateData.expectedOutcomes = expectedOutcomes;
        if (fileUrl !== undefined)
            updateData.fileUrl = fileUrl;
        if (status) {
            updateData.status = status;
            if (status === 'SUBMITTED' && !proposal.submittedAt) {
                updateData.submittedAt = new Date();
            }
        }
        const updated = await prisma_1.prisma.researchProposal.update({
            where: { id },
            data: updateData
        });
        res.json({
            message: 'Proposal updated successfully',
            proposal: {
                ...updated,
                objectives: JSON.parse(updated.objectives)
            }
        });
    }
    catch (error) {
        console.error('Update proposal error:', error);
        res.status(500).json({ message: 'Failed to update proposal', error: error.message });
    }
};
exports.updateProposal = updateProposal;
// ========== RESOURCE LIBRARY ==========
const createResource = async (req, res) => {
    try {
        const { title, description, field, resourceType, url, fileUrl, fileName, author, publisher, publishedDate, tags } = req.body;
        const userId = req.user.id;
        const userRole = req.user.role;
        // Only admins and students can create resources
        if (userRole !== 'ADMIN' && userRole !== 'STUDENT') {
            return res.status(403).json({ message: 'Access denied' });
        }
        if (!title || !field || !resourceType) {
            return res.status(400).json({ message: 'Title, field, and resource type are required' });
        }
        const resource = await prisma_1.prisma.researchResource.create({
            data: {
                title,
                description,
                field,
                resourceType,
                url,
                fileUrl,
                fileName,
                author,
                publisher,
                publishedDate: publishedDate ? new Date(publishedDate) : null,
                tags: tags ? JSON.stringify(tags) : null,
                uploadedBy: userId
            }
        });
        res.json({
            message: 'Resource created successfully',
            resource: {
                ...resource,
                tags: resource.tags ? JSON.parse(resource.tags) : []
            }
        });
    }
    catch (error) {
        console.error('Create resource error:', error);
        res.status(500).json({ message: 'Failed to create resource', error: error.message });
    }
};
exports.createResource = createResource;
const getResources = async (req, res) => {
    try {
        const { field, resourceType, search } = req.query;
        const where = { isPublic: true };
        if (field) {
            where.field = field;
        }
        if (resourceType) {
            where.resourceType = resourceType;
        }
        if (search) {
            where.OR = [
                { title: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } }
            ];
        }
        const resources = await prisma_1.prisma.researchResource.findMany({
            where,
            orderBy: { createdAt: 'desc' }
        });
        const parsedResources = resources.map(r => ({
            ...r,
            tags: r.tags ? JSON.parse(r.tags) : []
        }));
        res.json(parsedResources);
    }
    catch (error) {
        console.error('Get resources error:', error);
        res.status(500).json({ message: 'Failed to get resources', error: error.message });
    }
};
exports.getResources = getResources;
// ========== SUPERVISOR CONNECT ==========
const requestSupervisor = async (req, res) => {
    try {
        const { supervisorId, field, requestMessage } = req.body;
        const userId = req.user.id;
        const userRole = req.user.role;
        if (userRole !== 'STUDENT') {
            return res.status(403).json({ message: 'Only students can request supervisors' });
        }
        if (!supervisorId || !field) {
            return res.status(400).json({ message: 'Supervisor ID and field are required' });
        }
        // Verify supervisor exists and is a provider or coach
        const supervisor = await prisma_1.prisma.user.findUnique({
            where: { id: supervisorId }
        });
        if (!supervisor || (supervisor.role !== 'HEALTHCARE_PROVIDER' && supervisor.role !== 'WELLNESS_COACH')) {
            return res.status(400).json({ message: 'Invalid supervisor' });
        }
        const match = await prisma_1.prisma.supervisorMatch.create({
            data: {
                studentId: userId,
                supervisorId,
                field,
                requestMessage,
                status: 'PENDING'
            },
            include: {
                student: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true
                    }
                },
                supervisor: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true
                    }
                }
            }
        });
        res.status(201).json({ message: 'Supervisor request sent successfully', match });
    }
    catch (error) {
        console.error('Request supervisor error:', error);
        res.status(500).json({ message: 'Failed to request supervisor', error: error.message });
    }
};
exports.requestSupervisor = requestSupervisor;
const getSupervisorRequests = async (req, res) => {
    try {
        const userId = req.user.id;
        const userRole = req.user.role;
        const { status } = req.query;
        const where = {};
        if (userRole === 'STUDENT') {
            where.studentId = userId;
        }
        else if (userRole === 'HEALTHCARE_PROVIDER' || userRole === 'WELLNESS_COACH') {
            where.supervisorId = userId;
        }
        else {
            return res.status(403).json({ message: 'Access denied' });
        }
        if (status) {
            where.status = status;
        }
        const requests = await prisma_1.prisma.supervisorMatch.findMany({
            where,
            include: {
                student: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true
                    }
                },
                supervisor: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
        res.json(requests);
    }
    catch (error) {
        console.error('Get supervisor requests error:', error);
        res.status(500).json({ message: 'Failed to get supervisor requests', error: error.message });
    }
};
exports.getSupervisorRequests = getSupervisorRequests;
const respondToSupervisorRequest = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, responseMessage } = req.body;
        const userId = req.user.id;
        const userRole = req.user.role;
        const match = await prisma_1.prisma.supervisorMatch.findUnique({
            where: { id }
        });
        if (!match) {
            return res.status(404).json({ message: 'Request not found' });
        }
        // Only supervisor can respond
        if (match.supervisorId !== userId) {
            return res.status(403).json({ message: 'Access denied' });
        }
        if (!['ACCEPTED', 'REJECTED'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }
        const updateData = {
            status,
            responseMessage
        };
        if (status === 'ACCEPTED') {
            updateData.matchedAt = new Date();
        }
        const updated = await prisma_1.prisma.supervisorMatch.update({
            where: { id },
            data: updateData,
            include: {
                student: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true
                    }
                },
                supervisor: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true
                    }
                }
            }
        });
        res.json({ message: 'Request response updated successfully', match: updated });
    }
    catch (error) {
        console.error('Respond to supervisor request error:', error);
        res.status(500).json({ message: 'Failed to respond to request', error: error.message });
    }
};
exports.respondToSupervisorRequest = respondToSupervisorRequest;
// ========== SUBMISSION TRACKER ==========
const createMilestone = async (req, res) => {
    try {
        const { proposalId, milestoneType, title, description, dueDate } = req.body;
        const userId = req.user.id;
        if (!proposalId || !milestoneType || !title) {
            return res.status(400).json({ message: 'Proposal ID, milestone type, and title are required' });
        }
        const proposal = await prisma_1.prisma.researchProposal.findUnique({
            where: { id: proposalId }
        });
        if (!proposal) {
            return res.status(404).json({ message: 'Proposal not found' });
        }
        if (proposal.userId !== userId) {
            return res.status(403).json({ message: 'Access denied' });
        }
        const milestone = await prisma_1.prisma.researchMilestone.create({
            data: {
                proposalId,
                userId,
                milestoneType,
                title,
                description,
                dueDate: dueDate ? new Date(dueDate) : null
            }
        });
        res.status(201).json({ message: 'Milestone created successfully', milestone });
    }
    catch (error) {
        console.error('Create milestone error:', error);
        res.status(500).json({ message: 'Failed to create milestone', error: error.message });
    }
};
exports.createMilestone = createMilestone;
const getMilestones = async (req, res) => {
    try {
        const { proposalId } = req.params;
        const userId = req.user.id;
        const proposal = await prisma_1.prisma.researchProposal.findUnique({
            where: { id: proposalId }
        });
        if (!proposal) {
            return res.status(404).json({ message: 'Proposal not found' });
        }
        if (proposal.userId !== userId) {
            return res.status(403).json({ message: 'Access denied' });
        }
        const milestones = await prisma_1.prisma.researchMilestone.findMany({
            where: { proposalId },
            orderBy: { createdAt: 'asc' }
        });
        res.json(milestones);
    }
    catch (error) {
        console.error('Get milestones error:', error);
        res.status(500).json({ message: 'Failed to get milestones', error: error.message });
    }
};
exports.getMilestones = getMilestones;
const updateMilestone = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, dueDate, status, notes } = req.body;
        const userId = req.user.id;
        const milestone = await prisma_1.prisma.researchMilestone.findUnique({
            where: { id }
        });
        if (!milestone) {
            return res.status(404).json({ message: 'Milestone not found' });
        }
        if (milestone.userId !== userId) {
            return res.status(403).json({ message: 'Access denied' });
        }
        const updateData = {};
        if (title)
            updateData.title = title;
        if (description !== undefined)
            updateData.description = description;
        if (dueDate !== undefined)
            updateData.dueDate = dueDate ? new Date(dueDate) : null;
        if (status) {
            updateData.status = status;
            if (status === 'COMPLETED' && !milestone.completedAt) {
                updateData.completedAt = new Date();
            }
        }
        if (notes !== undefined)
            updateData.notes = notes;
        const updated = await prisma_1.prisma.researchMilestone.update({
            where: { id },
            data: updateData
        });
        res.json({ message: 'Milestone updated successfully', milestone: updated });
    }
    catch (error) {
        console.error('Update milestone error:', error);
        res.status(500).json({ message: 'Failed to update milestone', error: error.message });
    }
};
exports.updateMilestone = updateMilestone;
// ========== COLLABORATION TOOLS ==========
const createCollaboration = async (req, res) => {
    try {
        const { proposalId, collaborationType, title, content, fileUrl, parentId, sharedWith } = req.body;
        const userId = req.user.id;
        if (!collaborationType || !title) {
            return res.status(400).json({ message: 'Collaboration type and title are required' });
        }
        const collaboration = await prisma_1.prisma.researchCollaboration.create({
            data: {
                proposalId: proposalId || null,
                userId,
                collaborationType,
                title,
                content: content || '',
                fileUrl,
                parentId: parentId || null,
                isShared: sharedWith ? true : false,
                sharedWith: sharedWith ? JSON.stringify(sharedWith) : null
            }
        });
        res.json({
            message: 'Collaboration item created successfully',
            collaboration: {
                ...collaboration,
                sharedWith: collaboration.sharedWith ? JSON.parse(collaboration.sharedWith) : []
            }
        });
    }
    catch (error) {
        console.error('Create collaboration error:', error);
        res.status(500).json({ message: 'Failed to create collaboration', error: error.message });
    }
};
exports.createCollaboration = createCollaboration;
const getCollaborations = async (req, res) => {
    try {
        const { proposalId, collaborationType, parentId } = req.query;
        const userId = req.user.id;
        const where = {
            OR: [
                { userId },
                { isShared: true, sharedWith: { contains: userId } }
            ]
        };
        if (proposalId) {
            where.proposalId = proposalId;
        }
        if (collaborationType) {
            where.collaborationType = collaborationType;
        }
        if (parentId !== undefined) {
            where.parentId = parentId || null;
        }
        const collaborations = await prisma_1.prisma.researchCollaboration.findMany({
            where,
            include: {
                user: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
        const parsedCollaborations = collaborations.map(c => ({
            ...c,
            sharedWith: c.sharedWith ? JSON.parse(c.sharedWith) : []
        }));
        res.json(parsedCollaborations);
    }
    catch (error) {
        console.error('Get collaborations error:', error);
        res.status(500).json({ message: 'Failed to get collaborations', error: error.message });
    }
};
exports.getCollaborations = getCollaborations;
const updateCollaboration = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content, fileUrl, sharedWith } = req.body;
        const userId = req.user.id;
        const collaboration = await prisma_1.prisma.researchCollaboration.findUnique({
            where: { id }
        });
        if (!collaboration) {
            return res.status(404).json({ message: 'Collaboration item not found' });
        }
        if (collaboration.userId !== userId) {
            return res.status(403).json({ message: 'Access denied' });
        }
        const updateData = {};
        if (title)
            updateData.title = title;
        if (content !== undefined)
            updateData.content = content;
        if (fileUrl !== undefined)
            updateData.fileUrl = fileUrl;
        if (sharedWith !== undefined) {
            updateData.sharedWith = sharedWith ? JSON.stringify(sharedWith) : null;
            updateData.isShared = sharedWith ? true : false;
        }
        const updated = await prisma_1.prisma.researchCollaboration.update({
            where: { id },
            data: updateData
        });
        res.json({
            message: 'Collaboration item updated successfully',
            collaboration: {
                ...updated,
                sharedWith: updated.sharedWith ? JSON.parse(updated.sharedWith) : []
            }
        });
    }
    catch (error) {
        console.error('Update collaboration error:', error);
        res.status(500).json({ message: 'Failed to update collaboration', error: error.message });
    }
};
exports.updateCollaboration = updateCollaboration;
const deleteCollaboration = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const collaboration = await prisma_1.prisma.researchCollaboration.findUnique({
            where: { id }
        });
        if (!collaboration) {
            return res.status(404).json({ message: 'Collaboration item not found' });
        }
        if (collaboration.userId !== userId) {
            return res.status(403).json({ message: 'Access denied' });
        }
        await prisma_1.prisma.researchCollaboration.delete({
            where: { id }
        });
        res.json({ message: 'Collaboration item deleted successfully' });
    }
    catch (error) {
        console.error('Delete collaboration error:', error);
        res.status(500).json({ message: 'Failed to delete collaboration', error: error.message });
    }
};
exports.deleteCollaboration = deleteCollaboration;
//# sourceMappingURL=researchController.js.map