# HealthBridge Namibia - Database Schema Documentation

## Overview

The database uses PostgreSQL with Prisma ORM. The schema supports multiple user roles and three main modules: Telehealth, Wellness Hub, and Learning Zone.

## Entity Relationship Diagram

```
User (1) ────< (N) Appointment (N) >─── (1) User
                │
                └───< (N) ConsultationNote

User (1) ────< (N) WellnessContent
User (1) ────< (N) Assignment (N) >─── (N) AssignmentSubmission >─── (1) User
LearningResource (standalone)
```

## Models

### User
Represents all users in the system (patients, providers, coaches, students, admins).

**Fields:**
- `id` (UUID, Primary Key): Unique identifier
- `email` (String, Unique): User email address
- `password` (String): Hashed password
- `firstName` (String): User's first name
- `lastName` (String): User's last name
- `phone` (String, Optional): Phone number
- `role` (Enum): User role (PATIENT, HEALTHCARE_PROVIDER, WELLNESS_COACH, STUDENT, ADMIN)
- `isActive` (Boolean): Account status
- `createdAt` (DateTime): Account creation timestamp
- `updatedAt` (DateTime): Last update timestamp

**Relations:**
- `appointmentsAsPatient`: Appointments where user is the patient
- `appointmentsAsProvider`: Appointments where user is the provider
- `consultationNotes`: Consultation notes created by user
- `wellnessContent`: Wellness content created by user
- `assignments`: Assignments created by user (as instructor)
- `submittedAssignments`: Assignment submissions by user (as student)

**Indexes:**
- `email`
- `role`

### Appointment
Represents telehealth appointments between patients and healthcare providers.

**Fields:**
- `id` (UUID, Primary Key): Unique identifier
- `patientId` (UUID, Foreign Key): Reference to patient User
- `providerId` (UUID, Foreign Key): Reference to provider User
- `appointmentDate` (DateTime): Scheduled appointment date/time
- `status` (Enum): Appointment status (PENDING, CONFIRMED, COMPLETED, CANCELLED)
- `notes` (String, Optional): Appointment notes
- `createdAt` (DateTime): Creation timestamp
- `updatedAt` (DateTime): Last update timestamp

**Relations:**
- `patient`: Patient user
- `provider`: Healthcare provider user
- `consultationNotes`: Consultation notes for this appointment

**Indexes:**
- `patientId`
- `providerId`
- `appointmentDate`

### ConsultationNote
Medical consultation notes created by healthcare providers after appointments.

**Fields:**
- `id` (UUID, Primary Key): Unique identifier
- `appointmentId` (UUID, Foreign Key): Reference to Appointment
- `providerId` (UUID, Foreign Key): Reference to provider User
- `patientId` (UUID): Reference to patient (denormalized for quick access)
- `notes` (String): Consultation notes
- `diagnosis` (String, Optional): Diagnosis
- `prescription` (String, Optional): Prescription details
- `followUpDate` (DateTime, Optional): Follow-up appointment date
- `createdAt` (DateTime): Creation timestamp
- `updatedAt` (DateTime): Last update timestamp

**Relations:**
- `appointment`: Related appointment
- `provider`: Healthcare provider who created the note

**Indexes:**
- `appointmentId`
- `patientId`

### WellnessContent
Content for the Wellness Hub (nutrition, fitness, stress management).

**Fields:**
- `id` (UUID, Primary Key): Unique identifier
- `title` (String): Content title
- `description` (String): Short description
- `category` (Enum): Content category (NUTRITION, FITNESS, STRESS_MANAGEMENT)
- `content` (String): Full content (rich text/markdown)
- `imageUrl` (String, Optional): Featured image URL
- `videoUrl` (String, Optional): Video URL
- `authorId` (UUID, Foreign Key): Reference to author User
- `isPublished` (Boolean): Publication status
- `createdAt` (DateTime): Creation timestamp
- `updatedAt` (DateTime): Last update timestamp

**Relations:**
- `author`: User who created the content

**Indexes:**
- `category`
- `isPublished`

### LearningResource
Educational resources (PDFs, documents) available to students.

**Fields:**
- `id` (UUID, Primary Key): Unique identifier
- `title` (String): Resource title
- `description` (String, Optional): Resource description
- `fileUrl` (String): File storage path/URL
- `fileName` (String): Original file name
- `fileSize` (Int): File size in bytes
- `mimeType` (String): File MIME type
- `uploadedBy` (String): User ID who uploaded (denormalized)
- `isPublished` (Boolean): Publication status
- `createdAt` (DateTime): Creation timestamp
- `updatedAt` (DateTime): Last update timestamp

**Indexes:**
- `isPublished`

### Assignment
Assignments created by instructors for students.

**Fields:**
- `id` (UUID, Primary Key): Unique identifier
- `title` (String): Assignment title
- `description` (String): Assignment description
- `dueDate` (DateTime): Assignment due date
- `instructorId` (UUID, Foreign Key): Reference to instructor User
- `fileUrl` (String, Optional): Assignment file/instructions URL
- `createdAt` (DateTime): Creation timestamp
- `updatedAt` (DateTime): Last update timestamp

**Relations:**
- `instructor`: User who created the assignment
- `submissions`: Student submissions for this assignment

**Indexes:**
- `instructorId`
- `dueDate`

### AssignmentSubmission
Student submissions for assignments.

**Fields:**
- `id` (UUID, Primary Key): Unique identifier
- `assignmentId` (UUID, Foreign Key): Reference to Assignment
- `studentId` (UUID, Foreign Key): Reference to student User
- `fileUrl` (String): Submission file path/URL
- `fileName` (String): Original file name
- `fileSize` (Int): File size in bytes
- `mimeType` (String): File MIME type
- `status` (Enum): Submission status (PENDING, SUBMITTED, GRADED)
- `grade` (Float, Optional): Assignment grade
- `feedback` (String, Optional): Instructor feedback
- `submittedAt` (DateTime): Submission timestamp
- `gradedAt` (DateTime, Optional): Grading timestamp
- `updatedAt` (DateTime): Last update timestamp

**Relations:**
- `assignment`: Related assignment
- `student`: Student who submitted

**Indexes:**
- `assignmentId`
- `studentId`

**Unique Constraint:**
- `(assignmentId, studentId)`: One submission per student per assignment

## Enums

### UserRole
- `PATIENT`: Regular patient user
- `HEALTHCARE_PROVIDER`: Healthcare provider/doctor
- `WELLNESS_COACH`: Wellness content creator
- `STUDENT`: Healthcare student
- `ADMIN`: System administrator

### AppointmentStatus
- `PENDING`: Appointment requested, awaiting confirmation
- `CONFIRMED`: Appointment confirmed by provider
- `COMPLETED`: Appointment completed
- `CANCELLED`: Appointment cancelled

### WellnessCategory
- `NUTRITION`: Nutrition-related content
- `FITNESS`: Fitness and exercise content
- `STRESS_MANAGEMENT`: Stress management content

### AssignmentStatus
- `PENDING`: Assignment not yet submitted
- `SUBMITTED`: Assignment submitted by student
- `GRADED`: Assignment graded by instructor

## Database Migrations

Migrations are managed through Prisma:
```bash
# Create a new migration
npx prisma migrate dev --name migration_name

# Apply migrations in production
npx prisma migrate deploy

# Reset database (development only)
npx prisma migrate reset
```

## Data Relationships

### One-to-Many
- User → Appointments (as patient)
- User → Appointments (as provider)
- User → ConsultationNotes
- User → WellnessContent
- User → Assignments
- Appointment → ConsultationNotes
- Assignment → AssignmentSubmissions

### Many-to-Many (through junction)
- Assignment ↔ Student (through AssignmentSubmission)

## Query Optimization

### Recommended Indexes
All foreign keys and frequently queried fields are indexed. Additional indexes can be added based on query patterns:

```prisma
// Example: Add index for full-text search
@@index([title, description], type: Gin)
```

### Common Queries

**Get user's appointments:**
```prisma
appointments.findMany({
  where: { patientId: userId },
  include: { provider: true }
})
```

**Get published wellness content:**
```prisma
wellnessContent.findMany({
  where: { isPublished: true, category: 'NUTRITION' }
})
```

**Get student's assignments:**
```prisma
assignments.findMany({
  include: {
    submissions: {
      where: { studentId: userId }
    }
  }
})
```

## Data Integrity

- Foreign key constraints ensure referential integrity
- Unique constraints prevent duplicate submissions
- Cascade deletes clean up related records
- Soft deletes can be implemented using `isActive` flag

## Backup and Recovery

Regular backups should include:
- All tables
- Indexes
- Sequences
- User-defined types

Restore procedure:
1. Drop existing database
2. Create new database
3. Restore from backup
4. Run migrations if schema changed

