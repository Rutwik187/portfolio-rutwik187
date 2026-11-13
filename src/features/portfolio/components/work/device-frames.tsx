import Image, { type StaticImageData } from "next/image"

import { cn } from "@/lib/utils"

/**
 * A desktop screenshot, shown as it is: a 10px radius and a hairline, no
 * drawn browser bar. The capture is the product; chrome would only imitate it.
 */
export function BrowserFrame({
  src,
  alt,
  sizes = "(min-width: 1024px) 640px, 92vw",
  className,
  preload,
}: {
  src: StaticImageData
  alt: string
  /** Kept for callers; a drawn address bar is no longer shown. */
  url?: string
  sizes?: string
  className?: string
  preload?: boolean
}) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-[10px] bg-paper-2 outline-1 -outline-offset-1 outline-rule",
        className
      )}
    >
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

/**
 * A phone screenshot. Its own corners are rounded like a screen, with a
 * hairline; there is no drawn phone body, notch or status bar around it.
 */
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
    <div className={cn("relative", className)}>
      <div
        className={cn(
          "overflow-hidden rounded-[9%/4.2%] bg-paper-2 outline-1 -outline-offset-1 outline-rule",
          screenClassName
        )}
      >
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
