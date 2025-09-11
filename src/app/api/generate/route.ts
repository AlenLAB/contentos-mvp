import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseClient } from '@/lib/supabase'
import { generatePhaseContent } from '@/lib/claude'

interface GeneratePhaseRequest {
  phaseDescription: string
  phaseTitle: string
  postsPerDay?: number
  duration?: number
  template?: 'story' | 'tool' | 'mixed'
}

export async function POST(request: NextRequest) {
  // Increase serverless function budget to accommodate Claude latency on Vercel
  // Vercel reads this export from the module scope
  
  try {
    const startedAt = Date.now()
    const requestId = request.headers.get('x-request-id') || `gen_${startedAt}_${Math.random().toString(36).slice(2, 8)}`
    console.log(`[generate][${requestId}] ▶️ Start handling POST /api/generate`)

    // Validate environment variables early
    if (!process.env.CLAUDE_API_KEY) {
      console.error(`[generate][${requestId}] ❌ CLAUDE_API_KEY not found in environment`)
      return NextResponse.json(
        { error: 'AI service not configured. CLAUDE_API_KEY missing.' },
        { status: 500 }
      )
    }

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.error(`[generate][${requestId}] ❌ Supabase environment variables missing`)
      return NextResponse.json(
        { error: 'Database not configured. Supabase environment variables missing.' },
        { status: 500 }
      )
    }

    const body: GeneratePhaseRequest = await request.json()
    console.log(`[generate][${requestId}] 📥 Body received`, {
      hasTitle: !!body?.phaseTitle,
      titleLen: body?.phaseTitle?.length || 0,
      hasDesc: !!body?.phaseDescription,
      descLen: body?.phaseDescription?.length || 0,
      postsPerDay: body?.postsPerDay ?? '(default)',
      duration: body?.duration ?? '(default)',
      template: body?.template ?? '(default)'
    })
    
    // Validate request
    if (!body.phaseDescription?.trim() || !body.phaseTitle?.trim()) {
      return NextResponse.json(
        { error: 'Phase title and description are required' },
        { status: 400 }
      )
    }

    // Generate the content using Claude
    const postsPerDay = body.postsPerDay || 1
    const duration = body.duration || 30
    const totalToGenerate = postsPerDay * duration
    console.log(`[generate][${requestId}] 🤖 Calling Claude to generate ${totalToGenerate} posts`)
    const generatedPosts = await generatePhaseContent({
      phaseTitle: body.phaseTitle,
      phaseDescription: body.phaseDescription,
      postsPerDay,
      duration,
      template: body.template || 'mixed'
    })
    console.log(`[generate][${requestId}] ✅ Claude returned ${generatedPosts.length} generated posts`)

    // Get Supabase client with runtime initialization
    const supabase = getSupabaseClient()
    console.log(`[generate][${requestId}] 📊 Supabase client initialized successfully`)

    // Save the generated posts to the database
    const postcards = []
    const failures: Array<{ index: number; error: string }> = []
    
    for (const [index, post] of generatedPosts.entries()) {
      const insertStarted = Date.now()
      const { data, error } = await supabase
        .from('postcards')
        .insert({
          english_content: post.english_content,
          swedish_content: post.swedish_content,
          state: 'draft' as const,
          template: post.template,
          scheduled_date: null,
          published_date: null,
        })
        .select()
        .single()

      if (error) {
        console.error(`[generate][${requestId}] ❌ Insert failed for index ${index}:`, error)
        failures.push({ index, error: error?.message || 'unknown insert error' })
        continue
      }

      if (data) {
        postcards.push(data)
        console.log(`[generate][${requestId}] 💾 Inserted postcard index ${index} in ${Date.now() - insertStarted}ms`)
      }
    }

    const durationMs = Date.now() - startedAt
    console.log(`[generate][${requestId}] 🏁 Completed with ${postcards.length}/${generatedPosts.length} inserts in ${durationMs}ms`)
    return NextResponse.json({
      success: true,
      message: `Generated ${postcards.length} postcards successfully`,
      postcards,
      metadata: {
        requestId,
        generatedCount: generatedPosts.length,
        insertedCount: postcards.length,
        failureCount: failures.length,
        failures,
        durationMs
      },
      phase: {
        title: body.phaseTitle,
        description: body.phaseDescription,
        postsGenerated: postcards.length,
      }
    })

  } catch (error) {
    console.error('[generate] 🧨 Error in generate API:', error)
    
    if (error instanceof Error) {
      // Handle Claude API specific errors
      if (error.message.includes('API key')) {
        return NextResponse.json(
          { error: 'AI service configuration error. Please check API keys.' },
          { status: 500 }
        )
      }
      
      if (error.message.includes('rate limit')) {
        return NextResponse.json(
          { error: 'Too many requests. Please try again in a few minutes.' },
          { status: 429 }
        )
      }
    }

    return NextResponse.json(
      { 
        error: 'Failed to generate content',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// Configure Vercel function max duration (in seconds)
export const maxDuration = 60
