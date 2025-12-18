# Admin Dashboard Documentation

## Overview

The Admin Dashboard provides comprehensive system management capabilities for HMS administrators. It includes user management, analytics, audit logging, system settings, and security controls.

## Features

### 1. **Dashboard Overview** (`/dashboard` for admins)

- System statistics and metrics
- Recent user registrations
- Appointment status overview
- System health indicators
- User growth trends

### 2. **User Management** (`/dashboard/admin/users`)

- View all system users
- Filter by role (Patient, Doctor, Nurse, Admin)
- Search by name, email, or ID
- Paginated user list
- User profile management
- Role assignment

### 3. **Doctors Management** (`/dashboard/admin/doctors`)

- View all registered doctors
- Doctor profiles with specializations
- License number tracking
- Quick edit and delete actions
- Search and filter capabilities

### 4. **Nurses Management** (`/dashboard/admin/nurses`)

- View all registered nurses
- Department assignments
- License verification
- Profile management
- Search functionality

### 5. **Patients Management** (`/dashboard/admin/patients`)

- Complete patient database
- Patient ID tracking
- Contact information
- Date of birth records
- Quick access to patient details

### 6. **Analytics & Reports** (`/dashboard/admin/analytics`)

- Appointment trends visualization
- User growth charts
- Department statistics
- Common diagnoses tracking
- Top prescribed medications
- Exportable reports
- Customizable time ranges

### 7. **Audit Logs** (`/dashboard/admin/audit-logs`)

- Complete system activity tracking
- User action logging
- Resource access monitoring
- IP address tracking
- Timestamp records
- Exportable audit trails

### 8. **System Settings** (`/dashboard/admin/settings`)

- General configuration
  - Site name and URL
  - Support email
- Notification settings
  - Email notifications
  - SMS notifications
- Security settings
  - User registration toggle
  - Email verification requirements
  - Session timeout configuration
  - Max login attempts
- Backup settings
  - Automatic backup scheduling
  - Backup frequency control
- Maintenance mode toggle

### 9. **Database Management** (`/dashboard/admin/database`)

- Database status monitoring
- Manual backup triggers
- Database restore functionality
- Database optimization tools
- Storage statistics

### 10. **Notifications Center** (`/dashboard/admin/notifications`)

- System-wide announcements
- Role-based notifications
- Email broadcasting
- Custom message templates

### 11. **Security Dashboard** (`/dashboard/admin/security`)

- Firewall status
- SSL certificate monitoring
- Failed login tracking
- API key rotation
- Force password reset
- Access log review

## API Endpoints

### User Management

```
GET /api/admin/users
- Query parameters: role, search, page, limit
- Returns: paginated user list with pagination metadata
```

### System Statistics

```
GET /api/admin/stats
- Returns: comprehensive system statistics including:
  - Total users, patients, doctors, nurses
  - Appointment counts
  - Active prescriptions
  - Pending lab tests
  - User growth metrics
  - Recent user registrations
```

### Audit Logs

```
GET /api/admin/audit-logs
- Query parameters: page, limit
- Returns: paginated audit log entries
```

## Authentication & Authorization

### Role Requirements

- **Admin Access**: `UserRole.ADMIN` or `UserRole.MAIN_ADMIN`
- All admin endpoints verify user role before granting access
- Unauthorized requests return 401 status

### Session Management

- Uses NextAuth.js for authentication
- Server-side session validation
- Automatic redirect to login if unauthenticated

## Component Structure

### Admin Components Location

```
src/components/dashboard/
├── admin-sidebar.tsx          # Admin navigation
├── admin-overview.tsx         # Dashboard homepage
├── admin-users-page.tsx       # User management
├── admin-doctors-page.tsx     # Doctor management
├── admin-nurses-page.tsx      # Nurse management
├── admin-patients-page.tsx    # Patient management
├── admin-analytics-page.tsx   # Analytics & reports
├── admin-audit-logs-page.tsx  # Audit logging
├── admin-settings-page.tsx    # System settings
├── admin-database-page.tsx    # Database management
├── admin-notifications-page.tsx # Notifications
└── admin-security-page.tsx    # Security dashboard
```

### Page Routes

```
src/app/dashboard/admin/
├── page.tsx              # Admin overview
├── users/page.tsx        # User management
├── doctors/page.tsx      # Doctors
├── nurses/page.tsx       # Nurses
├── patients/page.tsx     # Patients
├── analytics/page.tsx    # Analytics
├── audit-logs/page.tsx   # Audit logs
├── settings/page.tsx     # Settings
├── database/page.tsx     # Database
├── notifications/page.tsx # Notifications
└── security/page.tsx     # Security
```

## Styling & Design

### Color Scheme

- **Admin Badge**: Red (`bg-red-500/10 text-red-500`)
- **Icons**: Red shield icon for admin branding
- **Hover Effects**: Card shadows and transitions
- **Responsive**: Mobile-first design with breakpoints

### UI Patterns

- Card-based layouts
- Consistent spacing (gap-4, gap-6)
- Border radius: `rounded-lg`
- Hover states on interactive elements
- Loading spinners for async operations
- Empty states with icons

## Usage Examples

### Creating an Admin User

To create a user with admin privileges:

1. Register a new user through the system
2. Manually update their role in the database to `ADMIN` or `MAIN_ADMIN`
3. They will automatically have access to admin routes

### Monitoring System Health

1. Navigate to `/dashboard` (admin view)
2. View real-time statistics
3. Check system health indicators
4. Monitor recent activity

### Managing Users

1. Go to `/dashboard/admin/users`
2. Use search to find specific users
3. Filter by role to view specific user types
4. Click edit to modify user details
5. Use pagination to navigate large user lists

### Viewing Analytics

1. Navigate to `/dashboard/admin/analytics`
2. Select time range from dropdown
3. View charts and statistics
4. Export reports as needed

### Reviewing Audit Logs

1. Go to `/dashboard/admin/audit-logs`
2. Filter by action type
3. Search for specific users or resources
4. Export logs for compliance reporting

## Security Considerations

### Best Practices

- Always verify admin role before sensitive operations
- Log all administrative actions
- Implement rate limiting on admin endpoints
- Use HTTPS in production
- Enable audit logging for compliance
- Regular security audits
- Keep dependencies updated

### HIPAA Compliance

- All patient data access is logged
- Audit trails maintained
- Secure data transmission
- Role-based access control
- Regular backup verification

## Future Enhancements

### Planned Features

1. Real-time notifications using WebSockets
2. Advanced analytics with chart libraries (Chart.js/Recharts)
3. Bulk user operations
4. Custom role creation
5. Email template management
6. System backup automation
7. Advanced search with filters
8. Export to multiple formats (CSV, PDF, Excel)
9. Two-factor authentication management
10. API rate limiting dashboard

### Integration Opportunities

- Twilio for SMS notifications
- SendGrid for email services
- Sentry for error tracking
- DataDog for monitoring
- AWS S3 for backups

## Troubleshooting

### Common Issues

**Issue**: Admin routes showing 404

- **Solution**: Ensure user has `ADMIN` or `MAIN_ADMIN` role in database

**Issue**: Statistics not loading

- **Solution**: Check API endpoint, verify database connection

**Issue**: Pagination not working

- **Solution**: Verify query parameters in API call

**Issue**: Mobile menu not opening

- **Solution**: Check z-index conflicts, ensure mobile menu button is visible

## Support

For issues or feature requests related to the admin dashboard:

1. Check the error logs in browser console
2. Review server logs for API errors
3. Verify database connectivity
4. Ensure user has proper permissions

## Version History

### v1.0.0 (Current)

- Initial admin dashboard implementation
- User management
- Analytics dashboard
- Audit logging
- System settings
- Security controls
- Database management
- Notifications center

---

**Last Updated**: December 17, 2025
**Maintainers**: HMS Development Team
