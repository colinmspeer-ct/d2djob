#!/usr/bin/env python3
"""Rasterize the D2D door mark into the field-app PNG icons."""

import math
import struct
import zlib
from pathlib import Path

GREEN = (0x23, 0x42, 0x37, 255)
CREAM = (0xF6, 0xF3, 0xEC, 255)
CLAY = (0xC4, 0x50, 0x1A, 255)
CLEAR = (0, 0, 0, 0)


def chunk(tag: bytes, data: bytes) -> bytes:
    return struct.pack(">I", len(data)) + tag + data + struct.pack(">I", zlib.crc32(tag + data) & 0xFFFFFFFF)


def write_png(path: Path, size: int, rgba: bytes) -> None:
    raw = b"".join(b"\x00" + rgba[y * size * 4 : (y + 1) * size * 4] for y in range(size))
    ihdr = struct.pack(">IIBBBBB", size, size, 8, 6, 0, 0, 0)
    png = b"\x89PNG\r\n\x1a\n" + chunk(b"IHDR", ihdr) + chunk(b"IDAT", zlib.compress(raw, 9)) + chunk(b"IEND", b"")
    path.write_bytes(png)


def door_points():
    points = [(9.0, 7.5), (18.2, 7.5)]
    for step in range(1, 9):
        angle = math.radians(90 * step / 8)
        points.append((18.2 + 3.8 * math.sin(angle), 11.3 - 3.8 * math.cos(angle)))
    points.append((22.0, 25.0))
    points.append((13.2, 25.0))
    for step in range(1, 9):
        angle = math.radians(90 * step / 8)
        points.append((13.2 - 4.2 * math.sin(angle), 20.8 + 4.2 * math.cos(angle)))
    return points


DOOR = door_points()


def contains(x: float, y: float, polygon) -> bool:
    inside = False
    x1, y1 = polygon[-1]
    for x2, y2 in polygon:
        if ((y2 > y) != (y1 > y)) and (x < (x1 - x2) * (y - y2) / (y1 - y2 + 1e-12) + x2):
            inside = not inside
        x1, y1 = x2, y2
    return inside


def segment_distance(px: float, py: float, ax: float, ay: float, bx: float, by: float) -> float:
    dx, dy = bx - ax, by - ay
    length = dx * dx + dy * dy
    if length == 0:
        return math.hypot(px - ax, py - ay)
    t = max(0.0, min(1.0, ((px - ax) * dx + (py - ay) * dy) / length))
    return math.hypot(px - (ax + t * dx), py - (ay + t * dy))


def rounded_contains(px: float, py: float, size: float, radius: float) -> bool:
    cx = min(max(px, radius), size - radius)
    cy = min(max(py, radius), size - radius)
    return (px - cx) ** 2 + (py - cy) ** 2 <= radius * radius


def sample(px: float, py: float, size: int, style: str):
    if style == "any":
        if not rounded_contains(px, py, size, size * (8 / 32)):
            return CLEAR
        vx = px / size * 32
        vy = py / size * 32
        background = GREEN
    else:
        background = GREEN
        mark = size * 0.62
        origin = (size - mark) / 2
        vx = (px - origin) / mark * 32
        vy = (py - origin) / mark * 32
    if contains(vx, vy, DOOR):
        color = CREAM
    else:
        color = background
    fold = min(
        segment_distance(vx, vy, 18.2, 7.5, 18.2, 12.7),
        segment_distance(vx, vy, 18.2, 12.7, 22.0, 12.7),
    )
    if fold <= 0.85:
        color = CLAY
    return color


def render(size: int, style: str) -> bytes:
    scale = 3
    big = size * scale
    samples = [sample((x + 0.5) / scale, (y + 0.5) / scale, size, style) for y in range(big) for x in range(big)]
    out = bytearray(size * size * 4)
    area = scale * scale
    for y in range(size):
        for x in range(size):
            red = green = blue = alpha = 0
            for dy in range(scale):
                for dx in range(scale):
                    pixel = samples[(y * scale + dy) * big + (x * scale + dx)]
                    red += pixel[0]
                    green += pixel[1]
                    blue += pixel[2]
                    alpha += pixel[3]
            index = (y * size + x) * 4
            out[index : index + 4] = bytes((red // area, green // area, blue // area, alpha // area))
    return bytes(out)


def main() -> None:
    root = Path(__file__).resolve().parents[1] / "public" / "app" / "field"
    root.mkdir(parents=True, exist_ok=True)
    icons = {
        "icon-192.png": (192, "any"),
        "icon-512.png": (512, "any"),
        "icon-maskable-512.png": (512, "maskable"),
        "apple-touch-icon.png": (180, "apple"),
    }
    for name, (size, style) in icons.items():
        write_png(root / name, size, render(size, style))
        print(name, size)


if __name__ == "__main__":
    main()
