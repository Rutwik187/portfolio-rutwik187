import { Kalam } from "next/font/google"
import { GeistMono } from "geist/font/mono"
import { GeistSans } from "geist/font/sans"

import { cn } from "@/lib/utils"

const fontSans = GeistSans

const fontMono = GeistMono

// Kalam is drawn by the Indian Type Foundry and covers Devanagari too, so the
// Marathi greeting and the Latin notes share one handwriting.
const fontHandwritten = Kalam({
  weight: ["400", "700"],
  subsets: ["latin", "devanagari"],
  display: "swap",
  variable: "--font-handwritten",
})

export const fontVariables = cn(
  fontSans.variable,
  fontMono.variable,
  fontHandwritten.variable,
  "[--font-mono:var(--font-geist-mono)] [--font-sans:var(--font-geist-sans)]"
)
