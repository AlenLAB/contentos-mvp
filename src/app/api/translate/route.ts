import { NextRequest, NextResponse } from 'next/server'
import anthropic, { validateApiKey } from '@/lib/claude'

// Request body interface
interface TranslateContentRequest {
  englishContent: string
  template?: 'story' | 'tool'
}

// Response interface
interface TranslateContentResponse {
  swedishContent: string
  characterCount: number
}

// Helper function to get system prompt for translation
function getTranslationPrompt(template?: string) {
  const templateContext = template 
    ? `The original content follows a ${template.toUpperCase()} template structure. Maintain this structure in the expanded version.`
    : 'Adapt the content structure as appropriate for LinkedIn.'

  return `You are a professional content translator and copywriter specializing in LinkedIn content for the Swedish market.

Your task is to translate and expand Twitter/X content (280 chars) into professional LinkedIn content in Swedish (500-1000 chars optimal, max 3000 chars).

${templateContext}

Translation and Expansion Guidelines:
1. Translate to professional yet conversational Swedish
2. Use "du" form for personal connection (not "ni")
3. Expand the content with:
   - Relevant context and background
   - Specific examples or case studies
   - Deeper insights and analysis
   - Clear value propositions
4. Structure the content with:
   - Strong opening hook
   - Clear paragraph breaks for readability (use \n\n)
   - Logical flow of ideas
   - Compelling call-to-action
5. Cultural adaptation:
   - Include Swedish-specific references where relevant
   - Adapt idioms and expressions naturally
   - Use Swedish business terminology appropriately
6. Include 3-5 relevant Swedish hashtags at the end
7. Maintain the original message's core intent and energy

Target length: 500-1000 characters (can extend to 3000 if the content benefits from it)

Important: The expansion should add real value, not just filler. Every sentence should serve a purpose.`
}

export async function POST(request: NextRequest) {
  try {
    // Validate API key is configured
    if (!validateApiKey()) {
      return NextResponse.json(
        { error: 'Claude API key is not configured' },
        { status: 500 }
      )
    }

    // Parse request body
    const body: TranslateContentRequest = await request.json()
    
    // Validate required fields
    if (!body.englishContent || body.englishContent.trim().length === 0) {
      return NextResponse.json(
        { error: 'englishContent is required' },
        { status: 400 }
      )
    }

    // Validate English content length (should be Twitter-sized)
    if (body.englishContent.length > 500) {
      return NextResponse.json(
        { error: 'englishContent seems too long for a Twitter post (max 500 chars for safety)' },
        { status: 400 }
      )
    }

    // Validate template if provided
    if (body.template && !['story', 'tool'].includes(body.template)) {
      return NextResponse.json(
        { error: 'template must be "story" or "tool" if provided' },
        { status: 400 }
      )
    }

    // Prepare the user message for Claude
    const userMessage = `Translate and expand this Twitter/X post into professional Swedish LinkedIn content:

Original English Tweet:
"${body.englishContent}"

Create an engaging, expanded LinkedIn post in Swedish that:
1. Captures the essence of the original message
2. Expands to 500-1000 characters with valuable context
3. Uses professional yet personal Swedish ("du" form)
4. Includes line breaks for readability
5. Ends with relevant Swedish hashtags

Return ONLY the Swedish LinkedIn post, no explanations or metadata.`

    // Generate translation using Claude
    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 4000,
      temperature: 0.7,
      system: getTranslationPrompt(body.template),
      messages: [
        {
          role: 'user',
          content: userMessage
        }
      ]
    })

    // Extract the text content from response
    const textContent = response.content.find(c => c.type === 'text')?.text
    if (!textContent) {
      throw new Error('No text content in Claude response')
    }

    // Clean and validate the Swedish content
    let swedishContent = textContent.trim()
    
    // Remove any potential wrapper text that Claude might add
    // (Sometimes Claude adds "Here is the Swedish LinkedIn post:" or similar)
    const unwantedPrefixes = [
      'Here is the Swedish LinkedIn post:',
      'Swedish LinkedIn post:',
      'LinkedIn post in Swedish:',
      'Swedish translation:',
      'Svensk LinkedIn-post:',
      'Här är LinkedIn-inlägget på svenska:'
    ]
    
    for (const prefix of unwantedPrefixes) {
      if (swedishContent.toLowerCase().startsWith(prefix.toLowerCase())) {
        swedishContent = swedishContent.substring(prefix.length).trim()
        break
      }
    }

    // Ensure content doesn't exceed LinkedIn's limit
    if (swedishContent.length > 3000) {
      console.warn('Swedish content exceeds 3000 characters, trimming...')
      // Try to trim at a sentence boundary
      const trimmedContent = swedishContent.substring(0, 2990)
      const lastPeriod = trimmedContent.lastIndexOf('.')
      const lastExclamation = trimmedContent.lastIndexOf('!')
      const lastQuestion = trimmedContent.lastIndexOf('?')
      
      const lastSentenceEnd = Math.max(lastPeriod, lastExclamation, lastQuestion)
      
      if (lastSentenceEnd > 2500) {
        swedishContent = trimmedContent.substring(0, lastSentenceEnd + 1)
      } else {
        swedishContent = trimmedContent + '...'
      }
    }

    // Check if content is within optimal range
    const characterCount = swedishContent.length
    if (characterCount < 300) {
      console.warn(`Swedish content is quite short (${characterCount} chars). Consider requesting a re-generation.`)
    }

    // Create response
    const responseData: TranslateContentResponse = {
      swedishContent,
      characterCount
    }

    return NextResponse.json({
      success: true,
      ...responseData,
      metadata: {
        originalLength: body.englishContent.length,
        expansionRatio: (characterCount / body.englishContent.length).toFixed(2),
        withinOptimalRange: characterCount >= 500 && characterCount <= 1000,
        template: body.template || 'unspecified'
      }
    })

  } catch (error) {
    console.error('Error in translation:', error)
    
    // Handle specific error types
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        return NextResponse.json(
          { error: 'Claude API configuration error' },
          { status: 500 }
        )
      }
    }
    
    // Generic error response
    return NextResponse.json(
      { error: 'Failed to translate content' },
      { status: 500 }
    )
  }
}

// Handle unsupported methods
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  )
}