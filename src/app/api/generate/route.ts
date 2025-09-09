import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { generatePhaseContent } from '@/lib/claude'

interface GeneratePhaseRequest {
  phaseDescription: string
  phaseTitle: string
  postsPerDay?: number
  duration?: number
  template?: 'story' | 'tool' | 'mixed'
}

export async function POST(request: NextRequest) {
  try {
    const body: GeneratePhaseRequest = await request.json()
    
    // Validate request
    if (!body.phaseDescription?.trim() || !body.phaseTitle?.trim()) {
      return NextResponse.json(
        { error: 'Phase title and description are required' },
        { status: 400 }
      )
    }

    // Generate the content using Claude
    const generatedPosts = await generatePhaseContent({
      phaseTitle: body.phaseTitle,
      phaseDescription: body.phaseDescription,
      postsPerDay: body.postsPerDay || 1,
      duration: body.duration || 30,
      template: body.template || 'mixed'
    })

    // Save the generated posts to the database
    const postcards = []
    
    for (const post of generatedPosts) {
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
        console.error('Error saving postcard:', error)
        continue
      }

      if (data) {
        postcards.push(data)
      }
    }

    return NextResponse.json({
      success: true,
      message: `Generated ${postcards.length} postcards successfully`,
      postcards,
      phase: {
        title: body.phaseTitle,
        description: body.phaseDescription,
        postsGenerated: postcards.length,
      }
    })

  } catch (error) {
    console.error('Error in generate API:', error)
    
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