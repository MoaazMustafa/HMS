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

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>${filename}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            padding: 20px;
            color: #000;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
          }
          th, td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
          }
          th {
            background-color: #f4f4f4;
            font-weight: bold;
          }
          .header {
            margin-bottom: 20px;
            padding-bottom: 10px;
            border-bottom: 2px solid #333;
          }
          .footer {
            margin-top: 30px;
            padding-top: 10px;
            border-top: 1px solid #ddd;
            font-size: 12px;
            color: #666;
          }
          @media print {
            body { padding: 0; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>${filename}</h1>
          <p>Generated on: ${timestamp}</p>
        </div>
        ${content}
        <div class="footer">
          <p>Health Management System - Generated Report</p>
        </div>
        <script>
          window.onload = function() {
            window.print();
            // Close after printing (user can cancel)
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
