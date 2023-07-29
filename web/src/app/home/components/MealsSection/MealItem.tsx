import { ComponentPropsWithoutRef } from 'react'
import { Circle } from '@/assets/icons/phosphor-react'
import { twMerge } from 'tailwind-merge'

interface MealItemProps extends ComponentPropsWithoutRef<'button'> {
  hour: string
  name: string
  isDiet: boolean
}

export function MealItem({
  hour,
  name,
  isDiet,
  className,
  ...props
}: MealItemProps) {
  return (
    <button
      className={twMerge(
        'flex w-full items-center justify-start gap-3 rounded-md border border-gray-300 px-4 py-[14px]',
        className,
      )}
      {...props}
    >
      <span className="text-xs font-bold text-gray-700">{hour}</span>
      <div className="h-[14px] border-r border-r-gray-400" />
      <p className="flex-1 truncate text-left text-base text-gray-600">
        {name}
      </p>
      <span>
        <Circle
          size={18}
          weight="fill"
          className={twMerge(isDiet ? 'text-green-mid' : 'text-red-mid')}
        />
      </span>
    </button>
  )
}
