import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  Euler,
  Matrix3,
  Matrix4,
  NormalBlending,
  PerspectiveCamera,
  Points,
  Scene,
  ShaderMaterial,
  Vector2,
  Vector3,
  WebGLRenderer,
} from "three"

import { isDarkMode, readCssColor } from "@/lib/css-color"

import { CAMERA_Z, FRAGMENT_SHADER, VERTEX_SHADER } from "./hero-field-shaders"
import { buildChaos, buildForm, FORM_IDS } from "./hero-field-shapes"
import { PHASE_SECONDS, type FieldPhase } from "./hero-field-state"

const FOV = 30

const TIMING = PHASE_SECONDS

export type HeroFieldScene = {
  /** Where the form sits and how tall it is, in canvas pixels. */
  setStage(stage: { x: number; y: number; size: number }): void
  /** The pointer in canvas pixels, or null when it is outside. */
  setPointer(pointer: { x: number; y: number } | null): void
  /** How far the hero has scrolled away, from 0 to 1. */
  setScroll(progress: number): void
  /** Breaks up the current form and builds the one asked for. */
  showForm(index: number): void
  setRunning(running: boolean): void
  refreshColors(): void
  resize(width: number, height: number): void
  dispose(): void
}

export function createHeroFieldScene(
  canvas: HTMLCanvasElement,
  options: {
    count: number
    reducedMotion: boolean
    onChange: (state: { form: number; phase: FieldPhase }) => void
  }
): HeroFieldScene | null {
  let renderer: WebGLRenderer
  try {
    renderer = new WebGLRenderer({
      canvas,
      alpha: true,
      antialias: false,
      powerPreference: "high-performance",
    })
  } catch {
    return null
  }
  renderer.setClearColor(0x000000, 0)
  const pixelRatio = Math.min(window.devicePixelRatio || 1, 2)
  renderer.setPixelRatio(pixelRatio)

  const scene = new Scene()
  const camera = new PerspectiveCamera(FOV, 1, 0.1, 100)
  camera.position.set(0, 0, CAMERA_Z)

  const { count } = options
  const { chaos, seeds } = buildChaos(count)
  const forms = FORM_IDS.map((id) => buildForm(id, count))
  const accents = new Float32Array(count * 3)
  for (let i = 0; i < count; i++) {
    accents[i * 3] = forms[0].accents[i]
    accents[i * 3 + 1] = forms[1].accents[i]
    accents[i * 3 + 2] = forms[2].accents[i]
  }

  const geometry = new BufferGeometry()
  geometry.setAttribute("position", new BufferAttribute(chaos, 3))
  geometry.setAttribute("aChaos", new BufferAttribute(chaos, 3))
  geometry.setAttribute("aSeed", new BufferAttribute(seeds, 4))
  geometry.setAttribute("aFormA", new BufferAttribute(forms[0].positions, 3))
  geometry.setAttribute("aFormB", new BufferAttribute(forms[1].positions, 3))
  geometry.setAttribute("aFormC", new BufferAttribute(forms[2].positions, 3))
  geometry.setAttribute("aAccent", new BufferAttribute(accents, 3))

  const uniforms = {
    uTime: { value: 0 },
    uAssemble: { value: 0 },
    uWeights: { value: new Vector3(1, 0, 0) },
    uCenter: { value: new Vector3() },
    uScale: { value: 1 },
    uRotation: { value: new Matrix3() },
    uHalf: { value: new Vector2(1, 1) },
    uPointer: { value: new Vector2(9, 9) },
    uPointerStrength: { value: 0 },
    uAspect: { value: 1 },
    uPixelRatio: { value: pixelRatio },
    uSize: { value: 2.2 },
    uScatter: { value: 0 },
    uOpacity: { value: 1 },
    uChaosAlpha: { value: 0.5 },
    uFormAlpha: { value: 0.8 },
    uSoftness: { value: 0.4 },
    uInk: { value: new Vector3(1, 1, 1) },
    uBrand: { value: new Vector3(1, 0.6, 0.2) },
  }

  const material = new ShaderMaterial({
    uniforms,
    vertexShader: VERTEX_SHADER,
    fragmentShader: FRAGMENT_SHADER,
    transparent: true,
    depthWrite: false,
    depthTest: false,
  })

  const points = new Points(geometry, material)
  points.frustumCulled = false
  scene.add(points)

  const size = { width: 1, height: 1, unitsPerPixel: 1 }
  const stage = { x: 0.5, y: 0.5, size: 100 }

  const pointer = new Vector2(9, 9)
  const pointerTarget = new Vector2(9, 9)
  const tilt = new Vector2()
  let pointerInside = false
  let scroll = 0

  let form = 0
  let pendingForm: number | null = null
  let phase: FieldPhase = options.reducedMotion ? "hold" : "drift"
  let phaseTime = TIMING.drift * 0.5
  let assemble = options.reducedMotion ? 1 : 0
  let scatterSpeed = 1
  let time = 0
  let running = false
  let frame = 0
  let lastNow = 0

  const euler = new Euler(0, 0, 0, "YXZ")
  const rotation = new Matrix4()

  function emit() {
    options.onChange({ form, phase })
  }

  function setPhase(next: FieldPhase) {
    phase = next
    phaseTime = 0
    emit()
  }

  function setWeights() {
    uniforms.uWeights.value.set(
      form === 0 ? 1 : 0,
      form === 1 ? 1 : 0,
      form === 2 ? 1 : 0
    )
  }

  function step(dt: number) {
    time += dt
    phaseTime += dt

    if (phase === "drift" && phaseTime >= TIMING.drift) {
      setPhase("assemble")
    } else if (phase === "assemble") {
      assemble = Math.min(1, assemble + dt / TIMING.assemble)
      if (assemble >= 1) setPhase("hold")
    } else if (phase === "hold" && phaseTime >= TIMING.hold) {
      scatterSpeed = 1
      setPhase("scatter")
    } else if (phase === "scatter") {
      assemble = Math.max(0, assemble - (dt / TIMING.scatter) * scatterSpeed)
      if (assemble <= 0) {
        form = pendingForm ?? (form + 1) % FORM_IDS.length
        pendingForm = null
        setWeights()
        setPhase("drift")
        // A form the visitor picked starts sooner than the next in turn.
        if (scatterSpeed > 1) phaseTime = TIMING.drift * 0.6
      }
    }

    // The pointer eases in and out, and tilts the form towards itself.
    pointer.lerp(pointerTarget, 1 - Math.exp(-dt * 10))
    uniforms.uPointerStrength.value +=
      ((pointerInside ? 1 : 0) - uniforms.uPointerStrength.value) *
      (1 - Math.exp(-dt * 4))
    const ndcX = pointerInside ? pointer.x : 0
    const ndcY = pointerInside ? pointer.y : 0
    tilt.x += (ndcX - tilt.x) * (1 - Math.exp(-dt * 2.5))
    tilt.y += (ndcY - tilt.y) * (1 - Math.exp(-dt * 2.5))
  }

  function updateUniforms() {
    const isAgent = form === 2
    // The net swings round its side view, where it reads as a network; end
    // on, its layers stack into a ring.
    const yaw = isAgent
      ? -0.3 + Math.sin(time * 0.3) * 0.55 + tilt.x * 0.4
      : -0.34 + Math.sin(time * 0.22) * 0.3 + tilt.x * 0.4
    const pitch = 0.12 + Math.sin(time * 0.17) * 0.05 - tilt.y * 0.2
    euler.set(pitch, yaw, isAgent ? 0.18 : 0)
    rotation.makeRotationFromEuler(euler)
    uniforms.uRotation.value.setFromMatrix4(rotation)

    uniforms.uTime.value = time
    uniforms.uAssemble.value = assemble
    uniforms.uPointer.value.copy(pointer)
    const away = options.reducedMotion ? 0 : scroll
    uniforms.uScatter.value = Math.pow(away, 1.3) * 0.9
    uniforms.uOpacity.value = 1 - away * 0.65
  }

  function render() {
    updateUniforms()
    renderer.render(scene, camera)
  }

  function loop(now: number) {
    frame = requestAnimationFrame(loop)
    const dt = Math.min((now - lastNow) / 1000, 0.05)
    lastNow = now
    step(dt)
    render()
  }

  function refreshColors() {
    const dark = isDarkMode()
    const ink = readCssColor(
      "--foreground",
      dark ? [1, 1, 1] : [0.1, 0.1, 0.15]
    )
    const brand = readCssColor("--brand", [1, 0.62, 0.2])
    uniforms.uInk.value.set(...ink)
    uniforms.uBrand.value.set(...brand)
    // Light glows on the night paper; on the day paper ink is laid down.
    material.blending = dark ? AdditiveBlending : NormalBlending
    uniforms.uChaosAlpha.value = dark ? 0.5 : 0.42
    uniforms.uFormAlpha.value = dark ? 0.62 : 0.72
    uniforms.uSoftness.value = dark ? 0.45 : 0.28
    uniforms.uSize.value = dark ? 2.3 : 2
    material.needsUpdate = true
    if (!running) render()
  }

  function placeStage() {
    const { width, height, unitsPerPixel } = size
    uniforms.uCenter.value.set(
      (stage.x - width / 2) * unitsPerPixel,
      -(stage.y - height / 2) * unitsPerPixel,
      0
    )
    uniforms.uScale.value = stage.size * unitsPerPixel
  }

  setWeights()
  refreshColors()
  emit()

  return {
    setStage(next) {
      Object.assign(stage, next)
      placeStage()
      if (!running) render()
    },
    setPointer(next) {
      pointerInside = next !== null
      if (next) {
        pointerTarget.set(
          (next.x / size.width) * 2 - 1,
          -(next.y / size.height) * 2 + 1
        )
        // Jump straight to the first point, rather than sliding in from afar.
        if (pointer.x > 2) pointer.copy(pointerTarget)
      }
    },
    setScroll(progress) {
      scroll = Math.min(1, Math.max(0, progress))
    },
    showForm(index) {
      if (options.reducedMotion) {
        form = index
        setWeights()
        emit()
        render()
        return
      }
      if (index === form && phase !== "scatter") return
      if (phase === "drift") {
        form = index
        setWeights()
        emit()
        return
      }
      pendingForm = index
      scatterSpeed = 2.6
      if (phase !== "scatter") setPhase("scatter")
    },
    setRunning(next) {
      if (options.reducedMotion || next === running) return
      running = next
      if (running) {
        lastNow = performance.now()
        frame = requestAnimationFrame(loop)
      } else {
        cancelAnimationFrame(frame)
      }
    },
    refreshColors,
    resize(width, height) {
      size.width = Math.max(width, 1)
      size.height = Math.max(height, 1)
      renderer.setSize(size.width, size.height, false)
      camera.aspect = size.width / size.height
      camera.updateProjectionMatrix()
      const visibleHeight = 2 * CAMERA_Z * Math.tan((FOV * Math.PI) / 360)
      size.unitsPerPixel = visibleHeight / size.height
      uniforms.uAspect.value = camera.aspect
      uniforms.uHalf.value.set(
        (visibleHeight / 2) * camera.aspect,
        visibleHeight / 2
      )
      placeStage()
      if (!running) render()
    },
    dispose() {
      cancelAnimationFrame(frame)
      running = false
      geometry.dispose()
      material.dispose()
      renderer.dispose()
    },
  }
}
