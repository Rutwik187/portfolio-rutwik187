import {
  BoxGeometry,
  Color,
  DirectionalLight,
  HemisphereLight,
  InstancedMesh,
  Matrix4,
  Mesh,
  MeshStandardMaterial,
  OrthographicCamera,
  Quaternion,
  Raycaster,
  Scene,
  SRGBColorSpace,
  Vector2,
  Vector3,
  WebGLRenderer,
} from "three"

import { isDarkMode, readCssColor, type Rgb } from "@/lib/css-color"
import type { Activity } from "@/components/kit/contribution-graph"

/** The resting view: a little from the left, and from above. */
const AZIMUTH = -0.22
const ELEVATION = 0.62
const FOOTPRINT = 0.78
const MAX_HEIGHT = 6
const GROW_SECONDS = 1.8

export type SkylineHover = {
  activity: Activity
  /** Pointer position in canvas pixels. */
  x: number
  y: number
}

export type SkylineScene = {
  resize(width: number, height: number): void
  /** The pointer in canvas pixels, or null when it leaves. */
  setPointer(pointer: { x: number; y: number } | null): void
  /** Raises the bars from the ground, once. */
  grow(): void
  refreshColors(): void
  dispose(): void
}

/**
 * A year of commits as a city: one bar per day, weeks running left to right
 * and days running back to front, each bar as tall as that day's count.
 */
export function createSkylineScene(
  canvas: HTMLCanvasElement,
  options: {
    weeks: Array<Array<Activity | undefined>>
    reducedMotion: boolean
    onHover: (hover: SkylineHover | null) => void
  }
): SkylineScene | null {
  let renderer: WebGLRenderer
  try {
    renderer = new WebGLRenderer({ canvas, alpha: true, antialias: true })
  } catch {
    return null
  }
  renderer.setClearColor(0x000000, 0)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))

  const days = options.weeks.flatMap((week, weekIndex) =>
    week.flatMap((activity, dayIndex) =>
      activity ? [{ activity, weekIndex, dayIndex }] : []
    )
  )
  const weekCount = options.weeks.length
  const maxCount = Math.max(1, ...days.map((day) => day.activity.count))

  const scene = new Scene()
  const camera = new OrthographicCamera(-1, 1, 1, -1, 0.1, 400)
  const center = new Vector3(0, 1.2, 0)

  const hemisphere = new HemisphereLight(0xffffff, 0x000000, 1.4)
  const sun = new DirectionalLight(0xffffff, 2.2)
  sun.position.set(-18, 40, 26)
  scene.add(hemisphere, sun)

  // Each bar's base sits on the ground, so scaling it grows it upwards.
  const geometry = new BoxGeometry(1, 1, 1).translate(0, 0.5, 0)
  const material = new MeshStandardMaterial({ roughness: 0.62, metalness: 0 })
  const bars = new InstancedMesh(geometry, material, days.length)
  bars.frustumCulled = false
  scene.add(bars)

  const plinth = new Mesh(
    // Its top sits a hair below the bars' feet, so the two never flicker.
    new BoxGeometry(weekCount + 0.8, 0.28, 7.8).translate(0, -0.16, 0),
    new MeshStandardMaterial({ roughness: 0.9, metalness: 0 })
  )
  scene.add(plinth)

  const heights = days.map(({ activity }) =>
    activity.count === 0
      ? 0.06
      : 0.25 + Math.pow(activity.count / maxCount, 0.6) * MAX_HEIGHT
  )
  const positions = days.map(
    ({ weekIndex, dayIndex }) =>
      new Vector3(weekIndex - (weekCount - 1) / 2, 0, dayIndex - 3)
  )

  const matrix = new Matrix4()
  const rotation = new Quaternion()
  const scale = new Vector3()
  const colors: Color[] = []
  const hoverColor = new Color()

  let growth = options.reducedMotion ? 1 : 0
  let isGrowing = false
  let azimuth = AZIMUTH
  let azimuthTarget = AZIMUTH
  let hovered = -1
  let frame = 0
  let lastNow = 0
  const size = { width: 1, height: 1 }
  const pointer = new Vector2()
  const raycaster = new Raycaster()

  function placeBars() {
    days.forEach(({ weekIndex }, index) => {
      // A wave from the oldest week to the newest.
      const start = (weekIndex / weekCount) * 0.55
      const t = Math.min(1, Math.max(0, (growth - start) / 0.45))
      const eased = 1 - Math.pow(1 - t, 3)
      scale.set(FOOTPRINT, Math.max(heights[index] * eased, 0.02), FOOTPRINT)
      matrix.compose(positions[index], rotation, scale)
      bars.setMatrixAt(index, matrix)
    })
    bars.instanceMatrix.needsUpdate = true
  }

  function paintBars() {
    days.forEach((_, index) => {
      bars.setColorAt(index, index === hovered ? hoverColor : colors[index])
    })
    if (bars.instanceColor) bars.instanceColor.needsUpdate = true
  }

  function placeCamera() {
    const distance = 120
    camera.position.set(
      center.x + Math.sin(azimuth) * Math.cos(ELEVATION) * distance,
      center.y + Math.sin(ELEVATION) * distance,
      center.z + Math.cos(azimuth) * Math.cos(ELEVATION) * distance
    )
    camera.lookAt(center)
    camera.updateMatrixWorld()
  }

  /** Frames the whole city at rest, so turning it never changes the zoom. */
  function fitCamera() {
    azimuth = AZIMUTH
    placeCamera()
    const halfWidth = weekCount / 2 + 0.4
    const corner = new Vector3()
    let minX = Infinity
    let maxX = -Infinity
    let minY = Infinity
    let maxY = -Infinity
    for (const x of [-halfWidth, halfWidth]) {
      for (const y of [-0.3, MAX_HEIGHT + 0.3]) {
        for (const z of [-3.9, 3.9]) {
          corner.set(x, y, z).applyMatrix4(camera.matrixWorldInverse)
          minX = Math.min(minX, corner.x)
          maxX = Math.max(maxX, corner.x)
          minY = Math.min(minY, corner.y)
          maxY = Math.max(maxY, corner.y)
        }
      }
    }
    const aspect = size.width / size.height
    let halfX = ((maxX - minX) / 2) * 1.02
    let halfY = ((maxY - minY) / 2) * 1.04
    if (halfX / halfY > aspect) halfY = halfX / aspect
    else halfX = halfY * aspect
    const midX = (minX + maxX) / 2
    const midY = (minY + maxY) / 2
    camera.left = midX - halfX
    camera.right = midX + halfX
    camera.top = midY + halfY
    camera.bottom = midY - halfY
    camera.updateProjectionMatrix()
  }

  function render() {
    renderer.render(scene, camera)
  }

  function tick(now: number) {
    const dt = Math.min((now - lastNow) / 1000, 0.05)
    lastNow = now

    if (isGrowing) {
      growth = Math.min(1, growth + dt / GROW_SECONDS)
      placeBars()
      if (growth >= 1) {
        isGrowing = false
        bars.computeBoundingSphere()
      }
    }

    azimuth += (azimuthTarget - azimuth) * (1 - Math.exp(-dt * 5))
    placeCamera()
    render()

    const settled = Math.abs(azimuthTarget - azimuth) < 0.0005
    frame = isGrowing || !settled ? requestAnimationFrame(tick) : 0
  }

  function wake() {
    if (frame) return
    lastNow = performance.now()
    frame = requestAnimationFrame(tick)
  }

  function updateHover(next: number, x = 0, y = 0) {
    if (next !== hovered) {
      hovered = next
      paintBars()
      wake()
    }
    options.onHover(
      next === -1 ? null : { activity: days[next].activity, x, y }
    )
  }

  function refreshColors() {
    const dark = isDarkMode()
    const paper = readCssColor(
      "--background",
      dark ? [0.05, 0.05, 0.08] : [0.97, 0.97, 0.98]
    )
    const ink = readCssColor(
      "--foreground",
      dark ? [0.96, 0.96, 0.98] : [0.1, 0.1, 0.15]
    )
    const brand = readCssColor("--brand", [1, 0.62, 0.2])
    const mix = (amount: number): Rgb => [
      paper[0] + (ink[0] - paper[0]) * amount,
      paper[1] + (ink[1] - paper[1]) * amount,
      paper[2] + (ink[2] - paper[2]) * amount,
    ]
    const steps: Rgb[] = [
      mix(dark ? 0.16 : 0.1),
      mix(0.3),
      mix(0.48),
      mix(0.7),
      brand,
    ]

    colors.length = 0
    days.forEach(({ activity }) => {
      const level = Math.min(Math.max(activity.level, 0), steps.length - 1)
      colors.push(new Color().setRGB(...steps[level], SRGBColorSpace))
    })
    hoverColor
      .setRGB(...brand, SRGBColorSpace)
      .offsetHSL(0, 0, dark ? 0.08 : -0.06)
    ;(plinth.material as MeshStandardMaterial).color.setRGB(
      ...mix(dark ? 0.07 : 0.05),
      SRGBColorSpace
    )
    hemisphere.groundColor.setRGB(...paper, SRGBColorSpace)
    hemisphere.intensity = dark ? 1.1 : 1.6
    sun.intensity = dark ? 2 : 2.4
    paintBars()
    wake()
  }

  placeBars()
  bars.computeBoundingSphere()
  refreshColors()

  return {
    resize(width, height) {
      size.width = Math.max(width, 1)
      size.height = Math.max(height, 1)
      renderer.setSize(size.width, size.height, false)
      fitCamera()
      wake()
    },
    setPointer(next) {
      if (!next) {
        azimuthTarget = AZIMUTH
        updateHover(-1)
        wake()
        return
      }
      pointer.set(
        (next.x / size.width) * 2 - 1,
        -(next.y / size.height) * 2 + 1
      )
      if (!options.reducedMotion) {
        azimuthTarget = AZIMUTH + pointer.x * 0.12
        wake()
      }
      if (isGrowing) return
      raycaster.setFromCamera(pointer, camera)
      const [hit] = raycaster.intersectObject(bars)
      updateHover(hit?.instanceId ?? -1, next.x, next.y)
    },
    grow() {
      if (growth >= 1 || isGrowing) return
      isGrowing = true
      wake()
    },
    refreshColors,
    dispose() {
      cancelAnimationFrame(frame)
      geometry.dispose()
      material.dispose()
      plinth.geometry.dispose()
      ;(plinth.material as MeshStandardMaterial).dispose()
      bars.dispose()
      renderer.dispose()
    },
  }
}
