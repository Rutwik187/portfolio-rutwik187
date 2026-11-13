/**
 * The forms the hero's particles assemble into: a web app, a mobile app and
 * an AI agent. Each form is drawn from simple parts (lines, rounded boxes,
 * rings, balls) and sampled into exactly `count` points, so every particle
 * has a place in every form.
 *
 * Forms sit in a box about one unit tall, centred on the origin. UI layers
 * sit at different depths, so the forms read as exploded 3D views when they
 * turn.
 */

export type Point = [number, number, number]

export type FieldForm = {
  /** x, y and z for each particle. */
  positions: Float32Array
  /** 1 where the particle takes the brand colour, else 0. */
  accents: Float32Array
}

export type FormId = "web" | "mobile" | "agent"

export const FORM_IDS: FormId[] = ["web", "mobile", "agent"]

type Random = () => number

type Part = {
  /** How many particles the part gets, relative to the other parts. */
  weight: number
  accent: boolean
  sample: (random: Random) => Point
}

type PartOptions = {
  /** Particles per unit of length or area. */
  density?: number
  accent?: boolean
}

/** A small seeded random generator, so the forms are the same on every load. */
export function createRandom(seed: number): Random {
  let state = seed >>> 0
  return () => {
    state = (state + 0x6d2b79f5) >>> 0
    let t = state
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function line(a: Point, b: Point, options: PartOptions = {}): Part {
  const length = Math.hypot(b[0] - a[0], b[1] - a[1], b[2] - a[2])
  return {
    weight: length * (options.density ?? 1),
    accent: options.accent ?? false,
    sample: (random) => {
      const t = random()
      return [
        a[0] + (b[0] - a[0]) * t,
        a[1] + (b[1] - a[1]) * t,
        a[2] + (b[2] - a[2]) * t,
      ]
    },
  }
}

/** A polyline through the points, sampled evenly along its length. */
function path(points: Point[], options: PartOptions = {}): Part[] {
  return points
    .slice(1)
    .map((point, index) => line(points[index], point, options))
}

/** The outline of a rounded rectangle facing the camera. */
function box(
  cx: number,
  cy: number,
  z: number,
  width: number,
  height: number,
  radius: number,
  options: PartOptions = {}
): Part {
  const r = Math.min(radius, width / 2, height / 2)
  const straightX = width - 2 * r
  const straightY = height - 2 * r
  const arc = (Math.PI * r) / 2
  const perimeter = 2 * straightX + 2 * straightY + 4 * arc
  const left = cx - width / 2
  const right = cx + width / 2
  const top = cy + height / 2
  const bottom = cy - height / 2

  return {
    weight: perimeter * (options.density ?? 1),
    accent: options.accent ?? false,
    sample: (random) => {
      let s = random() * perimeter
      // Top, right, bottom and left edges, each followed by its corner.
      const edges: Array<[number, (t: number) => [number, number]]> = [
        [straightX, (t) => [left + r + t * straightX, top]],
        [
          arc,
          (t) => corner(right - r, top - r, Math.PI / 2 - t * (Math.PI / 2)),
        ],
        [straightY, (t) => [right, top - r - t * straightY]],
        [arc, (t) => corner(right - r, bottom + r, -t * (Math.PI / 2))],
        [straightX, (t) => [right - r - t * straightX, bottom]],
        [
          arc,
          (t) => corner(left + r, bottom + r, -Math.PI / 2 - t * (Math.PI / 2)),
        ],
        [straightY, (t) => [left, bottom + r + t * straightY]],
        [arc, (t) => corner(left + r, top - r, Math.PI - t * (Math.PI / 2))],
      ]
      for (const [length, at] of edges) {
        if (s <= length) {
          const [x, y] = at(length === 0 ? 0 : s / length)
          return [x, y, z]
        }
        s -= length
      }
      // Rounding can leave s a hair past the end: that is the start point.
      return [left + r, top, z]
    },
  }

  function corner(x: number, y: number, angle: number): [number, number] {
    return [x + Math.cos(angle) * r, y + Math.sin(angle) * r]
  }
}

/** A filled rectangle facing the camera, for blocks of text or images. */
function fill(
  cx: number,
  cy: number,
  z: number,
  width: number,
  height: number,
  options: PartOptions = {}
): Part {
  return {
    weight: width * height * 10 * (options.density ?? 1),
    accent: options.accent ?? false,
    sample: (random) => [
      cx + (random() - 0.5) * width,
      cy + (random() - 0.5) * height,
      z,
    ],
  }
}

/** A circle outline facing the camera. */
function ring(
  cx: number,
  cy: number,
  z: number,
  radius: number,
  options: PartOptions = {}
): Part {
  return {
    weight: 2 * Math.PI * radius * (options.density ?? 1),
    accent: options.accent ?? false,
    sample: (random) => {
      const angle = random() * Math.PI * 2
      return [cx + Math.cos(angle) * radius, cy + Math.sin(angle) * radius, z]
    },
  }
}

/** A small solid ball, for the nodes of a network. */
function ball(
  center: Point,
  radius: number,
  weight: number,
  accent = false
): Part {
  return {
    weight,
    accent,
    sample: (random) => {
      // A point on the sphere, pulled slightly inward so the ball reads solid.
      const u = random() * 2 - 1
      const angle = random() * Math.PI * 2
      const s = Math.sqrt(1 - u * u)
      const depth = radius * (0.7 + 0.3 * Math.cbrt(random()))
      return [
        center[0] + s * Math.cos(angle) * depth,
        center[1] + s * Math.sin(angle) * depth,
        center[2] + u * depth,
      ]
    },
  }
}

/** Shares `count` particles across the parts by weight, then samples them. */
export function sampleParts(
  parts: Part[],
  count: number,
  random: Random
): FieldForm {
  const positions = new Float32Array(count * 3)
  const accents = new Float32Array(count)
  const total = parts.reduce((sum, part) => sum + part.weight, 0)

  const quotas = parts.map((part) => (part.weight / total) * count)
  const counts = quotas.map(Math.floor)
  let left = count - counts.reduce((sum, n) => sum + n, 0)
  // Give the particles that rounding dropped to the largest remainders.
  const byRemainder = quotas
    .map((quota, index) => ({ index, rest: quota - Math.floor(quota) }))
    .sort((a, b) => b.rest - a.rest)
  for (let i = 0; left > 0; i = (i + 1) % byRemainder.length, left--) {
    counts[byRemainder[i].index]++
  }

  let cursor = 0
  parts.forEach((part, index) => {
    for (let i = 0; i < counts[index]; i++) {
      const [x, y, z] = part.sample(random)
      positions[cursor * 3] = x
      positions[cursor * 3 + 1] = y
      positions[cursor * 3 + 2] = z
      accents[cursor] = part.accent ? 1 : 0
      cursor++
    }
  })

  return { positions, accents }
}

/** A browser window, its UI pulled apart into layers. */
function webAppParts(): Part[] {
  const frameZ = -0.1
  const baseZ = -0.02
  const cardZ = 0.08
  const floatZ = 0.2

  const sidebarItems = [0.16, 0.2, 0.12, 0.18, 0.15, 0.1]
  const bars = [0.07, 0.12, 0.09, 0.16, 0.13]
  const chart: Point[] = [
    [0.4, -0.33, floatZ],
    [0.46, -0.27, floatZ],
    [0.51, -0.3, floatZ],
    [0.57, -0.2, floatZ],
    [0.62, -0.23, floatZ],
    [0.67, -0.13, floatZ],
  ]

  return [
    // The window and its bar.
    box(0, 0, frameZ, 1.5, 1, 0.05, { density: 2.4 }),
    line([-0.75, 0.38, frameZ], [0.75, 0.38, frameZ], { density: 1.2 }),
    ring(-0.68, 0.44, frameZ, 0.014, { density: 4, accent: true }),
    ring(-0.635, 0.44, frameZ, 0.014, { density: 4 }),
    ring(-0.59, 0.44, frameZ, 0.014, { density: 4 }),
    box(0.06, 0.44, frameZ, 0.62, 0.04, 0.02, { density: 1.3 }),
    line([-0.47, 0.38, frameZ], [-0.47, -0.5, frameZ], { density: 0.9 }),

    // The sidebar, with the open page marked.
    ...sidebarItems.map((length, i) =>
      line(
        [-0.69, 0.3 - i * 0.08, baseZ],
        [-0.69 + length, 0.3 - i * 0.08, baseZ],
        {
          density: 1.1,
        }
      )
    ),
    box(-0.6, 0.22, baseZ, 0.24, 0.05, 0.025, { density: 1.6, accent: true }),

    // The hero card: a head, a line, a button and an image.
    box(0.14, 0.2, cardZ, 1.08, 0.27, 0.03, { density: 1.6 }),
    fill(-0.13, 0.26, cardZ, 0.4, 0.022, { density: 3 }),
    line([-0.33, 0.19, cardZ], [-0.02, 0.19, cardZ], { density: 1 }),
    box(-0.25, 0.12, cardZ, 0.16, 0.04, 0.02, { density: 2.2, accent: true }),
    fill(0.47, 0.2, cardZ + 0.04, 0.34, 0.2, { density: 0.45 }),

    // Three cards floating in front: text, a bar chart and a line chart.
    ...[-0.25, 0.14, 0.53].map((x) =>
      box(x, -0.22, floatZ, 0.35, 0.38, 0.03, { density: 1.5 })
    ),
    line([-0.39, -0.1, floatZ], [-0.16, -0.1, floatZ], { density: 1.4 }),
    line([-0.39, -0.16, floatZ], [-0.11, -0.16, floatZ], { density: 0.9 }),
    line([-0.39, -0.21, floatZ], [-0.2, -0.21, floatZ], { density: 0.9 }),
    fill(-0.25, -0.33, floatZ, 0.27, 0.06, { density: 0.6 }),
    ...bars.map((height, i) =>
      line(
        [0.03 + i * 0.055, -0.36, floatZ],
        [0.03 + i * 0.055, -0.36 + height * 1.4, floatZ],
        { density: 2.6, accent: i === 3 }
      )
    ),
    ...path(chart, { density: 2.4, accent: true }),
  ]
}

/** A phone running an app, with a notification breaking out of the screen. */
function mobileAppParts(): Part[] {
  const bodyZ = -0.06
  const uiZ = 0.02
  const cardZ = 0.1
  const floatZ = 0.24

  return [
    // The body, the screen edge, the island and the buttons.
    box(0, 0, bodyZ, 0.52, 1, 0.075, { density: 2.8 }),
    box(0, 0, bodyZ, 0.48, 0.96, 0.06, { density: 0.7 }),
    fill(0, 0.44, bodyZ, 0.13, 0.028, { density: 3.2 }),
    line([0.262, 0.25, bodyZ], [0.262, 0.12, bodyZ], { density: 2 }),
    line([-0.262, 0.28, bodyZ], [-0.262, 0.21, bodyZ], { density: 2 }),
    line([-0.262, 0.17, bodyZ], [-0.262, 0.08, bodyZ], { density: 2 }),

    // The screen's head and line.
    fill(-0.09, 0.36, uiZ, 0.22, 0.022, { density: 3.2 }),
    line([-0.2, 0.31, uiZ], [0.06, 0.31, uiZ], { density: 1 }),

    // A feature card.
    box(0, 0.16, cardZ, 0.42, 0.18, 0.03, { density: 2, accent: true }),
    fill(0, 0.16, cardZ, 0.42, 0.18, { density: 0.3, accent: true }),

    // A list: an avatar and two lines per row.
    ...[0, 1, 2, 3].flatMap((i) => {
      const y = -0.01 - i * 0.095
      return [
        ring(-0.16, y, uiZ, 0.026, { density: 2.4 }),
        line([-0.11, y + 0.012, uiZ], [0.13, y + 0.012, uiZ], { density: 1 }),
        line([-0.11, y - 0.014, uiZ], [0.04, y - 0.014, uiZ], { density: 0.7 }),
      ]
    }),

    // The tab bar and the home indicator.
    line([-0.24, -0.39, uiZ], [0.24, -0.39, uiZ], { density: 0.7 }),
    ...[-0.15, -0.05, 0.05, 0.15].map((x, i) =>
      ring(x, -0.435, uiZ, 0.014, { density: 3, accent: i === 0 })
    ),
    line([-0.07, -0.48, uiZ], [0.07, -0.48, uiZ], { density: 2.4 }),

    // The notification.
    box(0.21, 0.3, floatZ, 0.34, 0.085, 0.035, { density: 2.2, accent: true }),
    ring(0.08, 0.3, floatZ, 0.016, { density: 3.4, accent: true }),
    line([0.115, 0.312, floatZ], [0.34, 0.312, floatZ], { density: 1.4 }),
    line([0.115, 0.287, floatZ], [0.27, 0.287, floatZ], { density: 1 }),
  ]
}

/**
 * A small neural network turned on its side: each layer is a ring of nodes,
 * so the net reads in depth as it turns. One path through it lights up.
 */
function agentParts(): Part[] {
  const layers = [
    { x: -0.62, nodes: 4, radius: 0.26 },
    { x: -0.21, nodes: 7, radius: 0.42 },
    { x: 0.21, nodes: 7, radius: 0.42 },
    { x: 0.62, nodes: 3, radius: 0.2 },
  ]
  const positions: Point[][] = layers.map((layer, l) =>
    Array.from({ length: layer.nodes }, (_, i) => {
      const angle = (i / layer.nodes) * Math.PI * 2 + l * 0.4
      return [
        layer.x,
        Math.sin(angle) * layer.radius,
        Math.cos(angle) * layer.radius * 0.85,
      ]
    })
  )
  const lit = [1, 3, 5, 0]

  const parts: Part[] = []
  positions.forEach((layer, l) => {
    const isOutput = l === positions.length - 1
    layer.forEach((node, i) => {
      parts.push(
        ball(
          node,
          isOutput ? 0.045 : 0.034,
          isOutput ? 0.8 : 0.55,
          isOutput || lit[l] === i
        )
      )
    })
    if (l === 0) return
    positions[l - 1].forEach((from, i) => {
      layer.forEach((to, j) => {
        const isLit = lit[l - 1] === i && lit[l] === j
        parts.push(
          line(from, to, { density: isLit ? 2.2 : 0.34, accent: isLit })
        )
      })
    })
  })
  return parts
}

const FORM_PARTS: Record<FormId, () => Part[]> = {
  web: webAppParts,
  mobile: mobileAppParts,
  agent: agentParts,
}

export function buildForm(id: FormId, count: number, seed = 7): FieldForm {
  return sampleParts(FORM_PARTS[id](), count, createRandom(seed))
}

/**
 * Where each particle drifts while the idea is still messy, and its seed:
 * x staggers its arrival, y sets its size, z is 0 for the cloud round the
 * form, 1 for a stray that roams the whole field, and 2 for dust that roams
 * and never joins a form, and w is 1 if it glows in the brand colour while it
 * drifts.
 */
export function buildChaos(count: number, seed = 11) {
  const random = createRandom(seed)
  const chaos = new Float32Array(count * 3)
  const seeds = new Float32Array(count * 4)

  const gaussian = () => {
    const u = Math.max(random(), 1e-6)
    const v = random()
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v)
  }

  for (let i = 0; i < count; i++) {
    const kind = random()
    const roams = kind < 0.34
    const isDust = kind < 0.1
    if (roams) {
      chaos[i * 3] = random() * 2 - 1
      chaos[i * 3 + 1] = random() * 2 - 1
      chaos[i * 3 + 2] = random() * 2 - 1
    } else {
      chaos[i * 3] = clamp(gaussian() * 0.55, -1.6, 1.6)
      chaos[i * 3 + 1] = clamp(gaussian() * 0.55, -1.6, 1.6)
      chaos[i * 3 + 2] = clamp(gaussian() * 0.55, -1.6, 1.6)
    }
    seeds[i * 4] = random()
    seeds[i * 4 + 1] = random()
    seeds[i * 4 + 2] = isDust ? 2 : roams ? 1 : 0
    seeds[i * 4 + 3] = random() < 0.07 ? 1 : 0
  }

  return { chaos, seeds }
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}
