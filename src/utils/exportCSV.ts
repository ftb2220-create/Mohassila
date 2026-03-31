// ============ CSV EXPORT UTILITY ============
// تصدير البيانات كملف CSV مع دعم اللغة العربية

export const exportToCSV = (
    data: Record<string, string | number>[],
    headers: { key: string; label: string }[],
    filename: string
) => {
    // BOM for Arabic/UTF-8 support in Excel
    const BOM = '\uFEFF';

    // Build header row
    const headerRow = headers.map(h => h.label).join(',');

    // Build data rows
    const rows = data.map(row =>
        headers.map(h => {
            const val = row[h.key] ?? '';
            // Wrap in quotes if contains comma, newline, or quotes
            const str = String(val);
            if (str.includes(',') || str.includes('\n') || str.includes('"')) {
                return `"${str.replace(/"/g, '""')}"`;
            }
            return str;
        }).join(',')
    );

    const csvContent = BOM + headerRow + '\n' + rows.join('\n');

    // Create and download blob
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};
