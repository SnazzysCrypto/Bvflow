import React from 'react'

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  options: { label: string; value: string }[]
}

export function Select({ label, error, options, className = '', id, ...props }: SelectProps) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={inputId} className="text-xs font-medium text-gray-600">
          {label}
        </label>
      )}
      <select
        id={inputId}
        {...props}
        className={[
          'w-full rounded-md border px-3 py-1.5 text-sm bg-white text-gray-900',
          'outline-none transition-colors appearance-none cursor-pointer',
          error ? 'border-red-400' : 'border-gray-200 focus:border-brand-400 focus:ring-1 focus:ring-brand-100',
          className,
        ].join(' ')}
      >
        {options.map(o => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}
