'use client'

import Link from 'next/link'
import { ComponentProps } from 'react'
import { VariantProps, tv } from 'tailwind-variants'

import { ArrowLeft } from '@/assets/icons/phosphor-react'
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { MealsSummary } from '@/@types/meal'
import { calculatePercentage } from '@/utils/calculate-percentage'

const percentVariants = tv({
  slots: {
    base: 'flex w-full flex-col px-6 pt-7',
    percentage: 'text-3xl font-bold text-gray-700',
    description: 'text-sm text-gray-600',
    icon: '',
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

type PercentSectionProps = ComponentProps<'header'> &
  VariantProps<typeof percentVariants>

export function PercentSection({
  color,
  className,
  ...props
}: PercentSectionProps) {
  const { data: mealsSummary } = useQuery({
    queryKey: ['meals-summary'],
    queryFn: async () => {
      const response = await api.get('/meals/summary', {
        withCredentials: true,
      })

      return response.data.summary as MealsSummary
    },
  })

  const percentageMealsInDiet = calculatePercentage({
    value: mealsSummary?.meals_in_diet || 0,
    total: mealsSummary?.total_meals || 0,
  })

  const percentageMealsInDietFormatted = percentageMealsInDiet
    .toString()
    .replace('.', ',')

  const isPercentageMealsInDietGood = percentageMealsInDiet > 50

  const { base, percentage, description, icon } = percentVariants({
    color: isPercentageMealsInDietGood ? 'primary' : 'secondary',
  })

  return (
    <header className={base({ class: className })} {...props}>
      <Link href="/home" className="self-start">
        <ArrowLeft className={icon()} size={24} />
      </Link>

      <div className="flex flex-col items-center justify-center">
        <strong className={percentage()}>
          {percentageMealsInDietFormatted}%
        </strong>
        <span className={description()}>das refeições dentro da dieta</span>
      </div>
    </header>
  )
}
