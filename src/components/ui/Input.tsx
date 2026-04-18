import React from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
}

export function Input({ label, error, hint, className = '', id, ...props }: InputProps) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={inputId} className="text-xs font-medium text-gray-600">
          {label}
        </label>
      )}
      <input
        id={inputId}
        {...props}
        className={[
          'w-full rounded-md border px-3 py-1.5 text-sm bg-white text-gray-900 placeholder-gray-400',
          'outline-none transition-colors',
          error
            ? 'border-red-400 focus:border-red-500 focus:ring-1 focus:ring-red-200'
            : 'border-gray-200 focus:border-brand-400 focus:ring-1 focus:ring-brand-100',
          className,
        ].join(' ')}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
      {hint && !error && <p className="text-xs text-gray-400">{hint}</p>}
    </div>
  )
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  hint?: string
}

export function Textarea({ label, error, hint, className = '', id, ...props }: TextareaProps) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={inputId} className="text-xs font-medium text-gray-600">
          {label}
        </label>
      )}
      <textarea
        id={inputId}
        {...props}
        className={[
          'w-full rounded-md border px-3 py-1.5 text-sm bg-white text-gray-900 placeholder-gray-400',
          'outline-none transition-colors resize-y min-h-[80px]',
          error
            ? 'border-red-400 focus:border-red-500'
            : 'border-gray-200 focus:border-brand-400 focus:ring-1 focus:ring-brand-100',
          className,
        ].join(' ')}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
      {hint && !error && <p className="text-xs text-gray-400">{hint}</p>}
    </div>
  )
}
