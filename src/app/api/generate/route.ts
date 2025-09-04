import { NextRequest, NextResponse } from 'next/server'
import anthropic, { validateApiKey } from '@/lib/claude'

// Template types
type Template = 'story' | 'tool' | 'mixed'

// Request body interface
interface GenerateContentRequest {
  phaseDescription: string
  phaseTitle: string
  postsPerDay?: number
  duration?: number
  template?: Template
}

// Response interface
interface Postcard {
  english_content: string
  template: string
}

// Template instructions for different content types
const TEMPLATE_INSTRUCTIONS = {
  story: `STORY TEMPLATE Structure:
- Start with a personal experience or relatable scenario (sets context)
- Share the learning moment or discovery (what happened)
- Highlight the key insight gained (the valuable takeaway)
- End with a call to action to encourage engagement

Keep it personal, authentic, and relatable. Focus on transformation and growth.`,
  
  tool: `TOOL TEMPLATE Structure:
- Identify a common problem or pain point (hook the reader)
- Introduce your solution/tool/method (the answer)
- Highlight 2-3 key features or benefits (value proposition)
- Explain practical impact (how it helps)
- End with a specific call to action (next step)

Keep it practical, actionable, and results-focused.`
}

// Helper function to get system prompt
function getSystemPrompt(template: Template, phaseTitle: string, phaseDescription: string) {
  const templateInstruction = template === 'mixed' 
    ? `Alternate between STORY and TOOL templates throughout the content phase.

${TEMPLATE_INSTRUCTIONS.story}

${TEMPLATE_INSTRUCTIONS.tool}`
    : TEMPLATE_INSTRUCTIONS[template]

  return `You are a content strategist creating a ${phaseTitle} content phase for personal branding. 
The phase theme: ${phaseDescription}

Each post must:
1. Be valuable, engaging, and fit within X/Twitter's 280 character limit (including hashtags)
2. Follow the template structure while keeping language natural and conversational
3. Include 2-3 relevant hashtags within the character count
4. Be standalone yet part of the cohesive phase theme
5. Drive engagement through clear value and actionable insights

${templateInstruction}

Important: 
- Character count includes ALL text, spaces, punctuation, and hashtags
- Make every character count - be concise and impactful
- Each post should feel complete on its own`
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

    // Check for empty body
    const contentLength = request.headers.get('content-length')
    if (!contentLength || contentLength === '0') {
      return NextResponse.json(
        { error: 'Request body is required' },
        { status: 400 }
      )
    }

    // Parse request body with error handling
    let body: GenerateContentRequest
    try {
      body = await request.json()
    } catch (parseError) {
      console.error('Error in content generation:', parseError)
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      )
    }
    
    // Validate required fields
    if (!body.phaseDescription || !body.phaseTitle) {
      return NextResponse.json(
        { error: 'phaseDescription and phaseTitle are required' },
        { status: 400 }
      )
    }

    // Set defaults
    const postsPerDay = body.postsPerDay || 1
    const duration = body.duration || 14
    const template = body.template || 'mixed'
    
    // Validate parameters
    if (postsPerDay < 1 || postsPerDay > 5) {
      return NextResponse.json(
        { error: 'postsPerDay must be between 1 and 5' },
        { status: 400 }
      )
    }
    
    if (duration < 1 || duration > 30) {
      return NextResponse.json(
        { error: 'duration must be between 1 and 30 days' },
        { status: 400 }
      )
    }
    
    if (!['story', 'tool', 'mixed'].includes(template)) {
      return NextResponse.json(
        { error: 'template must be "story", "tool", or "mixed"' },
        { status: 400 }
      )
    }
    
    // Calculate total posts needed
    const totalPosts = postsPerDay * duration
    
    // Prepare the user message for Claude
    const userMessage = `Generate exactly ${totalPosts} Twitter/X posts for the "${body.phaseTitle}" content phase.

Phase Description: ${body.phaseDescription}

Requirements:
- Create ${totalPosts} unique posts (${postsPerDay} per day for ${duration} days)
- ${template === 'mixed' ? 'Alternate between story and tool templates' : `Use ${template} template for all posts`}
- Each post MUST be 280 characters or less (including hashtags)
- Include 2-3 relevant hashtags in each post
- Ensure variety while maintaining thematic consistency

Return a JSON array with exactly ${totalPosts} objects, each containing:
{
  "english_content": "The complete Twitter/X post with hashtags (max 280 chars)",
  "template": "story" or "tool" (the template type used)
}`

    // Generate content using Claude
    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 8000,
      temperature: 0.7,
      system: getSystemPrompt(template, body.phaseTitle, body.phaseDescription),
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

    // Parse JSON from the response
    let postcards: Postcard[]
    try {
      // Extract JSON array from the response
      const jsonMatch = textContent.match(/\[[\s\S]*\]/)
      if (!jsonMatch) {
        throw new Error('No JSON array found in response')
      }
      postcards = JSON.parse(jsonMatch[0])
    } catch (parseError) {
      console.error('Error parsing Claude response:', parseError)
      console.error('Response text:', textContent)
      throw new Error('Failed to parse content from Claude response')
    }

    // Validate and clean the postcards
    const validatedPostcards = postcards.map((card, index) => {
      // Ensure character limit
      if (card.english_content.length > 280) {
        console.warn(`Post ${index + 1} exceeds 280 characters, trimming...`)
        card.english_content = card.english_content.substring(0, 280)
      }
      
      // Ensure template is specified
      if (!card.template) {
        card.template = template === 'mixed' 
          ? (index % 2 === 0 ? 'story' : 'tool')
          : template
      }
      
      return {
        english_content: card.english_content,
        template: card.template
      }
    })

    // Ensure we have the correct number of postcards
    if (validatedPostcards.length !== totalPosts) {
      console.warn(`Expected ${totalPosts} postcards, got ${validatedPostcards.length}`)
    }

    return NextResponse.json({
      success: true,
      postcards: validatedPostcards,
      metadata: {
        phaseTitle: body.phaseTitle,
        phaseDescription: body.phaseDescription,
        totalPosts: validatedPostcards.length,
        postsPerDay,
        duration,
        template
      }
    })

  } catch (error) {
    console.error('Error in content generation:', error)
    
    // Handle specific error types
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        return NextResponse.json(
          { error: 'Claude API configuration error' },
          { status: 500 }
        )
      }
      
      if (error.message.includes('parse')) {
        return NextResponse.json(
          { error: 'Failed to parse generated content' },
          { status: 500 }
        )
      }
    }
    
    // Generic error response
    return NextResponse.json(
      { error: 'Failed to generate content' },
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