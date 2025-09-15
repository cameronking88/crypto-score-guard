import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const arcadeButtonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        neon: "arcade-border bg-background text-primary hover:bg-primary/10 neon-glow font-bold tracking-wider uppercase",
        magenta: "arcade-border bg-background text-neon-magenta border-neon-magenta hover:bg-neon-magenta/10 font-bold tracking-wider uppercase",
        lime: "arcade-border bg-background text-neon-lime border-neon-lime hover:bg-neon-lime/10 font-bold tracking-wider uppercase",
        submit: "bg-gradient-neon text-background hover:shadow-glow-cyan font-bold tracking-wider uppercase border-0",
        ghost: "text-primary hover:bg-primary/10 hover:text-primary border border-primary/20",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "neon",
      size: "default",
    },
  }
)

export interface ArcadeButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof arcadeButtonVariants> {
  asChild?: boolean
}

const ArcadeButton = React.forwardRef<HTMLButtonElement, ArcadeButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(arcadeButtonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
ArcadeButton.displayName = "ArcadeButton"

export { ArcadeButton, arcadeButtonVariants }