import React from 'react'

interface ColorPickerProps {
  label?: string
  value: string
  onChange: (value: string) => void
}

export function ColorPicker({ label, value, onChange }: ColorPickerProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-xs font-medium text-gray-600">{label}</label>}
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={value || '#6471f5'}
          onChange={e => onChange(e.target.value)}
          className="w-8 h-8 rounded cursor-pointer border border-gray-200 p-0.5"
        />
        <input
          type="text"
          value={value}
          onChange={e => onChange(e.target.value)}
          maxLength={7}
          className="flex-1 text-xs rounded border border-gray-200 px-2 py-1.5 font-mono bg-white focus:outline-none focus:border-brand-400"
          placeholder="#6471f5"
        />
      </div>
    </div>
  )
}
