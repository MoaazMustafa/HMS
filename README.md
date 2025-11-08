# HMS - Health Management System

A comprehensive digital healthcare platform built with Next.js 15, TypeScript, Tailwind CSS, and Prisma ORM. HMS provides a complete solution for managing patients, prescriptions, appointments, medical records, and lab tests with HIPAA compliance and security as top priorities.

![Next.js](https://img.shields.io/badge/Next.js-15.5.6-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38bdf8?style=flat-square&logo=tailwind-css)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=flat-square&logo=prisma)

## 🚀 Features

### Core Modules

#### 👨‍⚕️ Patient Management
- **Patient Registration & Profiles**: Complete demographic and medical information
- **Patient ID Auto-generation**: Unique identifiers for each patient
- **Search & Filter**: Advanced search by name, ID, email, or phone
- **Doctor Assignment**: Assign patients to primary care physicians
- **Profile Version Control**: Track changes to patient information

#### 💊 Prescription Management
- **E-Prescriptions**: Digital prescription creation and management
- **Drug Interaction Checking**: Automatic detection of potential drug interactions
- **Refill Management**: Track remaining refills and expiration dates
- **Digital Signatures**: Secure prescription validation
- **Status Tracking**: Active, Completed, Cancelled, Expired
- **QR Code Generation**: Quick prescription verification
- **Detail Views**: Comprehensive prescription information for doctors and patients

#### 📅 Appointment Scheduling
- **Smart Booking**: Intelligent appointment scheduling system
- **Doctor Availability**: View and manage doctor schedules
- **Status Management**: Scheduled, Confirmed, Completed, Cancelled, No-Show
- **Automated Reminders**: Multi-channel notifications (SMS/Email/Push)
- **Double-Booking Prevention**: Conflict detection and resolution
- **Detail Views**: Complete appointment information with update capabilities

#### 📋 Medical Records (EHR)
- **SOAP Format**: Subjective, Objective, Assessment, Plan notes
- **ICD-10 Coding**: Standardized diagnosis codes
- **Vital Signs Tracking**: Comprehensive health metrics
- **Lab Report Integration**: Link lab results to medical records
- **Digital Signatures**: Finalize records with physician signatures
- **Version Control**: Track changes and updates
- **Detail Views**: Full medical record display with SOAP notes and diagnoses

#### 🧪 Lab Test Management
- **Test Ordering**: Order laboratory tests for patients
- **Status Tracking**: Ordered, Collected, In Progress, Completed, Cancelled
- **Results Management**: Store and display test results
- **Critical Value Alerts**: Automatic notifications for critical results
- **Result Files**: Upload and manage lab report documents
- **Review Workflow**: Doctor review and approval process
- **Detail Views**: Complete test information and results for doctors and patients

### User Roles & Permissions

#### 🏥 Doctor Dashboard
- Patient list with assignment management
- Appointment calendar and scheduling
- Prescription creation and management
- Lab test ordering and review
- Medical record creation with SOAP notes
- Profile management with specialization
- Schedule management (availability, time slots)

#### 👤 Patient Dashboard
- Personal health overview
- Appointment booking and management
- Prescription viewing and refills
- Lab results access
- Medical records history
- Allergy and immunization tracking
- Profile management with password change

### Security & Compliance
- **Multi-Factor Authentication**: Enhanced account security
- **AES-256 Encryption**: Data encryption at rest
- **RBAC**: Role-based access control
- **Audit Logging**: Complete activity tracking
- **Session Management**: Secure session handling
- **HIPAA Compliance**: Healthcare data protection standards
- **WCAG 2.1 Level AA**: Accessibility standards

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS 4
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **UI Components**: Custom components following shadcn/ui patterns

### Backend
- **Runtime**: Node.js
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: NextAuth.js
- **API**: Next.js API Routes

### Development Tools
- **Package Manager**: npm
- **Linting**: ESLint
- **Formatting**: Prettier
- **Version Control**: Git

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- PostgreSQL 14+
- npm or yarn

### Setup

1. **Clone the repository**
```bash
git clone https://github.com/MoaazMustafa/HMS.git
cd HMS
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env
```

Edit `.env` and configure:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/hms"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
```

4. **Set up the database**
```bash
# Generate Prisma Client
npm run db:generate

# Run migrations
npm run db:migrate

# Seed the database (optional)
npm run db:seed
```

5. **Start the development server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🗂️ Project Structure

```
HMS/
├── prisma/
│   ├── schema.prisma          # Database schema
│   ├── migrations/            # Database migrations
│   └── seed.ts               # Seed data
├── public/                    # Static assets
├── src/
│   ├── app/                  # Next.js App Router
│   │   ├── layout.tsx        # Root layout
│   │   ├── page.tsx          # Home page
│   │   ├── api/              # API routes
│   │   └── dashboard/        # Dashboard pages
│   ├── components/
│   │   ├── sections/         # Page sections
│   │   ├── dashboard/        # Dashboard components
│   │   └── ui/              # Reusable UI components
│   ├── lib/                 # Utilities & configs
│   │   ├── auth.ts          # Authentication config
│   │   ├── prisma.ts        # Prisma client
│   │   ├── metadata.ts      # SEO metadata
│   │   └── utils.ts         # Helper functions
│   ├── styles/
│   │   └── globals.css      # Global styles
│   └── types/               # TypeScript types
├── .env                     # Environment variables
├── next.config.ts          # Next.js configuration
├── tailwind.config.ts      # Tailwind CSS configuration
├── tsconfig.json           # TypeScript configuration
└── package.json            # Dependencies & scripts
```

## 🚀 Available Scripts

### Development
```bash
npm run dev          # Start development server with Turbopack
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run format       # Format code with Prettier
```

### Database
```bash
npm run db:generate  # Generate Prisma Client
npm run db:push      # Push schema to database
npm run db:migrate   # Create and apply migrations
npm run db:studio    # Open Prisma Studio GUI
npm run db:seed      # Seed the database
```

### Type Checking
```bash
npm run type-check   # Run TypeScript compiler check
```

## 📱 Key Features by User Role

### Doctor Features
- ✅ View and manage assigned patients
- ✅ Create and update medical records with SOAP notes
- ✅ Prescribe medications with drug interaction checks
- ✅ Order and review lab tests
- ✅ Manage appointment schedule
- ✅ Update appointment status
- ✅ View detailed patient information
- ✅ Edit profile and manage availability

### Patient Features
- ✅ View personal health dashboard
- ✅ Book appointments with available doctors
- ✅ View prescription details and refills
- ✅ Access lab results and reports
- ✅ View medical records history
- ✅ Manage allergies and immunizations
- ✅ Update profile information
- ✅ Change password securely

## 🔐 Authentication

### User Roles
- **PATIENT**: Standard patient access
- **DOCTOR**: Healthcare provider access
- **ADMIN**: System administrator (future)

### Session Management
- JWT-based authentication
- Secure session storage
- Automatic session refresh
- Role-based route protection

## 📊 Database Schema

### Core Models
- **User**: Authentication and base user data
- **Patient**: Patient-specific information
- **Doctor**: Doctor profiles and specializations
- **Appointment**: Scheduling and booking
- **Prescription**: Medication management
- **MedicalRecord**: EHR with SOAP notes
- **LabTest**: Laboratory tests and results
- **Diagnosis**: ICD-10 coded diagnoses

### Relationships
- One User → One Patient/Doctor
- Many Patients → One Doctor (primary care)
- Many Appointments → One Patient, One Doctor
- Many Prescriptions → One Patient, One Doctor
- Many MedicalRecords → One Patient, One Doctor
- Many LabTests → One Patient, One Doctor

## 🎨 Design System

### Color Palette
- **Primary**: `#acec00` (Lime Green) - Brand color for CTAs and highlights
- **Dark Mode**: Full dark theme support
- **Semantic Colors**: Success, Error, Warning, Info states

### Components
- Consistent component library
- Accessible by default (WCAG 2.1 AA)
- Responsive design (mobile-first)
- Smooth animations with Framer Motion

## 🔧 Configuration

### Environment Variables
```env
# Database
DATABASE_URL="postgresql://..."

# Authentication
NEXTAUTH_SECRET="your-secret"
NEXTAUTH_URL="http://localhost:3000"

# Optional: Email, SMS, etc.
SMTP_HOST="smtp.example.com"
SMTP_PORT="587"
TWILIO_ACCOUNT_SID="..."
```

## 📈 Performance

- **Page Load**: <3s average
- **Lighthouse Score**: 90+ across all metrics
- **Bundle Size**: Optimized with Next.js 15
- **Image Optimization**: Automatic with next/image
- **Code Splitting**: Automatic route-based splitting

## 🧪 Testing

```bash
# Run tests (when implemented)
npm run test

# Run tests in watch mode
npm run test:watch

# Coverage report
npm run test:coverage
```

## 🚀 Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Import project in Vercel
3. Configure environment variables
4. Deploy automatically

### Docker (Alternative)
```bash
docker build -t hms .
docker run -p 3000:3000 hms
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Authors

- **Moaaz Mustafa** - [GitHub](https://github.com/MoaazMustafa)

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Vercel for hosting and deployment
- Prisma for the excellent ORM
- Tailwind CSS for the utility-first CSS framework
- shadcn/ui for component patterns

## 📞 Support

For support, email support@hms.example.com or open an issue in the repository.

## 🗺️ Roadmap

### Phase 1 (Current)
- ✅ Core patient management
- ✅ Prescription management with detail views
- ✅ Appointment scheduling with updates
- ✅ Medical records with SOAP notes and detail views
- ✅ Lab test management with detail views
- ✅ Doctor and patient dashboards

### Phase 2 (Upcoming)
- ⏳ Billing and payment integration
- ⏳ Insurance claim processing
- ⏳ Telemedicine video consultations
- ⏳ Advanced analytics and reporting
- ⏳ Mobile app (React Native)

### Phase 3 (Future)
- ⏳ AI-powered diagnosis assistance
- ⏳ Integration with external lab systems (HL7)
- ⏳ Multi-language support
- ⏳ Advanced role permissions
- ⏳ Pharmacy integration

---

**Built with ❤️ using Next.js 15**
