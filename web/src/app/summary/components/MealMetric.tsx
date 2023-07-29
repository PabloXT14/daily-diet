import { ComponentProps } from 'react'
import { tv, VariantProps } from 'tailwind-variants'

const mealMetricVariants = tv({
  slots: {
    wrapper: 'flex flex-col items-center justify-center gap-2 rounded-lg p-4',
    percentage: 'text-2xl font-bold text-gray-700',
    description: 'text-center text-sm text-gray-600',
  },
  variants: {
    color: {
      gray: {
        wrapper: 'bg-gray-200',
      },
      green: {
        wrapper: 'bg-green-light',
      },
      red: {
        wrapper: 'bg-red-light',
      },
    },
  },
  defaultVariants: {
    color: 'gray',
  },
})

type MealMetricProps = ComponentProps<'div'> &
  VariantProps<typeof mealMetricVariants> & {
    metricPercentage: number
    metricDescription?: string
  }

export function MealMetric({
  metricPercentage,
  metricDescription,
  color,
  className,
  ...props
}: MealMetricProps) {
  const { wrapper, percentage, description } = mealMetricVariants({ color })

  return (
    <div className={wrapper({ class: className })} {...props}>
      <span className={percentage()}>{metricPercentage}</span>
      {metricDescription && (
        <p className={description()}>{metricDescription}</p>
      )}
    </div>
  )
}
