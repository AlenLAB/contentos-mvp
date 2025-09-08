const https = require('https');

async function comprehensiveAudit() {
  console.log('🔍 ContentOS MVP Comprehensive Visual Audit');
  console.log('===========================================\n');
  
  const url = 'https://contentos-mvp.vercel.app';
  
  try {
    const startTime = Date.now();
    
    // Fetch the complete page
    const html = await fetchPage(url);
    const loadTime = Date.now() - startTime;
    
    console.log('✅ CONNECTIVITY & PERFORMANCE');
    console.log(`   📊 Load time: ${loadTime}ms`);
    console.log(`   📦 HTML size: ${html.length} characters`);
    console.log(`   🌐 Site accessible: Yes`);
    
    // Analyze dark theme implementation
    console.log('\n🎨 DARK THEME ANALYSIS');
    analyzeTheme(html);
    
    // Check glassmorphic navigation
    console.log('\n🧊 GLASSMORPHIC NAVIGATION');
    analyzeNavigation(html);
    
    // Emerald accent colors
    console.log('\n💎 EMERALD ACCENT COLORS');
    analyzeAccentColors(html);
    
    // Page structure
    console.log('\n🏗️ PAGE STRUCTURE');
    analyzePageStructure(html);
    
    // Check for potential issues
    console.log('\n🚨 ISSUE DETECTION');
    detectIssues(html);
    
    // Mobile responsiveness indicators
    console.log('\n📱 MOBILE RESPONSIVENESS');
    analyzeMobileResponsiveness(html);
    
    // Performance indicators
    console.log('\n⚡ PERFORMANCE INDICATORS');
    analyzePerformance(html);
    
    console.log('\n📋 AUDIT SUMMARY');
    generateSummary(html, loadTime);
    
  } catch (error) {
    console.error('❌ Audit failed:', error.message);
  }
}

function analyzeTheme(html) {
  const darkThemeIndicators = [
    { name: 'bg-zinc-900', pattern: /bg-zinc-900/g },
    { name: 'bg-zinc-950', pattern: /bg-zinc-950/g },
    { name: 'bg-background', pattern: /bg-background/g },
    { name: 'text-white', pattern: /text-white/g },
    { name: 'border-zinc-700', pattern: /border-zinc-700/g },
    { name: 'Dark theme classes', pattern: /dark:/g }
  ];
  
  darkThemeIndicators.forEach(indicator => {
    const matches = html.match(indicator.pattern);
    const count = matches ? matches.length : 0;
    console.log(`   ${indicator.name}: ${count > 0 ? '✅' : '❌'} (${count} instances)`);
  });
}

function analyzeNavigation(html) {
  const glassmorphicIndicators = [
    { name: 'backdrop-blur', pattern: /backdrop-blur/g },
    { name: 'bg-gradient-to-', pattern: /bg-gradient-to-/g },
    { name: 'glass-effect', pattern: /glass-effect/g },
    { name: 'Navigation structure', pattern: /<nav/gi },
    { name: 'Sidebar visible', pattern: /lg:flex.*lg:flex-col.*lg:fixed/g }
  ];
  
  glassmorphicIndicators.forEach(indicator => {
    const matches = html.match(indicator.pattern);
    const count = matches ? matches.length : 0;
    console.log(`   ${indicator.name}: ${count > 0 ? '✅' : '❌'} (${count} instances)`);
  });
}

function analyzeAccentColors(html) {
  const emeraldIndicators = [
    { name: 'emerald-500', pattern: /emerald-500/g },
    { name: 'emerald-600', pattern: /emerald-600/g },
    { name: 'emerald-400', pattern: /emerald-400/g },
    { name: 'from-emerald', pattern: /from-emerald/g },
    { name: 'to-emerald', pattern: /to-emerald/g }
  ];
  
  emeraldIndicators.forEach(indicator => {
    const matches = html.match(indicator.pattern);
    const count = matches ? matches.length : 0;
    console.log(`   ${indicator.name}: ${count > 0 ? '✅' : '❌'} (${count} instances)`);
  });
}

function analyzePageStructure(html) {
  const structure = [
    { name: 'Page title', pattern: /<title[^>]*>([^<]+)<\/title>/i },
    { name: 'Navigation sections', pattern: /Overview.*Planning|Content Management|Analytics.*People|Tools.*System/g },
    { name: 'Dashboard cards', pattern: /Total Postcards|Scheduled|Published|Drafts/g },
    { name: 'Interactive buttons', pattern: /<button[^>]*>/gi },
    { name: 'Icon components', pattern: /lucide lucide-/g }
  ];
  
  structure.forEach(item => {
    const matches = html.match(item.pattern);
    const count = matches ? matches.length : 0;
    
    if (item.name === 'Page title' && matches) {
      console.log(`   ${item.name}: ✅ "${matches[1]}"`);
    } else {
      console.log(`   ${item.name}: ${count > 0 ? '✅' : '❌'} (${count} found)`);
    }
  });
}

function detectIssues(html) {
  const issues = [];
  
  // Check for white background bleeds
  if (html.includes('bg-white') && !html.includes('dark:bg-white')) {
    issues.push('🚨 Potential white background detected');
  }
  
  // Check for missing dark mode classes
  if (!html.includes('dark:') && html.includes('bg-white')) {
    issues.push('⚠️ Missing dark mode variants for light backgrounds');
  }
  
  // Check for error states
  if (html.match(/error|Error|ERROR/gi)) {
    const errorMatches = html.match(/error|Error|ERROR/gi);
    if (errorMatches && errorMatches.length > 10) {
      issues.push('⚠️ High number of error references detected');
    }
  }
  
  // Check for proper Next.js hydration
  if (!html.includes('__NEXT_DATA__')) {
    issues.push('⚠️ Next.js hydration data missing');
  }
  
  // Check viewport meta
  if (!html.includes('viewport')) {
    issues.push('🚨 Viewport meta tag missing');
  }
  
  if (issues.length === 0) {
    console.log('   ✅ No critical issues detected');
  } else {
    issues.forEach(issue => console.log(`   ${issue}`));
  }
}

function analyzeMobileResponsiveness(html) {
  const responsiveIndicators = [
    { name: 'Viewport meta tag', pattern: /viewport/i },
    { name: 'Mobile breakpoints (lg:)', pattern: /lg:/g },
    { name: 'Medium breakpoints (md:)', pattern: /md:/g },
    { name: 'Mobile menu button', pattern: /lg:hidden/g },
    { name: 'Responsive grid', pattern: /grid-cols-.*md:grid-cols/g }
  ];
  
  responsiveIndicators.forEach(indicator => {
    const matches = html.match(indicator.pattern);
    const count = matches ? matches.length : 0;
    console.log(`   ${indicator.name}: ${count > 0 ? '✅' : '❌'} (${count} instances)`);
  });
}

function analyzePerformance(html) {
  const performanceIndicators = [
    { name: 'Preload fonts', pattern: /preload.*font/gi },
    { name: 'CSS bundling', pattern: /_next\/static.*\.css/g },
    { name: 'JS chunking', pattern: /_next\/static.*\.js/g },
    { name: 'Async scripts', pattern: /async=""/g },
    { name: 'Image optimization hints', pattern: /fetchPriority|loading=/g }
  ];
  
  performanceIndicators.forEach(indicator => {
    const matches = html.match(indicator.pattern);
    const count = matches ? matches.length : 0;
    console.log(`   ${indicator.name}: ${count > 0 ? '✅' : '❌'} (${count} instances)`);
  });
}

function generateSummary(html, loadTime) {
  const hasNavigation = html.includes('backdrop-blur');
  const hasTheme = html.includes('bg-zinc-900') || html.includes('bg-zinc-950');
  const hasAccents = html.includes('emerald-');
  const hasStructure = html.includes('Dashboard') && html.includes('ContentOS');
  const hasResponsive = html.includes('lg:') && html.includes('md:');
  
  console.log('   🎯 Overall Assessment:');
  console.log(`   Theme Implementation: ${hasTheme ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`   Navigation Design: ${hasNavigation ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`   Accent Colors: ${hasAccents ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`   Page Structure: ${hasStructure ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`   Mobile Responsive: ${hasResponsive ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`   Load Performance: ${loadTime < 3000 ? '✅ PASS' : '❌ SLOW'} (${loadTime}ms)`);
  
  const score = [hasTheme, hasNavigation, hasAccents, hasStructure, hasResponsive, loadTime < 3000].filter(Boolean).length;
  console.log(`\n   🏆 AUDIT SCORE: ${score}/6 (${Math.round(score/6*100)}%)`);
}

function fetchPage(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      let html = '';
      response.on('data', chunk => html += chunk);
      response.on('end', () => resolve(html));
      response.on('error', reject);
    }).on('error', reject);
  });
}

comprehensiveAudit().catch(console.error);