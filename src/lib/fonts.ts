import { Instrument_Serif } from "next/font/google"
import { GeistMono } from "geist/font/mono"
import { GeistSans } from "geist/font/sans"

import { cn } from "@/lib/utils"

const fontSans = GeistSans

const fontMono = GeistMono

// The display face: a narrow, light serif set large and in lowercase for heads.
const fontDisplay = Instrument_Serif({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-instrument-serif",
})

export const fontVariables = cn(
  fontSans.variable,
  fontMono.variable,
  fontDisplay.variable,
  "[--font-display:var(--font-instrument-serif)] [--font-mono:var(--font-geist-mono)] [--font-sans:var(--font-geist-sans)]"
)
