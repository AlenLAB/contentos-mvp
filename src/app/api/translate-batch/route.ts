import { NextRequest, NextResponse } from 'next/server'
import { anthropic, validateApiKey } from '@/lib/claude'
import { supabase } from '@/lib/supabase'

interface BatchTranslateRequest {
  postIds: string[]
}

interface PostToTranslate {
  id: string
  english_content: string
  template: string
}

// Helper to get translation prompt
function getBatchTranslationPrompt() {
  return `You are a professional content translator specializing in LinkedIn content for the Swedish market.
  
You will receive multiple Twitter/X posts in English. For each post, create a professional LinkedIn version in Swedish that:
1. Expands to 500-1000 characters with valuable context
2. Uses professional yet personal Swedish ("du" form)
3. Includes line breaks for readability
4. Adds relevant Swedish hashtags
5. Maintains the original message's core intent

Return a JSON array with translations in the same order as the input posts.`
}

export async function POST(request: NextRequest) {
  try {
    if (!validateApiKey()) {
      return NextResponse.json(
        { error: 'Claude API key is not configured' },
        { status: 500 }
      )
    }

    const body: BatchTranslateRequest = await request.json()
    
    if (!body.postIds || body.postIds.length === 0) {
      return NextResponse.json(
        { error: 'postIds array is required' },
        { status: 400 }
      )
    }

    // Fetch posts that need translation
    const { data: posts, error: fetchError } = await supabase
      .from('postcards')
      .select('id, english_content, template')
      .in('id', body.postIds)
      .or('translation_status.is.null,translation_status.eq.pending')

    if (fetchError || !posts) {
      console.error('Error fetching posts:', fetchError)
      return NextResponse.json(
        { error: 'Failed to fetch posts' },
        { status: 500 }
      )
    }

    if (posts.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No posts need translation',
        translatedCount: 0
      })
    }

    // Process in batches of 5 for efficiency
    const batchSize = 5
    let totalTranslated = 0
    const errors: string[] = []

    for (let i = 0; i < posts.length; i += batchSize) {
      const batch = posts.slice(i, i + batchSize) as PostToTranslate[]
      
      try {
        // Mark batch as processing
        await supabase
          .from('postcards')
          .update({ translation_status: 'processing' })
          .in('id', batch.map(p => p.id))

        // Create batch translation request
        const batchPrompt = batch.map((post, idx) => 
          `Post ${idx + 1} (${post.template} template):\n"${post.english_content}"`
        ).join('\n\n')

        // Call Claude for batch translation
        const response = await anthropic.messages.create({
          model: 'claude-3-5-sonnet-latest',
          max_tokens: 8000,
          temperature: 0.7,
          system: getBatchTranslationPrompt(),
          messages: [{
            role: 'user',
            content: `Translate these ${batch.length} posts to Swedish LinkedIn format:\n\n${batchPrompt}\n\nReturn as JSON array with ${batch.length} Swedish translations.`
          }]
        })

        // Extract and parse translations
        const textContent = response.content.find(c => c.type === 'text')?.text
        if (!textContent) {
          throw new Error('No response from Claude')
        }

        // Parse JSON array from response
        const jsonMatch = textContent.match(/\[[\s\S]*\]/)
        if (!jsonMatch) {
          throw new Error('Invalid response format')
        }

        const translations = JSON.parse(jsonMatch[0]) as string[]

        // Update each post with its translation
        for (let j = 0; j < batch.length && j < translations.length; j++) {
          const post = batch[j]
          const swedishContent = translations[j]?.trim() || ''
          
          if (swedishContent) {
            const { error: updateError } = await supabase
              .from('postcards')
              .update({
                swedish_content: swedishContent.slice(0, 3000), // Ensure within limit
                translation_status: 'completed',
                updated_at: new Date().toISOString()
              })
              .eq('id', post.id)

            if (!updateError) {
              totalTranslated++
            } else {
              errors.push(`Failed to update post ${post.id}`)
            }
          }
        }

        // Small delay between batches to avoid rate limits
        if (i + batchSize < posts.length) {
          await new Promise(resolve => setTimeout(resolve, 1000))
        }

      } catch (batchError) {
        console.error(`Error translating batch ${i / batchSize + 1}:`, batchError)
        
        // Mark batch as failed
        await supabase
          .from('postcards')
          .update({ translation_status: 'failed' })
          .in('id', batch.map(p => p.id))
        
        errors.push(`Batch ${i / batchSize + 1} failed: ${batchError instanceof Error ? batchError.message : 'Unknown error'}`)
      }
    }

    return NextResponse.json({
      success: true,
      message: `Translated ${totalTranslated} of ${posts.length} posts`,
      translatedCount: totalTranslated,
      errors: errors.length > 0 ? errors : undefined
    })

  } catch (error) {
    console.error('Batch translation error:', error)
    return NextResponse.json(
      { error: 'Failed to process batch translation' },
      { status: 500 }
    )
  }
}

// Support GET to check translation status
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get('status') || 'pending'

    const { data, error } = await supabase
      .from('postcards')
      .select('id, translation_status')
      .eq('translation_status', status)

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch translation status' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      status,
      count: data?.length || 0,
      posts: data
    })

  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to check translation status' },
      { status: 500 }
    )
  }
}