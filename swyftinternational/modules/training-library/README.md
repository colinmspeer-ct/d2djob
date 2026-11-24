# Training library

Reusable module for a logged-in library of videos, PDFs, documents, images, and links. Swyft International uses it with `site: "swyftinternational"`. The D2D Job desk can use the same tables with `site: "d2djob"`.

The sibling Cloudflare pass had not landed a module when this preview was written, so this is the equivalent. It is async on purpose: Node SQLite and Cloudflare D1 can both sit behind `Sql`, and local disk or R2 can both sit behind `ObjectStorage`.

```ts
import { createTrainingLibrary, applyTrainingSchema, d1Sql, r2Storage } from "./index";
import { sqliteSql } from "./sqlite";
import { nodeFileStorage } from "./node-file-storage";

// Preview (Node + a local folder standing in for R2)
await applyTrainingSchema(sqliteSql(db));
const library = createTrainingLibrary(sqliteSql(db), nodeFileStorage(".data/objects"), {
  site: "swyftinternational",
});

// Workers (D1 binding DB, R2 binding MEDIA)
const libraryOnWorkers = createTrainingLibrary(d1Sql(env.DB), r2Storage(env.MEDIA), {
  site: "d2djob",
});
```

Rows are filtered by `site` on every read and write. Copy this folder into the other app rather than importing across the Next.js apps.

Allowed uploads: mp4, webm, quicktime, pdf, doc, docx, txt, md, png, jpeg, webp. Links must be `https`. Default size caps are 32 MB video, 15 MB documents, 8 MB images. Callers still have to enforce login and `noindex`; this module does not render pages.
