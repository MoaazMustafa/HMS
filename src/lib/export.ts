/**
 * Export Utility Library
 * Provides functions to export data to CSV, Excel, and PDF formats
 */

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */

/**
 * Convert data array to CSV string
 */
function convertToCSV(data: any[], headers: string[]): string {
  const headerRow = headers.join(',');
  const rows = data.map((row) =>
    headers
      .map((header) => {
        const value = row[header];
        // Handle values with commas, quotes, or newlines
        if (
          typeof value === 'string' &&
          (value.includes(',') || value.includes('"') || value.includes('\n'))
        ) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value ?? '';
      })
      .join(','),
  );
  return [headerRow, ...rows].join('\n');
}

/**
 * Download string as file
 */
function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Export data to CSV format
 * @param data Array of objects to export
 * @param filename Name of the file (without extension)
 * @param headers Optional array of header keys to include
 */
export function exportToCSV(
  data: any[],
  filename: string,
  headers?: string[],
): void {
  if (!data || data.length === 0) {
    console.error('No data to export');
    return;
  }

  // Use provided headers or extract from first object
  const csvHeaders = headers || Object.keys(data[0]);
  const csvContent = convertToCSV(data, csvHeaders);
  const timestamp = new Date().toISOString().split('T')[0];
  downloadFile(csvContent, `${filename}_${timestamp}.csv`, 'text/csv');
}

/**
 * Export data to Excel format (CSV with .xlsx extension for basic compatibility)
 * For true Excel support, consider using a library like xlsx or exceljs
 * @param data Array of objects to export
 * @param filename Name of the file (without extension)
 * @param headers Optional array of header keys to include
 */
export function exportToExcel(
  data: any[],
  filename: string,
  headers?: string[],
): void {
  if (!data || data.length === 0) {
    console.error('No data to export');
    return;
  }

  // For now, use CSV format with .xls extension for Excel compatibility
  const csvHeaders = headers || Object.keys(data[0]);
  const csvContent = convertToCSV(data, csvHeaders);
  const timestamp = new Date().toISOString().split('T')[0];
  downloadFile(
    csvContent,
    `${filename}_${timestamp}.xls`,
    'application/vnd.ms-excel',
  );
}

/**
 * Export data to PDF format
 * Creates a simple text-based PDF. For advanced PDF features, consider using jsPDF or pdfmake
 * @param content HTML content or string to export
 * @param filename Name of the file (without extension)
 */
export function exportToPDF(content: string, filename: string): void {
  // Open print dialog with the content
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    console.error('Could not open print window');
    return;
  }

  const timestamp = new Date().toISOString().split('T')[0];
  const currentDateTime = new Date().toLocaleString();

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>${filename}</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            padding: 30px;
            color: #1a1a1a;
            background: #fff;
          }
          .brand-header {
            background: linear-gradient(135deg, #800000 0%, #a00000 100%);
            color: white;
            padding: 30px;
            border-radius: 12px;
            margin-bottom: 30px;
            box-shadow: 0 4px 6px rgba(128, 0, 0, 0.1);
          }
          .brand-header h1 {
            font-size: 32px;
            font-weight: 700;
            margin-bottom: 8px;
            letter-spacing: -0.5px;
          }
          .brand-header .subtitle {
            font-size: 14px;
            opacity: 0.9;
            font-weight: 400;
          }
          .brand-logo {
            display: flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 16px;
          }
          .logo-icon {
            width: 60px;
            height: 48px;
            background: rgba(255, 255, 255, 0.2);
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
            font-weight: 700;
          }
          .document-info {
            display: flex;
            justify-content: space-between;
            padding: 20px;
            background: #f8f9fa;
            border-radius: 8px;
            margin-bottom: 30px;
            border-left: 4px solid #800000;
          }
          .document-info div {
            display: flex;
            flex-direction: column;
            gap: 4px;
          }
          .document-info label {
            font-size: 11px;
            text-transform: uppercase;
            color: #666;
            font-weight: 600;
            letter-spacing: 0.5px;
          }
          .document-info value {
            font-size: 14px;
            color: #1a1a1a;
            font-weight: 500;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            overflow: hidden;
          }
          th {
            background: #800000;
            color: white;
            padding: 12px 16px;
            text-align: left;
            font-weight: 600;
            font-size: 13px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          td {
            padding: 12px 16px;
            border-bottom: 1px solid #e5e7eb;
            font-size: 14px;
            color: #374151;
          }
          tr:last-child td {
            border-bottom: none;
          }
          tr:nth-child(even) {
            background: #f9fafb;
          }
          .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 2px solid #e5e7eb;
            text-align: center;
            color: #6b7280;
          }
          .footer-brand {
            font-size: 14px;
            font-weight: 600;
            color: #800000;
            margin-bottom: 8px;
          }
          .footer-text {
            font-size: 12px;
            line-height: 1.6;
          }
          .confidential {
            background: #fef3c7;
            border: 1px solid #fbbf24;
            padding: 16px;
            border-radius: 8px;
            margin-top: 20px;
            font-size: 12px;
            color: #92400e;
          }
          @media print {
            body { 
              padding: 20px;
            }
            .brand-header {
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
            th {
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
            .no-print { 
              display: none; 
            }
          }
        </style>
      </head>
      <body>
        <div class="brand-header">
          <div class="brand-logo">
            <div class="logo-icon">HMS</div>
            <div>
              <h1>Health Management System</h1>
              <div class="subtitle">Professional Healthcare Documentation</div>
            </div>
          </div>
        </div>

        <div class="document-info">
          <div>
            <label>Document Name</label>
            <value>${filename.replace(/-/g, ' ').toUpperCase()}</value>
          </div>
          <div>
            <label>Generated On</label>
            <value>${currentDateTime}</value>
          </div>
          <div>
            <label>Document ID</label>
            <value>#DOC-${Date.now().toString().slice(-8)}</value>
          </div>
        </div>

        ${content}

        <div class="confidential">
          <strong>⚠️ CONFIDENTIAL INFORMATION</strong><br>
          This document contains protected health information. Handle according to HIPAA regulations. 
          Unauthorized access, use, or disclosure is strictly prohibited.
        </div>

        <div class="footer">
          <div class="footer-brand">HMS - Health Management System</div>
          <div class="footer-text">
            © ${new Date().getFullYear()} Health Management System. All rights reserved.<br>
            For support, contact: support@hms.healthcare | www.hms.healthcare
          </div>
        </div>

        <script>
          window.onload = function() {
            window.print();
            window.onafterprint = function() {
              window.close();
            };
          };
        </script>
      </body>
    </html>
  `);
  printWindow.document.close();
}

/**
 * Export table data to PDF
 * @param data Array of objects to export
 * @param filename Name of the file (without extension)
 * @param headers Optional array of header keys with display names
 */
export function exportTableToPDF(
  data: any[],
  filename: string,
  headers?: { key: string; label: string }[],
): void {
  if (!data || data.length === 0) {
    console.error('No data to export');
    return;
  }

  // Use provided headers or extract from first object
  const tableHeaders =
    headers ||
    Object.keys(data[0]).map((key) => ({
      key,
      label: key.charAt(0).toUpperCase() + key.slice(1),
    }));

  // Create HTML table
  const tableHTML = `
    <table>
      <thead>
        <tr>
          ${tableHeaders.map((h) => `<th>${h.label}</th>`).join('')}
        </tr>
      </thead>
      <tbody>
        ${data
          .map(
            (row) => `
          <tr>
            ${tableHeaders.map((h) => `<td>${row[h.key] ?? ''}</td>`).join('')}
          </tr>
        `,
          )
          .join('')}
      </tbody>
    </table>
  `;

  exportToPDF(tableHTML, filename);
}

/**
 * Format data for export by cleaning and transforming values
 * @param data Array of objects to format
 * @param transformations Object mapping keys to transformation functions
 */
export function formatDataForExport<T extends Record<string, any>>(
  data: T[],
  transformations?: Partial<Record<keyof T, (value: any) => any>>,
): any[] {
  return data.map((item) => {
    const formatted: any = {};
    Object.keys(item).forEach((key) => {
      const value = item[key];
      // Apply transformation if provided
      if (transformations && transformations[key]) {
        const transform = transformations[key];
        formatted[key] = transform ? transform(value) : value;
      } else if (value instanceof Date) {
        // Format dates
        formatted[key] = value.toLocaleDateString();
      } else if (typeof value === 'object' && value !== null) {
        // Convert objects to strings
        formatted[key] = JSON.stringify(value);
      } else {
        formatted[key] = value;
      }
    });
    return formatted;
  });
}

/**
 * Export with multiple format options
 * @param data Data to export
 * @param filename Base filename
 * @param format Export format
 * @param options Additional options
 */
export function exportData(
  data: any[],
  filename: string,
  format: 'csv' | 'excel' | 'pdf',
  options?: {
    headers?: string[] | { key: string; label: string }[];
    transformations?: Record<string, (value: any) => any>;
  },
): void {
  // Format data if transformations provided
  const formattedData = options?.transformations
    ? formatDataForExport(data, options.transformations)
    : data;

  switch (format) {
    case 'csv':
      exportToCSV(
        formattedData,
        filename,
        options?.headers as string[] | undefined,
      );
      break;
    case 'excel':
      exportToExcel(
        formattedData,
        filename,
        options?.headers as string[] | undefined,
      );
      break;
    case 'pdf':
      exportTableToPDF(
        formattedData,
        filename,
        options?.headers as { key: string; label: string }[] | undefined,
      );
      break;
    default:
      console.error('Unsupported export format');
  }
}
