import { ComponentPropsWithoutRef, forwardRef } from 'react'

import { cn } from '@/lib/utils'

type MealMetricNumberProps = ComponentPropsWithoutRef<'span'> & {
  metricNumber: number
}

const MealMetricNumber = forwardRef<HTMLSpanElement, MealMetricNumberProps>(
  ({ className, metricNumber, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn('text-2xl font-bold text-gray-700', className)}
        {...props}
      >
        {metricNumber}
      </span>
    )
  },
)

MealMetricNumber.displayName = 'MealMetricNumber'

export { MealMetricNumber }
