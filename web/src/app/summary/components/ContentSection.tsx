import { ComponentProps } from 'react'
import { twMerge } from 'tailwind-merge'

import { MealMetric } from './MealMetric'

type ContentSectionProps = ComponentProps<'section'>

export function ContentSection({ className, ...props }: ContentSectionProps) {
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
          metricPercentage={22}
          metricDescription="melhor sequência de pratos dentro da dieta"
        />

        {/* Total */}
        <MealMetric
          metricPercentage={109}
          metricDescription="refeições registradas"
        />

        {/* Info */}
        <div className="flex flex-wrap gap-3">
          {/* Success */}
          <MealMetric
            metricPercentage={99}
            metricDescription="refeições dentro da dieta"
            className="min-w-[130px] flex-1"
            color="green"
          />

          {/* Fail */}
          <MealMetric
            metricPercentage={10}
            metricDescription="refeições fora da dieta"
            className="min-w-[130px] flex-1"
            color="red"
          />
        </div>
      </div>
    </section>
  )
}
