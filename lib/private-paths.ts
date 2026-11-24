export const PRIVATE_PREFIXES = ["/admin", "/training", "/library"] as const

export function isPrivatePath(pathname: string) {
  return PRIVATE_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`))
}
