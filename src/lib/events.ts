import { z } from "zod"

import { op } from "./openpanel"

const eventSchema = z.object({
  name: z.enum([
    "copy_email",
    "open_command_menu",
    "command_menu_action",
    "keyboard_shortcut_navigate",
    "terminal_command",
    "konami_unlocked",
    "snake_game_over",
    "open_hire_brief",
    "send_hire_brief",
    "copy_hire_brief",
    "open_work",
    "toggle_x_ray",
    "ask_agent",
    "open_agent_chat",
  ]),
  // declare type AllowedPropertyValues = string | number | boolean | null
  properties: z
    .record(
      z.string(),
      z.union([z.string(), z.number(), z.boolean(), z.null()])
    )
    .optional(),
})

export type Event = z.infer<typeof eventSchema>

export function trackEvent(input: Event) {
  const event = eventSchema.parse(input)
  if (event) {
    console.log("trackEvent:", event)
    op?.track(event.name, event.properties)
  }
}
