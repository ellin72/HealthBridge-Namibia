// FHIR (Fast Healthcare Interoperability Resources) utilities
// This provides interoperability with legacy hospital information systems

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Convert Patient to FHIR Patient resource
export function patientToFHIR(patient: any) {
  return {
    resourceType: 'Patient',
    id: patient.id,
    identifier: [
      {
        use: 'usual',
        value: patient.id,
      },
    ],
    name: [
      {
        use: 'official',
        family: patient.lastName,
        given: [patient.firstName],
      },
    ],
    telecom: patient.phone
      ? [
          {
            system: 'phone',
            value: patient.phone,
          },
          {
            system: 'email',
            value: patient.email,
          },
        ]
      : [
          {
            system: 'email',
            value: patient.email,
          },
        ],
    gender: patient.gender || 'unknown',
    birthDate: patient.birthDate || undefined,
    meta: {
      lastUpdated: patient.updatedAt || patient.createdAt,
    },
  };
}

// Convert Appointment to FHIR Appointment resource
export function appointmentToFHIR(appointment: any) {
  return {
    resourceType: 'Appointment',
    id: appointment.id,
    status: mapAppointmentStatus(appointment.status),
    serviceType: [
      {
        coding: [
          {
            system: 'http://terminology.hl7.org/CodeSystem/service-type',
            code: 'general',
            display: 'General Consultation',
          },
        ],
      },
    ],
    participant: [
      {
        actor: {
          reference: `Patient/${appointment.patientId}`,
        },
        status: 'accepted',
      },
      {
        actor: {
          reference: `Practitioner/${appointment.providerId}`,
        },
        status: 'accepted',
      },
    ],
    start: appointment.appointmentDate,
    end: new Date(new Date(appointment.appointmentDate).getTime() + 30 * 60 * 1000).toISOString(), // 30 min default
    created: appointment.createdAt,
    meta: {
      lastUpdated: appointment.updatedAt || appointment.createdAt,
    },
  };
}

// Convert Observation (vital signs, lab results) to FHIR Observation resource
export function observationToFHIR(observation: any) {
  return {
    resourceType: 'Observation',
    id: observation.id,
    status: 'final',
    category: [
      {
        coding: [
          {
            system: 'http://terminology.hl7.org/CodeSystem/observation-category',
            code: observation.category || 'vital-signs',
          },
        ],
      },
    ],
    code: {
      coding: [
        {
          system: observation.codeSystem || 'http://loinc.org',
          code: observation.code,
          display: observation.display,
        },
      ],
    },
    subject: {
      reference: `Patient/${observation.patientId}`,
    },
    effectiveDateTime: observation.date || new Date().toISOString(),
    valueQuantity: observation.value
      ? {
          value: observation.value,
          unit: observation.unit,
          system: 'http://unitsofmeasure.org',
          code: observation.unitCode,
        }
      : undefined,
    valueString: observation.valueString || undefined,
    meta: {
      lastUpdated: observation.updatedAt || observation.createdAt,
    },
  };
}

// Store FHIR resource
export async function storeFHIRResource(resource: any) {
  const existing = await prisma.fHIRResource.findUnique({
    where: { fhirId: resource.id },
  });

  if (existing) {
    return await prisma.fHIRResource.update({
      where: { id: existing.id },
      data: {
        resourceData: JSON.stringify(resource),
        version: existing.version + 1,
        lastUpdated: new Date(),
      },
    });
  } else {
    return await prisma.fHIRResource.create({
      data: {
        resourceType: resource.resourceType,
        fhirId: resource.id,
        resourceData: JSON.stringify(resource),
        version: 1,
      },
    });
  }
}

// Get FHIR resource
export async function getFHIRResource(fhirId: string) {
  const resource = await prisma.fHIRResource.findUnique({
    where: { fhirId },
  });

  if (!resource) {
    return null;
  }

  return JSON.parse(resource.resourceData);
}

// Map appointment status to FHIR status
function mapAppointmentStatus(status: string): string {
  const statusMap: { [key: string]: string } = {
    PENDING: 'proposed',
    CONFIRMED: 'confirmed',
    COMPLETED: 'fulfilled',
    CANCELLED: 'cancelled',
  };

  return statusMap[status] || 'proposed';
}

// Export patient data as FHIR Bundle
export async function exportPatientAsFHIRBundle(patientId: string) {
  const patient = await prisma.user.findUnique({
    where: { id: patientId },
    include: {
      appointmentsAsPatient: true,
      patientHistory: true,
    },
  });

  if (!patient) {
    throw new Error('Patient not found');
  }

  const bundle = {
    resourceType: 'Bundle',
    type: 'document',
    id: `bundle-${patientId}-${Date.now()}`,
    timestamp: new Date().toISOString(),
    entry: [
      {
        fullUrl: `Patient/${patient.id}`,
        resource: patientToFHIR(patient),
      },
      ...patient.appointmentsAsPatient.map((appointment) => ({
        fullUrl: `Appointment/${appointment.id}`,
        resource: appointmentToFHIR(appointment),
      })),
    ],
  };

  return bundle;
}

