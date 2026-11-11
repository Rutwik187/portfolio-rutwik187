import Image, { type StaticImageData } from "next/image"

import { cn } from "@/lib/utils"

/** A browser window around a desktop screenshot. */
export function BrowserFrame({
  src,
  alt,
  url,
  sizes = "(min-width: 1024px) 640px, 92vw",
  className,
  preload,
}: {
  src: StaticImageData
  alt: string
  url?: string
  sizes?: string
  className?: string
  preload?: boolean
}) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-lg bg-stone-100 shadow-2xl ring-1 shadow-stone-950/25 ring-stone-950/10 sm:rounded-xl dark:bg-stone-800 dark:ring-white/10",
        className
      )}
    >
      <div className="flex h-5 items-center gap-1 border-b border-stone-950/5 px-2 sm:h-7 sm:gap-1.5 sm:px-3 dark:border-white/5">
        <span className="size-1.5 rounded-full bg-stone-300 sm:size-2 dark:bg-stone-600" />
        <span className="size-1.5 rounded-full bg-stone-300 sm:size-2 dark:bg-stone-600" />
        <span className="size-1.5 rounded-full bg-stone-300 sm:size-2 dark:bg-stone-600" />
        {url && (
          <span className="mx-auto max-w-[60%] truncate rounded-full bg-white/80 px-2 font-mono text-[0.5rem]/[0.875rem] text-stone-500 sm:px-3 sm:text-[0.625rem]/[1.125rem] dark:bg-stone-900/80 dark:text-stone-400">
            {url}
          </span>
        )}
      </div>
      <Image
        src={src}
        alt={alt}
        sizes={sizes}
        placeholder="blur"
        preload={preload}
        className="block h-auto w-full"
      />
    </div>
  )
}

/** A phone around a mobile screenshot. The screenshot keeps its own aspect. */
export function PhoneFrame({
  src,
  alt,
  sizes = "(min-width: 1024px) 220px, 40vw",
  className,
  screenClassName,
}: {
  src: StaticImageData
  alt: string
  sizes?: string
  className?: string
  screenClassName?: string
}) {
  return (
    <div
      className={cn(
        "relative rounded-[13%/6%] bg-stone-950 p-[3.5%] shadow-2xl ring-1 shadow-stone-950/40 ring-stone-700/60 dark:ring-stone-600/60",
        className
      )}
    >
      <div
        className={cn(
          "@container relative overflow-hidden rounded-[10%/4.6%] bg-stone-950",
          screenClassName
        )}
      >
        {/* A status bar, so the camera island never covers the screenshot. */}
        <div
          className="flex aspect-390/40 items-center justify-between px-[8%] font-sans text-[3.4cqw] font-semibold text-white"
          aria-hidden
        >
          <span>9:41</span>
          <span className="h-[52%] w-[30%] rounded-full bg-stone-900" />
          <span className="flex items-center gap-[1.5cqw]">
            <span className="flex h-[2.6cqw] items-end gap-[0.5cqw]">
              <span className="h-[40%] w-[0.8cqw] rounded-[1px] bg-white" />
              <span className="h-[60%] w-[0.8cqw] rounded-[1px] bg-white" />
              <span className="h-[80%] w-[0.8cqw] rounded-[1px] bg-white" />
              <span className="h-full w-[0.8cqw] rounded-[1px] bg-white" />
            </span>
            <span className="relative h-[2.8cqw] w-[5.6cqw] rounded-[0.8cqw] ring-1 ring-white/60">
              <span className="absolute inset-[0.5cqw] right-[1.4cqw] rounded-[0.3cqw] bg-white" />
            </span>
          </span>
        </div>
        <Image
          src={src}
          alt={alt}
          sizes={sizes}
          placeholder="blur"
          className="block h-auto w-full"
        />
      </div>
    </div>
  )
}
