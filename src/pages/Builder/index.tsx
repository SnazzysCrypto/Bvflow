import React, { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useBuilderStore } from '../../store/builderStore'
import { useUIStore } from '../../store/uiStore'
import { funnelsApi } from '../../api/funnels'
import { useBuilderSync } from '../../hooks/useBuilderSync'
import { BuilderHeader } from './BuilderHeader'
import { StepList } from './StepList'
import { Canvas } from './Canvas'
import { Inspector } from './Inspector'
import { PreviewModal } from '../Preview'

export function Builder() {
  const { funnelId } = useParams<{ funnelId: string }>()
  const navigate = useNavigate()
  const loadFunnel = useBuilderStore(s => s.loadFunnel)
  const funnel = useBuilderStore(s => s.funnel)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  useBuilderSync()

  useEffect(() => {
    if (!funnelId) return
    setLoading(true)
    funnelsApi.get(funnelId)
      .then(f => { loadFunnel(f); setLoading(false) })
      .catch(e => { setError(e.message); setLoading(false) })
  }, [funnelId])

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-gray-400">
        Loading funnel…
      </div>
    )
  }

  if (error || !funnel) {
    return (
      <div className="h-screen flex flex-col items-center justify-center gap-3 text-gray-500">
        <p>Failed to load funnel: {error}</p>
        <button onClick={() => navigate('/')} className="text-brand-600 text-sm hover:underline">← Back to dashboard</button>
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <BuilderHeader />
      <div className="flex-1 flex overflow-hidden">
        <StepList />
        <Canvas />
        <Inspector />
      </div>
      <PreviewModal />
    </div>
  )
}
