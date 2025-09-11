import { NextRequest, NextResponse } from 'next/server'
import createAnthropicClient, { validateApiKey } from '@/lib/claude'
import { getSupabaseClient } from '@/lib/supabase'

export const maxDuration = 30

export async function GET(request: NextRequest) {
  const startedAt = Date.now()
  const requestId = request.headers.get('x-request-id') || `diag_${startedAt}_${Math.random().toString(36).slice(2, 8)}`

  const results: any = {
    requestId,
    timestamp: new Date().toISOString(),
    runtime: {
      vercel: process.env.VERCEL === '1',
      region: process.env.VERCEL_REGION || 'unknown',
      nodeVersion: process.version,
    },
    env: {
      hasClaudeKey: !!process.env.CLAUDE_API_KEY,
      hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasSupabaseAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    },
    checks: {
      claude: { ok: false as boolean, ms: 0, error: undefined as string | undefined },
      supabase: { ok: false as boolean, ms: 0, error: undefined as string | undefined, count: undefined as number | undefined },
    }
  }

  // Claude health (tiny request)
  if (!validateApiKey()) {
    results.checks.claude.error = 'CLAUDE_API_KEY missing'
  } else {
    try {
      const t0 = Date.now()
      const anthropic = createAnthropicClient()
      const msg = await anthropic.messages.create({
        model: 'claude-3-5-sonnet-latest',
        max_tokens: 1,
        temperature: 0,
        messages: [{ role: 'user', content: 'ok' }],
      })
      results.checks.claude.ok = !!msg?.id
      results.checks.claude.ms = Date.now() - t0
    } catch (e: any) {
      results.checks.claude.error = e?.message || 'unknown Claude error'
    }
  }

  // Supabase health (HEAD count query)
  try {
    const t0 = Date.now()
    const supabase = getSupabaseClient()
    const { count, error } = await supabase
      .from('postcards')
      .select('id', { head: true, count: 'estimated' })

    if (error) throw error
    results.checks.supabase.ok = true
    results.checks.supabase.ms = Date.now() - t0
    results.checks.supabase.count = count ?? 0
  } catch (e: any) {
    results.checks.supabase.error = e?.message || 'unknown Supabase error'
  }

  results.durationMs = Date.now() - startedAt
  const status = results.checks.claude.ok && results.checks.supabase.ok ? 200 : 503
  return NextResponse.json(results, { status })
}

export async function POST(request: NextRequest) {
  // Echo GET for convenience in Postman
  return GET(request)
}

