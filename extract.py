import re
import os

html_path = r'c:\Users\guilu\Downloads\index (8).html'
out_dir = r'C:\Users\guilu\.gemini\antigravity\scratch\maju-moda'

with open(html_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Extract CSS
css_match = re.search(r'<style>(.*?)</style>', content, re.DOTALL)
if css_match:
    with open(os.path.join(out_dir, 'style.css'), 'w', encoding='utf-8') as f:
        f.write(css_match.group(1).strip())
    content = content.replace(css_match.group(0), '<link rel="stylesheet" href="style.css">')

# Extract JS
js_match = re.search(r'<script>(.*?)</script>', content, re.DOTALL)
if js_match:
    with open(os.path.join(out_dir, 'script.js'), 'w', encoding='utf-8') as f:
        f.write(js_match.group(1).strip())
    content = content.replace(js_match.group(0), '<script src="script.js" defer></script>')

# Replace base64 images with Cloudinary placeholder
cloudinary_url = "https://res.cloudinary.com/demo/image/fetch/f_auto,q_auto/https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&auto=format&fit=crop"
content = re.sub(r'src="data:image/[^"]+"', f'src="{cloudinary_url}" loading="lazy" alt="MAJU Moda"', content)

with open(os.path.join(out_dir, 'index.html'), 'w', encoding='utf-8') as f:
    f.write(content)

print("Extraction complete.")
