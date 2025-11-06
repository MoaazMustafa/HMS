# HMS - Health Management System
## User Roles, Permissions & Feature Specifications

---

## 1. PATIENT ROLE

### 1.1 Account Management
- Register for new account from signup page
- Email format validation
- System generates unique Patient ID automatically
- View and update personal profile information
- Manage contact information (phone, email, address)
- Update emergency contact details
- System maintains version history of profile changes

### 1.2 Appointment Management
- View available doctors with their schedules
- Book appointments by selecting doctor, date, and time
- View available time slots based on doctor schedule
- View upcoming appointments
- Reschedule appointments up to 24 hours before scheduled time
- Cancel appointments with refund processing (if applicable)
- Receive reminders 24 hours and 2 hours before appointment via push notification
- Appointments are automatically archived after their time has passed

### 1.3 Medical Records Access
- View complete medical history
- View medical records and clinical notes (read-only)
- Access SOAP format notes (Subjective, Objective, Assessment, Plan)
- View diagnoses with ICD-10 codes
- View active problem list
- View allergy information (medications, food, environmental)
- View immunization records

### 1.4 Prescription Management
- View all prescriptions (active and historical)
- Download prescriptions as PDF
- View prescription details: medication name, dosage, frequency, duration
- View refills remaining
- View prescription QR codes for verification
- Receive notifications for prescription changes via push notification 

### 1.5 Lab Reports & Test Results
- View lab reports after doctor review
- View test results with trend graphs
- Access historical lab data
- View flagged critical values

### 1.6 Sessions & Follow-ups
- View upcoming sessions
- Sessions are automatically deleted after their time has passed
- Track session history with assigned doctor

### 1.7 Billing & Payments
- View billing details
- View appointment fees
- View session fees
- Access payment history

---

## 2. DOCTOR ROLE

### 2.1 Profile & Schedule Management
- Edit personal details and profile information
- Add or remove working hours
- Configure availability (working days, hours, breaks)
- Block time for leave or emergencies
- Set default appointment fees
- Set default session fees

### 2.2 Patient Management
- View active patients list
- Search patients by Patient ID, name, phone, or email (results within 2 seconds)
- Support for partial name matching in search
- View patient demographics and contact information
- Access patient emergency contact details
- View patient insurance information
- Activate or deactivate patients for themselves
- Assign patients to new doctors
- Discharge patients from active care
- Update patient status

### 2.3 Medical Records Management
- Add and change patient medical details
- Document clinical notes in SOAP format
- System auto-populates patient demographics and previous diagnoses
- Add diagnoses with ICD-10 codes
- Maintain active problem list
- Link diagnoses to prescriptions and lab orders
- Record allergies (medications, food, environmental)
- Track immunization records
- Require digital signature before finalizing notes
- Finalized notes cannot be modified (system prevents modification)

### 2.4 Vital Signs Recording
- Record vital signs (BP, heart rate, temperature, weight, height)
- System flags abnormal values with color coding
- View vital signs trends over time with graphs

### 2.5 Prescription Management
- Create prescriptions with medication name, dosage, frequency, and duration
- Access searchable drug database with auto-complete
- System checks drug-drug interactions
- System checks patient allergies
- View and acknowledge interaction warnings
- Generate prescription with digital signature and QR code
- Modify or discontinue existing prescriptions
- System maintains prescription version history
- Patient receives automatic notification of prescription changes via push notification

### 2.6 Lab Management
- Order lab tests for patients
- Review lab results
- System flags critical values and sends immediate alerts
- View lab trends with graphs
- Approve lab results for patient viewing

### 2.7 Appointment Management
- View booked appointments
- Add new appointments
- Decline appointment requests
- Change appointment status within scheduled time
- Appointments marked as "done" or "not taken" after time passes
- Cannot update appointment status after scheduled time expires
- Set custom appointment fees for specific patients at specific times

### 2.8 Session Management
- Add sessions for active patients
- Change session status within scheduled time
- Sessions marked as "done" or "not taken" after time passes
- Cannot update session status after scheduled time expires
- Set custom session fees for specific patients at specific times

---

## 3. NURSE ROLE

### 3.1 Patient Care
- Record vital signs (BP, heart rate, temperature, weight, height)
- View patient records (read-only access)
- Update patient status
- Access patient demographics and medical history (view only)

### 3.2 Clinical Support
- View current medications and prescriptions
- View allergy information
- View upcoming appointments and sessions
- Assist with patient check-in procedures

---

## 4. RECEPTIONIST ROLE

### 4.1 Appointment Management
- Register walk-in patients
- Schedule appointments on behalf of patients
- View doctor schedules and availability
- Manage appointment calendar
- Handle appointment cancellations and rescheduling

### 4.2 Patient Registration
- Assist with new patient registration
- Verify patient information
- Collect insurance and contact details

---

## 5. ADMIN ROLE

### 5.1 User Management
- Full access to doctor and patient accounts
- View all patients and doctors
- Add new doctors to the system
- Modify doctor details and profiles
- Modify patient details and profiles
- Assign user roles
- Give custom permissions to doctors
- Manage user account status (active/inactive)

### 5.2 System Configuration
- Configure system settings
- Manage appointment types and durations
- Set system-wide fee structures
- Configure notification templates (push)

### 5.3 Reports & Analytics
- View system reports
- Access user activity logs
- View appointment statistics
- View billing reports
- Monitor system performance metrics

### 5.4 Data Management
- Access audit logs for all critical activities
- Manage data backups
- Handle data exports
- Monitor system security

---

## 6. MAIN ADMIN (SUPER ADMIN) ROLE

### 6.1 Complete System Access
- Full access to all upper role permissions
- Access to all panels and modules
- Override capabilities for all system functions

### 6.2 Admin Management
- Create new admin accounts
- Create new main admin accounts
- Modify admin permissions
- Deactivate admin accounts
- Audit admin activities

### 6.3 System Administration
- Manage role-based access control (RBAC)
- Monitor system security compliance
- Manage system integrations (Laboratory)

### 6.4 Advanced Configuration
- Configure system-wide policies
- Manage data retention policies
- Set up automated backup schedules
- Configure disaster recovery settings
- Manage API access and keys

---

## 7. SYSTEM REQUIREMENTS & SPECIFICATIONS

### 7.1 Architecture Principles
- Every feature has its own dedicated tab/section
- System is consistent and scalable
- Modular architecture for easy maintenance
- Component-based design following shadcn/ui patterns

### 7.2 Security & Privacy
- Appointments and prescriptions restricted to authorized users only
- Multi-factor authentication for doctors and admins
- AES-256 encryption for data at rest
- TLS 1.3 for data in transit
- Role-based access control (RBAC)
- Audit logging for all critical activities
- HIPAA compliance maintained

### 7.3 User Interface
- UI design similar to GitHub's clean interface
- Skeleton loaders for boards and data loading
- Consistent UI boards for each user role
- Components built using shadcn/ui
- Mobile responsive design
- WCAG 2.1 Level AA accessibility compliance
- Dark/light theme support

### 7.4 Performance Requirements
- Page load time: ≤ 3 seconds
- Support 10,000+ concurrent users
- Search results: ≤ 1 second (within 2 seconds for patient search)
- System uptime: 99.5%

### 7.5 Data Management
- Version history for profile changes
- Version history for prescription modifications
- Digital signatures for clinical notes and prescriptions
- Prevent double-booking of appointments
- Automatic archival of past appointments and sessions
- Daily automated backups
- Recovery Time Objective: 4 hours
- Recovery Point Objective: 1 hour

### 7.6 Notification System
- Push notifications for mobile
- Multi-channel appointment reminders (24h and 2h before)
- Prescription change notifications
- Critical lab value alerts

### 7.7 Time-based Automation
- Appointments automatically marked "done" or "not taken" after time passes
- Sessions automatically marked "done" or "not taken" after time passes
- Doctors cannot update status after scheduled time expires
- Automatic deletion/archival of past sessions and appointments
- Automatic reminder triggers (24h and 2h before appointments)

---

## 8. SUCCESS CRITERIA
- System uptime ≥ 99.5%
- 80% patient registration within 6 months
- 90% doctor adoption rate
- User satisfaction ≥ 4.0/5.0
- Zero critical security breaches
- Search results consistently under 2 seconds
- Page loads consistently under 3 seconds

---

**Document Version:** 2.0  
**Last Updated:** November 6, 2025  
**Status:** Active Development 