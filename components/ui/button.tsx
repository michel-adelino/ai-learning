import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-violet-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900",
  {
    variants: {
      variant: {
        default: "bg-violet-600 text-white hover:bg-violet-500 shadow-lg shadow-violet-500/20 hover:shadow-violet-500/30",
        destructive:
          "bg-red-600 text-white hover:bg-red-500 shadow-lg shadow-red-500/20 focus-visible:ring-red-500/50",
        outline:
          "border border-white/10 bg-white/5 text-zinc-200 hover:bg-white/10 hover:text-white hover:border-white/20 backdrop-blur-sm",
        secondary:
          "bg-zinc-800 text-zinc-100 hover:bg-zinc-700 border border-zinc-700",
        ghost:
          "text-zinc-400 hover:bg-white/5 hover:text-white",
        link: "text-violet-400 underline-offset-4 hover:underline hover:text-violet-300",
        gradient: "bg-linear-to-r from-violet-600 to-fuchsia-600 text-white hover:from-violet-500 hover:to-fuchsia-500 shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40",
      },
      size: {
        default: "h-10 px-5 py-2.5",
        sm: "h-8 rounded-lg gap-1.5 px-3 text-xs",
        lg: "h-12 rounded-xl px-7 text-base",
        icon: "size-10",
        "icon-sm": "size-8 rounded-lg",
        "icon-lg": "size-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
