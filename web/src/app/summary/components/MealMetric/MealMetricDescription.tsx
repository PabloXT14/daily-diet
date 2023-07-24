import { ComponentPropsWithoutRef, forwardRef } from 'react'

import { cn } from '@/lib/utils'

type MealMetricDescriptonProps = ComponentPropsWithoutRef<'p'> & {
  metricDescription: string
}

const MealMetricDescription = forwardRef<
  HTMLParagraphElement,
  MealMetricDescriptonProps
>(({ className, metricDescription, ...props }, ref) => {
  return (
    <p
      ref={ref}
      className={cn('text-center text-sm text-gray-600', className)}
      {...props}
    >
      {metricDescription}
    </p>
  )
})

MealMetricDescription.displayName = 'MealMetricDescription'

export { MealMetricDescription }
