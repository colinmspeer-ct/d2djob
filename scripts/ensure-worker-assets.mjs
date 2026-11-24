import fs from "node:fs"

const index = "out/index.html"
if (fs.existsSync(index)) {
  console.log("out/ already exists; leaving the static export in place.")
} else {
  fs.mkdirSync("out", { recursive: true })
  fs.writeFileSync(
    index,
    "<!doctype html><html lang=\"en\"><head><meta charset=\"utf-8\"><title>D2D Job</title></head><body data-site=\"marketing\"><h1>D2D Job</h1><p>Placeholder marketing page for local worker development. Run npm run build:pages before a real deploy.</p></body></html>\n",
  )
  fs.writeFileSync("out/404.html", "<!doctype html><title>Not found</title><h1>Not found</h1>\n")
  fs.writeFileSync("out/CNAME", "d2djob.com\n")
  console.log("Wrote a placeholder out/ for local worker development. It is not the live marketing site.")
}
