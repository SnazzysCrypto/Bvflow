import React from 'react'

type BadgeVariant = 'draft' | 'published' | 'archived' | 'new' | 'contacted' | 'closed' | 'default'

const variants: Record<BadgeVariant, string> = {
  draft: 'bg-gray-100 text-gray-600',
  published: 'bg-green-100 text-green-700',
  archived: 'bg-yellow-100 text-yellow-700',
  new: 'bg-blue-100 text-blue-700',
  contacted: 'bg-purple-100 text-purple-700',
  closed: 'bg-gray-100 text-gray-500',
  default: 'bg-gray-100 text-gray-600',
}

export function Badge({ variant = 'default', children }: { variant?: BadgeVariant; children: React.ReactNode }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${variants[variant]}`}>
      {children}
    </span>
  )
}
