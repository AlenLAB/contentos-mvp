// Test script to verify API fixes for empty body handling

async function testAPIFixes() {
  console.log('Testing API fixes for JSON parsing errors...\n');
  
  const baseUrl = 'http://localhost:3001';
  
  // Test 1: Empty body to postcards API
  console.log('Test 1: Sending empty body to /api/postcards...');
  try {
    const emptyResponse = await fetch(`${baseUrl}/api/postcards`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: ''
    });
    
    const result = await emptyResponse.json();
    if (emptyResponse.status === 400 && result.error) {
      console.log('✅ Empty body handled correctly:', result.error);
    } else {
      console.log('❌ Unexpected response:', result);
    }
  } catch (error) {
    console.log('❌ Failed:', error.message);
  }
  
  // Test 2: Invalid JSON to postcards API
  console.log('\nTest 2: Sending invalid JSON to /api/postcards...');
  try {
    const invalidResponse = await fetch(`${baseUrl}/api/postcards`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: '{invalid json'
    });
    
    const result = await invalidResponse.json();
    if (invalidResponse.status === 400 && result.error) {
      console.log('✅ Invalid JSON handled correctly:', result.error);
    } else {
      console.log('❌ Unexpected response:', result);
    }
  } catch (error) {
    console.log('❌ Failed:', error.message);
  }
  
  // Test 3: Valid request with minimal data
  console.log('\nTest 3: Sending valid minimal postcard...');
  try {
    const validResponse = await fetch(`${baseUrl}/api/postcards`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        english_content: 'Test post from API fix verification',
        swedish_content: '',  // Empty is now allowed
        template: 'story'
      })
    });
    
    const result = await validResponse.json();
    if (validResponse.ok && result.postcard) {
      console.log('✅ Valid request processed:', result.postcard.id);
      console.log('   Translation status:', result.postcard.translation_status || 'not set');
    } else {
      console.log('⚠️ Response:', result);
    }
  } catch (error) {
    console.log('❌ Failed:', error.message);
  }
  
  // Test 4: Empty body to generate API
  console.log('\nTest 4: Sending empty body to /api/generate...');
  try {
    const emptyGenResponse = await fetch(`${baseUrl}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: ''
    });
    
    const result = await emptyGenResponse.json();
    if (emptyGenResponse.status === 400 && result.error) {
      console.log('✅ Empty body handled correctly:', result.error);
    } else {
      console.log('❌ Unexpected response:', result);
    }
  } catch (error) {
    console.log('❌ Failed:', error.message);
  }
  
  console.log('\n🏁 API fixes test completed!');
  console.log('If all tests passed, the JSON parsing errors are fixed.');
}

// Run tests
testAPIFixes();