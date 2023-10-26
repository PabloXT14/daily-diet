'use client'

import Link from 'next/link'
import { ComponentProps } from 'react'
import { tv, VariantProps } from 'tailwind-variants'
import { useQuery } from '@tanstack/react-query'

import { ArrowUpRight } from '@/assets/icons/phosphor-react'
import { api } from '@/lib/api'
import { MealsSummary } from '@/@types/meal'

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
  const { data: mealsSummary } = useQuery<MealsSummary>({
    queryKey: ['meals-summary'],
    queryFn: async () => {
      const response = await api.get('/meals/summary', {
        withCredentials: true,
      })

      const mealsSummary = response.data.summary as MealsSummary

      return mealsSummary
    },
  })

  const percentageNumber = mealsSummary?.total_meals
    ? Math.round((mealsSummary?.meals_in_diet / mealsSummary.total_meals) * 100)
    : 0

  const { base, percentage, description, icon } = percentVariants({
    color: percentageNumber > 50 ? 'primary' : 'secondary',
  })

  return (
    <section className={base({ class: className })} {...props}>
      <Link href="/summary">
        <ArrowUpRight className={icon()} size={24} />
      </Link>
      <strong className={percentage()}>{percentageNumber}%</strong>
      <span className={description()}>das refeições dentro da dieta</span>
    </section>
  )
}
