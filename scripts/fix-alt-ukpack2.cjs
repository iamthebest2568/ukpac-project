const fs = require("fs");
const path = require("path");
const fs = require("fs");

const ROOTS = [
  path.join(__dirname, "..", "client", "pages", "ukpack2"),
  path.join(__dirname, "..", "client", "pages", "ukpack1"),
];

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) walk(full);
    else if (/\.(ts|tsx|js|jsx|html)$/.test(e.name)) {
      try {
        let content = fs.readFileSync(full, { encoding: "utf8" });
        const orig = content;
        // Replace alt="...". If aria-hidden exists on same tag, set alt="" (decorative)
        content = content.replace(/<img([\s\S]*?)>/g, (match) => {
          if (!/alt=/.test(match)) return match;
          const hasAriaHidden = /aria-hidden\s*=\s*"true"/.test(match);
          if (hasAriaHidden) {
            return match.replace(/alt\s*=\s*"[^"]*"/g, 'alt=""');
          }
          return match.replace(/alt\s*=\s*"[^"]*"/g, 'alt="image"');
        });

        if (content !== orig) {
          fs.writeFileSync(full, content, { encoding: "utf8" });
          console.log("Updated alts in", full);
        }
      } catch (err) {
        console.error("Error processing", full, err.message);
      }
    }
  }
}

for (const r of ROOTS) {
  if (fs.existsSync(r)) walk(r);
}
console.log("Alt-fix complete");
