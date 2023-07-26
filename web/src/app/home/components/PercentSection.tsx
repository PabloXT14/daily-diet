import Link from 'next/link'
import { ComponentProps } from 'react'
import { tv, VariantProps } from 'tailwind-variants'

import { ArrowUpRight } from '@/assets/icons/phosphor-react'

const percentVariants = tv({
  slots: {
    base: 'relative mb-10 mt-9 flex h-[102px] flex-col items-center justify-center rounded-lg',
    percentage: 'text-3xl font-bold text-gray-700',
    description: 'text-sm text-gray-600',
    icon: 'absolute right-2 top-2',
  },
  variants: {
    color: {
      primary: {
        base: 'bg-green-light',
        icon: 'text-green-dark',
      },
      secondary: {
        base: 'bg-red-light',
        icon: 'text-red-dark',
      },
    },
  },
  defaultVariants: {
    color: 'primary',
  },
})

type PercentSectionProps = ComponentProps<'section'> &
  VariantProps<typeof percentVariants>

export function PercentSection({
  color,
  className,
  ...props
}: PercentSectionProps) {
  const { base, percentage, description, icon } = percentVariants({ color })

  return (
    <section className={base({ class: className })} {...props}>
      <strong className={percentage()}>90,86%</strong>
      <span className={description()}>das refeições dentro da dieta</span>
      <Link href="/summary">
        <ArrowUpRight className={icon()} size={24} />
      </Link>
    </section>
  )
}
