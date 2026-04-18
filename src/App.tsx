import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { ToastContainer } from './components/ui/Toast'
import { Dashboard } from './pages/Dashboard'
import { Builder } from './pages/Builder'
import { SubmissionsPage } from './pages/Submissions'
import { AnalyticsPage } from './pages/Analytics'

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/builder/:funnelId" element={<Builder />} />
        <Route path="/submissions/:funnelId" element={<SubmissionsPage />} />
        <Route path="/analytics/:funnelId" element={<AnalyticsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <ToastContainer />
    </>
  )
}
