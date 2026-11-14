import fs from "node:fs"
import path from "node:path"

const out = path.resolve("out")

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) walk(full, files)
    else files.push(full)
  }
  return files
}

function prefixFor(file) {
  const rel = path.relative(out, path.dirname(file))
  const depth = !rel || rel === "." ? 0 : rel.split(path.sep).length
  return depth === 0 ? "./" : "../".repeat(depth)
}

function rewriteAttributeUrls(text, prefix) {
  return text.replace(/(href|src|srcset|poster|action)=(["'])([\s\S]*?)\2/g, (full, attr, quote, value) => {
    if (value.startsWith("data:") || value.startsWith("mailto:") || value.startsWith("tel:")) return full
    // Next's client runtime looks up script tags by the absolute /_next/ URL.
    // Rewriting those to relative paths leaves the runtime waiting on a chunk that never resolves.
    const next = value.replace(/(^|,\s*)\/(?!\/)/g, (match, lead, offset, whole) => {
      if (whole.slice(offset + lead.length).startsWith("/_next/")) return match
      return `${lead}${prefix}`
    })
    return `${attr}=${quote}${next}${quote}`
  })
}

const files = walk(out)
for (const file of files) {
  if (file.endsWith(".html")) {
    const prefix = prefixFor(file)
    const next = rewriteAttributeUrls(fs.readFileSync(file, "utf8"), prefix)
    fs.writeFileSync(file, next)
  } else if (file.endsWith(".css")) {
    const prefix = prefixFor(file)
    const css = fs.readFileSync(file, "utf8").replace(/url\((['"]?)\/(?!\/)/g, `url($1${prefix}`)
    fs.writeFileSync(file, css)
  }
}

fs.writeFileSync(path.join(out, "CNAME"), "d2djob.com\n")
fs.writeFileSync(path.join(out, ".nojekyll"), "")
console.log(`prepared ${files.length} files for GitHub Pages`)
