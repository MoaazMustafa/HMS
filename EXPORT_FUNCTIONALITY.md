# Export Functionality Documentation

## Overview

The HMS project now includes comprehensive export functionality across all major data management pages. Users can export data in three formats: **CSV**, **Excel**, and **PDF**.

## Export Library

**Location**: `/src/lib/export.ts`

### Core Functions

#### 1. `exportToCSV(data, filename, headers?)`
Exports data as a CSV file.

```typescript
exportToCSV(
  [{ name: 'John', age: 30 }],
  'users',
  ['name', 'age']
);
// Downloads: users_2025-12-19.csv
```

#### 2. `exportToExcel(data, filename, headers?)`
Exports data as an Excel-compatible file (.xls).

```typescript
exportToExcel(
  [{ name: 'John', age: 30 }],
  'users',
  ['name', 'age']
);
// Downloads: users_2025-12-19.xls
```

#### 3. `exportToPDF(content, filename)`
Exports HTML content as a PDF (via print dialog).

```typescript
const html = '<h1>Report</h1><table>...</table>';
exportToPDF(html, 'report');
// Opens print dialog with formatted content
```

#### 4. `exportTableToPDF(data, filename, headers?)`
Exports tabular data directly to PDF.

```typescript
exportTableToPDF(
  [{ name: 'John', age: 30 }],
  'users',
  [
    { key: 'name', label: 'Full Name' },
    { key: 'age', label: 'Age' }
  ]
);
```

#### 5. `exportData(data, filename, format, options?)`
Universal export function with format selection.

```typescript
exportData(
  data,
  'report',
  'pdf',
  {
    headers: [{ key: 'name', label: 'Name' }],
    transformations: {
      date: (val) => new Date(val).toLocaleDateString()
    }
  }
);
```

#### 6. `formatDataForExport(data, transformations?)`
Pre-formats data before export (dates, objects, etc.).

```typescript
const formatted = formatDataForExport(
  users,
  {
    createdAt: (date) => new Date(date).toLocaleDateString(),
    profile: (obj) => obj.name
  }
);
```

## Implemented Pages

### 1. Admin Analytics Page
**Location**: `/src/components/dashboard/admin-analytics-page.tsx`

**Features**:
- Export system statistics
- Includes metrics: appointments, users, prescriptions, medical records
- Time range included in export
- Dropdown menu with 3 format options

**Usage**:
Click "Export" button → Select format → Downloads `analytics-report_[date].[ext]`

---

### 2. Admin Audit Logs Page
**Location**: `/src/components/dashboard/admin-audit-logs-page.tsx`

**Features**:
- Export all audit log entries
- Includes: timestamp, user, action, resource, details, IP address
- Formatted timestamps for readability
- Alert if no logs to export

**Usage**:
Click "Export" button → Select format → Downloads `audit-logs_[date].[ext]`

**Export Fields**:
- Timestamp (formatted)
- User
- Action (CREATE, UPDATE, DELETE, LOGIN)
- Resource
- Details
- IP Address

---

### 3. Admin Doctors Management Page
**Location**: `/src/components/dashboard/admin-doctors-page.tsx`

**Features**:
- Export all doctors or filtered results
- Respects search filter
- Includes verification status
- Professional formatting for PDF

**Usage**:
Search/filter doctors → Click "Export" → Select format → Downloads `doctors-list_[date].[ext]`

**Export Fields**:
- Name
- Email
- Specialization
- License Number
- Verified (Yes/No)
- Joined Date

---

### 4. Admin Nurses Management Page
**Location**: `/src/components/dashboard/admin-nurses-page.tsx`

**Features**:
- Export all nurses or filtered results
- Department information included
- License number tracking
- Alert if no data to export

**Usage**:
Search/filter nurses → Click "Export" → Select format → Downloads `nurses-list_[date].[ext]`

**Export Fields**:
- Name
- Email
- Department
- License Number
- Verified (Yes/No)
- Joined Date

---

### 5. Admin Patients Management Page
**Location**: `/src/components/dashboard/admin-patients-page.tsx`

**Features**:
- Export all patients or filtered results
- Patient ID included
- Date of birth formatted
- Phone numbers included

**Usage**:
Search/filter patients → Click "Export" → Select format → Downloads `patients-list_[date].[ext]`

**Export Fields**:
- Name
- Email
- Patient ID
- Phone
- Date of Birth
- Verified (Yes/No)
- Joined Date

---

### 6. Lab Test Detail Page
**Location**: `/src/components/dashboard/lab-test-detail-page.tsx`

**Features**:
- Export individual lab test report
- Complete test information
- Critical flag included
- Professional PDF formatting with header/footer

**Usage**:
View lab test → Click "Download Report" → Select format → Downloads `lab-test-[testId]_[date].[ext]`

**Export Fields**:
- Test ID
- Test Name
- Test Type
- Status
- Patient Information
- Doctor Information
- Ordered/Collected/Completed Dates
- Results
- Critical Flag
- Notes

**PDF Special Features**:
- Formatted table layout
- Test details clearly organized
- Critical alerts highlighted
- Professional header with test ID

---

### 7. Prescriptions Page
**Location**: `/src/components/dashboard/prescriptions-page.tsx`

**Features**:
- Export all prescriptions ("Export All" button)
- Export individual prescription (per-item "Export" button)
- Includes medication details and refill information
- Professional PDF with disclaimer

**Usage - All Prescriptions**:
Filter prescriptions → Click "Export All" → Select format → Downloads `prescriptions-list_[date].[ext]`

**Export Fields (All)**:
- Prescription ID
- Medication
- Dosage
- Frequency
- Duration
- Refills Remaining
- Issued At
- Expiry Date
- Status
- Doctor

**Usage - Single Prescription**:
Find prescription → Click "Export" dropdown → Select format → Downloads `prescription-[rxId]_[date].[ext]`

**Export Fields (Single)**:
- Prescription ID
- Medication Name
- Dosage
- Frequency
- Duration
- Instructions
- Refills Allowed/Remaining
- Issued At
- Expiry Date
- Status
- Doctor Name
- Specialization

**PDF Special Features**:
- Professional prescription format
- Important disclaimer section
- Highlighted instructions
- Verification note

---

## User Experience

### Export Button Design

All export buttons follow a consistent pattern:

```tsx
<div className="relative group">
  <Button variant="outline" className="gap-2">
    <Download className="h-4 w-4" />
    Export
  </Button>
  <div className="absolute right-0 mt-1 hidden w-40 rounded-lg border border-border bg-card shadow-lg group-hover:block z-50">
    <button onClick={() => handleExport('csv')}>Export as CSV</button>
    <button onClick={() => handleExport('excel')}>Export as Excel</button>
    <button onClick={() => handleExport('pdf')}>Export as PDF</button>
  </div>
</div>
```

**Features**:
- Hover-activated dropdown
- Clear format labels
- Consistent placement (top-right)
- Icon for visual recognition
- Dark mode compatible

### File Naming Convention

All exported files follow this pattern:
```
[description]_[date].[extension]

Examples:
- analytics-report_2025-12-19.csv
- doctors-list_2025-12-19.xls
- prescription-RX001_2025-12-19.pdf
- audit-logs_2025-12-19.csv
```

### Data Formatting

**Dates**: Formatted using `toLocaleDateString()` for consistency
**Booleans**: Converted to "Yes/No" for clarity
**Missing Data**: Displayed as "N/A" instead of empty
**Complex Objects**: Stringified or extracted to relevant fields

---

## Technical Details

### CSV Format
- Standard RFC 4180 compliant
- Commas as delimiters
- Quoted fields with special characters
- UTF-8 encoding
- First row contains headers

### Excel Format
- CSV format with .xls extension
- Compatible with Excel 2007+
- Opens automatically in Excel
- Preserves data types
- Can be upgraded to true .xlsx with libraries like `xlsx` or `exceljs`

### PDF Format
- Browser print dialog based
- HTML-to-PDF conversion
- Professional styling included
- Print-optimized layout
- Auto-filename suggestion
- Header and footer sections
- Table formatting with borders
- Responsive to print settings

---

## Browser Compatibility

✅ **Chrome/Edge**: Full support
✅ **Firefox**: Full support
✅ **Safari**: Full support
⚠️ **Mobile Browsers**: Limited PDF support (use CSV/Excel)

---

## Future Enhancements

### Planned Features
1. **Advanced Excel Support**: Use `xlsx` library for true .xlsx format with:
   - Multiple sheets
   - Cell formatting (colors, bold, borders)
   - Formulas
   - Charts

2. **Advanced PDF Support**: Integrate `jsPDF` or `pdfmake` for:
   - Custom page layouts
   - Images and logos
   - Digital signatures
   - Password protection
   - Custom fonts

3. **Scheduled Exports**: Automated report generation
4. **Email Delivery**: Send exports directly via email
5. **Cloud Storage**: Save to Google Drive, Dropbox, etc.
6. **Custom Templates**: User-defined export templates
7. **Batch Exports**: Export multiple sections at once
8. **Export History**: Track all exported files
9. **Compression**: ZIP large exports automatically
10. **API Exports**: RESTful API endpoints for programmatic access

### Possible Integrations
- **Google Sheets**: Direct export to Google Sheets
- **Microsoft Excel Online**: Cloud-based Excel integration
- **Tableau/Power BI**: Business intelligence integration
- **FHIR Format**: Healthcare data standard compliance

---

## Troubleshooting

### Common Issues

**Issue**: Export button not responding
**Solution**: Check browser console for errors, ensure data is loaded

**Issue**: PDF opens but looks incorrect
**Solution**: Update browser, check print CSS, try different format

**Issue**: Excel file won't open
**Solution**: Ensure file extension is .xls or .xlsx, try opening with text editor first

**Issue**: CSV has garbled text
**Solution**: Open with UTF-8 encoding, use Excel's "Get Data" feature

**Issue**: Large exports cause browser to freeze
**Solution**: Use pagination, export in smaller batches, consider server-side generation

---

## Security Considerations

1. **Data Sanitization**: All exported data is sanitized to prevent CSV injection
2. **Access Control**: Export functionality respects user roles and permissions
3. **Audit Logging**: All exports should be logged (future enhancement)
4. **HIPAA Compliance**: Exported files contain PHI - users must handle securely
5. **Download Location**: Files saved to browser's default download folder

---

## Developer Notes

### Adding Export to a New Page

1. Import the export library:
```typescript
import { exportData } from '@/lib/export';
```

2. Create export handler:
```typescript
const handleExport = (format: 'csv' | 'excel' | 'pdf') => {
  if (data.length === 0) {
    alert('No data to export');
    return;
  }

  const exportDataArray = data.map((item) => ({
    field1: item.field1,
    field2: item.field2,
    // ... map all fields
  }));

  exportData(exportDataArray, 'filename', format, {
    headers: [
      { key: 'field1', label: 'Display Name 1' },
      { key: 'field2', label: 'Display Name 2' },
    ],
  });
};
```

3. Add export button:
```tsx
<div className="relative group">
  <Button variant="outline" className="gap-2">
    <Download className="h-4 w-4" />
    Export
  </Button>
  <div className="absolute right-0 mt-1 hidden w-40 rounded-lg border border-border bg-card shadow-lg group-hover:block z-50">
    <button onClick={() => handleExport('csv')}>Export as CSV</button>
    <button onClick={() => handleExport('excel')}>Export as Excel</button>
    <button onClick={() => handleExport('pdf')}>Export as PDF</button>
  </div>
</div>
```

---

## Testing Checklist

- [ ] Export with data present
- [ ] Export with empty data (should show alert)
- [ ] Export with filtered data
- [ ] CSV opens correctly in Excel
- [ ] Excel file opens in Microsoft Excel
- [ ] PDF prints correctly
- [ ] File naming includes date
- [ ] Special characters handled (commas, quotes)
- [ ] Large datasets (1000+ rows)
- [ ] Mobile device compatibility
- [ ] Dark mode appearance
- [ ] Hover states work properly
- [ ] Dropdown closes after selection

---

## License & Credits

Export functionality developed for HMS (Health Management System)
Built with TypeScript, React, and Next.js
Uses native browser APIs for file downloads

---

**Last Updated**: December 19, 2025
**Version**: 1.0.0
**Author**: HMS Development Team
