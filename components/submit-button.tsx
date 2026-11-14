"use client"

import { useFormStatus } from "react-dom"
import { Button } from "@/components/ui/button"

export function SubmitButton({
  children,
  pendingLabel,
  variant = "default",
  className,
  name,
  value,
}: {
  children: React.ReactNode
  pendingLabel: string
  variant?: "default" | "outline" | "secondary" | "destructive" | "ghost"
  className?: string
  name?: string
  value?: string
}) {
  const { pending } = useFormStatus()
  return (
    <Button
      type="submit"
      name={name}
      value={value}
      variant={variant}
      className={className ?? "h-10 px-3.5"}
      disabled={pending}
    >
      {pending ? pendingLabel : children}
    </Button>
  )
}
