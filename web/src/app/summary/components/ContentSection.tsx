'use client'

import { ComponentProps } from 'react'
import { twMerge } from 'tailwind-merge'
import { useQuery } from '@tanstack/react-query'

import { MealMetric } from './MealMetric'
import { api } from '@/lib/api'
import { MealsSummary } from '@/@types/meal'

type ContentSectionProps = ComponentProps<'section'>

export function ContentSection({ className, ...props }: ContentSectionProps) {
  const { data: mealsSummary } = useQuery({
    queryKey: ['meals-summary'],
    queryFn: async () => {
      const response = await api.get('/meals/summary', {
        withCredentials: true,
      })

      return response.data.summary as MealsSummary
    },
  })

  if (!mealsSummary) {
    return null
  }

  return (
    <section
      className={twMerge(
        'flex-1 rounded-t-[20px] bg-gray-100 px-6 pt-8',
        className,
      )}
      {...props}
    >
      <h2 className="mb-6 text-center text-sm font-bold text-gray-700">
        Estatísticas gerais
      </h2>

      <div className="flex flex-col gap-3">
        {/* Sequence */}
        <MealMetric
          metricPercentage={mealsSummary.best_diet_sequence}
          metricDescription="melhor sequência de pratos dentro da dieta"
        />

        {/* Total */}
        <MealMetric
          metricPercentage={mealsSummary.total_meals}
          metricDescription="refeições registradas"
        />

        {/* Info */}
        <div className="flex flex-wrap gap-3">
          {/* Success */}
          <MealMetric
            metricPercentage={mealsSummary.meals_in_diet}
            metricDescription="refeições dentro da dieta"
            className="min-w-[130px] flex-1"
            color="green"
          />

          {/* Fail */}
          <MealMetric
            metricPercentage={mealsSummary.meals_out_of_diet}
            metricDescription="refeições fora da dieta"
            className="min-w-[130px] flex-1"
            color="red"
          />
        </div>
      </div>
    </section>
  )
}
