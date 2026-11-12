import React from "react"

import { cn } from "@/lib/utils"

function Panel({ className, ...props }: React.ComponentProps<"section">) {
  return (
    <section
      data-slot="panel"
      className={cn("relative", className)}
      {...props}
    />
  )
}

function PanelHeader({ className, ...props }: React.ComponentProps<"header">) {
  return (
    <header
      data-slot="panel-header"
      className={cn("px-4 pb-2", className)}
      {...props}
    />
  )
}

function PanelTitle({
  as: Comp = "h2",
  className,
  ...props
}: React.ComponentProps<"h2"> & { as?: "h1" | "h2" | "div" }) {
  return (
    <Comp
      data-slot="panel-title"
      className={cn(
        "group/panel-title font-heading text-3xl font-medium tracking-tight text-balance sm:text-4xl",
        className
      )}
      {...props}
    />
  )
}

function PanelTitleSup({ className, ...props }: React.ComponentProps<"sup">) {
  return (
    <sup
      className={cn(
        "top-[-0.75em] ml-1 text-sm font-medium tracking-normal text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}

function PanelDescription({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="panel-description"
      className={cn(
        "mt-3 max-w-2xl text-base text-pretty text-muted-foreground sm:text-lg",
        className
      )}
      {...props}
    />
  )
}

function PanelContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div data-slot="panel-body" className={cn("p-4", className)} {...props} />
  )
}

export {
  Panel,
  PanelContent,
  PanelDescription,
  PanelHeader,
  PanelTitle,
  PanelTitleSup,
}
