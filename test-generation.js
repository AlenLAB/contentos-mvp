// Test script to generate and save posts like the UI would

async function testGeneration() {
  console.log('Testing content generation and persistence...\n');
  
  try {
    // Step 1: Generate content
    console.log('Step 1: Generating 3 test posts...');
    const generateResponse = await fetch('http://localhost:3001/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        phaseTitle: 'Test Generation',
        phaseDescription: 'Testing the complete generation and persistence flow',
        duration: 3,
        postsPerDay: 1,
        template: 'mixed'
      })
    });

    if (!generateResponse.ok) {
      throw new Error(`Generation failed: ${generateResponse.status}`);
    }

    const generated = await generateResponse.json();
    console.log(`✓ Generated ${generated.postcards.length} posts\n`);

    // Step 2: Translate and save each post
    console.log('Step 2: Translating and saving posts...');
    const savedPosts = [];
    
    for (let i = 0; i < generated.postcards.length; i++) {
      const post = generated.postcards[i];
      console.log(`  Processing post ${i + 1}/${generated.postcards.length}...`);
      
      // Translate to Swedish
      const translateResponse = await fetch('http://localhost:3001/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          englishContent: post.english_content,
          template: post.template
        })
      });

      let swedishContent = '';
      if (translateResponse.ok) {
        const translated = await translateResponse.json();
        swedishContent = translated.swedishContent || '';
        console.log(`    ✓ Translated (${swedishContent.length} chars)`);
      } else {
        console.log('    ⚠ Translation failed, using empty Swedish content');
      }

      // Save postcard
      const saveResponse = await fetch('http://localhost:3001/api/postcards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          english_content: post.english_content,
          swedish_content: swedishContent,
          template: post.template,
          state: 'draft'
        })
      });

      if (saveResponse.ok) {
        const saved = await saveResponse.json();
        savedPosts.push(saved.postcard);
        console.log(`    ✓ Saved with ID: ${saved.postcard.id}`);
      } else {
        console.log(`    ✗ Failed to save post ${i + 1}`);
      }
    }

    // Step 3: Verify total count
    console.log('\nStep 3: Verifying persistence...');
    const countResponse = await fetch('http://localhost:3001/api/postcards');
    const allPosts = await countResponse.json();
    
    console.log(`\n✅ Success! Total postcards in database: ${allPosts.count}`);
    console.log(`   Newly created: ${savedPosts.length}`);
    
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
  }
}

// Run the test
testGeneration();