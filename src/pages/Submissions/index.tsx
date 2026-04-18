import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { submissionsApi } from '../../api/submissions'
import { funnelsApi } from '../../api/funnels'
import type { Submission } from '../../types/analytics'
import type { Funnel } from '../../types/funnel'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { SubmissionDetail } from './SubmissionDetail'

export function SubmissionsPage() {
  const { funnelId } = useParams<{ funnelId: string }>()
  const navigate = useNavigate()
  const [funnel, setFunnel] = useState<Funnel | null>(null)
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<Submission | null>(null)

  useEffect(() => {
    if (!funnelId) return
    Promise.all([
      funnelsApi.get(funnelId),
      submissionsApi.list(funnelId),
    ]).then(([f, res]) => {
      setFunnel(f)
      setSubmissions(res.submissions)
      setTotal(res.total)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [funnelId])

  const handleStatusChange = async (id: string, status: string) => {
    if (!funnelId) return
    await submissionsApi.updateStatus(funnelId, id, status)
    setSubmissions(prev => prev.map(s => s.id === id ? { ...s, status: status as any } : s))
    if (selected?.id === id) setSelected(prev => prev ? { ...prev, status: status as any } : null)
  }

  const statusVariant = (s: string) => {
    if (s === 'new') return 'new'
    if (s === 'contacted') return 'contacted'
    return 'closed'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center gap-3">
          <button onClick={() => navigate('/')} className="text-gray-400 hover:text-gray-700">←</button>
          <div>
            <h1 className="font-semibold text-gray-900">{funnel?.title ?? 'Submissions'}</h1>
            <p className="text-xs text-gray-400">{total} submission{total !== 1 ? 's' : ''} total</p>
          </div>
          <div className="ml-auto flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => funnelId && window.open(submissionsApi.csvUrl(funnelId), '_blank')}
            >
              Export CSV
            </Button>
            <Button size="sm" variant="ghost" onClick={() => funnelId && navigate(`/analytics/${funnelId}`)}>
              Analytics
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8">
        {loading ? (
          <div className="text-center text-gray-400 py-16">Loading…</div>
        ) : submissions.length === 0 ? (
          <div className="text-center text-gray-400 py-16">
            <div className="text-3xl mb-3">📭</div>
            <p>No submissions yet. Share your funnel to start collecting leads.</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-left">
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500">Date</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500">Status</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500">Complete</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500">Steps</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500">Preview</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {submissions.map(s => {
                  const topField = Object.entries(s.data).find(([k]) => !k.includes('consent') && !k.includes('_first') && !k.includes('_last'))
                  return (
                    <tr key={s.id} className="border-b border-gray-50 hover:bg-gray-50 cursor-pointer" onClick={() => setSelected(s)}>
                      <td className="px-4 py-3 text-gray-600">
                        {new Date(s.startedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={statusVariant(s.status) as any}>{s.status}</Badge>
                      </td>
                      <td className="px-4 py-3">
                        {s.isComplete ? (
                          <span className="text-green-600 font-medium text-xs">✓ Yes</span>
                        ) : (
                          <span className="text-gray-400 text-xs">Partial</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-gray-500 text-xs">{s.lastStep + 1}/{s.totalSteps}</td>
                      <td className="px-4 py-3 text-gray-500 text-xs max-w-[200px] truncate">
                        {topField ? `${topField[0]}: ${String(topField[1])}` : '—'}
                      </td>
                      <td className="px-4 py-3">
                        <button className="text-xs text-brand-600 hover:underline" onClick={e => { e.stopPropagation(); setSelected(s) }}>
                          View
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </main>

      <SubmissionDetail
        submission={selected}
        onClose={() => setSelected(null)}
        onStatusChange={handleStatusChange}
      />
    </div>
  )
}
