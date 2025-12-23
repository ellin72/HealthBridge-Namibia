# HealthBridge Namibia - API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication

All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

## Endpoints

### Authentication

#### Register
- **POST** `/auth/register`
- **Description**: Register a new user
- **Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "password123",
    "firstName": "John",
    "lastName": "Doe",
    "phone": "+264123456789",
    "role": "PATIENT"
  }
  ```
- **Response**: `201 Created`
  ```json
  {
    "message": "User registered successfully",
    "user": { ... },
    "token": "jwt_token_here"
  }
  ```

#### Login
- **POST** `/auth/login`
- **Description**: Authenticate user and get token
- **Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **Response**: `200 OK`
  ```json
  {
    "message": "Login successful",
    "user": { ... },
    "token": "jwt_token_here"
  }
  ```

#### Get Profile
- **GET** `/auth/profile`
- **Description**: Get current user's profile
- **Auth**: Required
- **Response**: `200 OK`

### Users

#### Get Users
- **GET** `/users`
- **Description**: Get all users (Admin only)
- **Auth**: Required (Admin)
- **Query Parameters**:
  - `role`: Filter by role
  - `search`: Search by name or email
- **Response**: `200 OK`

#### Get User by ID
- **GET** `/users/:id`
- **Description**: Get user by ID
- **Auth**: Required
- **Response**: `200 OK`

#### Update User
- **PUT** `/users/:id`
- **Description**: Update user information
- **Auth**: Required (Own profile or Admin)
- **Body**:
  ```json
  {
    "firstName": "John",
    "lastName": "Doe",
    "phone": "+264123456789",
    "password": "newpassword"
  }
  ```
- **Response**: `200 OK`

#### Delete User
- **DELETE** `/users/:id`
- **Description**: Delete user (Admin only)
- **Auth**: Required (Admin)
- **Response**: `200 OK`

### Appointments

#### Create Appointment
- **POST** `/appointments`
- **Description**: Create a new appointment
- **Auth**: Required (Patient)
- **Body**:
  ```json
  {
    "providerId": "provider-uuid",
    "appointmentDate": "2024-01-15T10:00:00Z",
    "notes": "Regular checkup"
  }
  ```
- **Response**: `201 Created`

#### Get Appointments
- **GET** `/appointments`
- **Description**: Get user's appointments
- **Auth**: Required
- **Query Parameters**:
  - `status`: Filter by status (PENDING, CONFIRMED, COMPLETED, CANCELLED)
  - `startDate`: Filter from date
  - `endDate`: Filter to date
- **Response**: `200 OK`

#### Get Appointment by ID
- **GET** `/appointments/:id`
- **Description**: Get appointment details
- **Auth**: Required
- **Response**: `200 OK`

#### Update Appointment
- **PUT** `/appointments/:id`
- **Description**: Update appointment
- **Auth**: Required
- **Body**:
  ```json
  {
    "appointmentDate": "2024-01-15T10:00:00Z",
    "status": "CONFIRMED",
    "notes": "Updated notes"
  }
  ```
- **Response**: `200 OK`

#### Delete Appointment
- **DELETE** `/appointments/:id`
- **Description**: Cancel/delete appointment
- **Auth**: Required (Patient or Admin)
- **Response**: `200 OK`

### Consultations

#### Create Consultation Note
- **POST** `/consultations`
- **Description**: Create consultation note for an appointment
- **Auth**: Required (Healthcare Provider)
- **Body**:
  ```json
  {
    "appointmentId": "appointment-uuid",
    "notes": "Patient examination notes",
    "diagnosis": "Common cold",
    "prescription": "Rest and fluids",
    "followUpDate": "2024-01-22T10:00:00Z"
  }
  ```
- **Response**: `201 Created`

#### Get Consultation Notes
- **GET** `/consultations`
- **Description**: Get consultation notes
- **Auth**: Required
- **Query Parameters**:
  - `appointmentId`: Filter by appointment
  - `patientId`: Filter by patient
- **Response**: `200 OK`

#### Get Consultation Note by ID
- **GET** `/consultations/:id`
- **Description**: Get consultation note details
- **Auth**: Required
- **Response**: `200 OK`

#### Update Consultation Note
- **PUT** `/consultations/:id`
- **Description**: Update consultation note
- **Auth**: Required (Provider or Admin)
- **Body**:
  ```json
  {
    "notes": "Updated notes",
    "diagnosis": "Updated diagnosis",
    "prescription": "Updated prescription"
  }
  ```
- **Response**: `200 OK`

### Wellness Hub

#### Create Wellness Content
- **POST** `/wellness`
- **Description**: Create wellness content
- **Auth**: Required (Wellness Coach or Admin)
- **Body**:
  ```json
  {
    "title": "Healthy Eating Guide",
    "description": "Tips for healthy eating",
    "category": "NUTRITION",
    "content": "Full content here...",
    "imageUrl": "https://example.com/image.jpg",
    "videoUrl": "https://example.com/video.mp4",
    "isPublished": true
  }
  ```
- **Response**: `201 Created`

#### Get Wellness Content
- **GET** `/wellness`
- **Description**: Get wellness content
- **Auth**: Required
- **Query Parameters**:
  - `category`: Filter by category (NUTRITION, FITNESS, STRESS_MANAGEMENT)
  - `publishedOnly`: Only show published content
- **Response**: `200 OK`

#### Get Wellness Content by ID
- **GET** `/wellness/:id`
- **Description**: Get wellness content details
- **Auth**: Required
- **Response**: `200 OK`

#### Update Wellness Content
- **PUT** `/wellness/:id`
- **Description**: Update wellness content
- **Auth**: Required (Author or Admin)
- **Response**: `200 OK`

#### Delete Wellness Content
- **DELETE** `/wellness/:id`
- **Description**: Delete wellness content
- **Auth**: Required (Author or Admin)
- **Response**: `200 OK`

### Learning Zone

#### Upload Learning Resource
- **POST** `/learning/resources`
- **Description**: Upload a learning resource (PDF/document)
- **Auth**: Required
- **Content-Type**: `multipart/form-data`
- **Body**:
  - `file`: File (PDF, DOC, DOCX)
  - `title`: Resource title
  - `description`: Resource description
  - `isPublished`: Boolean
- **Response**: `201 Created`

#### Get Learning Resources
- **GET** `/learning/resources`
- **Description**: Get learning resources
- **Auth**: Required
- **Query Parameters**:
  - `publishedOnly`: Only show published resources
- **Response**: `200 OK`

#### Delete Learning Resource
- **DELETE** `/learning/resources/:id`
- **Description**: Delete learning resource (Admin only)
- **Auth**: Required (Admin)
- **Response**: `200 OK`

#### Create Assignment
- **POST** `/learning/assignments`
- **Description**: Create an assignment
- **Auth**: Required (Healthcare Provider or Admin)
- **Body**:
  ```json
  {
    "title": "Assignment 1",
    "description": "Complete this assignment",
    "dueDate": "2024-02-01T23:59:59Z",
    "fileUrl": "https://example.com/assignment.pdf"
  }
  ```
- **Response**: `201 Created`

#### Get Assignments
- **GET** `/learning/assignments`
- **Description**: Get assignments
- **Auth**: Required
- **Query Parameters**:
  - `instructorId`: Filter by instructor
  - `studentId`: Filter by student
- **Response**: `200 OK`

#### Get Assignment by ID
- **GET** `/learning/assignments/:id`
- **Description**: Get assignment details
- **Auth**: Required
- **Response**: `200 OK`

#### Submit Assignment
- **POST** `/learning/assignments/submit`
- **Description**: Submit assignment (Student only)
- **Auth**: Required (Student)
- **Content-Type**: `multipart/form-data`
- **Body**:
  - `file`: File (PDF, DOC, DOCX)
  - `assignmentId`: Assignment UUID
- **Response**: `201 Created`

#### Grade Assignment
- **PUT** `/learning/assignments/submissions/:submissionId/grade`
- **Description**: Grade an assignment submission
- **Auth**: Required (Instructor or Admin)
- **Body**:
  ```json
  {
    "grade": 85.5,
    "feedback": "Good work!"
  }
  ```
- **Response**: `200 OK`

## Error Responses

All errors follow this format:
```json
{
  "message": "Error message here"
}
```

### Status Codes
- `200 OK`: Success
- `201 Created`: Resource created
- `400 Bad Request`: Invalid input
- `401 Unauthorized`: Authentication required
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server error

## User Roles

- `PATIENT`: Can book appointments, view wellness content, access learning resources
- `HEALTHCARE_PROVIDER`: Can manage appointments, create consultation notes, create assignments
- `WELLNESS_COACH`: Can create and manage wellness content
- `STUDENT`: Can access learning resources, submit assignments
- `ADMIN`: Full access to all features

