# HMS Database Setup Guide

## Prerequisites

- PostgreSQL installed and running
- Node.js and npm installed

## Step-by-Step Setup

### 1. Install PostgreSQL

If you haven't installed PostgreSQL, download it from: https://www.postgresql.org/download/

### 2. Create Database

Open PostgreSQL terminal (psql) or use pgAdmin and create a new database:

```sql
CREATE DATABASE hms_db;
```

### 3. Configure Environment Variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Update the `DATABASE_URL` in `.env` file:

```env
DATABASE_URL="postgresql://USERNAME:PASSWORD@localhost:5432/hms_db?schema=public"
```

Replace:

- `USERNAME` with your PostgreSQL username (default is usually `postgres`)
- `PASSWORD` with your PostgreSQL password

### 4. Install Dependencies

```bash
npm install
```

### 5. Generate Prisma Client

```bash
npm run db:generate
```

### 6. Push Schema to Database

This will create all tables without migrations:

```bash
npm run db:push
```

**OR** use migrations for production:

```bash
npm run db:migrate
```

### 7. Seed the Database (Optional)

Populate the database with demo data:

```bash
npm run db:seed
```

This will create:

- Main Admin user
- Admin user
- 2 Doctors with working hours
- 1 Nurse
- 1 Receptionist
- 2 Patients with allergies
- Sample medications
- System settings
- Notification templates

## Demo Credentials

After seeding, you can login with:

- **Main Admin**: `mainadmin@hms.com` / `password123`
- **Admin**: `admin@hms.com` / `password123`
- **Doctor 1**: `dr.smith@hms.com` / `password123`
- **Doctor 2**: `dr.johnson@hms.com` / `password123`
- **Nurse**: `nurse.williams@hms.com` / `password123`
- **Receptionist**: `receptionist@hms.com` / `password123`
- **Patient 1**: `patient1@example.com` / `password123`
- **Patient 2**: `patient2@example.com` / `password123`

## Database Commands

### View Data in Prisma Studio

```bash
npm run db:studio
```

This opens a visual database editor at `http://localhost:5555`

### Create a New Migration

```bash
npm run db:migrate
```

### Reset Database

⚠️ **WARNING**: This will delete all data!

```bash
npm run db:migrate:reset
```

### Deploy Migrations (Production)

```bash
npm run db:migrate:deploy
```

## Database Schema Overview

### Core Tables

#### Users & Authentication

- `users` - Core user authentication table
- `patients` - Patient-specific information
- `doctors` - Doctor profiles and settings
- `nurses` - Nurse profiles
- `receptionists` - Receptionist profiles
- `admins` - Administrator profiles

#### Medical Records

- `medical_records` - SOAP format clinical notes
- `diagnoses` - ICD-10 coded diagnoses
- `prescriptions` - Medication prescriptions with digital signatures
- `prescription_history` - Version tracking for prescriptions
- `drug_interactions` - Drug interaction warnings
- `medications` - Drug database
- `allergies` - Patient allergy records
- `vital_signs` - Vital signs with trend tracking
- `lab_tests` - Lab orders and results
- `immunizations` - Vaccination records

#### Appointments & Scheduling

- `appointments` - Appointment booking and management
- `sessions` - Follow-up sessions
- `working_hours` - Doctor availability
- `time_off_requests` - Doctor leave management

#### Patient Management

- `patient_profile_history` - Profile change tracking
- `patient_doctor_assignments` - Patient-doctor relationships

#### Billing & Payments

- `billings` - Payment records

#### Notifications & Audit

- `notifications` - User notifications
- `notification_templates` - Notification message templates
- `audit_logs` - System audit trail

#### System

- `system_settings` - Application configuration
- `doctor_permissions` - Custom doctor permissions

### Key Features

#### Security

- AES-256 encryption ready (data at rest)
- Multi-factor authentication support
- Role-based access control (RBAC)
- Comprehensive audit logging
- Digital signatures for prescriptions and clinical notes

#### Data Integrity

- Unique identifiers for all entities
- Version history for critical records
- Cascading deletes where appropriate
- Referential integrity with foreign keys

#### Performance

- Optimized indexes on frequently queried fields
- Efficient relationship modeling
- Support for 10,000+ concurrent users

## Troubleshooting

### Connection Issues

If you can't connect to PostgreSQL:

1. Check if PostgreSQL is running:

   ```bash
   # Windows
   services.msc
   # Look for PostgreSQL service

   # Linux/Mac
   sudo systemctl status postgresql
   ```

2. Verify connection string in `.env`
3. Check PostgreSQL is listening on port 5432
4. Ensure firewall allows connections

### Migration Errors

If migrations fail:

1. Check database user has proper permissions
2. Ensure database exists
3. Try `npm run db:push` instead of migrations for development

### Seed Errors

If seeding fails:

1. Ensure Prisma Client is generated: `npm run db:generate`
2. Check database is empty or reset it
3. Verify all dependencies are installed

## Production Deployment

### Using Railway, Supabase, or Neon

1. Create a PostgreSQL database on your chosen platform
2. Copy the connection string
3. Update `DATABASE_URL` in production environment variables
4. Run migrations:
   ```bash
   npm run db:migrate:deploy
   ```

### Using Vercel Postgres

1. Add Vercel Postgres to your project
2. Vercel automatically sets `DATABASE_URL`
3. Add build command: `prisma generate && prisma migrate deploy && next build`

## Database Maintenance

### Backups

Configure automated daily backups (required for HIPAA compliance):

```bash
# Manual backup
pg_dump -U postgres hms_db > backup_$(date +%Y%m%d).sql

# Restore from backup
psql -U postgres hms_db < backup_20231106.sql
```

### Monitoring

- Monitor query performance with Prisma logs
- Track database size and growth
- Monitor connection pool usage

---

For more information, refer to:

- [Prisma Documentation](https://www.prisma.io/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs)
