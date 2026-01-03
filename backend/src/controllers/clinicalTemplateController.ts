import { Response } from 'express';
import { prisma } from '../utils/prisma';
import { AuthRequest } from '../middleware/auth';

// Get clinical templates
export const getTemplates = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { category, shared } = req.query;

    const where: any = {};
    
    // Providers can see their own templates and shared ones
    if (shared === 'true') {
      where.isShared = true;
    } else {
      where.providerId = userId;
    }
    
    if (category) where.category = category;

    const templates = await prisma.clinicalTemplate.findMany({
      where,
      orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
    });

    const formattedTemplates = templates.map((t) => ({
      ...t,
      templateData: JSON.parse(t.templateData),
    }));

    res.json({ templates: formattedTemplates });
  } catch (error: any) {
    console.error('Get templates error:', error);
    res.status(500).json({ message: 'Failed to fetch templates', error: error.message });
  }
};

// Create clinical template
export const createTemplate = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { name, category, templateData, isDefault, isShared } = req.body;

    if (!name || !category || !templateData) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // If setting as default, unset other defaults
    if (isDefault) {
      await prisma.clinicalTemplate.updateMany({
        where: { providerId: userId, isDefault: true },
        data: { isDefault: false },
      });
    }

    const template = await prisma.clinicalTemplate.create({
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
  } catch (error: any) {
    console.error('Create template error:', error);
    res.status(500).json({ message: 'Failed to create template', error: error.message });
  }
};

// Update clinical template
export const updateTemplate = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;
    const { name, category, templateData, isDefault, isShared } = req.body;

    const template = await prisma.clinicalTemplate.findFirst({
      where: { id, providerId: userId },
    });

    if (!template) {
      return res.status(404).json({ message: 'Template not found' });
    }

    // If setting as default, unset other defaults
    if (isDefault) {
      await prisma.clinicalTemplate.updateMany({
        where: { providerId: userId, isDefault: true, id: { not: id } },
        data: { isDefault: false },
      });
    }

    const updated = await prisma.clinicalTemplate.update({
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
  } catch (error: any) {
    console.error('Update template error:', error);
    res.status(500).json({ message: 'Failed to update template', error: error.message });
  }
};

// Delete clinical template
export const deleteTemplate = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;

    const template = await prisma.clinicalTemplate.findFirst({
      where: { id, providerId: userId },
    });

    if (!template) {
      return res.status(404).json({ message: 'Template not found' });
    }

    await prisma.clinicalTemplate.delete({
      where: { id },
    });

    res.json({ message: 'Template deleted successfully' });
  } catch (error: any) {
    console.error('Delete template error:', error);
    res.status(500).json({ message: 'Failed to delete template', error: error.message });
  }
};

