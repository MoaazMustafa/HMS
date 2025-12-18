# HMS - Health Management System

## AI Coding Agent Instructions

### Project Overview

HMS is a comprehensive digital healthcare platform built with **Next.js 15** (App Router), **TypeScript**, **Tailwind CSS 4**, and **Framer Motion**. It manages patients, prescriptions, appointments, and medical records with HIPAA compliance and security as top priorities.

### Architecture & Tech Stack

- **Framework**: Next.js 15 with App Router (`src/app/`)
- **Styling**: Tailwind CSS 4 with custom design system
- **Animations**: Framer Motion for smooth, performant animations
- **Icons**: Lucide React
- **Type Safety**: Strict TypeScript with no `any` types
- **Database**: Prisma ORM (schema-driven, migration-based workflow)
- **UI Components**: Custom components in `src/components/ui/` following shadcn/ui patterns

### Project Structure

```
src/
├── app/              # Next.js App Router pages
│   ├── layout.tsx    # Root layout with theme provider
│   └── page.tsx      # Home page composition
├── components/
│   ├── sections/     # Page sections (Hero, Features, etc.)
│   └── ui/           # Reusable UI components
├── lib/              # Utilities and configurations
│   ├── metadata.ts   # SEO metadata generators
│   └── utils.ts      # Helper functions
└── styles/
    └── globals.css   # Global styles with Tailwind directives
```

### Design System & Conventions

#### Color Palette

- **Primary**: `#800000` (lime green) - Used for CTAs, highlights, and brand elements
- **CSS Variables**: Use semantic tokens like `bg-primary`, `text-primary`, `border-primary`
- **Theme**: Supports dark/light modes via `ThemeProvider`

#### Component Patterns

1. **Client Components**: Mark with `'use client'` when using React hooks, event handlers, or Framer Motion
2. **Server Components**: Default for pages and layouts - use for data fetching
3. **Animation Pattern**: Use `ScrollReveal` wrapper for scroll-triggered animations with staggered delays
4. **Responsive Design**: Mobile-first with `md:` and `lg:` breakpoints

#### Naming Conventions

- **Components**: PascalCase (e.g., `HeroSection`, `FeatureCard`)
- **Files**: kebab-case (e.g., `hero-section.tsx`, `floating-nav.tsx`)
- **CSS Classes**: Tailwind utility classes, avoid custom CSS unless necessary

### Healthcare Domain Context

#### Four Core Modules (Reference: `Health Management System1.docx.txt`)

1. **Patient Management** - Registration, profiles, search (Patient ID auto-generation, OTP verification)
2. **Prescription Management** - E-prescriptions with drug interaction checking, digital signatures
3. **Appointment Scheduling** - Smart booking with automated reminders (SMS/Email/Push)
4. **Medical Records** - EHR with SOAP notes, ICD-10 codes, vital signs, lab reports

#### Key Requirements

- **Security**: Multi-factor auth, AES-256 encryption, RBAC, audit logging
- **Performance**: <3s page loads, 10K+ concurrent users, <1s search results
- **Compliance**: HIPAA, WCAG 2.1 Level AA accessibility
- **Availability**: 99.5% uptime, daily backups, 4-hour recovery time

### Development Workflows

#### Running the Project

```bash
npm run dev          # Development server (Turbopack)
npm run build        # Production build
npm run lint         # ESLint check
npm run format       # Prettier format
```

#### Database Workflow (Prisma)

```bash
npm run db:generate  # Generate Prisma Client
npm run db:push      # Push schema to database
npm run db:migrate   # Create and apply migrations
npm run db:studio    # Open Prisma Studio GUI
```

#### Adding New Features

1. **New Page**: Create in `src/app/[name]/page.tsx` with metadata from `lib/metadata.ts`
2. **New Section**: Create in `src/components/sections/` with ScrollReveal wrapper
3. **New UI Component**: Create in `src/components/ui/` following existing patterns
4. **Animations**: Use Framer Motion's `motion` components with `whileInView` for scroll animations

### Critical Patterns

#### Metadata Management

Always use `generatePageMetadata()` from `lib/metadata.ts` for consistent SEO:

```typescript
export const metadata = pageMetadata.patients; // Pre-defined
// OR
export const metadata = generatePageMetadata({
  title: 'New Page',
  description: '...',
  keywords: ['...'],
  canonical: '/path',
});
```

#### Animation Performance

- Use `viewport={{ once: true }}` to prevent re-triggering animations
- Set `margin: '-50px'` or `-100px` for earlier/later trigger points
- Stagger delays with `delay={index * 0.1}` for sequential reveals
- Use `whileHover` for micro-interactions, avoid heavy transforms

#### Responsive Components

- Always test mobile-first: base styles → `md:` → `lg:`
- Use `grid` with `md:grid-cols-2` or `lg:grid-cols-3` for layouts
- Navigation: Desktop menu hidden on mobile (`hidden md:flex`), mobile menu with overlay

#### Accessibility

- Use semantic HTML (`<section>`, `<nav>`, `<button>`)
- Include proper `aria-labels` for icon-only buttons
- Ensure color contrast meets WCAG AA standards
- Test keyboard navigation (Tab, Enter, Escape)

### Common Issues & Solutions

1. **CSS Import Error**: Import from `@/styles/globals.css` in `layout.tsx`, not individual CSS modules
2. **Hydration Errors**: Ensure client/server component boundaries are correct - use `'use client'` when needed
3. **Framer Motion Performance**: Use `layout` prop sparingly, prefer `transform` over layout-shifting properties
4. **Theme Flicker**: Use `suppressHydrationWarning` on `<html>` tag in layout

### Module-Specific Guidance

When working on healthcare modules:

- **Patient Data**: Always validate email/phone, track version history, use unique Patient IDs
- **Prescriptions**: Include drug interaction checks, allergy alerts, and digital signatures
- **Appointments**: Prevent double-booking, send multi-channel reminders (24h + 2h before)
- **Medical Records**: Use SOAP format for notes, require digital signature before finalizing

### Testing & Quality

- **Type Safety**: Run `npm run type-check` before committing
- **Linting**: Fix ESLint errors with `npm run lint`
- **Performance**: Use React DevTools Profiler to check for unnecessary re-renders
- **Security**: Never expose sensitive data in client components, use server actions for mutations

### External Integrations (Future)

- SMS: Twilio for notifications
- Email: SendGrid for communications
- Payment: Stripe/PayPal for billing
- Labs: HL7 protocol for lab integrations

### When Adding New Dependencies

1. Check bundle size impact (`npm run build` and review output)
2. Prefer packages with TypeScript support
3. Verify license compatibility (MIT, Apache 2.0 preferred)
4. Update `package.json` scripts if needed

### Design Principles

- **Consistency**: Follow existing component patterns
- **Performance**: Prioritize Core Web Vitals (LCP, FID, CLS)
- **Accessibility**: WCAG 2.1 Level AA compliance
- **Security**: Defense in depth, never trust client input
- **User Experience**: Smooth animations, clear feedback, intuitive navigation

---

**Last Updated**: November 5, 2025
**Version**: 1.0.0
