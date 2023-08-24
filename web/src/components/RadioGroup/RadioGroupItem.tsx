'use client'

import { forwardRef, ElementRef, ComponentPropsWithoutRef } from 'react'
import * as RadioGroupPrimitive from '@radix-ui/react-radio-group'
import { tv, VariantProps } from 'tailwind-variants'

import { Circle } from '@/assets/icons/phosphor-react'

const radioGroupItemVariants = tv({
  slots: {
    wrapper:
      'rounded-md p-4 flex items-center justify-center gap-2 border bg-gray-200 transition-all',
    label: 'font-bold text-sm text-gray-700',
    icon: '',
  },
  variants: {
    variant: {
      primary: {
        wrapper:
          'data-[state=checked]:bg-green-light data-[state=checked]:border-green-dark',
        icon: 'text-green-dark',
      },
      secondary: {
        wrapper:
          'data-[state=checked]:bg-red-light data-[state=checked]:border-red-dark',
        icon: 'text-red-dark',
      },
    },
  },
  defaultVariants: {
    variant: 'primary',
  },
})

type RadioGroupItemProps = ComponentPropsWithoutRef<
  typeof RadioGroupPrimitive.Item
> &
  VariantProps<typeof radioGroupItemVariants>

const RadioGroupItem = forwardRef<
  ElementRef<typeof RadioGroupPrimitive.Item>,
  RadioGroupItemProps
>(({ children, className, variant, id, ...props }, ref) => {
  const { wrapper, icon, label } = radioGroupItemVariants({ variant })

  return (
    <RadioGroupPrimitive.Item
      ref={ref}
      className={wrapper({ class: className })}
      id={id}
      {...props}
    >
      <RadioGroupPrimitive.Indicator className="hidden" />

      <Circle size={12} weight="fill" className={icon()} />

      <label htmlFor={id} className={label()}>
        {children}
      </label>
    </RadioGroupPrimitive.Item>
  )
})

RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName

export { RadioGroupItem }
