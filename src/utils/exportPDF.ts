// ============ PDF EXPORT UTILITY ============
// تصدير البيانات كملف PDF مع دعم اللغة العربية
// يستخدم HTML/CSS لإنشاء ملف PDF عبر نافذة الطباعة

interface PDFColumn {
    key: string;
    label: string;
    align?: 'right' | 'left' | 'center';
}

interface PDFExportOptions {
    title: string;
    subtitle?: string;
    data: Record<string, string | number>[];
    columns: PDFColumn[];
    filename: string;
    brandColor?: string;
    showDate?: boolean;
    showTotal?: boolean;
    totalColumns?: string[];
    orientation?: 'portrait' | 'landscape';
}

export const exportToPDF = (options: PDFExportOptions) => {
    const {
        title,
        subtitle,
        data,
        columns,
        brandColor = '#06B6D4',
        showDate = true,
        showTotal = false,
        totalColumns = [],
        orientation = 'portrait',
    } = options;

    const today = new Date().toLocaleDateString('ar-SA', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    // Calculate totals if needed
    const totals: Record<string, number> = {};
    if (showTotal && totalColumns.length > 0) {
        totalColumns.forEach(col => {
            totals[col] = data.reduce((sum, row) => sum + (Number(row[col]) || 0), 0);
        });
    }

    const formatNumber = (n: number) => n.toLocaleString('ar-SA');

    // Build table rows
    const tableRows = data.map((row, i) => `
        <tr style="background: ${i % 2 === 0 ? '#FFFFFF' : '#F8FAFC'};">
            ${columns.map(col => `
                <td style="padding: 10px 14px; border-bottom: 1px solid #E2E8F0; font-size: 12px; color: #334155; text-align: ${col.align || 'right'};">
                    ${typeof row[col.key] === 'number' ? formatNumber(row[col.key] as number) : row[col.key] ?? '—'}
                </td>
            `).join('')}
        </tr>
    `).join('');

    // Total row
    const totalRow = showTotal ? `
        <tr style="background: ${brandColor}10; font-weight: 800;">
            ${columns.map((col, i) => `
                <td style="padding: 12px 14px; border-top: 2px solid ${brandColor}; font-size: 13px; color: ${totalColumns.includes(col.key) ? brandColor : '#64748B'}; text-align: ${col.align || 'right'};">
                    ${i === 0 ? 'الإجمالي' : totalColumns.includes(col.key) ? formatNumber(totals[col.key]) : ''}
                </td>
            `).join('')}
        </tr>
    ` : '';

    const html = `
    <!DOCTYPE html>
    <html dir="rtl" lang="ar">
    <head>
        <meta charset="utf-8">
        <title>${title}</title>
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Arabic:wght@400;600;700;900&display=swap');
            
            * { margin: 0; padding: 0; box-sizing: border-box; }
            
            body {
                font-family: 'Noto Sans Arabic', 'Segoe UI', sans-serif;
                background: white;
                color: #0F172A;
                direction: rtl;
            }
            
            @page {
                size: ${orientation === 'landscape' ? 'landscape' : 'portrait'};
                margin: 20mm 15mm;
            }

            .header {
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
                margin-bottom: 32px;
                padding-bottom: 20px;
                border-bottom: 3px solid ${brandColor};
            }

            .header-right h1 {
                font-size: 24px;
                font-weight: 900;
                color: #0F172A;
                margin-bottom: 4px;
            }

            .header-right .subtitle {
                font-size: 13px;
                color: #64748B;
                font-weight: 500;
            }

            .header-left {
                text-align: left;
            }

            .header-left .brand {
                font-size: 20px;
                font-weight: 900;
                color: ${brandColor};
            }

            .header-left .date {
                font-size: 11px;
                color: #94A3B8;
                margin-top: 4px;
            }

            .header-left .count {
                font-size: 11px;
                color: #64748B;
                margin-top: 2px;
                font-weight: 600;
            }

            .table-wrapper {
                border-radius: 12px;
                overflow: hidden;
                border: 1px solid #E2E8F0;
            }

            table {
                width: 100%;
                border-collapse: collapse;
            }

            thead tr {
                background: linear-gradient(135deg, ${brandColor}, ${brandColor}dd);
            }

            thead th {
                padding: 12px 14px;
                font-size: 12px;
                font-weight: 700;
                color: white;
                text-align: right;
                letter-spacing: 0.5px;
            }

            .footer {
                margin-top: 24px;
                padding-top: 16px;
                border-top: 1px solid #E2E8F0;
                display: flex;
                justify-content: space-between;
                align-items: center;
                font-size: 10px;
                color: #94A3B8;
            }

            .footer .page-info {
                font-weight: 600;
            }

            @media print {
                body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
                .no-print { display: none; }
            }
        </style>
    </head>
    <body>
        <div class="header">
            <div class="header-right">
                <h1>${title}</h1>
                ${subtitle ? `<p class="subtitle">${subtitle}</p>` : ''}
            </div>
            <div class="header-left">
                <div class="brand">محصّلة</div>
                ${showDate ? `<div class="date">${today}</div>` : ''}
                <div class="count">${data.length} سجل</div>
            </div>
        </div>

        <div class="table-wrapper">
            <table>
                <thead>
                    <tr>
                        ${columns.map(col => `<th style="text-align: ${col.align || 'right'}">${col.label}</th>`).join('')}
                    </tr>
                </thead>
                <tbody>
                    ${tableRows}
                    ${totalRow}
                </tbody>
            </table>
        </div>

        <div class="footer">
            <span>تم الإنشاء بواسطة نظام محصّلة</span>
            <span class="page-info">${today}</span>
        </div>

        <script>
            setTimeout(() => window.print(), 600);
        </script>
    </body>
    </html>
    `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
        printWindow.document.write(html);
        printWindow.document.close();
    }
};
