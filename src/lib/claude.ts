import Anthropic from '@anthropic-ai/sdk'
import { PostTemplate } from '@/types/database'

// Utility function to clean control characters from JSON strings
function sanitizeJsonString(str: string): string {
  // Remove or escape control characters that break JSON parsing
  return str
    .replace(/[\u0000-\u001F\u007F-\u009F]/g, '') // Remove control characters
    .replace(/\n/g, '\\n')     // Escape newlines
    .replace(/\r/g, '\\r')     // Escape carriage returns
    .replace(/\t/g, '\\t')     // Escape tabs
    .replace(/\\/g, '\\\\')    // Escape backslashes
    .replace(/"/g, '\\"')      // Escape quotes
}

// Utility function to extract and clean JSON from Claude response
function extractJsonFromResponse(text: string): string | null {
  // Try multiple patterns to find JSON array
  const patterns = [
    /\[\s*\{[\s\S]*?\}\s*\]/g,           // Standard JSON array
    /```json\s*(\[[\s\S]*?\])\s*```/g,   // JSON in code blocks
    /```\s*(\[[\s\S]*?\])\s*```/g,       // JSON in generic code blocks
  ]
  
  for (const pattern of patterns) {
    const matches = text.match(pattern)
    if (matches) {
      // Return the first match, cleaned of markdown
      return matches[0].replace(/```json|```/g, '').trim()
    }
  }
  
  // Fallback: try to find any array structure
  const arrayStart = text.indexOf('[')
  const arrayEnd = text.lastIndexOf(']')
  if (arrayStart !== -1 && arrayEnd !== -1 && arrayEnd > arrayStart) {
    return text.substring(arrayStart, arrayEnd + 1)
  }
  
  return null
}

// Create Anthropic client with lazy initialization
function createAnthropicClient(): Anthropic {
  const apiKey = process.env.CLAUDE_API_KEY
  
  if (!apiKey) {
    throw new Error('CLAUDE_API_KEY is not set in environment variables')
  }
  
  return new Anthropic({
    apiKey,
    maxRetries: 3,
    timeout: 120000, // 2 minutes for generation
  })
}

// Default export for backward compatibility - just the function
export default createAnthropicClient

// Export an anthropic instance for direct use
export const anthropic = createAnthropicClient()

// Export types for convenience
export type { 
  Message,
  MessageParam,
  TextBlock,
  ToolUseBlock,
  ImageBlock,
  ContentBlock,
  MessageStreamEvent
} from '@anthropic-ai/sdk/resources/messages'

// Helper function to validate API key at runtime
export function validateApiKey(): boolean {
  return !!process.env.CLAUDE_API_KEY
}

interface PhaseData {
  phaseTitle: string
  phaseDescription: string
  postsPerDay: number
  duration: number
  template: 'story' | 'tool' | 'mixed'
}

interface GeneratedContent {
  english_content: string
  swedish_content: string
  template: PostTemplate
}

export async function generatePhaseContent(
  params: PhaseData
): Promise<GeneratedContent[]> {
  // Create client with lazy initialization
  const anthropic = createAnthropicClient()
  const isDebug = process.env.CLAUDE_DEBUG === 'true'
  
  try {
    const totalPosts = params.duration * params.postsPerDay
    
    if (isDebug) {
      console.log('🔧 Debug: Generating', totalPosts, 'posts for phase:', params.phaseTitle)
    }
    
    // Handle template instructions based on type
    let templateInstructions = ''
    let templateDistribution = ''
    
    if (params.template === 'story') {
      templateInstructions = 'All posts should use the "story" template format - create engaging personal stories, experiences, and narrative-driven content that resonates emotionally.'
    } else if (params.template === 'tool') {
      templateInstructions = 'All posts should use the "tool" template format - share practical tools, tips, resources, and actionable advice that provides immediate value.'
    } else if (params.template === 'mixed') {
      templateInstructions = 'Alternate between "story" and "tool" template formats. Start with story posts for emotional engagement, then provide practical tools and tips. Mix these throughout the phase for variety.'
      templateDistribution = `\n\nTemplate Distribution:
- Approximately 50% story posts (personal experiences, narratives, emotional content)
- Approximately 50% tool posts (practical tips, resources, actionable advice)
- Alternate the templates naturally throughout the phase progression`
    }

    const systemPrompt = `You are a social media content expert specializing in creating engaging phase-based content campaigns for Twitter/X and LinkedIn.

Your task is to generate ${totalPosts} social media posts for a complete phase titled "${params.phaseTitle}".

PHASE CONTEXT:
Title: ${params.phaseTitle}
Description: ${params.phaseDescription}
Duration: ${params.duration} days (${params.postsPerDay} post(s) per day)
Total Posts: ${totalPosts}

NARRATIVE PROGRESSION REQUIREMENTS:
The posts must form a cohesive narrative journey across the entire phase:
1. Early posts (first 25%): Introduce the theme, set context, build anticipation
2. Middle posts (50%): Develop core concepts, share main insights, build momentum  
3. Later posts (final 25%): Provide conclusions, key takeaways, call-to-action

Each post should build upon previous ones while standing alone as valuable content.

CONTENT REQUIREMENTS:
For each post, create:
1. English version for Twitter/X (MUST be 280 characters or less, including spaces and punctuation)
2. Swedish version for LinkedIn (up to 3000 characters, more detailed and professional)

${templateInstructions}${templateDistribution}

CONTENT GUIDELINES:
- Maintain narrative coherence across all posts
- Each post should feel like part of a larger story/journey
- Twitter/X: Concise, punchy, engaging with appropriate hashtags
- LinkedIn: More detailed, professional, educational with Swedish cultural context
- Ensure authentic progression from beginning to end of phase
- Avoid repetitive content - each post should offer unique value
- Include relevant hashtags appropriate for each platform and language

CRITICAL: Return ONLY a clean JSON array. No markdown, no explanations, no extra text.

RESPONSE FORMAT - EXACTLY THIS:
[
  {
    "english_content": "Twitter/X post here (max 280 chars)",
    "swedish_content": "LinkedIn post in Swedish here (up to 3000 chars)",
    "template_used": "story"
  }
]`

    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-latest', // Updated model name
      max_tokens: 8000,
      temperature: 0.7,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: `Generate exactly ${totalPosts} posts as a clean JSON array. No additional text or formatting.`,
        },
      ],
    })

    // Parse the response
    const textContent = message.content.find(c => c.type === 'text')?.text
    if (!textContent) {
      throw new Error('No text content in response from Claude')
    }

    if (isDebug) {
      console.log('🔧 Debug: Raw Claude response (first 500 chars):', textContent.substring(0, 500))
    }

    // Extract JSON from the response using improved method
    const jsonString = extractJsonFromResponse(textContent)
    if (!jsonString) {
      console.error('❌ Failed to extract JSON. Full response:', textContent)
      throw new Error('No valid JSON array found in Claude response')
    }

    if (isDebug) {
      console.log('🔧 Debug: Extracted JSON (first 300 chars):', jsonString.substring(0, 300))
    }

    let posts: Array<{
      english_content: string
      swedish_content: string
      template_used?: 'story' | 'tool'
    }>

    try {
      posts = JSON.parse(jsonString)
    } catch (parseError) {
      console.error('❌ JSON Parse Error:', parseError)
      console.error('❌ Problematic JSON string:', jsonString)
      
      // Try to clean and retry
      try {
        const cleanedJson = jsonString
          .replace(/[\u0000-\u001F\u007F-\u009F]/g, '')  // Remove control chars
          .replace(/\n/g, ' ')  // Replace newlines with spaces
          .replace(/\r/g, '')   // Remove carriage returns
          .replace(/\t/g, ' ')  // Replace tabs with spaces
        
        if (isDebug) {
          console.log('🔧 Debug: Cleaned JSON attempt:', cleanedJson.substring(0, 200))
        }
        
        posts = JSON.parse(cleanedJson)
      } catch (secondError) {
        console.error('❌ Second parse attempt failed:', secondError)
        throw new Error(`Failed to parse JSON response: ${parseError}`)
      }
    }

    if (!Array.isArray(posts)) {
      throw new Error('Response is not a valid array')
    }

    if (posts.length === 0) {
      throw new Error('No posts generated')
    }

    if (isDebug) {
      console.log('✅ Successfully parsed', posts.length, 'posts')
    }

    // Validate and ensure character limits
    return posts.map((post, index) => {
      // Trim Twitter content if it exceeds 280 characters
      const english_content = post.english_content?.slice(0, 280) || ''
      // Trim LinkedIn content if it exceeds 3000 characters
      const swedish_content = post.swedish_content?.slice(0, 3000) || ''

      // Determine template for each post
      let postTemplate: PostTemplate = null
      if (params.template === 'mixed') {
        // For mixed, use the template_used from response, or alternate if not specified
        postTemplate = post.template_used === 'story' ? 'story' : 
                      post.template_used === 'tool' ? 'tool' :
                      (index % 2 === 0 ? 'story' : 'tool')
      } else if (params.template === 'story') {
        postTemplate = 'story'
      } else if (params.template === 'tool') {
        postTemplate = 'tool'
      }

      return {
        english_content,
        swedish_content,
        template: postTemplate,
      }
    })
  } catch (error) {
    console.error('❌ Error generating phase content:', error)
    
    if (error instanceof Error) {
      // Log specific error details
      if (error.message.includes('API key')) {
        throw new Error('Claude API key is invalid or not configured')
      }
      if (error.message.includes('rate limit')) {
        throw new Error('Rate limit exceeded. Please try again in a few minutes.')
      }
      if (error.message.includes('quota')) {
        throw new Error('API quota exceeded. Check your Claude account.')
      }
      
      throw error
    }
    
    throw new Error('Unknown error occurred during content generation')
  }
}

export async function translateToSwedish(englishText: string): Promise<string> {
  const anthropic = createAnthropicClient()
  
  try {
    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-latest', // Updated model name
      max_tokens: 4000,
      temperature: 0.3,
      system: `You are a professional translator specializing in English to Swedish translations for social media content.
      
Translate the given English text to Swedish while:
- Maintaining the tone and style appropriate for LinkedIn
- Using natural, contemporary Swedish
- Adapting cultural references appropriately
- Keeping hashtags relevant for Swedish audience
- Ensuring the translation flows naturally, not word-for-word
- Maximum 3000 characters

Return ONLY the Swedish translation, no explanations or additional text.`,
      messages: [
        {
          role: 'user',
          content: englishText,
        },
      ],
    })

    const textContent = message.content.find(c => c.type === 'text')?.text
    if (!textContent) {
      throw new Error('No text content in response')
    }

    // Ensure it doesn't exceed LinkedIn limit
    return textContent.slice(0, 3000)
  } catch (error) {
    console.error('Error translating to Swedish:', error)
    throw new Error('Failed to translate content')
  }
}

// Helper function to estimate tokens (rough approximation)
export function estimateTokens(text: string): number {
  // Rough estimate: 1 token ≈ 4 characters
  return Math.ceil(text.length / 4)
}

// Helper function to validate content before sending to Claude
export function validateContentRequest(
  description: string,
  count: number,
  template: PostTemplate
): { isValid: boolean; error?: string } {
  if (!description || description.trim().length === 0) {
    return { isValid: false, error: 'Description is required' }
  }

  if (description.length > 1000) {
    return { isValid: false, error: 'Description is too long (max 1000 characters)' }
  }

  if (count < 1 || count > 10) {
    return { isValid: false, error: 'Count must be between 1 and 10' }
  }

  if (template !== null && !['story', 'tool'].includes(template)) {
    return { isValid: false, error: 'Invalid template type' }
  }

  return { isValid: true }
}

// Generic helper function for creating messages with error handling
export async function createMessage(params: Anthropic.Messages.MessageCreateParams) {
  const anthropic = createAnthropicClient()
  
  try {
    if (!validateApiKey()) {
      throw new Error('Claude API key is not configured')
    }
    
    return await anthropic.messages.create(params)
  } catch (error) {
    if (error instanceof Anthropic.APIError) {
      console.error('Claude API Error:', {
        status: error.status,
        message: error.message,
        type: error.type,
      })
    } else {
      console.error('Unexpected error calling Claude API:', error)
    }
    throw error
  }
}

// Helper function for streaming messages
export async function createStreamingMessage(
  params: Anthropic.Messages.MessageCreateParams
) {
  const anthropic = createAnthropicClient()
  
  try {
    if (!validateApiKey()) {
      throw new Error('Claude API key is not configured')
    }
    
    return await anthropic.messages.create({
      ...params,
      stream: true,
    })
  } catch (error) {
    if (error instanceof Anthropic.APIError) {
      console.error('Claude API Streaming Error:', {
        status: error.status,
        message: error.message,
        type: error.type,
      })
    } else {
      console.error('Unexpected error in Claude streaming:', error)
    }
    throw error
  }
}