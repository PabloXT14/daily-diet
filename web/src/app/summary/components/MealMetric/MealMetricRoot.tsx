import { cn } from '@/lib/utils'
import { ComponentProps, forwardRef } from 'react'

type MealMetricRootProps = ComponentProps<'div'>

const MealMetricRoot = forwardRef<HTMLDivElement, MealMetricRootProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex flex-col items-center justify-center gap-2 rounded-lg bg-gray-200 p-4',
          className,
        )}
        {...props}
      >
        {children}
      </div>
    )
  },
)

MealMetricRoot.displayName = 'MealMetricRoot'

export { MealMetricRoot }
