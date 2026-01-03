import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { prisma } from '../utils/prisma';
import bcrypt from 'bcryptjs';

export const getUsers = async (req: AuthRequest, res: Response) => {
  try {
    const { role, search } = req.query;
    const userId = req.user!.id;
    const userRole = req.user!.role;

    const where: any = {};

    // ADMIN users can see all users (route is already protected by authorize(UserRole.ADMIN))
    // Regular users can only see themselves
    // Providers can only see patients who have chosen them
    // Wellness coaches can only see users who have chosen them
    if (userRole === 'ADMIN') {
      // Admins can see all users - no restriction needed
      // where clause remains empty to allow all users
      // Note: Role and search filters (lines 47-57) still apply to ADMIN queries
      // This allows admins to filter users by role or search terms for administrative purposes
    } else if (userRole === 'PATIENT' || userRole === 'STUDENT') {
      // Patients/Students can only see themselves
      where.id = userId;
    } else if (userRole === 'HEALTHCARE_PROVIDER') {
      // Providers can only see patients who have appointments with them
      const appointments = await prisma.appointment.findMany({
        where: { providerId: userId },
        select: { patientId: true },
        distinct: ['patientId']
      });
      const patientIds = appointments.map(a => a.patientId);
      if (patientIds.length === 0) {
        // No patients, return empty result
        where.id = '00000000-0000-0000-0000-000000000000';
      } else {
        where.id = { in: patientIds };
      }
    } else if (userRole === 'WELLNESS_COACH') {
      // Wellness coaches can only see users who have wellness plans with them
      // For now, return empty until we establish the relationship in schema
      where.id = '00000000-0000-0000-0000-000000000000';
    } else {
      // All other roles cannot see user list
      where.id = '00000000-0000-0000-0000-000000000000';
    }

    if (role) {
      where.role = role;
    }

    if (search) {
      where.OR = [
        { firstName: { contains: search as string, mode: 'insensitive' } },
        { lastName: { contains: search as string, mode: 'insensitive' } },
        { email: { contains: search as string, mode: 'insensitive' } }
      ];
    }

    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
        isActive: true,
        createdAt: true
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(users);
  } catch (error: any) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Failed to get users', error: error.message });
  }
};

export const getUserById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;
    const userRole = req.user!.role;

    // Prevent "providers" from being treated as an ID
    if (id === 'providers') {
      return res.status(404).json({ message: 'Route not found' });
    }

    // Users can view their own profile
    if (userId === id) {
      // Allow access to own profile
    } else if (userRole === 'HEALTHCARE_PROVIDER') {
      // Providers can only view profiles of patients who have chosen them
      const hasRelationship = await prisma.appointment.findFirst({
        where: {
          providerId: userId,
          patientId: id
        }
      });
      if (!hasRelationship) {
        return res.status(403).json({ message: 'Access denied. You can only view profiles of your patients.' });
      }
    } else if (userRole === 'WELLNESS_COACH') {
      // Wellness coaches can only view profiles of users who have chosen them
      // For now, deny access until we establish the relationship
      return res.status(403).json({ message: 'Access denied. You can only view profiles of your clients.' });
    } else {
      // All other roles cannot view other users' profiles
      return res.status(403).json({ message: 'Access denied' });
    }

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
        isActive: true,
        createdAt: true
      }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error: any) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Failed to get user', error: error.message });
  }
};

export const updateUser = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, phone, password } = req.body;

    // Users can only update their own profile
    if (req.user?.id !== id) {
      return res.status(403).json({ message: 'Access denied. You can only update your own profile.' });
    }

    const updateData: any = {};

    if (firstName) updateData.firstName = firstName;
    if (lastName) updateData.lastName = lastName;
    if (phone) updateData.phone = phone;
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const user = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
        updatedAt: true
      }
    });

    res.json({ message: 'User updated successfully', user });
  } catch (error: any) {
    console.error('Update user error:', error);
    res.status(500).json({ message: 'Failed to update user', error: error.message });
  }
};

export const createUser = async (req: AuthRequest, res: Response) => {
  try {
    const { email, password, firstName, lastName, phone, role } = req.body;

    // Validate required fields
    if (!email || !password || !firstName || !lastName || !role) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        phone,
        role,
        isActive: true
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
        isActive: true,
        createdAt: true
      }
    });

    res.status(201).json({
      message: 'User created successfully',
      user
    });
  } catch (error: any) {
    console.error('Create user error:', error);
    res.status(500).json({ message: 'Failed to create user', error: error.message });
  }
};

export const deleteUser = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.user.delete({
      where: { id }
    });

    res.json({ message: 'User deleted successfully' });
  } catch (error: any) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'Failed to delete user', error: error.message });
  }
};

// Get healthcare providers (accessible to patients for booking appointments)
export const getProviders = async (req: AuthRequest, res: Response) => {
  try {
    console.log('getProviders called');
    console.log('User:', req.user);
    
    // This endpoint is accessible to all authenticated users
    const { search } = req.query;

    const where: any = {
      role: 'HEALTHCARE_PROVIDER',
      isActive: true
    };

    if (search) {
      where.OR = [
        { firstName: { contains: search as string, mode: 'insensitive' } },
        { lastName: { contains: search as string, mode: 'insensitive' } },
        { email: { contains: search as string, mode: 'insensitive' } }
      ];
    }

    const providers = await prisma.user.findMany({
      where,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
        createdAt: true,
        providerFee: {
          select: {
            consultationFee: true,
            serviceFees: true,
            currency: true,
            isActive: true
          }
        }
      },
      orderBy: [
        { lastName: 'asc' },
        { firstName: 'asc' }
      ]
    });

    // Format providers with fee information
    const providersWithFees = providers.map(provider => {
      let serviceFees = null;
      if (provider.providerFee?.serviceFees) {
        try {
          serviceFees = JSON.parse(provider.providerFee.serviceFees);
        } catch (parseError) {
          console.warn(`Failed to parse serviceFees for provider ${provider.id}:`, parseError);
          serviceFees = null;
        }
      }
      
      return {
        id: provider.id,
        email: provider.email,
        firstName: provider.firstName,
        lastName: provider.lastName,
        phone: provider.phone,
        role: provider.role,
        createdAt: provider.createdAt,
        consultationFee: provider.providerFee?.consultationFee || 500, // Default to 500 if no fee set
        serviceFees,
        currency: provider.providerFee?.currency || 'NAD',
        feeActive: provider.providerFee?.isActive ?? true
      };
    });

    console.log(`Found ${providersWithFees.length} healthcare providers`);
    console.log('Providers:', providersWithFees.map(p => `${p.firstName} ${p.lastName} - ${p.currency} ${p.consultationFee}`));

    res.json(providersWithFees);
  } catch (error: any) {
    console.error('Get providers error:', error);
    res.status(500).json({ message: 'Failed to get providers', error: error.message });
  }
};

