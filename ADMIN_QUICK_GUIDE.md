# 🎯 Admin Dashboard - Quick Start Guide

## 🚀 Access the Dashboard

1. **Start the server:**
   ```bash
   cd /Users/moaazmustafa/Documents/name/HMS
   npm run dev
   ```

2. **Open browser:**
   - Navigate to: `http://localhost:3002`
   - Server is currently running on port 3002 (Port 3000 was in use)

3. **Login as Admin:**
   - Go to `/login`
   - Use admin credentials
   - Auto-redirect to `/dashboard`

---

## 📊 Main Dashboard Features (/)dashboard)

### At a Glance:
- **8 Stat Cards** with real-time data
- **6 Quick Actions** for fast navigation
- **Recent Activity** showing latest users & appointments
- **System Health** with 4 metrics
- **4 Management Cards** for direct access
- **Refresh Button** to reload all data

### What You Can Do:
1. ✅ View total counts (users, patients, doctors, nurses)
2. ✅ See today's appointments
3. ✅ Check active prescriptions
4. ✅ Monitor pending lab tests
5. ✅ View recent user registrations
6. ✅ See appointment status breakdown
7. ✅ Check system health (API, DB, Uptime, Performance)
8. ✅ Quick navigate to any management section

---

## 🗺️ Navigation Guide

### Sidebar Menu:
```
📋 Overview          → Main dashboard (default)
👥 User Management   → Manage all system users
🏥 Doctors           → Doctor profiles & specializations
🩺 Nurses            → Nurse profiles & departments
👤 Patients          → Patient records & information
📊 Analytics         → Charts, trends, and reports
📝 Audit Logs        → System activity tracking
⚙️  System Settings  → Configuration & preferences
💾 Database          → Backup and restore
🔔 Notifications     → Send announcements
🔒 Security          → Security dashboard
```

### Quick Actions Grid:
- Click any card to jump to that section
- All cards have hover effects
- Arrow indicator shows navigation

---

## 🔑 Key Functionalities

### 1. User Management (`/dashboard/admin/users`)
- Search users by name/email
- Filter by role (PATIENT, DOCTOR, NURSE, ADMIN)
- Paginated list (10 per page)
- View user details
- Role badges color-coded

### 2. Analytics (`/dashboard/admin/analytics`)
- Appointment trends chart
- User growth visualization
- Time range filters (7 days, 30 days, 90 days, year)
- Export functionality
- Quick stats overview

### 3. Audit Logs (`/dashboard/admin/audit-logs`)
- Complete activity tracking
- Filter by action type
- Search capabilities
- Timestamp records
- User identification

### 4. System Settings (`/dashboard/admin/settings`)
- General configuration
- Notification settings
- Security settings
- Backup settings
- Maintenance mode

### 5. Database Management (`/dashboard/admin/database`)
- Database status
- Manual backup
- Restore functionality
- Storage statistics

---

## 🎨 UI Elements Guide

### Color Coding:
- 🔴 **Red/Primary:** Admin roles, important actions
- 🟣 **Purple:** Doctors
- 🟢 **Green:** Nurses, success states
- 🔵 **Blue:** Patients, info
- 🟡 **Yellow:** Warnings, notifications
- ⚫ **Gray:** General UI elements

### Interactive Elements:
- All cards have **hover effects**
- Loading states show **spinner**
- Error states show **error messages**
- Success actions show **confirmation**

---

## 📱 Responsive Behavior

- **Mobile (< 768px):** 1 column, mobile menu
- **Tablet (768-1023px):** 2 columns
- **Desktop (≥ 1024px):** 3-4 columns, full sidebar

---

## 🔒 Security Notes

- Only **ADMIN** and **MAIN_ADMIN** roles can access
- Session validated on every request
- Unauthorized users redirected to login
- API endpoints protected server-side

---

## ⚡ Performance Tips

- Use **Refresh button** to reload data
- Stats update on page load
- Pagination prevents data overload
- Optimized API calls

---

## 🐛 Common Issues & Fixes

| Issue | Solution |
|-------|----------|
| Stats not loading | Check database connection |
| Unauthorized error | Verify admin role in session |
| Port 3000 in use | Server uses port 3002 automatically |
| Styling broken | Clear cache, restart server |
| Data not updating | Click refresh button |

---

## 📋 Checklist Before Using

- ✅ Database is running
- ✅ Prisma Client is generated
- ✅ Environment variables set
- ✅ Admin user exists in database
- ✅ Server is running (npm run dev)
- ✅ Logged in as admin

---

## 🎯 Quick Actions

### To view statistics:
1. Go to main dashboard
2. All stats load automatically
3. Click refresh to update

### To manage users:
1. Click "User Management" in sidebar
2. Use search/filter as needed
3. Click user to view details

### To check system health:
1. Scroll to "System Health" section
2. View API, DB, Uptime, Performance
3. Green = Good, Red = Issue

### To navigate:
- Use sidebar for main sections
- Use quick actions for fast access
- Use management cards for direct links

---

## 🚦 Status Indicators

- 🟢 **Green:** Operational, good health
- 🟡 **Yellow:** Warning, needs attention
- 🔴 **Red:** Error, immediate action needed
- 🔵 **Blue:** Info, normal operation
- ⚪ **Gray:** Inactive, disabled

---

## 📞 Need Help?

Check these files:
- `ADMIN_DASHBOARD_COMPLETE.md` - Full documentation
- `ADMIN_DASHBOARD_VISUAL.txt` - Visual layout
- `ADMIN_DASHBOARD.md` - Original specifications

---

**Current Status:** ✅ FULLY OPERATIONAL  
**Server URL:** http://localhost:3002  
**Version:** 1.0.0  
**Last Updated:** December 18, 2025
