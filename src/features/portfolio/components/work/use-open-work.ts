"use client"

import { useSetAtom } from "jotai"

import { trackEvent } from "@/lib/events"

import { workDialogAtom } from "./work-state"

/**
 * Opens a project's details dialog from anywhere on the home page, and records
 * where it was opened from. The dialog itself is rendered by `WorkList`.
 */
export function useOpenWork() {
  const setDialog = useSetAtom(workDialogAtom)

  return (id: string, source: string) => {
    setDialog({ id, open: true })
    trackEvent({ name: "open_work", properties: { id, source } })
  }
}
