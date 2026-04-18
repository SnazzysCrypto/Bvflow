import React from 'react'

interface Tab { id: string; label: string }

interface TabsProps {
  tabs: Tab[]
  active: string
  onChange: (id: string) => void
}

export function Tabs({ tabs, active, onChange }: TabsProps) {
  return (
    <div className="flex border-b border-gray-200">
      {tabs.map(t => (
        <button
          key={t.id}
          onClick={() => onChange(t.id)}
          className={[
            'px-3 py-2 text-xs font-medium transition-colors border-b-2 -mb-px',
            active === t.id
              ? 'border-brand-500 text-brand-600'
              : 'border-transparent text-gray-500 hover:text-gray-700',
          ].join(' ')}
        >
          {t.label}
        </button>
      ))}
    </div>
  )
}
