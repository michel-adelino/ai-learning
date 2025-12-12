import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "flex h-11 w-full rounded-xl border border-white/10 bg-zinc-900 px-4 py-2.5 text-base text-white placeholder:text-zinc-500 transition-all duration-200 outline-none",
        "focus:border-white/30 focus:ring-2 focus:ring-white/10 focus:bg-zinc-800",
        "hover:border-white/20 hover:bg-zinc-800",
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        "file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-zinc-300",
        className
      )}
      {...props}
    />
  )
}

export { Input }
