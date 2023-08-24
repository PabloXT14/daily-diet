'use client'

import { forwardRef, ElementRef, ComponentPropsWithoutRef } from 'react'
import * as RadioGroupPrimitive from '@radix-ui/react-radio-group'
import { twMerge } from 'tailwind-merge'

const RadioGroupRoot = forwardRef<
  ElementRef<typeof RadioGroupPrimitive.Root>,
  ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Root
      className={twMerge('grid gap-2', className)}
      {...props}
      ref={ref}
    />
  )
})

RadioGroupRoot.displayName = RadioGroupPrimitive.Root.displayName

export { RadioGroupRoot }
