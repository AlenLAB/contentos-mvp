import { NextRequest, NextResponse } from 'next/server'

// Test endpoint to verify AI generation and translation
export async function GET(request: NextRequest) {
  try {
    console.log('Starting AI generation test...')
    
    // Test data for content generation
    const testPhaseData = {
      phaseTitle: "Building in Public Journey",
      phaseDescription: "Sharing daily learnings from building ContentOS - documenting the challenges, wins, and insights from creating a content management system for creators",
      template: "story" as const,
      duration: 1,
      postsPerDay: 1
    }

    // Step 1: Test the generate endpoint
    console.log('Step 1: Testing content generation...')
    const generateResponse = await fetch(new URL('/api/generate', request.url).toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testPhaseData)
    })

    if (!generateResponse.ok) {
      const error = await generateResponse.json()
      throw new Error(`Generation failed: ${error.error || 'Unknown error'}`)
    }

    const generateResult = await generateResponse.json()
    console.log('Generation successful:', {
      postcardCount: generateResult.postcards?.length,
      metadata: generateResult.metadata
    })

    // Verify we have postcards
    if (!generateResult.postcards || generateResult.postcards.length === 0) {
      throw new Error('No postcards generated')
    }

    const firstPostcard = generateResult.postcards[0]
    const englishLength = firstPostcard.english_content.length

    // Verify English content is within Twitter limits
    if (englishLength > 280) {
      console.warn(`English content exceeds 280 characters: ${englishLength}`)
    } else {
      console.log(`✅ English content length: ${englishLength}/280 characters`)
    }

    // Step 2: Test the translate endpoint
    console.log('Step 2: Testing Swedish translation...')
    const translateResponse = await fetch(new URL('/api/translate', request.url).toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        englishContent: firstPostcard.english_content,
        template: firstPostcard.template
      })
    })

    if (!translateResponse.ok) {
      const error = await translateResponse.json()
      throw new Error(`Translation failed: ${error.error || 'Unknown error'}`)
    }

    const translateResult = await translateResponse.json()
    console.log('Translation successful:', {
      characterCount: translateResult.characterCount,
      withinOptimalRange: translateResult.metadata?.withinOptimalRange
    })

    // Verify Swedish content is within LinkedIn limits
    const swedishLength = translateResult.characterCount
    if (swedishLength < 500) {
      console.warn(`⚠️ Swedish content is shorter than optimal: ${swedishLength} characters (optimal: 500-1000)`)
    } else if (swedishLength > 3000) {
      console.error(`❌ Swedish content exceeds maximum: ${swedishLength}/3000 characters`)
    } else if (swedishLength >= 500 && swedishLength <= 1000) {
      console.log(`✅ Swedish content length optimal: ${swedishLength} characters (500-1000 range)`)
    } else {
      console.log(`✅ Swedish content length: ${swedishLength} characters (within limits but above optimal)`)
    }

    // Prepare comprehensive test results
    const testResults = {
      success: true,
      timestamp: new Date().toISOString(),
      tests: {
        generation: {
          success: true,
          phaseTitle: testPhaseData.phaseTitle,
          postcardCount: generateResult.postcards.length,
          template: firstPostcard.template
        },
        english: {
          content: firstPostcard.english_content,
          length: englishLength,
          withinLimit: englishLength <= 280,
          limit: 280
        },
        swedish: {
          content: translateResult.swedishContent,
          length: swedishLength,
          withinOptimalRange: swedishLength >= 500 && swedishLength <= 1000,
          withinMaxLimit: swedishLength <= 3000,
          optimalRange: '500-1000',
          maxLimit: 3000,
          expansionRatio: translateResult.metadata?.expansionRatio
        },
        validation: {
          englishValid: englishLength > 0 && englishLength <= 280,
          swedishValid: swedishLength > 0 && swedishLength <= 3000,
          bothValid: englishLength <= 280 && swedishLength >= 500 && swedishLength <= 3000
        }
      },
      summary: {
        allTestsPassed: englishLength <= 280 && swedishLength >= 500 && swedishLength <= 3000,
        englishOk: englishLength <= 280,
        swedishOk: swedishLength >= 500 && swedishLength <= 3000,
        message: `Generated ${englishLength} char English tweet and ${swedishLength} char Swedish LinkedIn post`
      }
    }

    console.log('\n=== Test Summary ===')
    console.log(`English (Twitter/X): ${englishLength}/280 chars - ${testResults.summary.englishOk ? '✅ PASS' : '❌ FAIL'}`)
    console.log(`Swedish (LinkedIn): ${swedishLength} chars (optimal: 500-1000, max: 3000) - ${testResults.summary.swedishOk ? '✅ PASS' : '⚠️ CHECK'}`)
    console.log(`Overall: ${testResults.summary.allTestsPassed ? '✅ ALL TESTS PASSED' : '⚠️ SOME ISSUES DETECTED'}`)

    return NextResponse.json(testResults)

  } catch (error) {
    console.error('Test failed:', error)
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      timestamp: new Date().toISOString(),
      hint: 'Check if CLAUDE_API_KEY is set in environment variables'
    }, { status: 500 })
  }
}

// Also support POST for testing with custom data
export async function POST(request: NextRequest) {
  try {
    const customData = await request.json()
    
    // Use custom data or defaults
    const testPhaseData = {
      phaseTitle: customData.phaseTitle || "Building in Public Journey",
      phaseDescription: customData.phaseDescription || "Sharing daily learnings from building ContentOS",
      template: customData.template || "story" as const,
      duration: customData.duration || 1,
      postsPerDay: customData.postsPerDay || 1
    }

    // Reuse GET logic with custom data
    const generateResponse = await fetch(new URL('/api/generate', request.url).toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testPhaseData)
    })

    if (!generateResponse.ok) {
      const error = await generateResponse.json()
      throw new Error(`Generation failed: ${error.error || 'Unknown error'}`)
    }

    const generateResult = await generateResponse.json()
    
    // Return the full generation result for POST
    return NextResponse.json({
      success: true,
      testData: testPhaseData,
      result: generateResult,
      postcardCount: generateResult.postcards?.length || 0
    })

  } catch (error) {
    console.error('Custom test failed:', error)
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }, { status: 500 })
  }
}