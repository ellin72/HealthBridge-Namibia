import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { PrismaClient, AssignmentStatus } from '@prisma/client';
import path from 'path';
import fs from 'fs';

const prisma = new PrismaClient();

// Learning Resources
export const uploadLearningResource = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'File is required' });
    }

    const { title, description, isPublished } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }

    const fileUrl = `/uploads/${req.file.filename}`;
    const fileSize = req.file.size;
    const mimeType = req.file.mimetype;

    const resource = await prisma.learningResource.create({
      data: {
        title,
        description,
        fileUrl,
        fileName: req.file.originalname,
        fileSize,
        mimeType,
        uploadedBy: req.user!.id,
        isPublished: isPublished === 'true' || false
      }
    });

    res.status(201).json({ message: 'Learning resource uploaded successfully', resource });
  } catch (error: any) {
    console.error('Upload learning resource error:', error);
    res.status(500).json({ message: 'Failed to upload learning resource', error: error.message });
  }
};

export const getLearningResources = async (req: AuthRequest, res: Response) => {
  try {
    const { publishedOnly } = req.query;
    const userRole = req.user!.role;

    const where: any = {};

    // Students can only see published resources
    if (publishedOnly === 'true' || userRole === 'STUDENT') {
      where.isPublished = true;
    }

    const resources = await prisma.learningResource.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });

    res.json(resources);
  } catch (error: any) {
    console.error('Get learning resources error:', error);
    res.status(500).json({ message: 'Failed to get learning resources', error: error.message });
  }
};

export const deleteLearningResource = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userRole = req.user!.role;

    // Only admins can delete resources
    if (userRole !== 'ADMIN') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const resource = await prisma.learningResource.findUnique({
      where: { id }
    });

    if (!resource) {
      return res.status(404).json({ message: 'Learning resource not found' });
    }

    // Delete file from filesystem
    const filePath = path.join(__dirname, '../../', resource.fileUrl);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await prisma.learningResource.delete({
      where: { id }
    });

    res.json({ message: 'Learning resource deleted successfully' });
  } catch (error: any) {
    console.error('Delete learning resource error:', error);
    res.status(500).json({ message: 'Failed to delete learning resource', error: error.message });
  }
};

// Assignments
export const createAssignment = async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, dueDate, fileUrl } = req.body;
    const instructorId = req.user!.id;

    if (!title || !description || !dueDate) {
      return res.status(400).json({ message: 'Title, description, and due date are required' });
    }

    // Only healthcare providers and admins can create assignments
    if (req.user!.role !== 'HEALTHCARE_PROVIDER' && req.user!.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Only instructors can create assignments' });
    }

    const assignment = await prisma.assignment.create({
      data: {
        title,
        description,
        dueDate: new Date(dueDate),
        instructorId,
        fileUrl
      },
      include: {
        instructor: {
          select: {
            id: true,
            firstName: true,
            lastName: true
          }
        }
      }
    });

    res.status(201).json({ message: 'Assignment created successfully', assignment });
  } catch (error: any) {
    console.error('Create assignment error:', error);
    res.status(500).json({ message: 'Failed to create assignment', error: error.message });
  }
};

export const getAssignments = async (req: AuthRequest, res: Response) => {
  try {
    const { instructorId, studentId } = req.query;
    const userId = req.user!.id;
    const userRole = req.user!.role;

    const where: any = {};

    if (instructorId) {
      where.instructorId = instructorId as string;
    }

    // Students see all assignments, instructors see their own
    if (userRole === 'HEALTHCARE_PROVIDER' && !instructorId) {
      where.instructorId = userId;
    }

    const assignments = await prisma.assignment.findMany({
      where,
      include: {
        instructor: {
          select: {
            id: true,
            firstName: true,
            lastName: true
          }
        },
        submissions: userRole === 'STUDENT' ? {
          where: { studentId: userId },
          select: {
            id: true,
            status: true,
            grade: true,
            submittedAt: true
          }
        } : true
      },
      orderBy: { dueDate: 'asc' }
    });

    res.json(assignments);
  } catch (error: any) {
    console.error('Get assignments error:', error);
    res.status(500).json({ message: 'Failed to get assignments', error: error.message });
  }
};

export const getAssignmentById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;
    const userRole = req.user!.role;

    const assignment = await prisma.assignment.findUnique({
      where: { id },
      include: {
        instructor: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        },
        submissions: {
          include: {
            student: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true
              }
            }
          }
        }
      }
    });

    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    res.json(assignment);
  } catch (error: any) {
    console.error('Get assignment error:', error);
    res.status(500).json({ message: 'Failed to get assignment', error: error.message });
  }
};

export const submitAssignment = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'File is required' });
    }

    const { assignmentId } = req.body;
    const studentId = req.user!.id;

    if (!assignmentId) {
      return res.status(400).json({ message: 'Assignment ID is required' });
    }

    // Only students can submit assignments
    if (req.user!.role !== 'STUDENT') {
      return res.status(403).json({ message: 'Only students can submit assignments' });
    }

    // Check if assignment exists
    const assignment = await prisma.assignment.findUnique({
      where: { id: assignmentId }
    });

    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    // Check if already submitted
    const existingSubmission = await prisma.assignmentSubmission.findUnique({
      where: {
        assignmentId_studentId: {
          assignmentId,
          studentId
        }
      }
    });

    if (existingSubmission) {
      return res.status(400).json({ message: 'Assignment already submitted' });
    }

    const fileUrl = `/uploads/${req.file.filename}`;
    const fileSize = req.file.size;
    const mimeType = req.file.mimetype;

    const submission = await prisma.assignmentSubmission.create({
      data: {
        assignmentId,
        studentId,
        fileUrl,
        fileName: req.file.originalname,
        fileSize,
        mimeType,
        status: 'SUBMITTED'
      },
      include: {
        assignment: {
          select: {
            id: true,
            title: true,
            dueDate: true
          }
        },
        student: {
          select: {
            id: true,
            firstName: true,
            lastName: true
          }
        }
      }
    });

    res.status(201).json({ message: 'Assignment submitted successfully', submission });
  } catch (error: any) {
    console.error('Submit assignment error:', error);
    res.status(500).json({ message: 'Failed to submit assignment', error: error.message });
  }
};

export const gradeAssignment = async (req: AuthRequest, res: Response) => {
  try {
    const { submissionId } = req.params;
    const { grade, feedback } = req.body;

    if (grade === undefined) {
      return res.status(400).json({ message: 'Grade is required' });
    }

    // Only instructors and admins can grade
    if (req.user!.role !== 'HEALTHCARE_PROVIDER' && req.user!.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Only instructors can grade assignments' });
    }

    const submission = await prisma.assignmentSubmission.findUnique({
      where: { id: submissionId },
      include: {
        assignment: true
      }
    });

    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }

    // Check if instructor owns the assignment
    if (req.user!.role !== 'ADMIN' && submission.assignment.instructorId !== req.user!.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const updatedSubmission = await prisma.assignmentSubmission.update({
      where: { id: submissionId },
      data: {
        grade: parseFloat(grade),
        feedback,
        status: 'GRADED',
        gradedAt: new Date()
      },
      include: {
        assignment: true,
        student: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        }
      }
    });

    res.json({ message: 'Assignment graded successfully', submission: updatedSubmission });
  } catch (error: any) {
    console.error('Grade assignment error:', error);
    res.status(500).json({ message: 'Failed to grade assignment', error: error.message });
  }
};

