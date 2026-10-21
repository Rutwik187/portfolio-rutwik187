import { ImageResponse } from "next/og"

export const size = { width: 180, height: 180 }
export const contentType = "image/png"

export default function AppleIcon() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#0c0a09",
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 32 32"
        width={120}
        height={120}
      >
        <path
          d="M9.5 10.5 15 16l-5.5 5.5"
          stroke="#fafaf9"
          strokeWidth="2.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <path
          d="M17.5 21.5h6"
          stroke="#fb923c"
          strokeWidth="2.75"
          strokeLinecap="round"
        />
      </svg>
    </div>,
    size
  )
}
