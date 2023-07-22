import { ButtonHTMLAttributes, forwardRef } from 'react'
import { cva, VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'flex items-center justify-center gap-3 rounded-md px-6 py-4 font-bold text-sm transition-colors',
  {
    variants: {
      variant: {
        default: ['text-white bg-gray-600', 'hover:bg-gray-700'],
        outline: [
          'text-gray-700 bg-transparent border border-gray-700',
          'hover:bg-gray-300',
        ],
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, className, variant, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, className }))}
        {...props}
      >
        {children}
      </button>
    )
  },
)

Button.displayName = 'Button'

export { Button, buttonVariants }
