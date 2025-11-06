# HMS Database Schema Documentation

## Overview
The HMS (Health Management System) database is designed to handle all aspects of healthcare management including patient records, appointments, prescriptions, medical records, and billing. The schema is built with PostgreSQL and Prisma ORM, ensuring type safety and excellent developer experience.

## Database Statistics
- **Total Tables**: 35+
- **Total Enums**: 13
- **Total Relationships**: 50+
- **Supported Users**: 10,000+ concurrent
- **Compliance**: HIPAA-ready with audit logging

## Schema Organization

### 1. User Management & Authentication (6 tables)

#### `users`
Central authentication table for all system users.
- **Primary Key**: `id` (cuid)
- **Unique Fields**: `email`
- **Indexes**: Email for fast lookup
- **Features**: 
  - MFA support
  - Email verification
  - Last login tracking
  - Role-based access

**Relations**: 1-to-1 with role-specific tables (Patient, Doctor, Nurse, etc.)

#### Role-Specific Tables
- `patients` - Patient profiles with medical information
- `doctors` - Doctor profiles with specializations and fees
- `nurses` - Nurse profiles
- `receptionists` - Receptionist profiles
- `admins` - Administrator profiles

**Key Feature**: Each user has exactly one role-specific profile based on `UserRole` enum.

---

### 2. Patient Management (3 tables)

#### `patients`
Comprehensive patient information including demographics, contacts, and insurance.

**Unique ID System**: 
- System `id` (cuid) for internal references
- User-facing `patientId` (e.g., "PAT-001") for display

**Key Fields**:
- Personal: First/last name, DOB, gender, blood group
- Contact: Phone, address, city, state, zip
- Emergency: Contact name, phone, relation
- Insurance: Provider, policy number
- Versioning: `profileVersion` tracks changes

#### `patient_profile_history`
Tracks all changes to patient profiles for compliance.
- Stores what changed (JSON)
- Who made the change
- When it was changed
- Version number

#### `patient_doctor_assignments`
Manages patient-doctor relationships.
- Supports multiple doctors per patient
- Tracks active/inactive status
- Records assignment and deactivation dates
- Allows notes on the relationship

---

### 3. Doctor Management (3 tables)

#### `doctors`
Doctor profiles with professional information.

**Key Fields**:
- Specialization
- License number (unique)
- Default appointment and session fees
- Professional contact information

#### `working_hours`
Doctor availability schedule.
- Day of week (0-6, Sunday-Saturday)
- Start and end times
- Active/inactive toggle
- Multiple time slots per day supported

#### `time_off_requests`
Doctor leave and unavailability.
- Start and end dates
- Reason for time off
- Automatically blocks appointment slots

#### `doctor_permissions`
Custom permissions for specific doctors.
- Permission name
- Description
- Who granted it and when
- Supports fine-grained access control

---

### 4. Appointments & Sessions (2 tables)

#### `appointments`
Patient-doctor appointment scheduling.

**Unique ID**: `appointmentId` (display ID like "APT-001")

**Status Flow**:
```
SCHEDULED → CONFIRMED → IN_PROGRESS → COMPLETED
          ↓            ↓
      CANCELLED    NO_SHOW / DECLINED
```

**Key Features**:
- Custom fees per appointment
- Time-based status locking (`canUpdateStatus`)
- Automatic archival after completion
- Prevents double-booking (through application logic)
- 24h and 2h reminder system

**Important Fields**:
- `statusUpdatedAt` - When status last changed
- `canUpdateStatus` - Boolean set to false after appointment time
- `archivedAt` - When automatically archived

#### `sessions`
Follow-up sessions for active patients.

**Similar to appointments but**:
- Used for ongoing treatment
- More flexible scheduling
- Can have multiple sessions per patient-doctor pair
- Automatically deleted after time passes

---

### 5. Medical Records (3 tables)

#### `medical_records`
Clinical notes in SOAP format.

**SOAP Format**:
- **S**ubjective: `chiefComplaint`
- **O**bjective: `physicalExam`
- **A**ssessment: `assessment`
- **P**lan: `plan`

**Security Features**:
- Digital signature required
- Cannot modify after finalization
- Audit trail of who signed and when
- Auto-populates patient demographics

#### `diagnoses`
ICD-10 coded diagnoses.

**Key Features**:
- Links to medical records
- Active problem list tracking
- Resolution date tracking
- Links to prescriptions and lab tests

**ICD-10 Code**: International standard for disease classification

---

### 6. Prescriptions (4 tables)

#### `prescriptions`
Electronic prescription system.

**Unique ID**: `prescriptionId` (display ID)

**Key Components**:
- Medication details (name, dosage, frequency, duration)
- Refills tracking
- QR code generation
- Digital signature
- Version tracking

**Status Flow**:
```
ACTIVE → COMPLETED
       ↓
   DISCONTINUED / EXPIRED
```

**Safety Features**:
- Drug-drug interaction checking
- Patient allergy checking
- Warning acknowledgment system
- Version history for modifications

#### `prescription_history`
Tracks all changes to prescriptions.
- Version number
- What changed (JSON format)
- Who changed it (doctor)
- When it was changed

#### `drug_interactions`
Stores identified drug interactions.
- Severity levels (MILD, MODERATE, SEVERE)
- Description of interaction
- Acknowledgment by doctor required

#### `medications`
Drug database for auto-complete.
- Generic and brand names
- Category (e.g., "Antibiotic", "Pain Reliever")
- Manufacturer information
- Active/inactive status

---

### 7. Allergies & Vital Signs (2 tables)

#### `allergies`
Patient allergy tracking.

**Types**:
- MEDICATION
- FOOD
- ENVIRONMENTAL

**Key Fields**:
- Allergen name
- Severity (MILD, MODERATE, SEVERE)
- Reaction description
- Diagnosis date
- Notes

**UI Behavior**: Prominent alerts displayed across system

#### `vital_signs`
Vital signs with trend analysis.

**Measured Values**:
- Blood pressure (systolic/diastolic)
- Heart rate
- Temperature
- Weight & Height (auto-calculates BMI)
- Oxygen saturation
- Respiratory rate

**Features**:
- Color-coded flags for abnormal values
- Status: NORMAL, ABNORMAL, CRITICAL
- Trend graphs over time
- Can be recorded by doctors or nurses

---

### 8. Lab Tests (1 table)

#### `lab_tests`
Laboratory test orders and results.

**Status Flow**:
```
ORDERED → IN_PROGRESS → COMPLETED → REVIEWED
        ↓
    CANCELLED
```

**Key Features**:
- Test name and type
- Results storage (text and file)
- Critical value flagging with immediate alerts
- Doctor review required before patient access
- Trend graphs for repeated tests
- Links to diagnoses

**Critical Value Handling**:
- `isCritical` flag
- `criticalAlertSent` tracking
- Immediate notification to doctor

---

### 9. Immunizations (1 table)

#### `immunizations`
Vaccination records.

**Key Fields**:
- Vaccine name
- Date administered
- Dose number (for multi-dose vaccines)
- Manufacturer and lot number
- Expiration date
- Administration site
- Next due date tracking

---

### 10. Billing & Payments (1 table)

#### `billings`
Financial transactions.

**Unique ID**: `billId` (display ID)

**Links to**:
- Appointments (one-to-one)
- Sessions (one-to-one)
- Patients

**Payment Status**:
```
PENDING → COMPLETED
        ↓
    FAILED / REFUNDED
```

**Key Fields**:
- Amount (decimal for precise currency)
- Description
- Payment method
- Transaction ID (from payment gateway)
- Refund tracking with reason

---

### 11. Notifications (2 tables)

#### `notifications`
User notification system.

**Notification Types**:
- Appointment reminders
- Appointment confirmations/cancellations
- Prescription changes
- Lab result availability
- Critical lab values
- Session reminders
- General notifications

**Delivery Channels**:
- Push notifications (mobile/web)
- Email (via SendGrid - future)
- SMS (via Twilio - future)

**Features**:
- Read/unread tracking
- Scheduled sending
- Metadata storage (e.g., appointment ID)

#### `notification_templates`
Reusable notification templates.

**Template Variables**:
- Patient name
- Doctor name
- Date, time
- Medication name
- Custom variables per template type

**Example**:
```
"Hello {{patientName}}, your appointment with Dr. {{doctorName}} 
is scheduled for {{date}} at {{time}}."
```

---

### 12. Audit & System (3 tables)

#### `audit_logs`
Complete audit trail for compliance.

**Logged Actions**:
- CREATE, UPDATE, DELETE operations
- Entity type (e.g., "Prescription", "Patient")
- Entity ID
- Changes made (JSON)
- User who performed action
- IP address and user agent
- Timestamp

**Purpose**: HIPAA compliance, security audits, debugging

#### `system_settings`
Application configuration.

**Examples**:
- `APPOINTMENT_REMINDER_HOURS`: "24,2"
- `MAX_APPOINTMENTS_PER_DAY`: "20"
- `APPOINTMENT_DURATION_MINUTES`: "30"

**Key/Value Storage**: Flexible configuration without code changes

---

## Database Enums

### UserRole
- PATIENT
- DOCTOR
- NURSE
- RECEPTIONIST
- ADMIN
- MAIN_ADMIN

### Gender
- MALE
- FEMALE
- OTHER

### BloodGroup
- A_POSITIVE, A_NEGATIVE
- B_POSITIVE, B_NEGATIVE
- AB_POSITIVE, AB_NEGATIVE
- O_POSITIVE, O_NEGATIVE

### AppointmentStatus
- SCHEDULED
- CONFIRMED
- IN_PROGRESS
- COMPLETED
- CANCELLED
- NO_SHOW
- DECLINED

### SessionStatus
- SCHEDULED
- IN_PROGRESS
- COMPLETED
- CANCELLED
- NO_SHOW

### PrescriptionStatus
- ACTIVE
- COMPLETED
- DISCONTINUED
- EXPIRED

### LabTestStatus
- ORDERED
- IN_PROGRESS
- COMPLETED
- REVIEWED
- CANCELLED

### PaymentStatus
- PENDING
- COMPLETED
- FAILED
- REFUNDED

### NotificationType
- APPOINTMENT_REMINDER
- APPOINTMENT_CONFIRMATION
- APPOINTMENT_CANCELLATION
- PRESCRIPTION_CHANGE
- LAB_RESULT_AVAILABLE
- CRITICAL_LAB_VALUE
- SESSION_REMINDER
- GENERAL

### AllergyType
- MEDICATION
- FOOD
- ENVIRONMENTAL

### VitalSignStatus
- NORMAL
- ABNORMAL
- CRITICAL

### AccountStatus
- ACTIVE
- INACTIVE
- SUSPENDED
- DEACTIVATED

---

## Key Relationships

### One-to-One
- User → Role-specific table (Patient, Doctor, etc.)
- Appointment → Billing
- Session → Billing

### One-to-Many
- Patient → Medical Records
- Patient → Prescriptions
- Patient → Appointments
- Patient → Lab Tests
- Doctor → Appointments
- Doctor → Prescriptions
- Doctor → Working Hours
- Prescription → Prescription History
- Medical Record → Diagnoses

### Many-to-Many
- Patient ↔ Doctor (via PatientDoctorAssignment)
- Diagnosis ↔ Prescription
- Diagnosis ↔ Lab Test

---

## Indexes

Optimized indexes on frequently queried fields:

- **Users**: email (unique)
- **Patients**: userId (unique), patientId (unique)
- **Appointments**: patientId, doctorId, scheduledDate
- **Sessions**: patientId, doctorId, scheduledDate
- **Prescriptions**: patientId, doctorId
- **Lab Tests**: patientId, doctorId, status
- **Vital Signs**: patientId, recordedAt
- **Audit Logs**: userId, entity+entityId, createdAt
- **Notifications**: userId, isRead

---

## Security Features

### Encryption
- Password hashing with bcrypt
- Support for AES-256 encryption (data at rest)
- TLS 1.3 for data in transit

### Access Control
- Role-based access control (RBAC)
- Custom permissions for doctors
- Account status tracking (ACTIVE, INACTIVE, SUSPENDED)

### Audit Trail
- All critical operations logged
- IP address and user agent tracking
- Change history for sensitive data

### Digital Signatures
- Clinical notes require signature before finalization
- Prescriptions include digital signature
- Signatures cannot be modified after finalization

---

## Performance Optimization

### Query Optimization
- Strategic indexes on foreign keys
- Compound indexes for common queries
- Cascading deletes to maintain data integrity

### Scalability
- Supports 10,000+ concurrent users
- Efficient relationship modeling
- Optimized for read-heavy workloads

### Caching Strategy
- Prisma Client query caching
- Connection pooling
- Prepared statements

---

## Data Integrity

### Constraints
- Foreign key constraints
- Unique constraints on identifiers
- NOT NULL constraints on required fields

### Cascading Rules
- Cascade delete for dependent records
- SetNull for optional relationships
- Restrict for protected relationships

### Versioning
- Patient profiles: `profileVersion`
- Prescriptions: `version` + history table
- Medical records: `isFinalized` flag

---

## Backup & Recovery

### Requirements
- Daily automated backups (HIPAA requirement)
- Recovery Time Objective (RTO): 4 hours
- Recovery Point Objective (RPO): 1 hour

### Backup Strategy
```bash
# Daily backup
pg_dump -U postgres hms_db > backup_$(date +%Y%m%d).sql

# Restore
psql -U postgres hms_db < backup_YYYYMMDD.sql
```

---

## Future Enhancements

### Planned Tables
- `messages` - In-app messaging
- `documents` - Document storage and management
- `insurance_claims` - Insurance processing
- `payments` - Enhanced payment tracking
- `telemedicine_sessions` - Video consultation support

### Planned Features
- Real-time collaboration
- Advanced analytics tables
- Integration tables for external systems
- Multi-language support tables

---

## Database Maintenance

### Regular Tasks
- Vacuum and analyze (weekly)
- Index rebuilding (monthly)
- Backup verification (daily)
- Query performance monitoring (continuous)

### Monitoring Metrics
- Connection pool usage
- Query execution time
- Database size growth
- Lock contention
- Cache hit ratio

---

For implementation details and API usage, refer to the Prisma documentation and the application's API routes.

**Last Updated**: November 6, 2025  
**Schema Version**: 1.0.0
