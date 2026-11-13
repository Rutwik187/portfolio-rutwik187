"use client"

import { motion, type MotionValue } from "motion/react"

/** The agent's ghost cursor, with a ripple each time it clicks. */
export function AgentCursor({
  x,
  y,
  clickId,
}: {
  x: MotionValue<number>
  y: MotionValue<number>
  clickId: number
}) {
  return (
    <motion.div
      className="pointer-events-none fixed top-0 left-0 z-70"
      style={{ x, y }}
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.6 }}
      transition={{ duration: 0.2 }}
      aria-hidden
    >
      <svg
        viewBox="0 0 24 24"
        className="size-6 translate-x-[-3px] translate-y-[-2px]"
        aria-hidden
      >
        <path
          d="M4 2.5 19.5 12l-6.8 1.6L9.6 20 4 2.5Z"
          className="fill-brand stroke-background"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>
      <span className="absolute top-5 left-4 rounded-md bg-brand px-1.5 py-0.5 text-xs font-medium whitespace-nowrap text-brand-foreground lowercase">
        agent
      </span>
      {clickId > 0 && (
        <motion.span
          key={clickId}
          className="absolute -top-3 -left-3 size-6 rounded-full border-2 border-brand"
          initial={{ scale: 0.4, opacity: 1 }}
          animate={{ scale: 2.2, opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      )}
    </motion.div>
  )
}

/** A soft ring around the element the agent is looking at. */
export function AgentHighlight({ box }: { box: DOMRect }) {
  return (
    <motion.div
      // Below the chat panel (z-60), so the ring never draws over the chat.
      className="pointer-events-none fixed top-0 left-0 z-55 rounded-lg ring-2 ring-brand"
      initial={{
        opacity: 0,
        x: box.left - 4,
        y: box.top - 4,
        width: box.width + 8,
        height: box.height + 8,
      }}
      animate={{
        opacity: [0, 1, 0.6, 1],
        x: box.left - 4,
        y: box.top - 4,
        width: box.width + 8,
        height: box.height + 8,
      }}
      exit={{ opacity: 0, transition: { duration: 0.2 } }}
      transition={{
        opacity: { duration: 1.2, times: [0, 0.2, 0.6, 1] },
        default: { type: "spring", bounce: 0, duration: 0.35 },
      }}
      aria-hidden
    />
  )
}
