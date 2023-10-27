import Link, { LinkProps } from 'next/link'
import { twMerge } from 'tailwind-merge'
import { format } from 'date-fns'

import { Circle } from '@/assets/icons/phosphor-react'
import { Meal } from '@/@types/meal'

type MealItemProps = LinkProps & {
  meal: Meal
  className?: string
}

export function MealItem({ meal, className, ...props }: MealItemProps) {
  return (
    <Link
      prefetch={false}
      className={twMerge(
        'flex w-full items-center justify-start gap-3 rounded-md border border-gray-300 px-4 py-[14px]',
        className,
      )}
      {...props}
    >
      <span className="text-xs font-bold text-gray-700">
        {format(new Date(meal.meal_datetime), 'HH:mm')}
      </span>
      <div className="h-[14px] border-r border-r-gray-400" />
      <p className="flex-1 truncate text-left text-base text-gray-600">
        {meal.name}
      </p>
      <span>
        <Circle
          size={18}
          weight="fill"
          className={twMerge(meal.is_diet ? 'text-green-mid' : 'text-red-mid')}
        />
      </span>
    </Link>
  )
}
