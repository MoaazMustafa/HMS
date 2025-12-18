# Admin Dashboard Quick Start Guide

## Prerequisites

- HMS system running locally or deployed
- Database with Prisma schema applied
- NextAuth configured

## Step 1: Create an Admin User

### Option A: Via Database (Recommended for Development)

1. Start Prisma Studio:

   ```bash
   npm run db:studio
   ```

2. Navigate to the `User` table

3. Find an existing user or create a new one

4. Update the `role` field to either:
   - `ADMIN` - Standard admin privileges
   - `MAIN_ADMIN` - Full system administrator

5. Save changes

### Option B: Via SQL (Direct Database Access)

```sql
-- Update existing user to admin
UPDATE "User"
SET role = 'ADMIN'
WHERE email = 'your-email@example.com';

-- Or for main admin
UPDATE "User"
SET role = 'MAIN_ADMIN'
WHERE email = 'your-email@example.com';
```

## Step 2: Access Admin Dashboard

1. **Login** with your admin credentials at `/login`

2. Once logged in, you'll be automatically redirected to `/dashboard`

3. As an admin, you'll see the **Admin Portal** with:
   - Red shield icon
   - "Admin Portal" or "Main Admin" badge
   - Full admin navigation menu

## Step 3: Explore Admin Features

### Quick Navigation

- **Overview**: System statistics and health
- **User Management**: View and manage all users
- **Doctors**: Manage doctor accounts
- **Nurses**: Manage nurse accounts
- **Patients**: Manage patient records
- **Analytics**: View system analytics and reports
- **Audit Logs**: Review system activity logs
- **Settings**: Configure system settings
- **Database**: Database management tools
- **Notifications**: Send system notifications
- **Security**: Security monitoring and controls

## Step 4: Test Admin Functions

### Test User Management

```
1. Go to /dashboard/admin/users
2. Try searching for a user
3. Filter by role (Patient, Doctor, Nurse)
4. Navigate through pages
```

### Test Analytics

```
1. Go to /dashboard/admin/analytics
2. View appointment trends
3. Check user growth charts
4. Review department statistics
5. Try different time ranges
```

### Test Settings

```
1. Go to /dashboard/admin/settings
2. Modify notification settings
3. Toggle features on/off
4. Save changes (currently mock - implement persistence as needed)
```

## Common Admin Tasks

### View System Statistics

1. Dashboard Overview shows:
   - Total users count
   - Active patients, doctors, nurses
   - Appointment counts
   - System health status

### Manage Users

1. Navigate to Users page
2. Use search to find specific users
3. Filter by role to segment users
4. View user details and associated profiles

### Review Audit Logs

1. Go to Audit Logs
2. See system activity timeline
3. Filter by action type
4. Export logs for compliance

### Configure System

1. Access Settings page
2. Adjust notification preferences
3. Configure security settings
4. Set backup schedules
5. Save all changes

## Development Tips

### Adding New Admin Features

1. Create component in `src/components/dashboard/admin-*.tsx`
2. Create page route in `src/app/dashboard/admin/*/page.tsx`
3. Add API endpoint in `src/app/api/admin/*/route.ts`
4. Add navigation item to `AdminSidebar` component
5. Export component in `src/components/index.ts`

### API Development

```typescript
// Example admin API endpoint
import { getServerSession } from 'next-auth/next';
import { UserRole } from '@prisma/client';
import { authOptions } from '@/lib/auth';

export async function GET() {
  const session = await getServerSession(authOptions);

  // Check admin authorization
  if (
    !session ||
    (session.user.role !== UserRole.ADMIN &&
      session.user.role !== UserRole.MAIN_ADMIN)
  ) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Your admin logic here
}
```

### Testing Permissions

1. Login as different user roles
2. Verify admin-only routes are protected
3. Check that non-admins get redirected
4. Test API authorization

## Security Checklist

- [ ] Admin routes are protected
- [ ] API endpoints verify admin role
- [ ] Audit logging is enabled
- [ ] Sensitive data is not exposed
- [ ] HTTPS is enabled in production
- [ ] Session timeout is configured
- [ ] Failed login tracking works
- [ ] Password requirements enforced

## Troubleshooting

### Issue: Can't access admin dashboard

**Solution**:

- Verify user role in database is `ADMIN` or `MAIN_ADMIN`
- Clear browser cache and cookies
- Check NextAuth session configuration

### Issue: API returns 401 Unauthorized

**Solution**:

- Ensure you're logged in
- Verify session is active
- Check user role in session data
- Review authOptions configuration

### Issue: Statistics not loading

**Solution**:

- Check database connection
- Verify Prisma schema is up to date
- Review API endpoint logs
- Check network tab in browser DevTools

### Issue: Mobile menu not working

**Solution**:

- Check mobile viewport
- Verify z-index of overlay
- Test touch events
- Review responsive CSS

## Next Steps

1. **Customize** the admin dashboard to your needs
2. **Implement** real data fetching in components
3. **Add** email/SMS notification integrations
4. **Enhance** analytics with charting libraries
5. **Setup** automated backups
6. **Configure** audit logging persistence
7. **Add** two-factor authentication
8. **Implement** bulk operations
9. **Create** custom reports
10. **Deploy** to production

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [NextAuth.js Guide](https://next-auth.js.org/)
- [Prisma Docs](https://www.prisma.io/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Framer Motion](https://www.framer.com/motion/)

## Support

For help with the admin dashboard:

- Review the main documentation in `ADMIN_DASHBOARD.md`
- Check existing issues and solutions
- Review code comments and types
- Test in development environment first

---

**Version**: 1.0.0  
**Last Updated**: December 17, 2025
