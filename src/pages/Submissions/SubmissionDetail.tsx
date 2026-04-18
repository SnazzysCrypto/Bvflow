import React from 'react'
import { SlideOver } from '../../components/ui/SlideOver'
import { Badge } from '../../components/ui/Badge'
import type { Submission } from '../../types/analytics'

interface SubmissionDetailProps {
  submission: Submission | null
  onClose: () => void
  onStatusChange: (id: string, status: string) => void
}

export function SubmissionDetail({ submission, onClose, onStatusChange }: SubmissionDetailProps) {
  if (!submission) return null

  const date = (s: string | null) => s ? new Date(s).toLocaleString() : '—'

  return (
    <SlideOver open={!!submission} onClose={onClose} title="Submission detail">
      <div className="flex flex-col gap-5">
        {/* Meta */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-xs text-gray-400 mb-0.5">Started</p>
            <p className="text-gray-700">{date(submission.startedAt)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-0.5">Completed</p>
            <p className="text-gray-700">{date(submission.completedAt)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-0.5">Steps reached</p>
            <p className="text-gray-700">{submission.lastStep + 1} of {submission.totalSteps}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-0.5">Status</p>
            <select
              value={submission.status}
              onChange={e => onStatusChange(submission.id, e.target.value)}
              className="text-xs border border-gray-200 rounded px-2 py-1"
            >
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="closed">Closed</option>
            </select>
          </div>
        </div>

        {/* Data */}
        <div>
          <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Responses</h4>
          <div className="flex flex-col gap-2">
            {Object.entries(submission.data).length === 0 ? (
              <p className="text-sm text-gray-400">No field data</p>
            ) : (
              Object.entries(submission.data).map(([key, val]) => (
                <div key={key} className="bg-gray-50 rounded-lg px-3 py-2.5">
                  <p className="text-xs text-gray-400 mb-0.5">{key}</p>
                  <p className="text-sm text-gray-800 break-words">{Array.isArray(val) ? val.join(', ') : String(val ?? '—')}</p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* ID */}
        <p className="text-xs text-gray-300 font-mono">{submission.id}</p>
      </div>
    </SlideOver>
  )
}
