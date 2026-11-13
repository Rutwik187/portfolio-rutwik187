"use client"

import type { StaticImageData } from "next/image"
import Image from "next/image"
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react"

import { cn } from "@/lib/utils"

import { WORK } from "../../data/work"
import type { Device, Work } from "../../types/work"

type Layer = {
  src: StaticImageData
  device: Device
  /** Position and width as percentages of the stage, and depth in pixels. */
  left: number
  top: number
  width: number
  z: number
}

/** The resting turn of the stage, in degrees, before the pointer moves it. */
const REST = { x: 11, y: -18 }

/**
 * The product's own screens, standing in depth: the cover in front, more of
 * the same product behind it, and its phone or desktop side beside it. The
 * stage turns a little towards the pointer, and a new project's screens fly
 * in from the front while the last one's fall back.
 */
export function WorkStage({ activeId }: { activeId: string }) {
  const reducedMotion = useReducedMotion() ?? false
  const pointerX = useMotionValue(0)
  const pointerY = useMotionValue(0)
  const spring = { stiffness: 110, damping: 20, mass: 0.6 }
  const rotateY = useSpring(
    useTransform(pointerX, [-0.5, 0.5], [REST.y - 9, REST.y + 9]),
    spring
  )
  const rotateX = useSpring(
    useTransform(pointerY, [-0.5, 0.5], [REST.x + 7, REST.x - 7]),
    spring
  )

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (reducedMotion || event.pointerType !== "mouse") return
    const box = event.currentTarget.getBoundingClientRect()
    pointerX.set((event.clientX - box.left) / box.width - 0.5)
    pointerY.set((event.clientY - box.top) / box.height - 0.5)
  }

  const handlePointerLeave = () => {
    pointerX.set(0)
    pointerY.set(0)
  }

  return (
    <div
      className="relative aspect-4/3 perspective-[1600px]"
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      {/* The shadow the stack casts on the page. */}
      <div
        className="absolute inset-x-[8%] bottom-[-6%] h-[16%] rounded-[50%] bg-ink/14 blur-2xl dark:bg-black/70"
        aria-hidden
      />

      <motion.div
        className="absolute inset-0 transform-3d"
        style={{ rotateX, rotateY }}
      >
        {WORK.map((work) => (
          <Stack
            key={work.id}
            work={work}
            isActive={work.id === activeId}
            reducedMotion={reducedMotion}
          />
        ))}
      </motion.div>
    </div>
  )
}

function Stack({
  work,
  isActive,
  reducedMotion,
}: {
  work: Work
  isActive: boolean
  reducedMotion: boolean
}) {
  const layers = getLayers(work)

  return (
    <div
      className={cn(
        "absolute inset-0 transform-3d",
        !isActive && "pointer-events-none"
      )}
      aria-hidden={!isActive}
    >
      {layers.map((layer, index) => (
        <motion.div
          key={layer.src.src}
          className="absolute"
          style={{
            left: `${layer.left}%`,
            top: `${layer.top}%`,
            width: `${layer.width}%`,
          }}
          initial={false}
          animate={
            isActive
              ? { opacity: 1, z: layer.z, y: 0, rotateX: 0 }
              : { opacity: 0, z: layer.z - 140, y: 28, rotateX: -8 }
          }
          transition={
            reducedMotion
              ? { duration: 0 }
              : {
                  duration: isActive ? 0.75 : 0.35,
                  ease: [0.16, 1, 0.3, 1],
                  delay: isActive ? 0.08 + index * 0.07 : 0,
                }
          }
        >
          <Screen layer={layer} />
        </motion.div>
      ))}
    </div>
  )
}

function Screen({ layer }: { layer: Layer }) {
  const isPhone = layer.device === "phone"

  return (
    <div
      className={cn(
        "relative overflow-hidden bg-paper-2 shadow-[0_40px_70px_-30px_oklch(0.1_0.02_290/0.55)] outline-1 -outline-offset-1 outline-rule-2",
        isPhone ? "rounded-[14px]" : "rounded-[8px]"
      )}
    >
      <Image
        src={layer.src}
        alt=""
        sizes={isPhone ? "160px" : "(min-width: 1440px) 460px, 34vw"}
        placeholder="blur"
        className="block h-auto w-full"
      />
      {/* A faint sheen, as on a screen held to the light. */}
      <div
        className="pointer-events-none absolute inset-0 bg-linear-to-br from-white/12 via-transparent to-transparent dark:from-white/8"
        aria-hidden
      />
    </div>
  )
}

/**
 * Picks the screens for a project's stack. A desktop cover stands in front
 * of two more desktop screens with a phone beside it; phone covers stand in
 * front of the product's desktop side.
 */
export function getLayers(work: Work): Layer[] {
  const others = (device: Device) =>
    work.shots
      .filter(
        (shot) =>
          shot.device === device && !work.cover.images.includes(shot.src)
      )
      .map((shot) => shot.src)

  if (work.cover.device === "desktop") {
    const [cover] = work.cover.images
    const [second, third] = others("desktop")
    const [phone] = others("phone")
    return [
      third && {
        src: third,
        device: "desktop",
        left: 19,
        top: 1,
        width: 74,
        z: -170,
      },
      second && {
        src: second,
        device: "desktop",
        left: 10,
        top: 12,
        width: 74,
        z: -85,
      },
      { src: cover, device: "desktop", left: 1, top: 23, width: 74, z: 0 },
      phone && {
        src: phone,
        device: "phone",
        left: 70,
        top: 36,
        width: 19,
        z: 90,
      },
    ].filter((layer): layer is Layer => Boolean(layer))
  }

  const [first, second] = work.cover.images
  const [desktop] = others("desktop")
  return [
    desktop && {
      src: desktop,
      device: "desktop",
      left: 24,
      top: 2,
      width: 72,
      z: -180,
    },
    { src: first, device: "phone", left: 12, top: 12, width: 25, z: 20 },
    second && {
      src: second,
      device: "phone",
      left: 42,
      top: 22,
      width: 25,
      z: 100,
    },
  ].filter((layer): layer is Layer => Boolean(layer))
}
