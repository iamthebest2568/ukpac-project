const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..", "client", "pages", "ukpack2");

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) walk(full);
    else if (/\.(ts|tsx|js|jsx|css|html)$/.test(e.name)) {
      try {
        let content = fs.readFileSync(full, { encoding: "utf8" });
        const orig = content;
        // Replace replacement characters with a single space
        content = content.replace(/\uFFFD/g, " ");
        content = content.replace(/\uFFFD/g, " ");
        if (content !== orig) {
          fs.writeFileSync(full, content, { encoding: "utf8" });
          console.log("Fixed encoding chars in", full);
        }
      } catch (err) {
        console.error("Error processing", full, err.message);
      }
    }
  }
}

walk(ROOT);
console.log("UTF-8 safeguard complete");
