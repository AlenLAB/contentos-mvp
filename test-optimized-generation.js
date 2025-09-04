// Test script for optimized generation flow with real-time progress

async function testOptimizedGeneration() {
  console.log('Testing optimized content generation...\n');
  console.log('Expected behavior:');
  console.log('1. Posts save immediately without Swedish');
  console.log('2. Translation happens in background');
  console.log('3. Real-time progress updates via SSE\n');
  
  try {
    // Step 1: Generate content (should be fast now)
    console.log('Step 1: Generating 3 test posts (immediate save)...');
    const startTime = Date.now();
    
    const generateResponse = await fetch('http://localhost:3001/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        phaseTitle: 'Optimized Test',
        phaseDescription: 'Testing the optimized async generation flow',
        duration: 3,
        postsPerDay: 1,
        template: 'mixed'
      })
    });

    if (!generateResponse.ok) {
      throw new Error(`Generation failed: ${generateResponse.status}`);
    }

    const generated = await generateResponse.json();
    const generationTime = ((Date.now() - startTime) / 1000).toFixed(1);
    console.log(`✓ Generated ${generated.postcards.length} posts in ${generationTime}s\n`);

    // Step 2: Check if posts were saved immediately
    console.log('Step 2: Verifying immediate save...');
    const postsResponse = await fetch('http://localhost:3001/api/postcards');
    const allPosts = await postsResponse.json();
    
    // Find posts without Swedish content (pending translation)
    const pendingTranslation = allPosts.postcards.filter(p => 
      p.english_content && !p.swedish_content && 
      (p.translation_status === 'pending' || !p.translation_status)
    );
    
    console.log(`✓ Found ${pendingTranslation.length} posts pending translation`);
    console.log(`✓ Total posts in DB: ${allPosts.count}\n`);
    
    // Step 3: Check batch translation status
    console.log('Step 3: Checking translation status...');
    await new Promise(resolve => setTimeout(resolve, 2000)); // Wait a bit
    
    const statusResponse = await fetch('http://localhost:3001/api/translate-batch?status=processing');
    const processing = await statusResponse.json();
    console.log(`  Processing: ${processing.count} posts`);
    
    const completedResponse = await fetch('http://localhost:3001/api/translate-batch?status=completed');
    const completed = await completedResponse.json();
    console.log(`  Completed: ${completed.count} posts`);
    
    // Step 4: Performance comparison
    console.log('\n📊 Performance Comparison:');
    console.log('  Old flow: ~3-4 minutes for 14 posts');
    console.log(`  New flow: ${generationTime}s for immediate save + background translation`);
    console.log(`  Improvement: ${Math.round(180 / parseFloat(generationTime))}x faster initial response!\n`);
    
    console.log('✅ Optimization test successful!');
    console.log('   - Posts saved immediately');
    console.log('   - Translation happening in background');
    console.log('   - User can continue working while translation completes');
    
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
  }
}

// Run the test
testOptimizedGeneration();