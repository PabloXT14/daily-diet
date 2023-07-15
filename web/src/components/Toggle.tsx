'use client'

import { ComponentPropsWithoutRef, ElementRef, forwardRef } from 'react'
import { cva, VariantProps } from 'class-variance-authority'
import * as TooglePrimitive from '@radix-ui/react-toggle'

import { Circle } from '@/assets/icons/phosphor-react'
import { cn } from '@/lib/utils'

const toggleVariants = cva(
  'rounded-md p-4 flex items-center justify-center gap-2 font-bold text-sm border bg-gray-200 text-gray-700 transition-all',
  {
    variants: {
      variant: {
        primary: [
          '[&>svg]:text-green-dark',
          'data-[state=on]:bg-green-light data-[state=on]:border-green-dark',
        ],
        secondary: [
          '[&>svg]:text-red-dark',
          'data-[state=on]:bg-red-light data-[state=on]:border-red-dark',
        ],
      },
    },
    defaultVariants: {
      variant: 'primary',
    },
  },
)

interface ToggleProps
  extends ComponentPropsWithoutRef<typeof TooglePrimitive.Root>,
    VariantProps<typeof toggleVariants> {}

const Toggle = forwardRef<ElementRef<typeof TooglePrimitive.Root>, ToggleProps>(
  ({ children, className, variant, ...props }, ref) => {
    return (
      <TooglePrimitive.Root
        ref={ref}
        className={cn(toggleVariants({ variant, className }))}
        {...props}
      >
        <Circle size={8} weight="fill" />
        {children}
      </TooglePrimitive.Root>
    )
  },
)

Toggle.displayName = TooglePrimitive.Root.displayName

export { Toggle, toggleVariants }
