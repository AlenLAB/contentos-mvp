import { NextRequest } from 'next/server'

// Store for active generation sessions
const activeSessions = new Map<string, {
  totalPosts: number
  generated: number
  translated: number
  status: 'generating' | 'translating' | 'completed' | 'error'
  message: string
}>()

// SSE helper to format messages
function formatSSE(data: any): string {
  return `data: ${JSON.stringify(data)}\n\n`
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const sessionId = searchParams.get('sessionId')
  
  if (!sessionId) {
    return new Response('Session ID required', { status: 400 })
  }

  // Create a new ReadableStream for SSE
  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder()
      
      // Send initial connection message
      controller.enqueue(
        encoder.encode(formatSSE({
          type: 'connected',
          sessionId,
          timestamp: new Date().toISOString()
        }))
      )
      
      // Send progress updates every second
      const interval = setInterval(() => {
        const session = activeSessions.get(sessionId)
        
        if (session) {
          // Calculate progress percentage
          const totalSteps = session.totalPosts * 2 // Generation + Translation
          const completedSteps = session.generated + session.translated
          const progress = Math.round((completedSteps / totalSteps) * 100)
          
          controller.enqueue(
            encoder.encode(formatSSE({
              type: 'progress',
              sessionId,
              status: session.status,
              message: session.message,
              progress,
              generated: session.generated,
              translated: session.translated,
              totalPosts: session.totalPosts,
              timestamp: new Date().toISOString()
            }))
          )
          
          // Close stream when completed or errored
          if (session.status === 'completed' || session.status === 'error') {
            controller.enqueue(
              encoder.encode(formatSSE({
                type: 'complete',
                sessionId,
                status: session.status,
                message: session.status === 'completed' 
                  ? `Successfully generated ${session.totalPosts} posts!`
                  : 'Generation failed. Please try again.',
                timestamp: new Date().toISOString()
              }))
            )
            
            clearInterval(interval)
            activeSessions.delete(sessionId)
            controller.close()
          }
        } else {
          // No session found, might be starting
          controller.enqueue(
            encoder.encode(formatSSE({
              type: 'waiting',
              sessionId,
              message: 'Preparing to generate content...',
              timestamp: new Date().toISOString()
            }))
          )
        }
      }, 1000)
      
      // Clean up on client disconnect
      request.signal.addEventListener('abort', () => {
        clearInterval(interval)
        controller.close()
      })
    }
  })

  // Return SSE response
  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  })
}

// POST endpoint to update generation status
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { sessionId, type, ...data } = body
    
    if (!sessionId) {
      return new Response('Session ID required', { status: 400 })
    }
    
    switch (type) {
      case 'start':
        activeSessions.set(sessionId, {
          totalPosts: data.totalPosts || 0,
          generated: 0,
          translated: 0,
          status: 'generating',
          message: 'Starting content generation...'
        })
        break
        
      case 'generated':
        const session = activeSessions.get(sessionId)
        if (session) {
          session.generated = data.count || 0
          session.message = `Generated ${session.generated} of ${session.totalPosts} posts`
          if (session.generated >= session.totalPosts) {
            session.status = 'translating'
            session.message = 'Starting translation to Swedish...'
          }
        }
        break
        
      case 'translated':
        const transSession = activeSessions.get(sessionId)
        if (transSession) {
          transSession.translated = data.count || 0
          transSession.message = `Translated ${transSession.translated} of ${transSession.totalPosts} posts`
          if (transSession.translated >= transSession.totalPosts) {
            transSession.status = 'completed'
            transSession.message = 'All posts generated and translated!'
          }
        }
        break
        
      case 'error':
        const errorSession = activeSessions.get(sessionId)
        if (errorSession) {
          errorSession.status = 'error'
          errorSession.message = data.message || 'An error occurred'
        } else {
          activeSessions.set(sessionId, {
            totalPosts: 0,
            generated: 0,
            translated: 0,
            status: 'error',
            message: data.message || 'An error occurred'
          })
        }
        break
        
      case 'complete':
        const completeSession = activeSessions.get(sessionId)
        if (completeSession) {
          completeSession.status = 'completed'
          completeSession.message = 'Generation completed successfully!'
        }
        break
    }
    
    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' }
    })
    
  } catch (error) {
    console.error('Error updating generation status:', error)
    return new Response('Failed to update status', { status: 500 })
  }
}