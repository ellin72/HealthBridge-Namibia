"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTemplate = exports.updateTemplate = exports.createTemplate = exports.getTemplates = void 0;
const prisma_1 = require("../utils/prisma");
// Get clinical templates
const getTemplates = async (req, res) => {
    try {
        const userId = req.user.id;
        const { category, shared } = req.query;
        const where = {};
        // Providers can see their own templates and shared ones
        if (shared === 'true') {
            where.isShared = true;
        }
        else {
            where.providerId = userId;
        }
        if (category)
            where.category = category;
        const templates = await prisma_1.prisma.clinicalTemplate.findMany({
            where,
            orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
        });
        const formattedTemplates = templates.map((t) => ({
            ...t,
            templateData: JSON.parse(t.templateData),
        }));
        res.json({ templates: formattedTemplates });
    }
    catch (error) {
        console.error('Get templates error:', error);
        res.status(500).json({ message: 'Failed to fetch templates', error: error.message });
    }
};
exports.getTemplates = getTemplates;
// Create clinical template
const createTemplate = async (req, res) => {
    try {
        const userId = req.user.id;
        const { name, category, templateData, isDefault, isShared } = req.body;
        if (!name || !category || !templateData) {
            return res.status(400).json({ message: 'Missing required fields' });
        }
        // If setting as default, unset other defaults
        if (isDefault) {
            await prisma_1.prisma.clinicalTemplate.updateMany({
                where: { providerId: userId, isDefault: true },
                data: { isDefault: false },
            });
        }
        const template = await prisma_1.prisma.clinicalTemplate.create({
            data: {
                providerId: userId,
                name,
                category,
                templateData: JSON.stringify(templateData),
                isDefault: isDefault || false,
                isShared: isShared || false,
            },
        });
        res.status(201).json({
            message: 'Clinical template created successfully',
            template: {
                ...template,
                templateData: JSON.parse(template.templateData),
            },
        });
    }
    catch (error) {
        console.error('Create template error:', error);
        res.status(500).json({ message: 'Failed to create template', error: error.message });
    }
};
exports.createTemplate = createTemplate;
// Update clinical template
const updateTemplate = async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;
        const { name, category, templateData, isDefault, isShared } = req.body;
        const template = await prisma_1.prisma.clinicalTemplate.findFirst({
            where: { id, providerId: userId },
        });
        if (!template) {
            return res.status(404).json({ message: 'Template not found' });
        }
        // If setting as default, unset other defaults
        if (isDefault) {
            await prisma_1.prisma.clinicalTemplate.updateMany({
                where: { providerId: userId, isDefault: true, id: { not: id } },
                data: { isDefault: false },
            });
        }
        const updated = await prisma_1.prisma.clinicalTemplate.update({
            where: { id },
            data: {
                name,
                category,
                templateData: templateData ? JSON.stringify(templateData) : undefined,
                isDefault,
                isShared,
            },
        });
        res.json({
            message: 'Template updated successfully',
            template: {
                ...updated,
                templateData: JSON.parse(updated.templateData),
            },
        });
    }
    catch (error) {
        console.error('Update template error:', error);
        res.status(500).json({ message: 'Failed to update template', error: error.message });
    }
};
exports.updateTemplate = updateTemplate;
// Delete clinical template
const deleteTemplate = async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;
        const template = await prisma_1.prisma.clinicalTemplate.findFirst({
            where: { id, providerId: userId },
        });
        if (!template) {
            return res.status(404).json({ message: 'Template not found' });
        }
        await prisma_1.prisma.clinicalTemplate.delete({
            where: { id },
        });
        res.json({ message: 'Template deleted successfully' });
    }
    catch (error) {
        console.error('Delete template error:', error);
        res.status(500).json({ message: 'Failed to delete template', error: error.message });
    }
};
exports.deleteTemplate = deleteTemplate;
//# sourceMappingURL=clinicalTemplateController.js.map