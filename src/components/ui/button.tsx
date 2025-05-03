import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[12px] text-sm font-semibold ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0", // Adjusted rounded corners, font-weight
  {
    variants: {
      variant: {
        default: "btn-primary-gradient text-white", // Apply gradient class, ensure text is white
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90", // Keep destructive default for now
        outline: // Crimson Frost Secondary/Outline Button - Glassy
          "border border-primary bg-transparent text-primary hover:bg-primary/10 hover:shadow-[0_0_12px_hsla(var(--primary)/0.4)] backdrop-blur-sm", // Glass effect with red border/glow
        secondary: // Similar to outline, potentially different base glass color if needed
           "border border-primary bg-transparent text-primary hover:bg-primary/10 hover:shadow-[0_0_12px_hsla(var(--primary)/0.4)] backdrop-blur-sm", // Reusing outline style
        ghost: "hover:bg-accent hover:text-accent-foreground", // Standard ghost
        link: "text-primary underline-offset-4 hover:underline", // Standard link
      },
      size: {
        default: "h-10 px-6 py-3", // Adjusted padding: 0.75rem = 12px (py-3), 1.5rem = 24px (px-6)
        sm: "h-9 rounded-[10px] px-4", // Adjusted rounded
        lg: "h-11 rounded-[14px] px-8", // Adjusted rounded
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
