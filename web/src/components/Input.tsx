import { InputHTMLAttributes, forwardRef } from 'react'

import { cn } from '@/lib/utils'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, id, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label htmlFor={id} className="text-sm font-bold text-gray-600">
            {label}
          </label>
        )}
        <input
          id={id}
          type={type}
          className={cn(
            [
              'rounded-md border border-gray-300 p-3 text-base text-gray-700 outline-none',
              'focus:border-gray-700',
            ],
            className,
          )}
          ref={ref}
          {...props}
        />
      </div>
    )
  },
)
Input.displayName = 'Input'

export { Input }
