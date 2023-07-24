'use client'

import { MealMetric } from './MealMetric'

export function ContentSection() {
  return (
    <section className="flex-1 rounded-t-[20px] bg-gray-100 px-6 pt-8">
      <h2 className="mb-6 text-center text-sm font-bold text-gray-700">
        Estatísticas gerais
      </h2>

      <div className="flex flex-col gap-3">
        {/* Sequence */}
        <MealMetric.Root>
          <MealMetric.Number metricNumber={22} />
          <MealMetric.Description
            metricDescription={'melhor sequência de pratos dentro da dieta'}
          />
        </MealMetric.Root>

        {/* Total */}
        <MealMetric.Root>
          <MealMetric.Number metricNumber={109} />
          <MealMetric.Description metricDescription={'refeições registradas'} />
        </MealMetric.Root>

        {/* Info */}
        <div className="flex flex-wrap gap-3">
          {/* Success */}
          <MealMetric.Root className="min-w-[130px] flex-1 bg-green-light">
            <MealMetric.Number metricNumber={99} />
            <MealMetric.Description
              metricDescription={'refeições dentro da dieta'}
            />
          </MealMetric.Root>

          {/* Fail */}
          <MealMetric.Root className="min-w-[130px] flex-1 bg-red-light">
            <MealMetric.Number metricNumber={10} />
            <MealMetric.Description
              metricDescription={'refeições fora da dieta'}
            />
          </MealMetric.Root>
        </div>
      </div>
    </section>
  )
}
