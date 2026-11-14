import { isFieldStatus, type FieldEntry } from "@/lib/field-model"

const DB_NAME = "d2d-field"
const DB_VERSION = 1

export type FieldState = {
  entries: FieldEntry[]
  repName: string
  lastIndustry: string
}

function openDb() {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)
    request.onupgradeneeded = () => {
      const db = request.result
      if (!db.objectStoreNames.contains("entries")) db.createObjectStore("entries", { keyPath: "id" })
      if (!db.objectStoreNames.contains("meta")) db.createObjectStore("meta")
    }
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error ?? new Error("Could not open storage."))
  })
}

function requestToPromise<T>(request: IDBRequest<T>) {
  return new Promise<T>((resolve, reject) => {
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error ?? new Error("Storage request failed."))
  })
}

function isEntry(value: unknown): value is FieldEntry {
  if (!value || typeof value !== "object") return false
  const entry = value as Partial<FieldEntry>
  return typeof entry.id === "string" && typeof entry.status === "string" && isFieldStatus(entry.status) && typeof entry.createdAt === "string"
}

export async function loadState(): Promise<FieldState> {
  const db = await openDb()
  try {
    const tx = db.transaction(["entries", "meta"], "readonly")
    const entries = (await requestToPromise(tx.objectStore("entries").getAll())).filter(isEntry)
    const repName = await requestToPromise(tx.objectStore("meta").get("repName"))
    const lastIndustry = await requestToPromise(tx.objectStore("meta").get("lastIndustry"))
    await transactionDone(tx)
    return {
      entries,
      repName: typeof repName === "string" ? repName : "",
      lastIndustry: typeof lastIndustry === "string" ? lastIndustry : "",
    }
  } finally {
    db.close()
  }
}

function transactionDone(tx: IDBTransaction) {
  return new Promise<void>((resolve, reject) => {
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error ?? new Error("Storage transaction failed."))
    tx.onabort = () => reject(tx.error ?? new Error("Storage transaction aborted."))
  })
}

export async function saveEntry(entry: FieldEntry) {
  const db = await openDb()
  try {
    const tx = db.transaction("entries", "readwrite")
    tx.objectStore("entries").put(entry)
    await transactionDone(tx)
  } finally {
    db.close()
  }
}

export async function deleteEntry(id: string) {
  const db = await openDb()
  try {
    const tx = db.transaction("entries", "readwrite")
    tx.objectStore("entries").delete(id)
    await transactionDone(tx)
  } finally {
    db.close()
  }
}

export async function saveMeta(key: "repName" | "lastIndustry", value: string) {
  const db = await openDb()
  try {
    const tx = db.transaction("meta", "readwrite")
    tx.objectStore("meta").put(value, key)
    await transactionDone(tx)
  } finally {
    db.close()
  }
}

export async function clearAll() {
  const db = await openDb()
  try {
    const tx = db.transaction(["entries", "meta"], "readwrite")
    tx.objectStore("entries").clear()
    tx.objectStore("meta").clear()
    await transactionDone(tx)
  } finally {
    db.close()
  }
}
