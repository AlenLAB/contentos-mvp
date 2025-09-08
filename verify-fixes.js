const { chromium } = require('playwright');
const fs = require('fs');

async function verifyContentOSFixes() {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  try {
    console.log('🚀 Starting ContentOS MVP verification...');
    
    // Navigate to the deployed app
    console.log('📍 Navigating to ContentOS MVP...');
    await page.goto('https://contentos-mvp.vercel.app', { 
      waitUntil: 'networkidle',
      timeout: 30000 
    });
    
    // Wait for the page to fully load
    await page.waitForTimeout(3000);
    
    console.log('✅ Page loaded successfully');
    
    // 1. THEME SYSTEM VERIFICATION
    console.log('\n🎨 THEME SYSTEM VERIFICATION');
    console.log('=' .repeat(50));
    
    // Check HTML element has 'dark' class
    const htmlClass = await page.evaluate(() => {
      return document.documentElement.className;
    });
    console.log(`HTML classes: "${htmlClass}"`);
    
    const hasDarkClass = htmlClass.includes('dark');
    console.log(`Has 'dark' class: ${hasDarkClass ? '✅' : '❌'}`);
    
    // Check CSS variables for dark theme
    const cssVariables = await page.evaluate(() => {
      const style = getComputedStyle(document.documentElement);
      return {
        background: style.getPropertyValue('--background').trim(),
        foreground: style.getPropertyValue('--foreground').trim(),
        card: style.getPropertyValue('--card').trim(),
        primaryBackground: style.getPropertyValue('--primary').trim()
      };
    });
    
    console.log('CSS Variables:');
    console.log(`  --background: "${cssVariables.background}"`);
    console.log(`  --foreground: "${cssVariables.foreground}"`);
    console.log(`  --card: "${cssVariables.card}"`);
    console.log(`  --primary: "${cssVariables.primaryBackground}"`);
    
    // Check if background is dark theme color
    const isDarkBackground = cssVariables.background === '#09090b' || 
                           cssVariables.background === '9 9 11' ||
                           cssVariables.background.includes('9 9 11');
    console.log(`Dark background applied: ${isDarkBackground ? '✅' : '❌'}`);
    
    // Take initial screenshot
    console.log('\n📸 Taking initial theme screenshot...');
    await page.screenshot({ 
      path: 'theme-verification.png', 
      fullPage: true 
    });
    console.log('✅ Screenshot saved: theme-verification.png');
    
    // 2. NAVIGATION Z-INDEX TEST
    console.log('\n🧭 NAVIGATION Z-INDEX TEST');
    console.log('=' .repeat(50));
    
    // Check if navigation sidebar is visible
    const navigationVisible = await page.isVisible('[data-testid="sidebar"], .sidebar, nav');
    console.log(`Navigation visible: ${navigationVisible ? '✅' : '❌'}`);
    
    // Test Calendar navigation specifically
    const calendarNavExists = await page.locator('a[href="/calendar"], a[href*="calendar"]').count();
    console.log(`Calendar navigation links found: ${calendarNavExists}`);
    
    if (calendarNavExists > 0) {
      const calendarLink = page.locator('a[href="/calendar"], a[href*="calendar"]').first();
      const isClickable = await calendarLink.isEnabled();
      console.log(`Calendar link clickable: ${isClickable ? '✅' : '❌'}`);
      
      // Test clicking calendar navigation
      try {
        console.log('🔗 Testing calendar navigation click...');
        await calendarLink.click();
        await page.waitForTimeout(2000);
        
        const currentUrl = page.url();
        console.log(`Current URL after click: ${currentUrl}`);
        const onCalendarPage = currentUrl.includes('calendar');
        console.log(`Successfully navigated to calendar: ${onCalendarPage ? '✅' : '❌'}`);
        
        // Take screenshot after navigation
        await page.screenshot({ 
          path: 'navigation-test.png', 
          fullPage: true 
        });
        console.log('✅ Screenshot saved: navigation-test.png');
        
      } catch (error) {
        console.log(`❌ Navigation test failed: ${error.message}`);
      }
    }
    
    // 3. LAYOUT TEST
    console.log('\n📐 LAYOUT TEST');
    console.log('=' .repeat(50));
    
    // Check main content area layout
    const mainContentExists = await page.locator('main, .main-content, [role="main"]').count();
    console.log(`Main content area found: ${mainContentExists > 0 ? '✅' : '❌'}`);
    
    if (mainContentExists > 0) {
      const mainElement = page.locator('main, .main-content, [role="main"]').first();
      const mainBoundingBox = await mainElement.boundingBox();
      
      if (mainBoundingBox) {
        console.log(`Main content position: x=${mainBoundingBox.x}, y=${mainBoundingBox.y}`);
        console.log(`Main content size: width=${mainBoundingBox.width}, height=${mainBoundingBox.height}`);
        
        const hasLeftMargin = mainBoundingBox.x > 200; // Check if content respects sidebar
        console.log(`Content respects navigation margin: ${hasLeftMargin ? '✅' : '❌'}`);
      }
    }
    
    // Check for background conflicts
    const bodyStyles = await page.evaluate(() => {
      const style = getComputedStyle(document.body);
      return {
        backgroundColor: style.backgroundColor,
        background: style.background
      };
    });
    
    console.log(`Body background-color: "${bodyStyles.backgroundColor}"`);
    const hasCorrectBodyBg = !bodyStyles.backgroundColor.includes('255, 255, 255') && 
                            !bodyStyles.backgroundColor.includes('white');
    console.log(`Body has dark background: ${hasCorrectBodyBg ? '✅' : '❌'}`);
    
    // 4. RESPONSIVENESS TEST
    console.log('\n📱 RESPONSIVENESS TEST');
    console.log('=' .repeat(50));
    
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(1000);
    
    const mobileNavVisible = await page.isVisible('[data-testid="mobile-nav"], .mobile-nav, .hamburger');
    console.log(`Mobile navigation visible: ${mobileNavVisible ? '✅' : '❌'}`);
    
    // Take mobile screenshot
    await page.screenshot({ 
      path: 'mobile-layout.png', 
      fullPage: true 
    });
    console.log('✅ Screenshot saved: mobile-layout.png');
    
    // Reset to desktop viewport
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.waitForTimeout(1000);
    
    // Final comprehensive screenshot
    await page.screenshot({ 
      path: 'final-verification.png', 
      fullPage: true 
    });
    console.log('✅ Screenshot saved: final-verification.png');
    
    // SUMMARY
    console.log('\n🏁 VERIFICATION SUMMARY');
    console.log('=' .repeat(50));
    
    const results = {
      darkThemeApplied: hasDarkClass && isDarkBackground,
      navigationWorking: calendarNavExists > 0,
      layoutCorrect: mainContentExists > 0,
      noBackgroundConflicts: hasCorrectBodyBg
    };
    
    console.log(`✅ Dark theme properly applied: ${results.darkThemeApplied}`);
    console.log(`✅ Navigation accessibility: ${results.navigationWorking}`);
    console.log(`✅ Layout structure correct: ${results.layoutCorrect}`);
    console.log(`✅ No background conflicts: ${results.noBackgroundConflicts}`);
    
    const allTestsPassed = Object.values(results).every(result => result);
    console.log(`\n🎯 OVERALL RESULT: ${allTestsPassed ? 'ALL TESTS PASSED ✅' : 'SOME TESTS FAILED ❌'}`);
    
  } catch (error) {
    console.error('❌ Verification failed:', error);
  } finally {
    await browser.close();
  }
}

verifyContentOSFixes();