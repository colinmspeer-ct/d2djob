import { emptyField, normalizeField, type FieldData } from "@/lib/field/records"

const DB_NAME = "d2d-field"
const DB_VERSION = 1
const STORE = "kv"
const DATA_KEY = "data"
const LOCAL_KEY = "d2d-field-v1"

function openDb() {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)
    request.onupgradeneeded = () => {
      const db = request.result
      if (!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE)
    }
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error ?? new Error("Could not open storage"))
  })
}

function idbGet(db: IDBDatabase) {
  return new Promise<unknown>((resolve, reject) => {
    const request = db.transaction(STORE, "readonly").objectStore(STORE).get(DATA_KEY)
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error ?? new Error("Could not read storage"))
  })
}

function idbSet(db: IDBDatabase, value: FieldData) {
  return new Promise<void>((resolve, reject) => {
    const request = db.transaction(STORE, "readwrite").objectStore(STORE).put(value, DATA_KEY)
    request.onsuccess = () => resolve()
    request.onerror = () => reject(request.error ?? new Error("Could not write storage"))
  })
}

function idbDelete(db: IDBDatabase) {
  return new Promise<void>((resolve, reject) => {
    const request = db.transaction(STORE, "readwrite").objectStore(STORE).delete(DATA_KEY)
    request.onsuccess = () => resolve()
    request.onerror = () => reject(request.error ?? new Error("Could not clear storage"))
  })
}

function readLocal() {
  try {
    const raw = localStorage.getItem(LOCAL_KEY)
    if (!raw) return null
    return normalizeField(JSON.parse(raw) as unknown)
  } catch {
    return null
  }
}

export async function loadField(): Promise<FieldData> {
  try {
    const db = await openDb()
    const stored = await idbGet(db)
    if (stored) return normalizeField(stored)
  } catch {
    return readLocal() ?? emptyField()
  }
  const fallback = readLocal()
  if (fallback && (fallback.leads.length > 0 || fallback.repName)) {
    await saveField(fallback).catch(() => undefined)
    return fallback
  }
  return emptyField()
}

export async function saveField(data: FieldData) {
  const normalized = normalizeField(data)
  try {
    const db = await openDb()
    await idbSet(db, normalized)
    localStorage.removeItem(LOCAL_KEY)
  } catch {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(normalized))
  }
}

export async function clearField() {
  try {
    const db = await openDb()
    await idbDelete(db)
  } catch {
    // IndexedDB may be blocked. The local copy is still removed below.
  }
  try {
    localStorage.removeItem(LOCAL_KEY)
  } catch {
    // Private mode can throw. There is nowhere else for the data to sit.
  }
}
