import React, { useState } from 'react'
import { useBuilderStore } from '../../store/builderStore'
import { useUIStore } from '../../store/uiStore'
import { PreviewFrame } from './PreviewFrame'
import { createPortal } from 'react-dom'

export function PreviewModal() {
  const previewOpen = useUIStore(s => s.previewOpen)
  const closePreview = useUIStore(s => s.closePreview)
  const funnel = useBuilderStore(s => s.funnel)
  const [mobile, setMobile] = useState(false)

  if (!previewOpen || !funnel) return null

  return createPortal(
    <div className="fixed inset-0 z-50 bg-gray-900/90 flex flex-col">
      {/* Preview header */}
      <div className="flex items-center justify-between px-5 py-3 bg-gray-900 border-b border-gray-700 shrink-0">
        <span className="text-sm font-medium text-white">Preview — {funnel.title}</span>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-gray-800 rounded-lg p-1">
            <button
              onClick={() => setMobile(false)}
              className={`px-3 py-1 rounded text-xs font-medium transition-colors ${!mobile ? 'bg-white text-gray-900' : 'text-gray-400 hover:text-white'}`}
            >
              Desktop
            </button>
            <button
              onClick={() => setMobile(true)}
              className={`px-3 py-1 rounded text-xs font-medium transition-colors ${mobile ? 'bg-white text-gray-900' : 'text-gray-400 hover:text-white'}`}
            >
              Mobile
            </button>
          </div>
          <button onClick={closePreview} className="text-gray-400 hover:text-white transition-colors px-2 py-1 rounded hover:bg-gray-800">
            ✕ Close
          </button>
        </div>
      </div>

      {/* Preview content */}
      <div className="flex-1 overflow-auto">
        {mobile ? (
          <div className="flex items-center justify-center min-h-full py-8">
            <div
              className="relative overflow-hidden rounded-[2.5rem] shadow-2xl border-4 border-gray-700"
              style={{ width: '390px', height: '844px', backgroundColor: funnel.branding.backgroundColor }}
            >
              <div className="h-full overflow-y-auto">
                <PreviewFrame funnel={funnel} mobile />
              </div>
            </div>
          </div>
        ) : (
          <div style={{ minHeight: '100%', backgroundColor: funnel.branding.backgroundColor }}>
            <PreviewFrame funnel={funnel} mobile={false} />
          </div>
        )}
      </div>
    </div>,
    document.body
  )
}
