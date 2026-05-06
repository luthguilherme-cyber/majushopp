const fs = require('fs');
const path = require('path');

const htmlPath = 'c:\\Users\\guilu\\Downloads\\index (8).html';
const outDir = 'C:\\Users\\guilu\\.gemini\\antigravity\\scratch\\maju-moda';

let content = fs.readFileSync(htmlPath, 'utf8');

// Extract CSS
const cssMatch = content.match(/<style>([\s\S]*?)<\/style>/);
if (cssMatch) {
    fs.writeFileSync(path.join(outDir, 'style.css'), cssMatch[1].trim(), 'utf8');
    content = content.replace(cssMatch[0], '<link rel="stylesheet" href="style.css">');
}

// Extract JS
const jsMatch = content.match(/<script>([\s\S]*?)<\/script>/);
if (jsMatch) {
    fs.writeFileSync(path.join(outDir, 'script.js'), jsMatch[1].trim(), 'utf8');
    content = content.replace(jsMatch[0], '<script src="script.js" defer></script>');
}

// Replace base64 images with Cloudinary placeholder
const cloudinaryUrl = "https://res.cloudinary.com/demo/image/fetch/f_auto,q_auto/https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&auto=format&fit=crop";
content = content.replace(/src="data:image\/[^"]+"/g, `src="${cloudinaryUrl}" loading="lazy" alt="MAJU Moda"`);

fs.writeFileSync(path.join(outDir, 'index.html'), content, 'utf8');

console.log("Extraction complete.");
