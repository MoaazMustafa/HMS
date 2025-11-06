# HMS - Quick Start Guide

## 🚀 Getting Started

### Prerequisites
- ✅ Node.js 18+ installed
- ✅ PostgreSQL database (Neon.tech configured)
- ✅ npm or yarn package manager

### ✨ Your Database is Ready!
Database schema has been created and seeded with demo users.

---

## 📝 Demo Credentials

### Test the system with these accounts:

| Role | Email | Password |
|------|-------|----------|
| **Main Admin** | mainadmin@hms.com | password123 |
| **Admin** | admin@hms.com | password123 |
| **Doctor (Cardiology)** | dr.smith@hms.com | password123 |
| **Doctor (General)** | dr.johnson@hms.com | password123 |
| **Nurse** | nurse.williams@hms.com | password123 |
| **Receptionist** | receptionist@hms.com | password123 |
| **Patient 1** | patient1@example.com | password123 |
| **Patient 2** | patient2@example.com | password123 |

---

## 🏃‍♂️ Run the Application

### 1. Start Development Server
```bash
npm run dev
```

The application will start at **http://localhost:3000**

### 2. Test Authentication
1. **Visit**: http://localhost:3000
2. **Click**: "Sign In" button in navigation
3. **Login**: Use any demo credentials above
4. **Access**: Dashboard (currently shows "Coming Soon")

### 3. Test Registration
1. **Visit**: http://localhost:3000/register
2. **Fill** the registration form
3. **Submit**: New patient account will be created
4. **Login**: Use new credentials

---

## 📁 Available Routes

### Public Routes
- `/` - Landing page with features
- `/login` - Sign in page
- `/register` - Patient registration

### Protected Routes (Requires Login)
- `/dashboard` - Main dashboard (Coming Soon component)

---

## 🛠️ Development Commands

```bash
# Development
npm run dev              # Start development server (Turbopack)
npm run build            # Create production build
npm run start            # Start production server
npm run lint             # Run ESLint
npm run format           # Format code with Prettier

# Database
npm run db:studio        # Open Prisma Studio (GUI)
npm run db:push          # Push schema changes
npm run db:migrate       # Create migration
npm run db:seed          # Seed demo data
npm run db:generate      # Generate Prisma Client
```

---

## 🎨 Features Implemented

### ✅ Authentication System
- Email/password login
- Patient registration
- JWT-based sessions (30-day expiration)
- Protected routes with middleware
- Role-based access control (6 roles)
- Account status tracking
- Last login tracking

### ✅ Landing Page
- Hero section with animations
- Features showcase
- Module overview
- Statistics counter
- Contact form (UI only)
- Responsive design
- Dark/Light theme toggle

### ✅ Database Schema
- 30+ tables covering all HMS requirements
- User management with 6 roles
- Patient profiles with versioning
- Doctor scheduling and working hours
- Appointments and sessions
- Prescriptions with version history
- Medical records with SOAP notes
- Lab tests and results
- Vital signs tracking
- Allergies and immunizations
- Billing and payments
- Notifications system
- Audit logging

---

## 📊 Database Management

### View Database (Prisma Studio)
```bash
npm run db:studio
```

This opens a GUI at **http://localhost:5555** where you can:
- Browse all tables
- View, edit, and delete records
- Test relationships
- Add new data

### Reset Database (if needed)
```bash
npm run db:migrate:reset
npm run db:seed
```

---

## 🔐 Security Features

- **Password Hashing**: bcrypt with 10 salt rounds
- **Session Management**: JWT tokens with 30-day expiration
- **Route Protection**: Middleware blocks unauthorized access
- **CSRF Protection**: Built-in NextAuth security
- **Account Status**: Only ACTIVE accounts can login
- **Audit Logging**: Ready to track all user actions

---

## 🎯 Next Development Steps

### Immediate Priorities
1. **Role-Based Dashboards**
   - Create unique dashboard for each role
   - Add role-specific navigation
   - Display relevant data per role

2. **Patient Management**
   - Patient list/search
   - Patient profile viewer
   - Medical history viewer
   - Appointment booking UI

3. **Doctor Features**
   - Doctor schedule calendar
   - Appointment management
   - Patient list view
   - Prescription creation UI

4. **Admin Features**
   - User management
   - System settings
   - Analytics dashboard
   - Audit log viewer

### Future Enhancements
- Email verification
- Password reset flow
- Multi-factor authentication
- Real-time notifications
- Telemedicine integration
- Document management
- Billing system
- Reporting and analytics

---

## 🐛 Troubleshooting

### Build Fails
```bash
# Clear cache and rebuild
rm -rf .next node_modules
npm install
npm run build
```

### Database Connection Issues
- Check `.env` file has correct `DATABASE_URL`
- Verify Neon.tech database is active
- Test connection with `npm run db:studio`

### Login Not Working
- Verify database is seeded: `npm run db:seed`
- Check browser console for errors
- Clear browser cookies and try again
- Ensure `NEXTAUTH_SECRET` is set in `.env`

### TypeScript Errors
```bash
# Regenerate Prisma Client
npm run db:generate

# Type check
npm run type-check
```

---

## 📚 Documentation Files

- **`README.md`** - Project overview and setup
- **`AUTH_DOCUMENTATION.md`** - Complete authentication guide
- **`prisma/README.md`** - Database setup instructions
- **`prisma/SCHEMA_DOCUMENTATION.md`** - Database schema details
- **`access.md`** - User roles and permissions
- **`.github/copilot-instructions.md`** - AI agent guidelines

---

## 🌟 Technology Stack

- **Framework**: Next.js 15.5.6 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **Animations**: Framer Motion + AOS
- **Authentication**: NextAuth.js 4
- **Database**: PostgreSQL (Neon.tech)
- **ORM**: Prisma 6.19.0
- **Icons**: Lucide React
- **Theme**: next-themes (Dark/Light mode)

---

## 🤝 Contributing

The system is ready for development! Key files:
- Add features in `/src/app/dashboard/`
- Create components in `/src/components/`
- Add API routes in `/src/app/api/`
- Update schema in `/prisma/schema.prisma`

---

## 📞 Support

For questions about:
- **Authentication**: See `AUTH_DOCUMENTATION.md`
- **Database**: See `prisma/SCHEMA_DOCUMENTATION.md`
- **Access Control**: See `access.md`
- **Development**: See `.github/copilot-instructions.md`

---

**Happy Coding!** 🎉

Your HMS application is fully set up with:
✅ Authentication system
✅ Database with 30+ tables
✅ 8 demo users across all roles
✅ Beautiful landing page
✅ Protected dashboard
✅ Dark/Light theme support
✅ Responsive design

**Next**: Run `npm run dev` and visit http://localhost:3000

---

**Last Updated**: November 6, 2025  
**Version**: 1.0.0
