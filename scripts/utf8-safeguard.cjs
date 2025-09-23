const fs = require('fs');
const path = require('path');
const fs = require('fs');

// Walk both ukpack1 and ukpack2 pages to sanitize replacement chars
const ROOTS = [
  path.join(__dirname, '..', 'client', 'pages', 'ukpack2'),
  path.join(__dirname, '..', 'client', 'pages', 'ukpack1'),
];

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) walk(full);
    else if (/\.(ts|tsx|js|jsx|css|html)$/.test(e.name)) {
      try {
        let content = fs.readFileSync(full, { encoding: 'utf8' });
        const orig = content;
        // Replace replacement characters (U+FFFD) with empty string and trim
        content = content.replace(/\uFFFD/g, '');
        // Also replace the visible replacement glyph if present
        content = content.replace(/\uFFFD/g, '');
        if (content !== orig) {
          fs.writeFileSync(full, content, { encoding: 'utf8' });
          console.log('Fixed encoding chars in', full);
        }
      } catch (err) {
        console.error('Error processing', full, err.message);
      }
    }
  }
}

for (const r of ROOTS) {
  if (fs.existsSync(r)) walk(r);
}
console.log('UTF-8 safeguard complete');
