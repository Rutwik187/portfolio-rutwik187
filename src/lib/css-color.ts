export type Rgb = [number, number, number]

let context: CanvasRenderingContext2D | null = null

/**
 * Reads a theme colour from a CSS custom property, as sRGB from 0 to 1.
 * The tokens are written in oklch, which WebGL cannot read, so a 1px canvas
 * paints the colour and hands back its pixel.
 */
export function readCssColor(property: `--${string}`, fallback: Rgb): Rgb {
  if (typeof document === "undefined") return fallback

  const value = getComputedStyle(document.documentElement)
    .getPropertyValue(property)
    .trim()
  if (!value) return fallback

  context ??= document
    .createElement("canvas")
    .getContext("2d", { willReadFrequently: true })
  if (!context) return fallback

  context.clearRect(0, 0, 1, 1)
  context.fillStyle = "#000"
  context.fillStyle = value
  context.fillRect(0, 0, 1, 1)
  const [r, g, b] = context.getImageData(0, 0, 1, 1).data
  return [r / 255, g / 255, b / 255]
}

/** True while the page is in dark mode. */
export function isDarkMode() {
  return document.documentElement.classList.contains("dark")
}
