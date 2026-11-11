"use client"

import { useSetAtom } from "jotai"

import { trackEvent } from "@/lib/events"
import { Button } from "@/components/ui/button"

import { hireDialogOpenAtom } from "./hire-state"

/** Opens the project brief dialog. `source` says where on the page it was. */
export function HireButton({
  source,
  onClick,
  ...props
}: React.ComponentProps<typeof Button> & { source: string }) {
  const setOpen = useSetAtom(hireDialogOpenAtom)

  return (
    <Button
      {...props}
      onClick={(e) => {
        onClick?.(e)
        setOpen(true)
        trackEvent({ name: "open_hire_brief", properties: { source } })
      }}
    />
  )
}
