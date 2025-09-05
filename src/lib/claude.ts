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

interface GeneratedContent {
  english_content: string
  swedish_content: string
  template: PostTemplate
}

export async function generatePhaseContent(
  description: string,
  count: number = 1,
  template: PostTemplate = null
): Promise<GeneratedContent[]> {
  try {
    const templateInstructions = template 
      ? `Use the "${template}" template format. ${
          template === 'story' 
            ? 'Create engaging personal stories or experiences.' 
            : 'Share practical tools, tips, or resources.'
        }`
      : 'Create general social media content without a specific template.'

    const systemPrompt = `You are a social media content expert specializing in creating engaging posts for Twitter/X and LinkedIn.
    
Your task is to generate ${count} social media post(s) based on the given description.

For each post, create:
1. English version for Twitter/X (MUST be 280 characters or less, including spaces and punctuation)
2. Swedish version for LinkedIn (up to 3000 characters)

${templateInstructions}

Guidelines:
- Twitter/X posts should be concise, punchy, and engaging
- LinkedIn posts can be more detailed and professional
- Maintain the same core message across both versions
- Use appropriate hashtags for each platform
- Ensure the Swedish translation is natural and culturally appropriate

Return the response as a JSON array with exactly ${count} object(s), each containing:
{
  "english_content": "Twitter/X post here (max 280 chars)",
  "swedish_content": "LinkedIn post in Swedish here"
}`

    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-latest',
      max_tokens: 4000,
      temperature: 0.7,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: `Generate ${count} social media post(s) about: ${description}`,
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
    }>

    // Validate and ensure character limits
    return posts.map(post => {
      // Trim Twitter content if it exceeds 280 characters
      const english_content = post.english_content.slice(0, 280)
      // Trim LinkedIn content if it exceeds 3000 characters
      const swedish_content = post.swedish_content.slice(0, 3000)

      return {
        english_content,
        swedish_content,
        template,
      }
    })
  } catch (error) {
    console.error('Error generating content:', error)
    throw new Error('Failed to generate content')
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