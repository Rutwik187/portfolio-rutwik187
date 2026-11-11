import { atom } from "jotai"

/**
 * The work item in the details dialog. `id` stays set while the dialog closes,
 * so its content does not vanish during the exit animation.
 */
export const workDialogAtom = atom<{ id: string | null; open: boolean }>({
  id: null,
  open: false,
})
