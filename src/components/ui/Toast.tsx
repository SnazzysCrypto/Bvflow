import React from 'react'
import { createPortal } from 'react-dom'
import { useUIStore } from '../../store/uiStore'

export function ToastContainer() {
  const toasts = useUIStore(s => s.toasts)
  const removeToast = useUIStore(s => s.removeToast)

  if (!toasts.length) return null

  return createPortal(
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map(t => (
        <div
          key={t.id}
          className={[
            'flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg text-sm font-medium',
            'animate-in slide-in-from-right-2 min-w-[240px] max-w-[360px]',
            t.type === 'success' ? 'bg-green-600 text-white' :
            t.type === 'error' ? 'bg-red-600 text-white' :
            'bg-gray-900 text-white',
          ].join(' ')}
        >
          <span className="flex-1">{t.message}</span>
          <button onClick={() => removeToast(t.id)} className="opacity-70 hover:opacity-100">✕</button>
        </div>
      ))}
    </div>,
    document.body
  )
}
