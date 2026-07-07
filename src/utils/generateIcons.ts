export async function autoGenerateIcons() {
    // Only run in development mode
    if (!import.meta.env.DEV) return;

    // Check if we've already generated them in this browser session to avoid duplicate hits
    if (sessionStorage.getItem('mohassila_icons_generated') === 'true') {
        return;
    }

    try {
        const response = await fetch('/mohassila-icon.svg');
        if (!response.ok) throw new Error('Failed to fetch mohassila-icon.svg');
        const svgText = await response.text();

        const sizes = [
            { name: 'apple-touch-icon.png', size: 180 },
            { name: 'mohassila-icon-192.png', size: 192 },
            { name: 'mohassila-icon-512.png', size: 512 }
        ];

        // Create an image out of the SVG
        const svgBlob = new Blob([svgText], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(svgBlob);

        const img = new Image();
        img.src = url;
        await new Promise((resolve, reject) => {
            img.onload = resolve;
            img.onerror = reject;
        });

        for (const { name, size } of sizes) {
            const canvas = document.createElement('canvas');
            canvas.width = size;
            canvas.height = size;
            const ctx = canvas.getContext('2d');
            if (ctx) {
                // Clear and draw image
                ctx.clearRect(0, 0, size, size);
                ctx.drawImage(img, 0, 0, size, size);
                
                const base64Data = canvas.toDataURL('image/png');
                
                // Save it back to our server
                await fetch('/api/save-icon', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ filename: name, base64Data })
                });
            }
        }

        URL.revokeObjectURL(url);
        sessionStorage.setItem('mohassila_icons_generated', 'true');
        console.log('[Icon Generator] Mobile PWA/Safari icons generated successfully!');
    } catch (err) {
        console.error('[Icon Generator] Error generating icons:', err);
    }
}
