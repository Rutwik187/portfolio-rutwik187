"use client"

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react"
import {
  ArrowDownIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  ArrowUpIcon,
  PauseIcon,
  PlayIcon,
  RotateCcwIcon,
} from "lucide-react"

import { trackEvent } from "@/lib/events"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const COLS = 21
const ROWS = 15
const START_SPEED_MS = 140
const MIN_SPEED_MS = 70
const BEST_SCORE_KEY = "snake-best-score"
const BEST_SCORE_EVENT = "snake-best-score-change"

type Point = { x: number; y: number }
type Direction = "up" | "down" | "left" | "right"
type Status = "idle" | "running" | "paused" | "over"

const VECTORS: Record<Direction, Point> = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
}

const OPPOSITE: Record<Direction, Direction> = {
  up: "down",
  down: "up",
  left: "right",
  right: "left",
}

const KEY_TO_DIRECTION: Record<string, Direction> = {
  arrowup: "up",
  w: "up",
  arrowdown: "down",
  s: "down",
  arrowleft: "left",
  a: "left",
  arrowright: "right",
  d: "right",
}

const GAME_OVER_LINES = [
  "The snake ate itself. Classic.",
  "Segfault. Well, snake-fault.",
  "That wall was not in the spec.",
  "Ctrl+Z does not work here. Try again.",
]

function randomFreeCell(snake: Point[]): Point {
  while (true) {
    const point = {
      x: Math.floor(Math.random() * COLS),
      y: Math.floor(Math.random() * ROWS),
    }
    if (!snake.some((s) => s.x === point.x && s.y === point.y)) {
      return point
    }
  }
}

function initialSnake(): Point[] {
  const y = Math.floor(ROWS / 2)
  return [
    { x: 6, y },
    { x: 5, y },
    { x: 4, y },
  ]
}

function readBestScore() {
  try {
    return Number(localStorage.getItem(BEST_SCORE_KEY)) || 0
  } catch {
    return 0
  }
}

function writeBestScore(score: number) {
  try {
    localStorage.setItem(BEST_SCORE_KEY, String(score))
  } catch {
    // Private mode or blocked storage: the best score just will not persist.
  }
  window.dispatchEvent(new Event(BEST_SCORE_EVENT))
}

function subscribeBestScore(onChange: () => void) {
  window.addEventListener("storage", onChange)
  window.addEventListener(BEST_SCORE_EVENT, onChange)
  return () => {
    window.removeEventListener("storage", onChange)
    window.removeEventListener(BEST_SCORE_EVENT, onChange)
  }
}

/**
 * Snake on a contribution graph: every bite turns that square a little more
 * saffron, so a long game paints a busy year of commits.
 */
export function SnakeGame({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const snakeRef = useRef<Point[]>(initialSnake())
  const foodRef = useRef<Point>({ x: 14, y: Math.floor(ROWS / 2) })
  const directionRef = useRef<Direction>("right")
  const queuedRef = useRef<Direction[]>([])
  const contributionsRef = useRef<number[]>(new Array(COLS * ROWS).fill(0))

  const [status, setStatus] = useState<Status>("idle")
  const [score, setScore] = useState(0)
  const scoreRef = useRef(0)
  const bestScore = useSyncExternalStore(
    subscribeBestScore,
    readBestScore,
    () => 0
  )
  const [message, setMessage] = useState("")

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")
    if (!canvas || !ctx) return

    const styles = getComputedStyle(document.documentElement)
    const color = (name: string) => styles.getPropertyValue(name).trim()

    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const width = canvas.clientWidth
    // A zero-width board (mid-layout or hidden) gives negative square sizes.
    if (width === 0) return
    const cell = width / COLS
    const height = cell * ROWS

    if (canvas.width !== Math.round(width * dpr)) {
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.clearRect(0, 0, width, height)

    const gap = Math.max(1.5, cell * 0.14)
    const size = cell - gap
    const radius = Math.min(3, size / 4)

    const square = (x: number, y: number, fill: string, alpha = 1) => {
      ctx.globalAlpha = alpha
      ctx.fillStyle = fill
      ctx.beginPath()
      ctx.roundRect(x * cell + gap / 2, y * cell + gap / 2, size, size, radius)
      ctx.fill()
      ctx.globalAlpha = 1
    }

    const muted = color("--muted-foreground")
    const brand = color("--brand")
    const foreground = color("--foreground")

    // The board itself: an empty contribution graph that fills up as you eat.
    contributionsRef.current.forEach((level, index) => {
      const x = index % COLS
      const y = Math.floor(index / COLS)
      if (level === 0) {
        square(x, y, muted, 0.08)
      } else {
        square(x, y, brand, Math.min(0.2 + level * 0.18, 0.9))
      }
    })

    const food = foodRef.current
    square(food.x, food.y, brand)

    snakeRef.current.forEach((part, index) => {
      square(part.x, part.y, foreground, index === 0 ? 1 : 0.75)
    })
  }, [])

  const reset = useCallback(() => {
    snakeRef.current = initialSnake()
    foodRef.current = randomFreeCell(snakeRef.current)
    directionRef.current = "right"
    queuedRef.current = []
    contributionsRef.current = new Array(COLS * ROWS).fill(0)
    scoreRef.current = 0
    setScore(0)
    setMessage("")
  }, [])

  const start = useCallback(() => {
    if (status === "over") reset()
    setStatus("running")
    containerRef.current?.focus({ preventScroll: true })
  }, [reset, status])

  const togglePause = useCallback(() => {
    setStatus((current) =>
      current === "running"
        ? "paused"
        : current === "paused"
          ? "running"
          : current
    )
  }, [])

  const steer = useCallback(
    (next: Direction) => {
      if (status === "idle" || status === "over") {
        start()
      }
      const queue = queuedRef.current
      const last = queue[queue.length - 1] ?? directionRef.current
      if (next !== last && next !== OPPOSITE[last] && queue.length < 3) {
        queue.push(next)
      }
    },
    [start, status]
  )

  // Game loop.
  useEffect(() => {
    if (status !== "running") {
      draw()
      return
    }

    const speed = Math.max(MIN_SPEED_MS, START_SPEED_MS - score * 3)

    const tick = setInterval(() => {
      const queued = queuedRef.current.shift()
      if (queued) directionRef.current = queued

      const snake = snakeRef.current
      const vector = VECTORS[directionRef.current]
      const head = { x: snake[0].x + vector.x, y: snake[0].y + vector.y }

      const hitWall =
        head.x < 0 || head.y < 0 || head.x >= COLS || head.y >= ROWS
      const hitSelf = snake.some((s) => s.x === head.x && s.y === head.y)

      if (hitWall || hitSelf) {
        setStatus("over")
        setMessage(
          GAME_OVER_LINES[Math.floor(Math.random() * GAME_OVER_LINES.length)]
        )
        const final = scoreRef.current
        trackEvent({ name: "snake_game_over", properties: { score: final } })
        if (final > readBestScore()) {
          writeBestScore(final)
        }
        return
      }

      const ate = head.x === foodRef.current.x && head.y === foodRef.current.y
      const next = [head, ...snake]

      if (ate) {
        const index = head.y * COLS + head.x
        contributionsRef.current[index] = Math.min(
          contributionsRef.current[index] + 1,
          4
        )
        foodRef.current = randomFreeCell(next)
        scoreRef.current += 1
        setScore(scoreRef.current)
      } else {
        next.pop()
      }

      snakeRef.current = next
      draw()
    }, speed)

    return () => clearInterval(tick)
  }, [draw, score, status])

  // Redraw on resize and theme change so the canvas stays crisp and on-palette.
  useEffect(() => {
    const observer = new ResizeObserver(() => draw())
    if (canvasRef.current) observer.observe(canvasRef.current)

    const themeObserver = new MutationObserver(() => draw())
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    })

    return () => {
      observer.disconnect()
      themeObserver.disconnect()
    }
  }, [draw])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const key = e.key.toLowerCase()
    const direction = KEY_TO_DIRECTION[key]

    if (direction) {
      e.preventDefault()
      steer(direction)
      return
    }

    if (key === " " || key === "enter") {
      e.preventDefault()
      if (status === "running" || status === "paused") togglePause()
      else start()
    }
  }

  // Swipe to steer on touch screens.
  const touchStart = useRef<Point | null>(null)

  const handleTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0]
    touchStart.current = { x: t.clientX, y: t.clientY }
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    const from = touchStart.current
    touchStart.current = null
    if (!from) return
    const t = e.changedTouches[0]
    const dx = t.clientX - from.x
    const dy = t.clientY - from.y
    if (Math.max(Math.abs(dx), Math.abs(dy)) < 24) return
    steer(
      Math.abs(dx) > Math.abs(dy)
        ? dx > 0
          ? "right"
          : "left"
        : dy > 0
          ? "down"
          : "up"
    )
  }

  const statusText =
    status === "idle"
      ? "Press Space, an arrow key, or Start."
      : status === "paused"
        ? "Paused. Chai break?"
        : status === "over"
          ? message
          : "Eat the saffron squares."

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <div className="flex items-center justify-between gap-4 px-4 font-mono text-sm">
        <p>
          score <span className="text-brand-strong tabular-nums">{score}</span>
        </p>
        <p className="text-muted-foreground">
          best <span className="text-foreground tabular-nums">{bestScore}</span>
        </p>
      </div>

      <div
        ref={containerRef}
        tabIndex={0}
        role="application"
        aria-label="Snake game. Use the arrow keys to steer and Space to pause."
        onKeyDown={handleKeyDown}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="relative mx-4 touch-none rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-brand/60"
      >
        <canvas
          ref={canvasRef}
          className="block aspect-21/15 w-full"
          aria-hidden
        />

        {status !== "running" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-lg bg-background/70 backdrop-blur-[2px]">
            {status === "over" && (
              <p className="font-mono text-2xl font-medium">game over</p>
            )}
            <Button
              size="sm"
              onClick={status === "paused" ? togglePause : start}
            >
              {status === "over" ? <RotateCcwIcon /> : <PlayIcon />}
              {status === "over"
                ? "Play again"
                : status === "paused"
                  ? "Resume"
                  : "Start"}
            </Button>
          </div>
        )}
      </div>

      <p
        className="px-4 text-center text-sm text-muted-foreground"
        aria-live="polite"
      >
        {statusText}
      </p>

      {/* On-screen controls for phones; keyboards have arrow keys. */}
      <div className="grid grid-cols-3 gap-2 self-center pointer-fine:hidden">
        <span />
        <ControlButton label="Up" onPress={() => steer("up")}>
          <ArrowUpIcon />
        </ControlButton>
        <span />
        <ControlButton label="Left" onPress={() => steer("left")}>
          <ArrowLeftIcon />
        </ControlButton>
        <ControlButton
          label={status === "running" ? "Pause" : "Play"}
          onPress={status === "running" ? togglePause : start}
        >
          {status === "running" ? <PauseIcon /> : <PlayIcon />}
        </ControlButton>
        <ControlButton label="Right" onPress={() => steer("right")}>
          <ArrowRightIcon />
        </ControlButton>
        <span />
        <ControlButton label="Down" onPress={() => steer("down")}>
          <ArrowDownIcon />
        </ControlButton>
        <span />
      </div>
    </div>
  )
}

function ControlButton({
  label,
  onPress,
  children,
}: {
  label: string
  onPress: () => void
  children: React.ReactNode
}) {
  return (
    <Button
      variant="outline"
      size="icon-lg"
      aria-label={label}
      onPointerDown={(e) => {
        e.preventDefault()
        onPress()
      }}
    >
      {children}
    </Button>
  )
}
