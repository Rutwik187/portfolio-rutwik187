import Link from "next/link"
import { ArrowRightIcon, Gamepad2Icon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { RutwikMark } from "@/components/rutwik-mark"

export function NotFound() {
  return (
    <div className="grid min-h-svh place-items-center dot-grid px-4 py-6">
      <section className="flex max-w-md flex-col items-center gap-6 text-center">
        <RutwikMark className="size-12" blink />

        <div className="space-y-2">
          <h1 className="font-mono text-7xl font-medium tracking-tight">
            4<span className="text-brand">0</span>4
          </h1>
          <p className="font-mono text-sm text-muted-foreground">
            zsh: no such file or directory
          </p>
        </div>

        <p className="text-balance text-muted-foreground">
          This page got eaten by the snake. Want revenge?
        </p>

        <div className="flex flex-wrap justify-center gap-2">
          <Button
            variant="outline"
            nativeButton={false}
            render={
              <Link href="/">
                Go home
                <ArrowRightIcon />
              </Link>
            }
          />
          <Button
            nativeButton={false}
            render={
              <Link href="/play">
                <Gamepad2Icon />
                Play Snake
              </Link>
            }
          />
        </div>
      </section>
    </div>
  )
}
