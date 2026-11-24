const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function formatDate(iso: string | null | undefined) {
  if (!iso) return "Date TBD";
  const [year, month, day] = iso.slice(0, 10).split("-");
  const monthIndex = Number(month) - 1;
  if (!year || !day || monthIndex < 0 || monthIndex > 11) return iso;
  return `${MONTHS[monthIndex]} ${Number(day)}, ${year}`;
}

export function one(value: string | string[] | undefined) {
  if (Array.isArray(value)) return value[0] ?? "";
  return value ?? "";
}

export function slugify(value: string) {
  return (
    value
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/&/g, " and ")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 80) || "item"
  );
}

export function countryLabel(code: string) {
  if (code === "EG") return "Egypt";
  if (code === "BZ") return "Belize";
  if (code === "OTHER") return "Other";
  return code;
}

export function siteUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL || "http://127.0.0.1:43124").replace(/\/$/, "");
}

export function jsonStrings(value: unknown) {
  if (typeof value !== "string" || !value) return [];
  try {
    const parsed = JSON.parse(value) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.map((item) => String(item).trim()).filter(Boolean);
  } catch {
    return [];
  }
}
