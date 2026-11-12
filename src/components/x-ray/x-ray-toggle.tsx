"use client"

import { usePathname } from "next/navigation"
import { useAtomValue } from "jotai"
import { ScanEyeIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

import { useXRayToggle } from "./x-ray-controller"
import { xRayPhaseAtom } from "./x-ray-state"

/** The header button for X-ray mode. Only the home page has X-ray sections. */
export function XRayToggle({ className }: { className?: string }) {
  const pathname = usePathname()
  const isOn = useAtomValue(xRayPhaseAtom) === "on"
  const toggle = useXRayToggle()

  if (pathname !== "/") return null

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            variant="ghost"
            size="icon-sm"
            className={cn(isOn && "bg-brand/12 text-brand-strong", className)}
            aria-pressed={isOn}
            aria-label="X-ray mode: see the code behind this page"
            onClick={() => toggle("header")}
          >
            <ScanEyeIcon />
          </Button>
        }
      />
      <TooltipContent>
        X-ray: see the code <kbd className="ml-1 font-mono">X</kbd>
      </TooltipContent>
    </Tooltip>
  )
}
