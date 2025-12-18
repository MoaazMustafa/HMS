# 🧪 Nurse Panel Testing Checklist

## Login Credentials

```
Email: nurse.williams@hms.com
Password: password123
```

---

## ✅ Testing Checklist

### 1. Login & Dashboard

- [ ] Login with nurse credentials
- [ ] Verify redirect to `/dashboard`
- [ ] Check green-themed nurse sidebar is visible
- [ ] Verify "Nurse Portal" label at top
- [ ] Check dashboard statistics display:
  - [ ] Vitals Recorded Today
  - [ ] Unique Patients
  - [ ] Upcoming Appointments
- [ ] Verify "Recent Vital Signs" section loads
- [ ] Verify "Upcoming Appointments" section loads
- [ ] Test all 4 quick action buttons

### 2. Patients Page (Read-only)

- [ ] Click "Patients" in sidebar
- [ ] Verify patient list displays
- [ ] Test search functionality:
  - [ ] Search by patient ID
  - [ ] Search by name
  - [ ] Search by email
- [ ] Verify patient cards show:
  - [ ] Patient ID and name
  - [ ] Age, gender, blood group
  - [ ] Contact information
  - [ ] Statistics (appointments, records, prescriptions)
- [ ] Click "View Details" button
- [ ] Verify no "Edit Patient" button exists (read-only)

### 3. Vital Signs Page

- [ ] Click "Vital Signs" in sidebar
- [ ] Verify page loads with "Record Vital Signs" button
- [ ] Test patient selection:
  - [ ] Search for a patient
  - [ ] Select a patient from dropdown
- [ ] Click "Record Vital Signs" button
- [ ] Fill in vital signs form:
  - [ ] Blood Pressure (e.g., 120/80)
  - [ ] Heart Rate (e.g., 72)
  - [ ] Temperature (e.g., 98.6)
  - [ ] Weight (e.g., 70)
  - [ ] Height (e.g., 170)
  - [ ] Oxygen Saturation (e.g., 98)
  - [ ] Notes (optional)
- [ ] Click "Save Vital Signs"
- [ ] Verify success toast appears
- [ ] Verify vital signs appear in history
- [ ] Check BMI is calculated automatically
- [ ] Verify status badge (Normal/Abnormal/Critical)

### 4. Appointments Page (NEW - Read-only)

- [ ] Click "Appointments" in sidebar
- [ ] Verify appointments list displays
- [ ] Test status filter:
  - [ ] All Statuses
  - [ ] Scheduled
  - [ ] Confirmed
  - [ ] Completed
  - [ ] Cancelled
  - [ ] No Show
- [ ] Test date range filter:
  - [ ] All Dates
  - [ ] Today
  - [ ] Upcoming
  - [ ] Past
- [ ] Test specific date picker
- [ ] Click "Clear Filters" button
- [ ] Verify appointment cards show:
  - [ ] Appointment ID and status badge
  - [ ] Date and time
  - [ ] Patient info (name, ID, email, phone)
  - [ ] Doctor info (name, specialization)
  - [ ] Reason (if provided)
  - [ ] Type badge (if provided)
- [ ] Click "View Details" button
- [ ] Verify no "Update Status" button exists (read-only)

### 5. Medical Records Page (NEW - Read-only)

- [ ] Click "Medical Records" in sidebar
- [ ] Verify medical records list displays
- [ ] Test search functionality:
  - [ ] Search by patient name
  - [ ] Search by patient ID
  - [ ] Search by record ID
  - [ ] Search by chief complaint
- [ ] Test status filter:
  - [ ] All Statuses
  - [ ] Finalized
  - [ ] Draft
  - [ ] Signed
  - [ ] Unsigned
- [ ] Test date filter:
  - [ ] All Dates
  - [ ] Today
  - [ ] This Week
  - [ ] This Month
- [ ] Click "Clear Filters" button
- [ ] Verify record cards show:
  - [ ] Record ID with status badges
  - [ ] Visit date
  - [ ] Patient info
  - [ ] Chief complaint
  - [ ] Diagnoses with ICD-10 codes
  - [ ] Vital signs (if available)
  - [ ] Assessment preview
  - [ ] Created date
- [ ] Click "View Details" button
- [ ] Verify no "Edit Record" or "Create Record" buttons exist (read-only)

### 6. Profile Page (NEW)

- [ ] Click "Profile" in sidebar
- [ ] Verify profile page displays with "Active" badge
- [ ] Check read-only fields:
  - [ ] Email (should be disabled)
  - [ ] License Number (should be disabled)
- [ ] Click "Edit Profile" button
- [ ] Edit the following fields:
  - [ ] First Name
  - [ ] Last Name
  - [ ] Professional Phone
  - [ ] Personal Phone
- [ ] Click "Save Changes"
- [ ] Verify success toast appears
- [ ] Verify changes are saved
- [ ] Click "Edit Profile" again
- [ ] Click "Cancel" button
- [ ] Verify changes are reverted
- [ ] Click "Change Password" button
- [ ] Test password change modal:
  - [ ] Enter current password
  - [ ] Enter new password
  - [ ] Confirm new password
  - [ ] Click "Change Password"
  - [ ] Verify success toast

### 7. Navigation & UI

- [ ] Test mobile menu (resize browser):
  - [ ] Click hamburger menu icon
  - [ ] Verify sidebar slides in
  - [ ] Click outside to close
  - [ ] Click X button to close
- [ ] Test desktop navigation:
  - [ ] All menu items are visible
  - [ ] Active page is highlighted
  - [ ] Icons are displayed correctly
- [ ] Test logout:
  - [ ] Click "Logout" button at bottom of sidebar
  - [ ] Verify redirect to home page
  - [ ] Verify session is cleared

### 8. Responsive Design

- [ ] Test on mobile (< 768px):
  - [ ] Sidebar collapses to hamburger menu
  - [ ] Cards stack vertically
  - [ ] Filters work properly
  - [ ] Buttons are touch-friendly
- [ ] Test on tablet (768px - 1024px):
  - [ ] Sidebar is visible
  - [ ] 2-column grid layouts work
  - [ ] Filter dropdowns fit
- [ ] Test on desktop (> 1024px):
  - [ ] Sidebar is always visible
  - [ ] 3+ column grids where applicable
  - [ ] All content fits properly

### 9. Error Handling

- [ ] Test with no data:
  - [ ] Empty appointments list shows empty state
  - [ ] Empty medical records shows empty state
  - [ ] Empty vitals history shows empty state
- [ ] Test network errors:
  - [ ] Disconnect network (DevTools)
  - [ ] Try to load data
  - [ ] Verify error message displays
  - [ ] Verify "Try Again" button works
- [ ] Test form validation:
  - [ ] Try to save profile with empty required fields
  - [ ] Verify validation messages appear

### 10. Performance

- [ ] Check page load times:
  - [ ] Dashboard loads in < 2 seconds
  - [ ] Patient list loads in < 2 seconds
  - [ ] Appointments list loads in < 2 seconds
  - [ ] Medical records list loads in < 2 seconds
- [ ] Check search performance:
  - [ ] Search responds instantly (< 100ms)
  - [ ] No lag when typing
- [ ] Check filter performance:
  - [ ] Filters apply instantly
  - [ ] No noticeable delay

---

## 🐛 Bug Report Template

If you find any issues, report them using this format:

```
**Page**: [Dashboard/Patients/Vital Signs/Appointments/Medical Records/Profile]
**Issue**: [Brief description]
**Steps to Reproduce**:
1. [Step 1]
2. [Step 2]
3. [Step 3]

**Expected Behavior**: [What should happen]
**Actual Behavior**: [What actually happened]
**Browser**: [Chrome/Firefox/Safari/Edge]
**Device**: [Desktop/Mobile/Tablet]
**Screenshot**: [If applicable]
```

---

## ✅ Expected Results Summary

After completing all tests, you should have:

- ✅ Successfully logged in as nurse
- ✅ Viewed all 6 pages (Dashboard, Patients, Vital Signs, Appointments, Medical Records, Profile)
- ✅ Recorded at least 1 set of vital signs
- ✅ Filtered appointments by status and date
- ✅ Searched medical records
- ✅ Updated nurse profile information
- ✅ Changed password successfully
- ✅ Tested mobile responsive design
- ✅ No critical errors or bugs found

---

## 📊 Test Coverage

### API Endpoints Tested

- ✅ `GET /api/patients` - List all patients
- ✅ `GET /api/vital-signs` - Get vital signs
- ✅ `POST /api/vital-signs` - Record vital signs
- ✅ `GET /api/appointments` - List all appointments
- ✅ `GET /api/medical-records` - List all medical records
- ✅ `GET /api/nurse/profile` - Get nurse profile
- ✅ `PUT /api/nurse/profile` - Update nurse profile

### Components Tested

- ✅ NurseSidebar
- ✅ NurseOverview
- ✅ NursePatientsPage
- ✅ DoctorVitalSignsPage (used by nurse)
- ✅ NurseAppointmentsPage
- ✅ NurseMedicalRecordsPage
- ✅ NurseProfilePage

### Routes Tested

- ✅ `/dashboard` (Nurse dashboard)
- ✅ `/dashboard/patients` (Nurse patients view)
- ✅ `/dashboard/vital-signs` (Nurse vital signs)
- ✅ `/dashboard/appointments` (Nurse appointments view)
- ✅ `/dashboard/medical-records` (Nurse medical records view)
- ✅ `/dashboard/profile` (Nurse profile)

---

**Total Test Cases**: 100+  
**Estimated Testing Time**: 30-45 minutes  
**Priority**: High (All features are critical)

---

## 🚀 Ready to Test!

Start with the **Login & Dashboard** section and work your way through each section systematically. Check off each item as you complete it.

Good luck! 🎉
