import Image from "next/image"
import { hashString } from "@/lib/hash"

const palette = ["#234237", "#8c3e14", "#3d4a34", "#1a1714", "#6a4b12"]

export function Avatar({
  name,
  photo,
  size = 56,
}: {
  name: string
  photo?: string | null
  size?: number
}) {
  if (photo) {
    return (
      <Image
        src={photo}
        alt=""
        width={size}
        height={size}
        unoptimized
        className="rounded-full object-cover"
        style={{ width: size, height: size }}
      />
    )
  }

  const initials = name
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()
  const background = palette[hashString(name) % palette.length]

  return (
    <span
      aria-hidden
      className="inline-flex shrink-0 items-center justify-center rounded-full font-medium text-[#f6f3ec]"
      style={{ width: size, height: size, background, fontSize: Math.round(size * 0.32) }}
    >
      {initials}
    </span>
  )
}
