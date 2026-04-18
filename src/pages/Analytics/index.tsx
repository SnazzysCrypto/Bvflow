import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { analyticsApi } from '../../api/analytics'
import { funnelsApi } from '../../api/funnels'
import type { AnalyticsSummary } from '../../types/analytics'
import type { Funnel } from '../../types/funnel'
import { Button } from '../../components/ui/Button'

export function AnalyticsPage() {
  const { funnelId } = useParams<{ funnelId: string }>()
  const navigate = useNavigate()
  const [funnel, setFunnel] = useState<Funnel | null>(null)
  const [data, setData] = useState<AnalyticsSummary | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!funnelId) return
    Promise.all([funnelsApi.get(funnelId), analyticsApi.getSummary(funnelId)])
      .then(([f, a]) => { setFunnel(f); setData(a); setLoading(false) })
      .catch(() => setLoading(false))
  }, [funnelId])

  const stat = (label: string, value: string | number, sub?: string) => (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <p className="text-xs text-gray-400 mb-1">{label}</p>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center gap-3">
          <button onClick={() => navigate('/')} className="text-gray-400 hover:text-gray-700">←</button>
          <div>
            <h1 className="font-semibold text-gray-900">{funnel?.title ?? 'Analytics'}</h1>
            <p className="text-xs text-gray-400">Funnel performance</p>
          </div>
          <div className="ml-auto">
            <Button size="sm" variant="ghost" onClick={() => funnelId && navigate(`/submissions/${funnelId}`)}>
              View submissions
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8">
        {loading ? (
          <div className="text-center text-gray-400 py-16">Loading analytics…</div>
        ) : !data ? (
          <div className="text-center text-gray-400 py-16">No analytics data available.</div>
        ) : (
          <div className="flex flex-col gap-8">
            {/* Overview stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {stat('Total views', data.totalViews)}
              {stat('Started', data.totalStarts)}
              {stat('Completed', data.totalCompletions)}
              {stat('Conversion rate', `${data.completionRate}%`, 'Views → Completions')}
            </div>

            {/* Step breakdown */}
            {data.stepBreakdown.length > 0 && (
              <div>
                <h2 className="text-sm font-semibold text-gray-700 mb-4">Step drop-off</h2>
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-100 text-left">
                        <th className="px-4 py-3 text-xs font-semibold text-gray-500">Step</th>
                        <th className="px-4 py-3 text-xs font-semibold text-gray-500">Views</th>
                        <th className="px-4 py-3 text-xs font-semibold text-gray-500">Completions</th>
                        <th className="px-4 py-3 text-xs font-semibold text-gray-500">Drop-off</th>
                        <th className="px-4 py-3 text-xs font-semibold text-gray-500">Retention</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.stepBreakdown.map((row, i) => {
                        const retention = 100 - row.dropOffRate
                        const funnelStep = funnel?.steps.find(s => s.id === row.stepId)
                        return (
                          <tr key={i} className="border-b border-gray-50">
                            <td className="px-4 py-3 text-gray-700">
                              <span className="text-gray-400 mr-2 text-xs">#{i + 1}</span>
                              {funnelStep?.title ?? `Step ${i + 1}`}
                            </td>
                            <td className="px-4 py-3 text-gray-600">{row.views}</td>
                            <td className="px-4 py-3 text-gray-600">{row.completions}</td>
                            <td className="px-4 py-3">
                              <span className={`text-xs font-medium ${row.dropOffRate > 50 ? 'text-red-500' : row.dropOffRate > 25 ? 'text-amber-500' : 'text-green-600'}`}>
                                {row.dropOffRate}%
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <div className="flex-1 bg-gray-100 rounded-full h-2 max-w-[120px]">
                                  <div
                                    className="h-2 rounded-full bg-brand-500 transition-all"
                                    style={{ width: `${retention}%` }}
                                  />
                                </div>
                                <span className="text-xs text-gray-500">{retention}%</span>
                              </div>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {data.stepBreakdown.length === 0 && (
              <div className="text-center text-gray-400 py-10 bg-white rounded-xl border border-gray-200">
                <div className="text-2xl mb-2">📊</div>
                <p>No step data yet. Share your published funnel to start collecting analytics.</p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
