import { readFileSync } from "node:fs"
import { join } from "node:path"
import { ImageResponse } from "next/og"

import { USER } from "@/features/portfolio/data/user"

import { clampParam } from "../params"

const geistSemiBold = readFileSync(
  join(process.cwd(), "src/assets/fonts/Geist-SemiBold.ttf")
)

const geistMonoRegular = readFileSync(
  join(process.cwd(), "src/assets/fonts/GeistMono-Regular.ttf")
)

const SAFFRON = "#fb923c"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)

  const title = clampParam(searchParams.get("title"), 160, USER.displayName)
  const description = clampParam(searchParams.get("description"), 320, USER.bio)

  return new ImageResponse(
    <div
      tw="flex h-full w-full flex-col justify-between p-18"
      style={{ backgroundColor: "#0c0a09", color: "#fafaf9" }}
    >
      <div tw="flex items-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 32 32"
          width={72}
          height={72}
        >
          <rect width="32" height="32" rx="8" fill="#fafaf9" />
          <path
            d="M9.5 10.5 15 16l-5.5 5.5"
            stroke="#0c0a09"
            strokeWidth="2.75"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          <path
            d="M17.5 21.5h6"
            stroke={SAFFRON}
            strokeWidth="2.75"
            strokeLinecap="round"
          />
        </svg>
        <div
          tw="ml-6 flex"
          style={{ fontFamily: "GeistMono", fontSize: 30, color: "#a8a29e" }}
        >
          <span style={{ color: SAFFRON }}>rutwik@pune</span>:~$ whoami
        </div>
      </div>

      <div tw="flex flex-col">
        <div
          style={{
            fontFamily: "GeistSans",
            fontWeight: 600,
            fontSize: 76,
            lineHeight: 1.05,
            textWrap: "balance",
            letterSpacing: "-0.03em",
          }}
        >
          {title}
        </div>

        {description && (
          <div
            tw="mt-6"
            style={{
              fontFamily: "GeistMono",
              fontSize: 30,
              lineHeight: 1.35,
              textWrap: "balance",
              color: "#a8a29e",
            }}
          >
            {description}
          </div>
        )}

        <div
          tw="mt-12 flex h-6 w-full"
          style={{
            backgroundImage: `linear-gradient(to right, ${SAFFRON} 2px, transparent 2px), linear-gradient(to right, #44403c 2px, transparent 2px)`,
            backgroundSize: "96px 100%, 16px 50%",
            backgroundRepeat: "repeat-x",
            backgroundPosition: "0 100%, 0 100%",
          }}
        />
      </div>
    </div>,
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: "GeistSans",
          data: geistSemiBold,
          weight: 600,
        },
        {
          name: "GeistMono",
          data: geistMonoRegular,
          weight: 400,
        },
      ],
      headers: {
        "Cache-Control": "public, max-age=3600, s-maxage=31536000, immutable",
      },
    }
  )
}
