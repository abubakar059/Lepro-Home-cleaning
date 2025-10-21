"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export const GlowButton = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<typeof Button>
>(({ className, ...props }, ref) => {
  return <Button ref={ref} className={cn("btn-glow", className)} {...props} />
})
GlowButton.displayName = "GlowButton"
