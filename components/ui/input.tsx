import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "flex h-11 w-full rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm px-4 py-2.5 text-base text-white placeholder:text-zinc-500 transition-all duration-200 outline-none",
        "focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 focus:bg-white/10",
        "hover:border-white/20 hover:bg-white/[0.07]",
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        "file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-zinc-300",
        className
      )}
      {...props}
    />
  )
}

export { Input }
