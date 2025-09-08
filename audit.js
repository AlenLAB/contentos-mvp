const { execSync } = require('child_process');
const http = require('http');
const https = require('https');

async function auditWebsite() {
  console.log('🔍 ContentOS MVP Visual Audit - Phase 1');
  console.log('=====================================');
  
  const url = 'https://contentos-mvp.vercel.app';
  console.log(`🌐 Target: ${url}`);
  
  try {
    // Test basic connectivity
    console.log('\n1️⃣ Testing connectivity...');
    const response = await fetchWithTimeout(url, 10000);
    console.log(`✅ Status: ${response.statusCode} ${response.statusMessage}`);
    console.log(`📊 Response size: ${response.headers['content-length'] || 'unknown'} bytes`);
    console.log(`🕒 Response time: ${Date.now() - startTime}ms`);
    
    // Check headers
    console.log('\n2️⃣ Response headers:');
    Object.entries(response.headers).forEach(([key, value]) => {
      if (key.includes('content') || key.includes('cache') || key.includes('server')) {
        console.log(`   ${key}: ${value}`);
      }
    });
    
    // Get HTML content
    console.log('\n3️⃣ Analyzing HTML content...');
    let html = '';
    response.on('data', chunk => html += chunk);
    
    response.on('end', () => {
      analyzeHTML(html);
    });
    
  } catch (error) {
    console.error('❌ Failed to fetch site:', error.message);
  }
}

function analyzeHTML(html) {
  console.log(`📄 HTML size: ${html.length} characters`);
  
  // Check for key elements
  console.log('\n4️⃣ Key element detection:');
  const checks = [
    { name: 'Next.js App', regex: /__next/g },
    { name: 'Dark theme classes', regex: /dark:/g },
    { name: 'Tailwind classes', regex: /class="[^"]*(?:bg-|text-|border-)/g },
    { name: 'Navigation elements', regex: /<nav/gi },
    { name: 'Button elements', regex: /<button/gi },
    { name: 'React hydration', regex: /__NEXT_DATA__/g },
    { name: 'Error indicators', regex: /error|Error|ERROR/gi },
    { name: 'Console scripts', regex: /console\.(log|error|warn)/gi }
  ];
  
  checks.forEach(check => {
    const matches = html.match(check.regex);
    const count = matches ? matches.length : 0;
    console.log(`   ${check.name}: ${count} ${count === 1 ? 'match' : 'matches'}`);
  });
  
  // Extract title
  const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  if (titleMatch) {
    console.log(`\n📑 Page title: "${titleMatch[1]}"`);
  }
  
  // Look for meta viewport
  const viewportMatch = html.match(/<meta[^>]+viewport[^>]*>/i);
  console.log(`📱 Viewport meta: ${viewportMatch ? '✅ Present' : '❌ Missing'}`);
  
  // Check for theme-related content
  console.log('\n5️⃣ Theme analysis:');
  const themeChecks = [
    'bg-zinc-950',
    'bg-zinc-900', 
    '#09090b',
    '#18181b',
    '#10b981',
    'emerald',
    'glassmorphic',
    'backdrop-blur'
  ];
  
  themeChecks.forEach(theme => {
    const found = html.includes(theme);
    console.log(`   ${theme}: ${found ? '✅' : '❌'}`);
  });
  
  console.log('\n6️⃣ Potential issues detected:');
  const issues = [];
  
  if (!html.includes('viewport')) issues.push('Missing viewport meta tag');
  if (html.includes('error') || html.includes('Error')) issues.push('Possible error states in HTML');
  if (!html.includes('dark')) issues.push('No dark mode classes detected');
  if (html.length < 1000) issues.push('HTML content seems too small');
  
  if (issues.length > 0) {
    issues.forEach(issue => console.log(`   ⚠️ ${issue}`));
  } else {
    console.log('   ✅ No obvious issues detected');
  }
  
  console.log('\n✅ Phase 1 audit complete');
}

function fetchWithTimeout(url, timeout) {
  const startTime = Date.now();
  
  return new Promise((resolve, reject) => {
    const request = https.get(url, resolve);
    
    request.setTimeout(timeout, () => {
      request.destroy();
      reject(new Error('Request timeout'));
    });
    
    request.on('error', reject);
  });
}

// Add startTime global
const startTime = Date.now();

auditWebsite().catch(console.error);