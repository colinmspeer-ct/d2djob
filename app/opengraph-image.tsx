import { ImageResponse } from "next/og";

export const alt = "D2D Job — door-to-door sales reps";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#f3efe6",
          color: "#1a1714",
          padding: "72px",
        }}
      >
        <div style={{ display: "flex", fontSize: 28, letterSpacing: 2 }}>D2D JOB · SWYFT MARKETING</div>
        <div style={{ display: "flex", fontSize: 68, lineHeight: 1.05, maxWidth: 900 }}>
          Meet the reps. The name stays off the page.
        </div>
        <div style={{ display: "flex", fontSize: 28, color: "#5c564c" }}>Door-to-door sales recruiting</div>
      </div>
    ),
    { ...size },
  );
}
