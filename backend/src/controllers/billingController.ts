import { Response } from 'express';
import { prisma } from '../utils/prisma';
import { AuthRequest } from '../middleware/auth';

// Automatically generate invoice after consultation
export const generateInvoiceAfterConsultation = async (
  appointmentId: string,
  providerId: string,
  patientId: string
): Promise<any> => {
  try {
    // Check if invoice already exists for this appointment
    const existingInvoice = await prisma.billingInvoice.findFirst({
      where: { appointmentId }
    });

    if (existingInvoice) {
      return existingInvoice;
    }

    // Get provider fee settings
    let providerFee = await prisma.providerFee.findUnique({
      where: { providerId }
    });

    // Create default fee if doesn't exist
    if (!providerFee) {
      providerFee = await prisma.providerFee.create({
        data: {
          providerId,
          consultationFee: 500,
          currency: 'NAD',
          isActive: true
        }
      });
    }

    // Get service fees if available
    const serviceFees = providerFee.serviceFees ? JSON.parse(providerFee.serviceFees) : {};
    const consultationFee = providerFee.consultationFee;

    // Create invoice items
    const items = [
      {
        description: 'Healthcare Consultation',
        quantity: 1,
        price: consultationFee
      }
    ];

    // Add additional service fees if any
    if (Object.keys(serviceFees).length > 0) {
      for (const [service, fee] of Object.entries(serviceFees)) {
        items.push({
          description: service,
          quantity: 1,
          price: fee as number
        });
      }
    }

    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = 0; // VAT can be added if applicable
    const total = subtotal + tax;

    // Generate invoice number
    const invoiceNumber = `INV-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

    const invoice = await prisma.billingInvoice.create({
      data: {
        providerId,
        patientId,
        appointmentId,
        invoiceNumber,
        items: JSON.stringify(items),
        subtotal,
        tax,
        discount: 0,
        total,
        status: 'PENDING',
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      },
      include: {
        patient: {
          select: { id: true, firstName: true, lastName: true, email: true }
        },
        provider: {
          select: { id: true, firstName: true, lastName: true, email: true }
        }
      }
    });

    return invoice;
  } catch (error: any) {
    console.error('Generate invoice after consultation error:', error);
    throw error;
  }
};

// Get invoices
export const getInvoices = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const userRole = req.user!.role;
    const { status, patientId, providerId } = req.query;

    const where: any = {};
    
    if (userRole === 'PATIENT') {
      // Patients can only see their own invoices
      where.patientId = userId;
    } else if (userRole === 'HEALTHCARE_PROVIDER') {
      // Providers can only see invoices for patients who have chosen them
      where.providerId = userId;
      if (patientId) {
        // Verify the provider has a relationship with this patient
        const hasRelationship = await prisma.appointment.findFirst({
          where: {
            providerId: userId,
            patientId: patientId as string
          }
        });
        if (!hasRelationship) {
          return res.status(403).json({ message: 'Access denied. You can only view invoices for your patients.' });
        }
        where.patientId = patientId;
      }
    } else {
      // All other roles cannot see invoices
      where.patientId = '00000000-0000-0000-0000-000000000000';
    }
    
    if (status) where.status = status;
    if (providerId && userRole === 'PATIENT') {
      // Patients can filter by provider
      where.providerId = providerId;
    }

    const invoices = await prisma.billingInvoice.findMany({
      where,
      include: {
        patient: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
        provider: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const formattedInvoices = invoices.map((inv) => ({
      ...inv,
      items: JSON.parse(inv.items),
    }));

    res.json({ invoices: formattedInvoices });
  } catch (error: any) {
    console.error('Get invoices error:', error);
    res.status(500).json({ message: 'Failed to fetch invoices', error: error.message });
  }
};

// Create invoice
export const createInvoice = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const userRole = req.user!.role;
    const { patientId, appointmentId, items, tax, discount, dueDate, notes } = req.body;

    // Only providers can create invoices
    if (userRole !== 'HEALTHCARE_PROVIDER') {
      return res.status(403).json({ message: 'Only healthcare providers can create invoices' });
    }

    if (!patientId || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Verify the provider has a relationship with this patient
    const hasRelationship = await prisma.appointment.findFirst({
      where: {
        providerId: userId,
        patientId: patientId
      }
    });
    if (!hasRelationship) {
      return res.status(403).json({ message: 'Access denied. You can only create invoices for your patients.' });
    }

    // Calculate totals
    const subtotal = items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);
    const taxAmount = tax || 0;
    const discountAmount = discount || 0;
    const total = subtotal + taxAmount - discountAmount;

    // Generate invoice number
    const invoiceNumber = `INV-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

    const invoice = await prisma.billingInvoice.create({
      data: {
        providerId: userId,
        patientId,
        appointmentId: appointmentId || null,
        invoiceNumber,
        items: JSON.stringify(items),
        subtotal,
        tax: taxAmount,
        discount: discountAmount,
        total,
        status: 'DRAFT',
        dueDate: dueDate ? new Date(dueDate) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days default
        notes: notes || null,
      },
      include: {
        patient: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
      },
    });

    res.status(201).json({
      message: 'Invoice created successfully',
      invoice: {
        ...invoice,
        items: JSON.parse(invoice.items),
      },
    });
  } catch (error: any) {
    console.error('Create invoice error:', error);
    res.status(500).json({ message: 'Failed to create invoice', error: error.message });
  }
};

// Update invoice
export const updateInvoice = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;
    const { items, tax, discount, status, dueDate, notes } = req.body;

    const invoice = await prisma.billingInvoice.findFirst({
      where: { id, providerId: userId },
    });

    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    // Recalculate totals if items changed
    let subtotal = invoice.subtotal;
    let total = invoice.total;
    
    if (items) {
      subtotal = items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);
      const taxAmount = tax !== undefined ? tax : invoice.tax;
      const discountAmount = discount !== undefined ? discount : invoice.discount;
      total = subtotal + taxAmount - discountAmount;
    } else {
      const taxAmount = tax !== undefined ? tax : invoice.tax;
      const discountAmount = discount !== undefined ? discount : invoice.discount;
      total = invoice.subtotal + taxAmount - discountAmount;
    }

    const updated = await prisma.billingInvoice.update({
      where: { id },
      data: {
        items: items ? JSON.stringify(items) : undefined,
        subtotal,
        tax: tax !== undefined ? tax : undefined,
        discount: discount !== undefined ? discount : undefined,
        total,
        status,
        dueDate: dueDate ? new Date(dueDate) : undefined,
        notes,
        paidDate: status === 'PAID' && invoice.status !== 'PAID' ? new Date() : undefined,
      },
    });

    res.json({
      message: 'Invoice updated successfully',
      invoice: {
        ...updated,
        items: JSON.parse(updated.items),
      },
    });
  } catch (error: any) {
    console.error('Update invoice error:', error);
    res.status(500).json({ message: 'Failed to update invoice', error: error.message });
  }
};

// Get billing statistics
export const getBillingStats = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const userRole = req.user!.role;

    const where: any = userRole === 'HEALTHCARE_PROVIDER' 
      ? { providerId: userId }
      : { patientId: userId };

    const [totalInvoices, paidInvoices, pendingInvoices, overdueInvoices, totalRevenue] = await Promise.all([
      prisma.billingInvoice.count({ where }),
      prisma.billingInvoice.count({ where: { ...where, status: 'PAID' } }),
      prisma.billingInvoice.count({ where: { ...where, status: 'PENDING' } }),
      prisma.billingInvoice.count({ 
        where: { 
          ...where, 
          status: 'PENDING',
          dueDate: { lt: new Date() },
        },
      }),
      prisma.billingInvoice.aggregate({
        where: { ...where, status: 'PAID' },
        _sum: { total: true },
      }),
    ]);

    res.json({
      stats: {
        totalInvoices,
        paidInvoices,
        pendingInvoices,
        overdueInvoices,
        totalRevenue: totalRevenue._sum.total || 0,
      },
    });
  } catch (error: any) {
    console.error('Get billing stats error:', error);
    res.status(500).json({ message: 'Failed to fetch billing statistics', error: error.message });
  }
};

