# HMS Authentication System

## Overview
HMS uses **NextAuth.js v4** with **Prisma Adapter** for secure, role-based authentication. The system supports 6 user roles with unique dashboards and permissions.

## Features

### ✅ Implemented
- ✅ Email/Password authentication with bcrypt hashing
- ✅ JWT-based session management (30-day expiration)
- ✅ Role-based access control (RBAC)
- ✅ Protected routes with middleware
- ✅ Account status tracking (ACTIVE, INACTIVE, SUSPENDED, DEACTIVATED)
- ✅ Last login tracking
- ✅ Patient registration system
- ✅ Responsive login/register pages
- ✅ Demo user credentials for testing

### 🚧 Planned
- Email verification
- Password reset flow
- Multi-factor authentication (MFA)
- OAuth providers (Google, GitHub)
- Session management dashboard
- Account recovery

---

## User Roles

| Role | Description | Dashboard Access |
|------|-------------|------------------|
| **MAIN_ADMIN** | Super administrator with full system access | `/dashboard` |
| **ADMIN** | System administrator | `/dashboard` |
| **DOCTOR** | Medical practitioners | `/dashboard` |
| **NURSE** | Nursing staff | `/dashboard` |
| **RECEPTIONIST** | Front desk staff | `/dashboard` |
| **PATIENT** | Patients | `/dashboard` |

---

## Demo Credentials

Use these credentials to test the system:

```
Main Admin:
  Email: mainadmin@hms.com
  Password: password123

Admin:
  Email: admin@hms.com
  Password: password123

Doctor (Cardiology):
  Email: dr.smith@hms.com
  Password: password123

Doctor (General Practice):
  Email: dr.johnson@hms.com
  Password: password123

Nurse:
  Email: nurse.williams@hms.com
  Password: password123

Receptionist:
  Email: receptionist@hms.com
  Password: password123

Patient 1:
  Email: patient1@example.com
  Password: password123

Patient 2:
  Email: patient2@example.com
  Password: password123
```

---

## Routes

### Public Routes
- `/` - Landing page
- `/login` - Sign in page
- `/register` - Patient registration page

### Protected Routes (Requires Authentication)
- `/dashboard` - Main dashboard (role-based)
- `/dashboard/*` - All dashboard sub-routes

### API Routes
- `/api/auth/[...nextauth]` - NextAuth.js handler
- `/api/auth/register` - Patient registration API

---

## Authentication Flow

### 1. Registration (Patients Only)
```
User fills form → POST /api/auth/register → Create User + Patient profile → Redirect to /login
```

**Required Fields:**
- First Name
- Last Name
- Email (unique)
- Phone
- Date of Birth
- Gender
- Password (min 8 characters)

**Auto-Generated:**
- Patient ID (PAT-001, PAT-002, etc.)
- Email verification (auto-verified for now)
- Account status (ACTIVE by default)

### 2. Login (All Roles)
```
User submits credentials → POST /api/auth/[...nextauth] → Verify password → Create JWT → Redirect to /dashboard
```

**Security Features:**
- bcrypt password hashing (10 rounds)
- Account status validation
- Last login tracking
- Role-based session data

### 3. Session Management
```
Client requests protected route → Middleware checks JWT → Valid: Allow | Invalid: Redirect to /login
```

**Session Data:**
```typescript
{
  user: {
    id: string;
    email: string;
    name: string;
    role: UserRole;
  }
}
```

---

## Code Structure

### Core Files

#### `/src/lib/auth.ts`
NextAuth configuration with Prisma adapter and credentials provider.

**Key Features:**
- Prisma adapter for database sessions
- Custom authorize function with password verification
- JWT callbacks for role injection
- Session callbacks for user data
- Custom sign-in page

#### `/src/types/next-auth.d.ts`
TypeScript definitions for NextAuth session and JWT.

#### `/src/middleware.ts`
Route protection middleware.

**Protected Patterns:**
- `/dashboard/:path*`
- `/admin/:path*`
- `/doctor/:path*`
- `/patient/:path*`

#### `/src/app/api/auth/[...nextauth]/route.ts`
NextAuth.js API route handler.

#### `/src/app/api/auth/register/route.ts`
Patient registration API endpoint.

**Validation:**
- Required fields check
- Email uniqueness
- Password strength (8+ characters)
- Auto-generate patient ID

#### `/src/app/login/page.tsx`
Login page with form validation and demo credentials display.

**Features:**
- Email/password form
- Show/hide password toggle
- Remember me checkbox
- Error handling
- Loading states
- Demo credentials box

#### `/src/app/register/page.tsx`
Patient registration page.

**Features:**
- Multi-field form (first name, last name, email, phone, DOB, gender, password)
- Password confirmation
- Password strength validation
- Error handling
- Responsive design

#### `/src/app/dashboard/page.tsx`
Protected dashboard page (currently showing Coming Soon component).

#### `/src/app/dashboard/layout.tsx`
Dashboard layout with header, user info, and role badge.

#### `/src/components/auth-provider.tsx`
Client-side SessionProvider wrapper.

#### `/src/components/ui/floating-nav.tsx`
Navigation with dynamic login/logout buttons based on session.

---

## Environment Variables

Required in `.env`:

```env
# Database
DATABASE_URL="postgresql://..."

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# Optional (Future Use)
# TWILIO_ACCOUNT_SID=""
# TWILIO_AUTH_TOKEN=""
# SENDGRID_API_KEY=""
```

**Generate NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

---

## Security Features

### Password Security
- **Hashing**: bcrypt with 10 salt rounds
- **Minimum Length**: 8 characters
- **Storage**: Only hashed passwords in database

### Session Security
- **Strategy**: JWT (stateless)
- **Expiration**: 30 days
- **HTTPS Only**: In production
- **CSRF Protection**: Built-in NextAuth

### Account Protection
- **Status Validation**: Only ACTIVE accounts can login
- **Failed Attempt Tracking**: (Planned)
- **Account Lockout**: (Planned)

### Database Security
- **Unique Constraints**: Email uniqueness enforced
- **Foreign Keys**: Cascade delete for user profiles
- **Audit Logging**: Ready to implement

---

## Usage Examples

### Check Authentication (Client Component)
```typescript
'use client';

import { useSession } from 'next-auth/react';

export default function MyComponent() {
  const { data: session, status } = useSession();

  if (status === 'loading') return <div>Loading...</div>;
  if (status === 'unauthenticated') return <div>Please sign in</div>;

  return <div>Welcome, {session.user.name}!</div>;
}
```

### Check Authentication (Server Component)
```typescript
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function MyPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  return <div>Welcome, {session.user.name}!</div>;
}
```

### Role-Based Access
```typescript
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { UserRole } from '@prisma/client';

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  if (!session || ![UserRole.ADMIN, UserRole.MAIN_ADMIN].includes(session.user.role)) {
    return <div>Unauthorized</div>;
  }

  return <div>Admin Panel</div>;
}
```

### Sign Out
```typescript
'use client';

import { signOut } from 'next-auth/react';

export function LogoutButton() {
  return (
    <button onClick={() => signOut({ callbackUrl: '/' })}>
      Sign Out
    </button>
  );
}
```

---

## Testing

### Manual Testing
1. **Registration:**
   - Go to `/register`
   - Fill form with valid data
   - Submit → Should redirect to `/login?registered=true`

2. **Login:**
   - Go to `/login`
   - Use demo credentials
   - Submit → Should redirect to `/dashboard`

3. **Protected Routes:**
   - While logged out, try accessing `/dashboard`
   - Should redirect to `/login`

4. **Role Display:**
   - After login, check dashboard header
   - Should show user name and role badge

### Database Testing
```bash
# View all users
npm run db:studio
# Navigate to User table
```

---

## Troubleshooting

### Issue: "Invalid credentials"
- Check email spelling
- Verify password
- Ensure account status is ACTIVE

### Issue: Redirect loop on /dashboard
- Clear cookies
- Check NEXTAUTH_URL matches your domain
- Verify NEXTAUTH_SECRET is set

### Issue: "Email already registered"
- Use a different email
- Check database for existing users

### Issue: Session not persisting
- Check NEXTAUTH_SECRET is consistent
- Verify cookies are enabled
- Check browser console for errors

---

## Next Steps

### Immediate Priorities
1. Create role-specific dashboards
2. Implement email verification
3. Add password reset flow
4. Create user profile pages

### Future Enhancements
1. Multi-factor authentication
2. OAuth providers (Google, Microsoft)
3. Session management dashboard
4. Password strength requirements
5. Account recovery system
6. Login activity tracking
7. Device management

---

## API Documentation

### POST /api/auth/register

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "dateOfBirth": "1990-01-01",
  "gender": "MALE",
  "password": "password123",
  "confirmPassword": "password123"
}
```

**Success Response (201):**
```json
{
  "message": "Registration successful",
  "user": {
    "id": "clxy123456",
    "email": "john@example.com",
    "role": "PATIENT"
  }
}
```

**Error Responses:**
- `400`: Missing required fields
- `400`: Email already registered
- `500`: Registration failed

### POST /api/auth/callback/credentials

**Request Body:**
```json
{
  "email": "patient1@example.com",
  "password": "password123"
}
```

**Success Response:**
- Sets session cookie
- Returns user data

**Error Response:**
- `401`: Invalid credentials

---

## Database Schema (Auth-Related)

### Users Table
```prisma
model User {
  id                String        @id @default(cuid())
  email             String        @unique
  password          String
  role              UserRole
  emailVerified     DateTime?
  accountStatus     AccountStatus @default(ACTIVE)
  mfaEnabled        Boolean       @default(false)
  mfaSecret         String?
  lastLogin         DateTime?
  createdAt         DateTime      @default(now())
  updatedAt         DateTime      @updatedAt

  // Relations
  patient           Patient?
  doctor            Doctor?
  nurse             Nurse?
  receptionist      Receptionist?
  admin             Admin?
}
```

### Patient Table
```prisma
model Patient {
  id              String    @id @default(cuid())
  userId          String    @unique
  patientId       String    @unique
  firstName       String
  lastName        String
  dateOfBirth     DateTime
  gender          Gender
  phone           String
  bloodGroup      BloodGroup?
  profileVersion  Int       @default(1)
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt

  user            User      @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

---

**Last Updated**: November 6, 2025  
**Version**: 1.0.0
