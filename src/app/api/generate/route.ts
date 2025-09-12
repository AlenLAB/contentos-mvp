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
    
    // FREE TIER LIMITATION: Prevent timeout by limiting posts
    const postsPerDay = body.postsPerDay || 1
    const duration = body.duration || 30
    const totalToGenerate = postsPerDay * duration
    const FREE_TIER_MAX_POSTS = 5 // Must complete within 10 seconds
    
    if (totalToGenerate > FREE_TIER_MAX_POSTS) {
      console.log(`[generate][${requestId}] ⚠️ Free tier limit exceeded: ${totalToGenerate} posts requested, max ${FREE_TIER_MAX_POSTS}`)
      return NextResponse.json(
        { 
          error: 'Too many posts for free tier',
          details: `Vercel free tier has a 10-second timeout. You requested ${totalToGenerate} posts, but the maximum is ${FREE_TIER_MAX_POSTS} posts to avoid timeout.`,
          errorType: 'free_tier_limit',
          requestId,
          suggestion: `Try generating ${FREE_TIER_MAX_POSTS} posts at a time. You can run multiple generations to create more content.`,
          limits: {
            requested: totalToGenerate,
            maximum: FREE_TIER_MAX_POSTS,
            reason: 'Vercel free tier 10-second timeout'
          }
        },
        { status: 400 }
      )
    }

    // Generate the content using Claude (variables already declared above)
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
    const requestId = request.headers.get('x-request-id') || 'unknown'
    console.error(`[generate][${requestId}] 🧨 Error in generate API:`, error)
    
    if (error instanceof Error) {
      // Handle specific error types with user-friendly messages
      if (error.message.includes('API key') || error.message.includes('CLAUDE_API_KEY')) {
        return NextResponse.json(
          { 
            error: 'AI service not configured',
            details: 'The ContentOS AI service is not properly set up. Please check that your Claude API key is configured correctly.',
            errorType: 'configuration',
            requestId
          },
          { status: 500 }
        )
      }
      
      if (error.message.includes('rate limit') || error.message.includes('429')) {
        return NextResponse.json(
          { 
            error: 'Too many requests',
            details: 'You\'ve exceeded the AI service rate limit. Please wait a few minutes and try again.',
            errorType: 'rate_limit',
            requestId,
            suggestion: 'Try generating fewer posts at once or wait 2-3 minutes before retrying.'
          },
          { status: 429 }
        )
      }
      
      if (error.message.includes('Supabase') || error.message.includes('database') || error.message.includes('NEXT_PUBLIC_SUPABASE')) {
        return NextResponse.json(
          { 
            error: 'Database connection failed',
            details: 'Unable to connect to the ContentOS database. Please try again in a moment.',
            errorType: 'database',
            requestId
          },
          { status: 500 }
        )
      }
      
      if (error.message.includes('timeout') || error.message.includes('AbortError')) {
        return NextResponse.json(
          { 
            error: 'Request timed out',
            details: 'The content generation took too long to complete.',
            errorType: 'timeout',
            requestId,
            suggestion: 'Try generating fewer posts at once (reduce duration or posts per day).'
          },
          { status: 408 }
        )
      }
      
      if (error.message.includes('network') || error.message.includes('fetch') || error.message.includes('ENOTFOUND')) {
        return NextResponse.json(
          { 
            error: 'Network connection failed',
            details: 'Unable to connect to external services. Please check your internet connection.',
            errorType: 'network',
            requestId
          },
          { status: 503 }
        )
      }
      
      // Handle JSON parsing errors from Claude API
      if (error.message.includes('JSON') || error.message.includes('parse')) {
        return NextResponse.json(
          { 
            error: 'AI response format error',
            details: 'The AI service returned an unexpected response format. This is usually temporary.',
            errorType: 'parsing',
            requestId,
            suggestion: 'Try again - this usually resolves itself.'
          },
          { status: 502 }
        )
      }
    }

    // Generic error with full context for debugging
    return NextResponse.json(
      { 
        error: 'Content generation failed',
        details: error instanceof Error ? error.message : 'An unexpected error occurred during content generation.',
        errorType: 'unknown',
        requestId,
        timestamp: new Date().toISOString(),
        suggestion: 'Please try again. If the problem persists, try generating fewer posts.'
      },
      { status: 500 }
    )
  }
}

// Configure Vercel function max duration (in seconds)
// Note: Free tier is limited to 10 seconds regardless of this setting
export const maxDuration = 10 // Match free tier limit
