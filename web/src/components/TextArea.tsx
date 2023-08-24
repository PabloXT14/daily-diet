import { TextareaHTMLAttributes, forwardRef } from 'react'

import { twMerge } from 'tailwind-merge'

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
}

const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ className, label, id, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label htmlFor={id} className="text-sm font-bold text-gray-600">
            {label}
          </label>
        )}
        <textarea
          id={id}
          className={twMerge(
            'rounded-md border border-gray-300 p-3 text-base text-gray-700 outline-none',
            'focus:border-gray-700',
            className,
          )}
          ref={ref}
          {...props}
        />
      </div>
    )
  },
)

TextArea.displayName = 'TextArea'

export { TextArea }
