"use client"

import * as React from "react"
import { Button, type ButtonProps } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export const GlowButton = React.forwardRef<HTMLButtonElement, ButtonProps>(({ className, ...props }, ref) => {
  return <Button ref={ref} className={cn("btn-glow", className)} {...props} />
})
GlowButton.displayName = "GlowButton"
