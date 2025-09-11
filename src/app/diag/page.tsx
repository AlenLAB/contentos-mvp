'use client'

import React, { useState } from 'react'

export default function DiagPage() {
  const [diagLoading, setDiagLoading] = useState(false)
  const [genLoading, setGenLoading] = useState(false)
  const [diagResult, setDiagResult] = useState<any>(null)
  const [genResult, setGenResult] = useState<any>(null)
  const [requestId, setRequestId] = useState<string>('')

  const runDiag = async () => {
    setDiagLoading(true)
    setDiagResult(null)
    try {
      const res = await fetch('/api/diag', { cache: 'no-store' })
      const json = await res.json()
      setDiagResult(json)
    } catch (e) {
      setDiagResult({ error: e instanceof Error ? e.message : 'Unknown error' })
    } finally {
      setDiagLoading(false)
    }
  }

  const runGenerate = async () => {
    setGenLoading(true)
    setGenResult(null)
    const reqId = `ui_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
    setRequestId(reqId)
    try {
      const body = {
        phaseTitle: 'Test',
        phaseDescription: 'Short',
        duration: 1,
        postsPerDay: 1,
        template: 'story',
      }
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-request-id': reqId,
        },
        body: JSON.stringify(body),
      })
      const json = await res.json()
      setGenResult({ status: res.status, ok: res.ok, json })
    } catch (e) {
      setGenResult({ error: e instanceof Error ? e.message : 'Unknown error' })
    } finally {
      setGenLoading(false)
    }
  }

  return (
    <main className="min-h-screen w-full p-6 md:p-10 text-white bg-zinc-950">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-2xl font-semibold">Diagnostics</h1>
        <p className="text-zinc-400">Run server health checks and a minimal generate test.</p>

        <section className="space-y-3 p-4 rounded-lg border border-zinc-800 bg-zinc-900/40">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium">/api/diag</h2>
            <button
              onClick={runDiag}
              disabled={diagLoading}
              className="px-3 py-1.5 rounded-md bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50"
            >
              {diagLoading ? 'Running…' : 'Run Diag'}
            </button>
          </div>
          <pre className="whitespace-pre-wrap break-words text-sm bg-black/40 p-3 rounded-md overflow-auto max-h-96">
            {diagResult ? JSON.stringify(diagResult, null, 2) : 'No results yet.'}
          </pre>
        </section>

        <section className="space-y-3 p-4 rounded-lg border border-zinc-800 bg-zinc-900/40">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium">/api/generate (minimal)</h2>
            <button
              onClick={runGenerate}
              disabled={genLoading}
              className="px-3 py-1.5 rounded-md bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50"
            >
              {genLoading ? 'Generating…' : 'Run Generate'}
            </button>
          </div>
          {requestId && (
            <p className="text-xs text-zinc-400">requestId: {requestId}</p>
          )}
          <pre className="whitespace-pre-wrap break-words text-sm bg-black/40 p-3 rounded-md overflow-auto max-h-96">
            {genResult ? JSON.stringify(genResult, null, 2) : 'No results yet.'}
          </pre>
          <p className="text-xs text-zinc-500">Use the requestId to find logs in Vercel &gt; Runtime Logs for /api/generate.</p>
        </section>
      </div>
    </main>
  )
}

