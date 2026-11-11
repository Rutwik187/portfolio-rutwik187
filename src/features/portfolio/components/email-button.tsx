"use client"

import { decodeEmail } from "@/utils/string"
import { MailIcon } from "lucide-react"

import { useIsClient } from "@/hooks/use-is-client"
import { Button } from "@/components/ui/button"
import { USER } from "@/features/portfolio/data/user"

/**
 * A mailto button. The address is decoded in the browser only, so it never
 * appears in the server HTML for scrapers to read.
 */
export function EmailButton({
  showAddress = false,
  className,
  ...props
}: Omit<React.ComponentProps<typeof Button>, "render" | "nativeButton"> & {
  /** Show the address as the label once the browser has decoded it. */
  showAddress?: boolean
}) {
  const isClient = useIsClient()
  const email = isClient ? decodeEmail(USER.emailB64) : null

  return (
    <Button
      {...props}
      className={className}
      nativeButton={false}
      render={
        <a href={email ? `mailto:${email}` : undefined}>
          <MailIcon data-icon="inline-start" />
          {showAddress && email ? email : "Email me"}
        </a>
      }
    />
  )
}
