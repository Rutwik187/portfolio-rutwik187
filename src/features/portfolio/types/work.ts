import type { StaticImageData } from "next/image"

export type Device = "desktop" | "phone"

export type Shot = {
  src: StaticImageData
  alt: string
  caption: string
  device: Device
}

export type WorkLink = {
  label: string
  href: string
}

export type WorkStep = {
  title: string
  detail: string
}

export type Work = {
  id: string
  title: string
  client: string
  /** Short product type for the list: "Web", "Mobile" or "AI". */
  kind: string
  year: string
  role?: string
  /** One line for the list. */
  summary: string
  /** A short paragraph for the details dialog. */
  description: string
  highlights: string[]
  /** Optional step-by-step lanes, for example how a RAG pipeline runs. */
  process?: {
    title: string
    lanes: { title: string; steps: WorkStep[] }[]
  }
  stack: string[]
  links: WorkLink[]
  /** Two colours for the gradient behind the hover preview. */
  accent: { from: string; to: string }
  /** The hover preview: one desktop screenshot, or two phone screenshots. */
  cover: { device: Device; images: StaticImageData[] }
  /** Every screenshot in the details dialog, in order. */
  shots: Shot[]
}
