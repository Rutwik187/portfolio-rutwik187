"use client"

import { useMemo } from "react"
import { tokenizeTsx, type TokenType } from "@/utils/tokenize-tsx"
import { useAtomValue } from "jotai"

import type { XRaySectionId, XRaySource } from "@/config/x-ray"
import { cn } from "@/lib/utils"

import { xRayDataAtom, xRayPhaseAtom } from "./x-ray-state"

const TOKEN_CLASS: Record<TokenType, string> = {
  comment: "text-muted-foreground/70 italic",
  string: "text-amber-700 dark:text-amber-300",
  tag: "text-brand-strong",
  keyword: "text-sky-700 dark:text-sky-400",
  number: "text-emerald-700 dark:text-emerald-400",
  attr: "text-violet-700 dark:text-violet-300",
  plain: "text-foreground/85",
}

/**
 * Wraps a home page section. In X-ray mode it lays the section's own source
 * code over it, masked to the lens at the cursor (see `XRayController`).
 */
export function XRaySection({
  id,
  className,
  children,
}: {
  id: XRaySectionId
  className?: string
  children: React.ReactNode
}) {
  const phase = useAtomValue(xRayPhaseAtom)
  const data = useAtomValue(xRayDataAtom)
  const source = phase === "off" ? undefined : data?.sections[id]

  return (
    <div
      data-x-ray-section={id}
      data-x-ray-component={source?.component}
      className={cn(
        "relative rounded-2xl outline-offset-4 transition-[outline-color] duration-500",
        source
          ? "outline-1 outline-brand/25 outline-dashed"
          : "outline-transparent",
        className
      )}
    >
      {children}

      {source && (
        <>
          <div
            data-x-ray-overlay
            className="pointer-events-none absolute inset-0 z-30 overflow-hidden rounded-2xl bg-background bg-[repeating-linear-gradient(to_bottom,transparent_0_3px,color-mix(in_oklab,var(--brand)_5%,transparent)_3px_4px)] x-ray-mask"
            aria-hidden
          >
            <CodeView source={source} />
          </div>

          <span
            className="pointer-events-none absolute -top-2.5 right-4 z-31 rounded-md bg-brand px-1.5 py-0.5 font-mono text-[0.6875rem]/none font-medium text-brand-foreground shadow-sm"
            aria-hidden
          >
            {`<${source.component} />`}
          </span>
        </>
      )}
    </div>
  )
}

function CodeView({ source }: { source: XRaySource }) {
  const lines = useMemo(() => tokenizeTsx(source.code), [source.code])

  return (
    <div className="h-full gap-8 p-5 font-mono text-[0.6875rem]/[1.65] [column-fill:auto] sm:columns-2">
      <div className="mb-1 truncate text-muted-foreground/70 italic">
        {`// ${source.file} · ${source.lines} lines`}
      </div>

      {lines.map((line, index) => (
        <div key={index} className="flex break-inside-avoid whitespace-pre">
          <span className="w-8 shrink-0 pr-3 text-right text-muted-foreground/40 tabular-nums select-none">
            {source.startLine + index}
          </span>
          <span className="min-w-0 overflow-hidden">
            {line.map((token, tokenIndex) => (
              <span key={tokenIndex} className={TOKEN_CLASS[token.type]}>
                {token.text}
              </span>
            ))}
          </span>
        </div>
      ))}
    </div>
  )
}
