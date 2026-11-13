"use client"

import { motion, useScroll, useSpring } from "motion/react"

/** A thin saffron bar under the header that fills as the page is read. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 200,
    damping: 40,
    restDelta: 0.001,
  })

  return (
    <motion.div
      className="absolute inset-x-0 -bottom-px h-px origin-left bg-brand"
      style={{ scaleX }}
      aria-hidden
    />
  )
}
