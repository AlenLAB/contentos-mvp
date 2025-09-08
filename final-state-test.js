const { chromium } = require('playwright');

async function finalStateTest() {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  try {
    console.log('🎯 FINAL STATE VERIFICATION');
    console.log('=' .repeat(60));
    
    await page.goto('https://contentos-mvp.vercel.app', { 
      waitUntil: 'networkidle',
      timeout: 30000 
    });
    
    await page.waitForTimeout(3000);
    
    // Take comprehensive screenshots for documentation
    await page.screenshot({ 
      path: 'final-state-fullpage.png', 
      fullPage: true 
    });
    
    await page.screenshot({ 
      path: 'final-state-viewport.png', 
      clip: { x: 0, y: 0, width: 1280, height: 720 }
    });
    
    // Extract all critical information
    const finalState = await page.evaluate(() => {
      const rootStyle = getComputedStyle(document.documentElement);
      
      return {
        // Theme Status
        htmlClass: document.documentElement.className,
        htmlDataTheme: document.documentElement.getAttribute('data-theme'),
        bodyClass: document.body.className,
        
        // CSS Variables (Current State)
        cssVariables: {
          background: rootStyle.getPropertyValue('--background').trim(),
          foreground: rootStyle.getPropertyValue('--foreground').trim(),
          card: rootStyle.getPropertyValue('--card').trim(),
          primary: rootStyle.getPropertyValue('--primary').trim(),
          border: rootStyle.getPropertyValue('--border').trim()
        },
        
        // Expected vs Actual
        expectedBackground: '#09090b',
        actualBackground: rootStyle.getPropertyValue('--background').trim(),
        
        // Navigation Status
        calendarLinks: document.querySelectorAll('a[href*="calendar"]').length,
        navigationVisible: !!document.querySelector('nav, .sidebar, [data-sidebar]'),
        
        // Layout Issues
        mainContent: (() => {
          const main = document.querySelector('main, [role="main"], .main-content');
          if (main) {
            const rect = main.getBoundingBox ? main.getBoundingBox() : main.getBoundingClientRect();
            return {
              exists: true,
              x: rect.x,
              y: rect.y,
              width: rect.width,
              height: rect.height
            };
          }
          return { exists: false };
        })(),
        
        // White background elements
        whiteElements: Array.from(document.querySelectorAll('*'))
          .filter(el => {
            const style = getComputedStyle(el);
            return style.backgroundColor.includes('255, 255, 255') || 
                   style.backgroundColor === 'white' ||
                   style.backgroundColor === 'rgb(255, 255, 255)';
          })
          .length,
          
        // System info
        userAgent: navigator.userAgent,
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight
        },
        
        // Tailwind status
        tailwindDetected: !!document.querySelector('[class*="bg-"], [class*="text-"], [class*="border-"]'),
        
        // URL and performance
        url: location.href,
        loadTime: performance.timing ? performance.timing.loadEventEnd - performance.timing.navigationStart : 'N/A'
      };
    });
    
    console.log('\n📊 FINAL VERIFICATION RESULTS');
    console.log('=' .repeat(60));
    
    console.log('\n🎨 THEME STATUS:');
    console.log(`  HTML Class: "${finalState.htmlClass}"`);
    console.log(`  Expected: "dark"`);
    console.log(`  ✅ Match: ${finalState.htmlClass.includes('dark') ? 'YES' : 'NO'}`);
    
    console.log('\n🔧 CSS VARIABLES:');
    console.log(`  --background: "${finalState.cssVariables.background}"`);
    console.log(`  Expected: "${finalState.expectedBackground}"`);
    console.log(`  ✅ Correct: ${finalState.cssVariables.background === finalState.expectedBackground ? 'YES' : 'NO'}`);
    
    console.log('\n🧭 NAVIGATION:');
    console.log(`  Calendar Links: ${finalState.calendarLinks}`);
    console.log(`  Navigation Visible: ${finalState.navigationVisible}`);
    console.log(`  ✅ Working: ${finalState.calendarLinks > 0 && finalState.navigationVisible ? 'YES' : 'NO'}`);
    
    console.log('\n📐 LAYOUT:');
    console.log(`  Main Content X: ${finalState.mainContent.x || 'N/A'}`);
    console.log(`  Expected X: >200px`);
    console.log(`  ✅ Correct: ${finalState.mainContent.x > 200 ? 'YES' : 'NO'}`);
    
    console.log('\n⚪ WHITE ELEMENTS:');
    console.log(`  Elements with white backgrounds: ${finalState.whiteElements}`);
    console.log(`  ✅ Dark theme: ${finalState.whiteElements === 0 ? 'YES' : 'NO'}`);
    
    console.log('\n🛠️ TECHNICAL INFO:');
    console.log(`  URL: ${finalState.url}`);
    console.log(`  Viewport: ${finalState.viewport.width}x${finalState.viewport.height}`);
    console.log(`  Tailwind Detected: ${finalState.tailwindDetected}`);
    console.log(`  Load Time: ${finalState.loadTime}ms`);
    
    console.log('\n🎯 OVERALL ASSESSMENT:');
    const themeWorking = finalState.htmlClass.includes('dark') && 
                        finalState.cssVariables.background === finalState.expectedBackground;
    const navigationWorking = finalState.calendarLinks > 0 && finalState.navigationVisible;
    const layoutCorrect = finalState.mainContent.x > 200;
    const darkThemeConsistent = finalState.whiteElements === 0;
    
    console.log(`  🎨 Theme System: ${themeWorking ? '✅ WORKING' : '❌ BROKEN'}`);
    console.log(`  🧭 Navigation: ${navigationWorking ? '✅ WORKING' : '❌ BROKEN'}`);
    console.log(`  📐 Layout: ${layoutCorrect ? '✅ WORKING' : '❌ BROKEN'}`);
    console.log(`  🌙 Dark Mode: ${darkThemeConsistent ? '✅ CONSISTENT' : '❌ INCONSISTENT'}`);
    
    const overallStatus = themeWorking && navigationWorking && layoutCorrect && darkThemeConsistent;
    console.log(`\n🏁 FINAL RESULT: ${overallStatus ? '✅ ALL SYSTEMS WORKING' : '❌ CRITICAL ISSUES FOUND'}`);
    
    // Save detailed state
    console.log('\n💾 Saving detailed state...');
    require('fs').writeFileSync('final-state-report.json', JSON.stringify(finalState, null, 2));
    console.log('✅ State saved to: final-state-report.json');
    
  } catch (error) {
    console.error('❌ Final state test failed:', error);
  } finally {
    await browser.close();
  }
}

finalStateTest();