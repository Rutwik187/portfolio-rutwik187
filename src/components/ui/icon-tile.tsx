import { cn } from "@/lib/utils"

/**
 * A leading icon in a metadata row. Just the icon, in the muted ink: no tile,
 * no ring, so the row reads as type with a mark beside it.
 */
export function IconTile({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="icon-tile"
      className={cn(
        "flex size-5 shrink-0 items-center justify-center text-muted-foreground select-none",
        "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    />
  )
}
