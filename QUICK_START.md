# Quick Start Guide - New Health Features

## 🚀 Getting Started

### Prerequisites

Ensure you have the following before testing:

- ✅ Next.js development server running
- ✅ PostgreSQL database connected
- ✅ Prisma schema synced
- ✅ Test accounts for Doctor and Patient roles

---

## 📋 Setup Instructions

### 1. Install Dependencies (if needed)

```bash
npm install
```

### 2. Generate Prisma Client

```bash
npm run db:generate
```

### 3. Start Development Server

```bash
npm run dev
```

### 4. Access the Application

Open your browser to: `http://localhost:3000`

---

## 👨‍⚕️ Doctor Panel - Testing Guide

### Access Vital Signs Management

1. **Login** as a Doctor user
2. Navigate to **Dashboard** → **Vital Signs** (new menu item)
3. You should see two panels:
   - Left: Patient list with search
   - Right: Vital signs history for selected patient

### Recording Vital Signs

1. **Select a patient** from the left panel
2. Click **"Record Vital Signs"** button (top right)
3. Fill in the form:
   - Systolic BP: `120` (mmHg)
   - Diastolic BP: `80` (mmHg)
   - Heart Rate: `72` (bpm)
   - Temperature: `36.6` (°C)
   - Weight: `70` (kg)
   - Height: `175` (cm)
   - Oxygen Saturation: `98` (%)
   - Respiratory Rate: `16` (breaths/min)
   - Notes: "Patient appears healthy" (optional)
4. Click **"Record Vital Signs"**
5. ✅ Success toast should appear
6. ✅ New vital signs record appears in history

### Testing Abnormal Values

Record vital signs with these values to test color coding:

- **ABNORMAL (Yellow):**
  - Systolic BP: `150` (high)
  - Heart Rate: `110` (high)
- **CRITICAL (Red):**
  - Systolic BP: `190` (very high)
  - Temperature: `40` (fever)
  - Oxygen Saturation: `85` (low)

### Managing Allergies (via API)

Currently through API only. Use this curl command:

```bash
curl -X POST http://localhost:3000/api/allergies \
  -H "Content-Type: application/json" \
  -H "Cookie: your-session-cookie" \
  -d '{
    "patientId": "patient-id-here",
    "allergen": "Penicillin",
    "type": "MEDICATION",
    "severity": "SEVERE",
    "reaction": "Hives and swelling",
    "notes": "Discovered during hospital visit"
  }'
```

### Managing Immunizations (via API)

```bash
curl -X POST http://localhost:3000/api/immunizations \
  -H "Content-Type: application/json" \
  -H "Cookie: your-session-cookie" \
  -d '{
    "patientId": "patient-id-here",
    "vaccineName": "COVID-19 Vaccine",
    "dateAdministered": "2025-01-15",
    "doseNumber": 1,
    "manufacturer": "Pfizer",
    "lotNumber": "ABC123",
    "administeredBy": "Dr. Smith",
    "nextDueDate": "2025-07-15",
    "notes": "First dose - no adverse reactions"
  }'
```

---

## 👤 Patient Panel - Testing Guide

### Access Health Records

1. **Login** as a Patient user
2. Navigate to **Dashboard** → **Health Records** (new menu item)
3. You should see:
   - Summary cards with counts
   - Three tabs: Vital Signs, Allergies, Immunizations

### Viewing Vital Signs

1. Click **"Vital Signs"** tab
2. View your vital signs history with:
   - ✅ Color-coded status badges (Normal/Abnormal/Critical)
   - ✅ Detailed measurements with icons
   - ✅ Date and time recorded
   - ✅ Provider notes
   - ✅ BMI calculation (if weight & height recorded)

### Viewing Allergies

1. Click **"Allergies"** tab
2. View allergy cards showing:
   - ✅ Allergen name with icon
   - ✅ Severity badge (Mild/Moderate/Severe)
   - ✅ Type (Medication/Food/Environmental)
   - ✅ Reaction details
   - ✅ Date diagnosed

### Viewing Immunizations

1. Click **"Immunizations"** tab
2. View immunization records with:
   - ✅ Vaccine name and dose number
   - ✅ Administration date
   - ✅ Administered by (healthcare provider)
   - ✅ Manufacturer and lot number
   - ✅ Next due date (if applicable)

---

## 🧪 API Testing with Postman/Thunder Client

### 1. Get Vital Signs

```
GET http://localhost:3000/api/vital-signs?patientId=xxx
Headers: Cookie: (your session cookie)
```

**Expected Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": "xxx",
      "systolicBP": 120,
      "diastolicBP": 80,
      "heartRate": 72,
      "temperature": 36.6,
      "weight": 70,
      "height": 175,
      "bmi": 22.86,
      "status": "NORMAL",
      "recordedAt": "2025-12-11T10:30:00Z"
    }
  ]
}
```

### 2. Create Vital Signs

```
POST http://localhost:3000/api/vital-signs
Headers:
  Content-Type: application/json
  Cookie: (your session cookie)
Body:
{
  "patientId": "patient-id",
  "systolicBP": 120,
  "diastolicBP": 80,
  "heartRate": 72,
  "temperature": 36.6,
  "weight": 70,
  "height": 175,
  "oxygenSaturation": 98,
  "notes": "Routine checkup"
}
```

### 3. Get Allergies

```
GET http://localhost:3000/api/allergies?patientId=xxx
```

### 4. Create Allergy

```
POST http://localhost:3000/api/allergies
Body:
{
  "patientId": "patient-id",
  "allergen": "Peanuts",
  "type": "FOOD",
  "severity": "SEVERE",
  "reaction": "Anaphylaxis",
  "diagnosedAt": "2024-05-20"
}
```

### 5. Get Immunizations

```
GET http://localhost:3000/api/immunizations?patientId=xxx
```

### 6. Create Immunization

```
POST http://localhost:3000/api/immunizations
Body:
{
  "patientId": "patient-id",
  "vaccineName": "Influenza Vaccine",
  "dateAdministered": "2025-12-01",
  "doseNumber": 1,
  "manufacturer": "Sanofi",
  "lotNumber": "FLU2025-001"
}
```

---

## 🎨 UI Features to Test

### Vital Signs Page (Doctor)

- ✅ Search patients by name, ID, or email
- ✅ Select patient updates vital signs history
- ✅ Record button disabled when no patient selected
- ✅ Form validation (numeric fields)
- ✅ BMI auto-calculation
- ✅ Status color coding:
  - 🟢 Green = Normal
  - 🟡 Yellow = Abnormal
  - 🔴 Red = Critical
- ✅ Responsive design (mobile/tablet/desktop)
- ✅ Empty state when no records

### Health Records Page (Patient)

- ✅ Summary cards with accurate counts
- ✅ Tab navigation (3 tabs)
- ✅ Beautiful card layouts
- ✅ Icon system for different data types
- ✅ Date formatting
- ✅ Empty states with helpful messages
- ✅ Responsive grid layouts
- ✅ Severity badges with colors

---

## 🔍 Verification Checklist

### Doctor Panel

- [ ] Can see "Vital Signs" in sidebar
- [ ] Can search and select patients
- [ ] Can record vital signs with all fields
- [ ] Can see historical vital signs
- [ ] Abnormal values show yellow badge
- [ ] Critical values show red badge
- [ ] BMI calculates correctly
- [ ] Notes field is optional
- [ ] Success toast appears after saving

### Patient Panel

- [ ] Can see "Health Records" in sidebar
- [ ] Summary cards show correct counts
- [ ] Can switch between tabs
- [ ] Vital signs display with icons
- [ ] Allergies show with severity
- [ ] Immunizations show completion status
- [ ] Empty states display correctly
- [ ] All dates format properly

### API Endpoints

- [ ] GET /api/vital-signs returns data
- [ ] POST /api/vital-signs creates record
- [ ] GET /api/allergies returns data
- [ ] POST /api/allergies creates record
- [ ] DELETE /api/allergies removes record
- [ ] GET /api/immunizations returns data
- [ ] POST /api/immunizations creates record
- [ ] PUT /api/immunizations updates record
- [ ] DELETE /api/immunizations removes record

---

## 🐛 Troubleshooting

### "Cannot find module" errors

**Solution:** Run `npm install` to ensure all dependencies are installed.

### Database errors

**Solution:** Run `npm run db:generate` to regenerate Prisma client.

### Session/Auth errors

**Solution:** Ensure you're logged in and have the correct role (Doctor/Patient).

### No patients showing

**Solution:** Ensure you have patient data in the database and the doctor has assigned patients.

### Vital signs not saving

**Solution:** Check console for errors. Ensure all required fields are filled.

---

## 📊 Test Data Examples

### Normal Vital Signs

```json
{
  "systolicBP": 120,
  "diastolicBP": 80,
  "heartRate": 72,
  "temperature": 36.6,
  "weight": 70,
  "height": 175,
  "oxygenSaturation": 98,
  "respiratoryRate": 16
}
```

### Abnormal Vital Signs (Yellow)

```json
{
  "systolicBP": 145,
  "diastolicBP": 92,
  "heartRate": 105,
  "temperature": 38.2
}
```

### Critical Vital Signs (Red)

```json
{
  "systolicBP": 190,
  "diastolicBP": 125,
  "heartRate": 145,
  "temperature": 40.5,
  "oxygenSaturation": 85
}
```

---

## 🎯 Success Criteria

Your implementation is working correctly if:

1. ✅ Doctor can record vital signs for any patient
2. ✅ Patient can view their own health records
3. ✅ Abnormal values are flagged with colors
4. ✅ BMI calculates automatically
5. ✅ All three tabs work in patient view
6. ✅ API endpoints return correct data
7. ✅ Mobile responsive design works
8. ✅ No console errors

---

## 📞 Support

If you encounter issues:

1. Check the browser console for errors
2. Check the terminal/server logs
3. Verify database connection
4. Ensure Prisma schema is synced
5. Check user role permissions

---

**Last Updated:** December 11, 2025  
**Version:** 1.0.0  
**Status:** Ready for Testing ✅
