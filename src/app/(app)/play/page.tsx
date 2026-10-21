import type { Metadata } from "next"

import { SnakeGame } from "@/components/snake-game"
import {
  Panel,
  PanelContent,
  PanelHeader,
  PanelTitle,
} from "@/features/portfolio/components/panel"

const title = "Snake"
const description =
  "Feed the snake. Every bite turns a square of the board into a contribution."

const ogImage = `/og/simple?title=${encodeURIComponent("snake.exe")}&description=${encodeURIComponent(description)}`

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: "/play",
  },
  openGraph: {
    url: "/play",
    type: "website",
    images: {
      url: ogImage,
      width: 1200,
      height: 630,
      alt: title,
    },
  },
  twitter: {
    card: "summary_large_image",
    images: [ogImage],
  },
}

export default function PlayPage() {
  return (
    <div className="mx-auto md:max-w-3xl">
      <div className="ruler-divider h-8 border-x" aria-hidden />

      <Panel>
        <PanelHeader>
          <PanelTitle as="h1">
            snake<span className="text-brand">.exe</span>
          </PanelTitle>
        </PanelHeader>

        <PanelContent className="space-y-1 text-muted-foreground">
          <p className="text-balance">
            I built my first Snake game back in 2021. This one eats squares on a
            contribution graph instead of apples.
          </p>
          <p className="text-sm">
            Arrow keys or WASD to steer, Space to pause. On a phone, swipe or
            use the buttons.
          </p>
        </PanelContent>
      </Panel>

      <Panel className="py-4">
        <h2 className="sr-only">Game</h2>
        <SnakeGame />
      </Panel>
    </div>
  )
}
