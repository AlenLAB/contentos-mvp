const { chromium } = require('playwright');

async function detailedDebug() {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  try {
    console.log('🔍 DETAILED DEBUG INVESTIGATION');
    console.log('=' .repeat(60));
    
    await page.goto('https://contentos-mvp.vercel.app', { 
      waitUntil: 'networkidle',
      timeout: 30000 
    });
    
    await page.waitForTimeout(3000);
    
    // 1. Check document structure and theme provider
    console.log('\n📋 DOCUMENT STRUCTURE ANALYSIS');
    console.log('-' .repeat(40));
    
    const documentInfo = await page.evaluate(() => {
      return {
        htmlClass: document.documentElement.className,
        htmlDataTheme: document.documentElement.getAttribute('data-theme'),
        bodyClass: document.body.className,
        bodyDataTheme: document.body.getAttribute('data-theme'),
        themeProviderExists: !!document.querySelector('[data-theme], .theme-provider, [class*="theme"]'),
        nextThemesScript: !!document.querySelector('script[data-theme]'),
        hasSystemColorScheme: window.matchMedia('(prefers-color-scheme: dark)').matches
      };
    });
    
    console.log('HTML element class:', documentInfo.htmlClass);
    console.log('HTML data-theme:', documentInfo.htmlDataTheme);
    console.log('Body class:', documentInfo.bodyClass);
    console.log('Body data-theme:', documentInfo.bodyDataTheme);
    console.log('Theme provider exists:', documentInfo.themeProviderExists);
    console.log('Next-themes script:', documentInfo.nextThemesScript);
    console.log('System prefers dark:', documentInfo.hasSystemColorScheme);
    
    // 2. Check CSS variables in different contexts
    console.log('\n🎨 CSS VARIABLES DEEP DIVE');
    console.log('-' .repeat(40));
    
    const cssAnalysis = await page.evaluate(() => {
      const rootStyle = getComputedStyle(document.documentElement);
      const bodyStyle = getComputedStyle(document.body);
      
      // Find the main content area
      const mainContent = document.querySelector('main, .main-content, [role="main"]');
      const mainStyle = mainContent ? getComputedStyle(mainContent) : null;
      
      // Check for white backgrounds
      const whiteElements = Array.from(document.querySelectorAll('*')).filter(el => {
        const style = getComputedStyle(el);
        return style.backgroundColor.includes('255, 255, 255') || 
               style.backgroundColor === 'white' ||
               style.background.includes('white');
      }).map(el => ({
        tagName: el.tagName,
        className: el.className,
        id: el.id,
        backgroundColor: getComputedStyle(el).backgroundColor
      }));
      
      return {
        root: {
          background: rootStyle.getPropertyValue('--background'),
          foreground: rootStyle.getPropertyValue('--foreground'),
          card: rootStyle.getPropertyValue('--card'),
          primary: rootStyle.getPropertyValue('--primary'),
          backgroundColor: rootStyle.backgroundColor,
          colorScheme: rootStyle.colorScheme
        },
        body: {
          backgroundColor: bodyStyle.backgroundColor,
          background: bodyStyle.background,
          color: bodyStyle.color
        },
        main: mainStyle ? {
          backgroundColor: mainStyle.backgroundColor,
          background: mainStyle.background,
          color: mainStyle.color
        } : null,
        whiteElements: whiteElements.slice(0, 5) // Limit to first 5
      };
    });
    
    console.log('\nROOT CSS Variables:');
    console.log('  --background:', cssAnalysis.root.background);
    console.log('  --foreground:', cssAnalysis.root.foreground);
    console.log('  --card:', cssAnalysis.root.card);
    console.log('  --primary:', cssAnalysis.root.primary);
    console.log('  backgroundColor:', cssAnalysis.root.backgroundColor);
    console.log('  colorScheme:', cssAnalysis.root.colorScheme);
    
    console.log('\nBODY Styles:');
    console.log('  backgroundColor:', cssAnalysis.body.backgroundColor);
    console.log('  background:', cssAnalysis.body.background);
    console.log('  color:', cssAnalysis.body.color);
    
    if (cssAnalysis.main) {
      console.log('\nMAIN Content Styles:');
      console.log('  backgroundColor:', cssAnalysis.main.backgroundColor);
      console.log('  background:', cssAnalysis.main.background);
      console.log('  color:', cssAnalysis.main.color);
    }
    
    console.log('\nElements with WHITE backgrounds:');
    cssAnalysis.whiteElements.forEach((el, i) => {
      console.log(`  ${i+1}. ${el.tagName}.${el.className} - ${el.backgroundColor}`);
    });
    
    // 3. Check for theme toggle functionality
    console.log('\n🔄 THEME TOGGLE INVESTIGATION');
    console.log('-' .repeat(40));
    
    const themeToggleInfo = await page.evaluate(() => {
      const toggleButton = document.querySelector('[data-theme-toggle], .theme-toggle, button[aria-label*="theme" i]');
      const darkModeButton = document.querySelector('button[aria-label*="dark" i]');
      
      return {
        toggleExists: !!toggleButton,
        darkModeButtonExists: !!darkModeButton,
        toggleButton: toggleButton ? {
          tagName: toggleButton.tagName,
          className: toggleButton.className,
          textContent: toggleButton.textContent,
          ariaLabel: toggleButton.getAttribute('aria-label')
        } : null
      };
    });
    
    console.log('Theme toggle exists:', themeToggleInfo.toggleExists);
    console.log('Dark mode button exists:', themeToggleInfo.darkModeButtonExists);
    if (themeToggleInfo.toggleButton) {
      console.log('Toggle button:', themeToggleInfo.toggleButton);
    }
    
    // 4. Try to manually trigger dark mode
    console.log('\n🌙 ATTEMPTING TO TRIGGER DARK MODE');
    console.log('-' .repeat(40));
    
    // Try to find and click theme toggle
    const themeToggle = page.locator('button[aria-label*="theme" i], [data-theme-toggle], .theme-toggle').first();
    const toggleExists = await themeToggle.count() > 0;
    
    if (toggleExists) {
      console.log('Found theme toggle, attempting click...');
      await themeToggle.click();
      await page.waitForTimeout(1000);
      
      const afterToggle = await page.evaluate(() => ({
        htmlClass: document.documentElement.className,
        background: getComputedStyle(document.documentElement).getPropertyValue('--background')
      }));
      
      console.log('After toggle - HTML class:', afterToggle.htmlClass);
      console.log('After toggle - background:', afterToggle.background);
      
      await page.screenshot({ path: 'after-theme-toggle.png', fullPage: true });
      console.log('✅ Screenshot saved: after-theme-toggle.png');
    } else {
      console.log('❌ No theme toggle found');
    }
    
    // 5. Check localStorage and theme persistence
    console.log('\n💾 THEME PERSISTENCE CHECK');
    console.log('-' .repeat(40));
    
    const storageInfo = await page.evaluate(() => {
      return {
        localStorage: {
          theme: localStorage.getItem('theme'),
          nextTheme: localStorage.getItem('next-theme'),
          colorScheme: localStorage.getItem('color-scheme')
        },
        cookies: document.cookie,
        systemTheme: window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
      };
    });
    
    console.log('LocalStorage theme:', storageInfo.localStorage.theme);
    console.log('LocalStorage next-theme:', storageInfo.localStorage.nextTheme);
    console.log('System theme preference:', storageInfo.systemTheme);
    
    // 6. Network and console errors
    console.log('\n🚨 ERROR INVESTIGATION');
    console.log('-' .repeat(40));
    
    const errors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    // Wait a bit to collect any errors
    await page.waitForTimeout(2000);
    
    if (errors.length > 0) {
      console.log('Console errors found:');
      errors.forEach((error, i) => {
        console.log(`  ${i+1}. ${error}`);
      });
    } else {
      console.log('No console errors detected');
    }
    
  } catch (error) {
    console.error('❌ Debug failed:', error);
  } finally {
    await browser.close();
  }
}

detailedDebug();