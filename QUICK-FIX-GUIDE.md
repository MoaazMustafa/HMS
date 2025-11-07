# Quick Fix Guide - Appointment Booking & Emergency Contacts

## Issues Identified & Fixed

### ✅ Issue 1: Appointment Booking Doctor Names
**Problem**: Appointments page was trying to access `doctor.user.name` which doesn't exist in the schema.

**Fixed**:
- Updated `appointments-page.tsx` type definition to use `doctor.firstName` and `doctor.lastName`
- Fixed search filter to construct doctor name from `firstName + lastName`
- Fixed display to show `Dr. {firstName} {lastName}` instead of `doctor.user.name`

**Status**: ✅ Code fixed, ready to test

---

### 🔧 Issue 2: No Doctors in Database
**Problem**: Appointment booking modal is likely empty because the database hasn't been seeded with doctor data.

**Solution**: Run the database seed command to populate with 2 sample doctors:

```bash
npm run db:seed
```

This will create:
- **Dr. John Smith** - Cardiology specialist
  - Available: Mon-Fri (9:00 AM - 5:00 PM, Fri until 1:00 PM)
  - Fee: $150
  
- **Dr. Emily Johnson** - General Practice
  - Available: Mon-Fri (8:00 AM - 4:00 PM, Fri until 2:00 PM)
  - Fee: $120

**Also creates**:
- 2 sample patients
- System admins
- Medications database
- Notification templates

**Demo Credentials** (after seeding):
- Doctor 1: `dr.smith@hms.com` / `password123`
- Doctor 2: `dr.johnson@hms.com` / `password123`
- Patient 1: `patient1@example.com` / `password123`
- Patient 2: `patient2@example.com` / `password123`

---

### ℹ️ Issue 3: Emergency Contact "Button" Not Visible
**Not Actually a Bug**: Emergency contacts are managed through the main Edit Profile flow.

**How to Add/Edit Emergency Contacts**:

1. Go to **Dashboard** → **Profile**
2. Click **"Edit Profile"** button (top right corner)
3. Scroll down to the **"Emergency Contacts"** section
4. Fill in:
   - Contact Name
   - Relationship (e.g., Spouse, Parent, Sibling)
   - Phone Number
5. Click **"Save Changes"**

**Current Behavior**:
- **View Mode**: Shows emergency contact info if exists, or "No emergency contact added yet" message
- **Edit Mode**: Shows editable fields for emergency contact details

**Optional Enhancement**: Could add an "Add Emergency Contact" quick action button to make this more discoverable, but the functionality works correctly through Edit Profile.

---

## Testing Checklist

### After Running Seed Command:

#### ✅ Appointment Booking Test
1. Login as a patient (use existing account or register new)
2. Go to **Dashboard** → **Appointments**
3. Click **"Book Appointment"** button
4. **Step 1 - Select Doctor**:
   - [ ] Verify 2 doctors appear (Dr. Smith, Dr. Johnson)
   - [ ] Verify doctor names display correctly
   - [ ] Verify specialization shows
   - [ ] Verify fees display ($150 and $120)
   - [ ] Click on a doctor to select
5. **Step 2 - Choose Date/Time**:
   - [ ] Verify selected doctor info displays at top
   - [ ] Pick a date (Monday-Friday)
   - [ ] Verify time slots appear based on doctor's working hours
   - [ ] Select a time slot
6. **Step 3 - Confirm**:
   - [ ] Verify all details shown (doctor name, date, time, fee)
   - [ ] Add a reason for visit
   - [ ] Click "Confirm Booking"
7. **Verification**:
   - [ ] Success message appears
   - [ ] Modal closes
   - [ ] New appointment appears in upcoming list
   - [ ] Doctor name displays correctly (not "undefined")

#### ✅ Emergency Contact Test
1. Go to **Dashboard** → **Profile**
2. Click **"Edit Profile"**
3. Scroll to **"Emergency Contacts"** section
4. Fill in:
   - Contact Name: "Jane Doe"
   - Relationship: "Spouse"
   - Phone: "+1234567890"
5. Click **"Save Changes"**
6. Verify success message
7. Scroll down to verify emergency contact displays in view mode

---

## Commands Reference

```bash
# Seed the database with sample data
npm run db:seed

# Run development server
npm run dev

# Push schema changes to database
npm run db:push

# Generate Prisma Client
npm run db:generate

# Open Prisma Studio (database GUI)
npm run db:studio

# Production build
npm run build
```

---

## If Appointment Booking Still Doesn't Work

### Check 1: Verify Doctors Exist
```bash
npm run db:studio
```
- Open the `Doctor` table
- Verify 2 doctors exist (Dr. Smith, Dr. Johnson)
- Check that `workingHours` are populated

### Check 2: Check Browser Console
- Open Developer Tools (F12)
- Go to Console tab
- Look for errors when:
  - Opening booking modal
  - Selecting a doctor
  - Choosing date/time

### Check 3: Check Network Tab
- Open Developer Tools (F12)
- Go to Network tab
- Click "Book Appointment"
- Look for `/api/doctors` request
- Verify it returns `200 OK` with doctors array

### Common Issues:

**"No doctors available"**:
- Database not seeded → Run `npm run db:seed`

**"Doctors load but names are undefined"**:
- Already fixed in code ✅

**"Time slots don't appear"**:
- Check if `dayOfWeek` in `workingHours` matches selected day (0=Sunday, 1=Monday, etc.)
- Already fixed to use numeric comparison ✅

**"Booking fails with error"**:
- Check `/api/appointments/book` response in Network tab
- Verify patient is logged in
- Check server logs for detailed error

---

## Next Steps After Testing

Once appointment booking works:

1. **Email Integration**: 
   - Set up SendGrid/Resend for password reset emails
   - Add `PasswordResetToken` model to schema

2. **Appointment Enhancements**:
   - Add cancellation functionality
   - Add rescheduling
   - Implement SMS/Email reminders

3. **Doctor Management**:
   - Create doctor registration flow
   - Add working hours management UI

---

## Summary

**What's Fixed**:
- ✅ Appointment booking doctor name display
- ✅ Appointments list doctor name display
- ✅ Search filter uses correct name fields
- ✅ Type definitions updated

**What's Needed**:
- 🔧 Run database seed command (`npm run db:seed`)
- 📋 Test appointment booking flow
- ℹ️ Emergency contacts work correctly (accessed via Edit Profile)

**Status**: Ready to test after running seed command!
