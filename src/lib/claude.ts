import Anthropic from '@anthropic-ai/sdk'
import { PostTemplate } from '@/types/database'

// Create a function to lazily initialize the Anthropic client
const createAnthropicClient = () => {
  const apiKey = process.env.CLAUDE_API_KEY
  
  // During build or when API key is missing, return a dummy client
  if (!apiKey) {
    if (typeof window !== 'undefined') {
      console.error('CLAUDE_API_KEY is not set. Please add it to your environment variables.')
    }
    // Return null during build to prevent errors
    return null as any
  }
  
  return new Anthropic({
    apiKey,
    // Optional: Add custom configuration
    maxRetries: 2,
    timeout: 60000, // 60 seconds
  })
}

// Create and configure the Anthropic client with error handling
const anthropic = createAnthropicClient()

// Export the client instance for use in API routes
export default anthropic

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
  try {
    const totalPosts = params.duration * params.postsPerDay
    
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

RESPONSE FORMAT:
Return a JSON array with exactly ${totalPosts} objects, each containing:
{
  "english_content": "Twitter/X post here (max 280 chars)",
  "swedish_content": "LinkedIn post in Swedish here (up to 3000 chars)",
  "template_used": "story" or "tool"
}`

    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-latest',
      max_tokens: 8000, // Increased for larger content generation
      temperature: 0.7,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: `Generate all ${totalPosts} posts for the phase "${params.phaseTitle}" that will create a compelling content journey over ${params.duration} days. Ensure each post contributes to the overall narrative while providing individual value.`,
        },
      ],
    })

    // Parse the response
    const textContent = message.content.find(c => c.type === 'text')?.text
    if (!textContent) {
      throw new Error('No text content in response')
    }

    // Extract JSON from the response
    const jsonMatch = textContent.match(/\[[\s\S]*\]/)
    if (!jsonMatch) {
      throw new Error('No JSON array found in response')
    }

    const posts = JSON.parse(jsonMatch[0]) as Array<{
      english_content: string
      swedish_content: string
      template_used?: 'story' | 'tool'
    }>

    // Validate and ensure character limits
    return posts.map((post, index) => {
      // Trim Twitter content if it exceeds 280 characters
      const english_content = post.english_content.slice(0, 280)
      // Trim LinkedIn content if it exceeds 3000 characters
      const swedish_content = post.swedish_content.slice(0, 3000)

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
    console.error('Error generating phase content:', error)
    throw new Error('Failed to generate phase content')
  }
}

export async function translateToSwedish(englishText: string): Promise<string> {
  try {
    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-latest',
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