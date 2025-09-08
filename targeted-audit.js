const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

async function targetedAudit() {
  const browser = await chromium.launch({
    headless: false,
    slowMo: 500
  });
  
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 }
  });
  
  const page = await context.newPage();
  
  const auditDir = path.join(process.cwd(), 'audit-results');
  const issues = [];
  
  console.log('🎯 Starting Targeted ContentOS MVP Audit');
  
  try {
    // Navigate and wait for full load
    await page.goto('https://contentos-mvp.vercel.app', { waitUntil: 'networkidle' });
    await page.waitForTimeout(5000);
    
    // Take initial screenshot
    await page.screenshot({ path: path.join(auditDir, '02-detailed-initial.png'), fullPage: true });
    console.log('📸 Detailed initial screenshot captured');
    
    // Inspect the actual DOM structure
    const domAnalysis = await page.evaluate(() => {
      // Find all navigation elements
      const navElements = [];
      
      // Common navigation selectors
      const selectors = [
        'nav', '[role="navigation"]', '.nav', '.navigation', 
        '.sidebar', '[data-sidebar]', '.menu', '[role="menu"]',
        'a', 'button[data-tab]', '[data-navigation]',
        '.tab', '[role="tab"]', '.nav-link'
      ];
      
      selectors.forEach(selector => {
        try {
          const elements = document.querySelectorAll(selector);
          elements.forEach((el, index) => {
            const rect = el.getBoundingClientRect();
            navElements.push({
              selector,
              index,
              tagName: el.tagName,
              className: el.className,
              id: el.id,
              textContent: el.textContent?.trim()?.substring(0, 100) || '',
              href: el.href || '',
              visible: rect.width > 0 && rect.height > 0,
              position: { x: rect.x, y: rect.y, width: rect.width, height: rect.height }
            });
          });
        } catch (e) {
          console.log('Error with selector:', selector, e.message);
        }
      });
      
      // Get theme information
      const themeInfo = {
        htmlClasses: document.documentElement.className,
        bodyClasses: document.body.className,
        bodyBgColor: getComputedStyle(document.body).backgroundColor,
        rootStyles: {
          background: getComputedStyle(document.documentElement).getPropertyValue('--background'),
          foreground: getComputedStyle(document.documentElement).getPropertyValue('--foreground'),
        }
      };
      
      // Check for specific ContentOS elements
      const contentOSElements = [
        { name: 'Sidebar', selectors: ['[data-sidebar]', '.sidebar', 'aside'] },
        { name: 'Navigation', selectors: ['nav', '[role="navigation"]'] },
        { name: 'Content Area', selectors: ['main', '[role="main"]', '.content'] },
        { name: 'Cards', selectors: ['.card', '[data-card]'] },
        { name: 'Buttons', selectors: ['button', '[role="button"]'] }
      ];
      
      const foundElements = {};
      contentOSElements.forEach(category => {
        foundElements[category.name] = [];
        category.selectors.forEach(selector => {
          const elements = document.querySelectorAll(selector);
          elements.forEach(el => {
            foundElements[category.name].push({
              selector,
              className: el.className,
              id: el.id,
              textContent: el.textContent?.trim()?.substring(0, 50) || '',
              visible: el.offsetWidth > 0 && el.offsetHeight > 0
            });
          });
        });
      });
      
      return {
        navElements: navElements.filter(el => el.visible && el.textContent.length > 0),
        themeInfo,
        foundElements
      };
    });
    
    console.log('\n🔍 DOM Analysis Results:');
    console.log('📊 Found Elements:', Object.keys(domAnalysis.foundElements).map(key => 
      `${key}: ${domAnalysis.foundElements[key].length}`).join(', '));
    console.log('🎨 Theme Info:', domAnalysis.themeInfo);
    
    // Look for navigation items more intelligently
    const navigationItems = domAnalysis.navElements.filter(el => 
      el.textContent.toLowerCase().includes('dashboard') ||
      el.textContent.toLowerCase().includes('calendar') ||
      el.textContent.toLowerCase().includes('post') ||
      el.textContent.toLowerCase().includes('editor') ||
      el.textContent.toLowerCase().includes('generate') ||
      el.href.includes('dashboard') ||
      el.href.includes('calendar') ||
      el.href.includes('post') ||
      el.href.includes('editor') ||
      el.href.includes('generate')
    );
    
    console.log('\n🧭 Navigation Items Found:', navigationItems.length);
    navigationItems.forEach((item, i) => {
      console.log(`  ${i+1}. ${item.tagName}: "${item.textContent}" (${item.href || item.className})`);
    });
    
    // Test clicking actual navigation if found
    if (navigationItems.length > 0) {
      console.log('\n🎯 Testing actual navigation elements...');
      
      for (let i = 0; i < Math.min(navigationItems.length, 5); i++) {
        const item = navigationItems[i];
        try {
          // Try to click the element
          const selector = item.id ? `#${item.id}` : 
                          item.className ? `.${item.className.split(' ')[0]}` :
                          item.tagName.toLowerCase();
          
          console.log(`🖱️ Clicking: ${item.textContent} (${selector})`);
          
          // Try different approaches to click
          try {
            await page.click(selector);
          } catch (e) {
            // Try by text content
            if (item.textContent) {
              await page.getByText(item.textContent).first().click();
            }
          }
          
          await page.waitForTimeout(3000);
          
          // Take screenshot after navigation
          const screenshotName = `03-nav-${i+1}-${item.textContent.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}.png`;
          await page.screenshot({ path: path.join(auditDir, screenshotName), fullPage: true });
          console.log(`📸 Screenshot captured: ${screenshotName}`);
          
          // Check for specific issues on this page
          const pageIssues = await checkCurrentPageIssues(page);
          issues.push(...pageIssues.map(issue => ({...issue, page: item.textContent})));
          
        } catch (error) {
          console.log(`❌ Failed to test ${item.textContent}:`, error.message);
          issues.push({
            severity: 'SEVERE',
            category: 'Navigation',
            issue: `Failed to navigate to ${item.textContent}`,
            details: error.message,
            page: 'Navigation Test'
          });
        }
      }
    } else {
      console.log('⚠️ No recognizable navigation items found');
      issues.push({
        severity: 'BLOCKING',
        category: 'Navigation',
        issue: 'No navigation system detected',
        details: 'Could not find standard navigation elements on the page',
        page: 'Initial Load'
      });
    }
    
    // Mobile test
    console.log('\n📱 Testing mobile viewport...');
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(2000);
    await page.screenshot({ path: path.join(auditDir, '04-mobile-view.png'), fullPage: true });
    console.log('📸 Mobile screenshot captured');
    
    // Final summary
    console.log('\n📊 Audit Complete');
    console.log(`⚠️ Issues found: ${issues.length}`);
    
    // Save detailed report
    const detailedReport = {
      timestamp: new Date().toISOString(),
      url: 'https://contentos-mvp.vercel.app',
      domAnalysis,
      navigationItems,
      issues,
      summary: {
        total_issues: issues.length,
        navigation_items_found: navigationItems.length,
        elements_analyzed: Object.values(domAnalysis.foundElements).flat().length
      }
    };
    
    fs.writeFileSync(
      path.join(auditDir, 'detailed-audit-report.json'),
      JSON.stringify(detailedReport, null, 2)
    );
    
    console.log('\n🔍 Browser remaining open for manual inspection...');
    await new Promise(resolve => setTimeout(resolve, 30000)); // Wait 30 seconds for manual inspection
    
  } catch (error) {
    console.error('💥 Audit failed:', error);
  }
  
  await browser.close();
}

// Function to check current page issues
async function checkCurrentPageIssues(page) {
  const issues = [];
  
  try {
    // Check theme violations
    const themeViolations = await page.evaluate(() => {
      const violations = [];
      const elements = document.querySelectorAll('*');
      
      elements.forEach(el => {
        const style = getComputedStyle(el);
        const bgColor = style.backgroundColor;
        const textColor = style.color;
        
        // White background in dark theme
        if (bgColor === 'rgb(255, 255, 255)') {
          violations.push({
            type: 'white_background',
            element: el.tagName + (el.className ? '.' + el.className.split(' ')[0] : ''),
            details: `Background: ${bgColor}`
          });
        }
        
        // Invisible text
        if (bgColor === textColor || (bgColor.includes('0, 0, 0') && textColor.includes('0, 0, 0'))) {
          violations.push({
            type: 'invisible_text',
            element: el.tagName + (el.className ? '.' + el.className.split(' ')[0] : ''),
            details: `Background: ${bgColor}, Text: ${textColor}`
          });
        }
      });
      
      return violations;
    });
    
    themeViolations.forEach(violation => {
      issues.push({
        severity: violation.type === 'invisible_text' ? 'SEVERE' : 'UX',
        category: 'Theme',
        issue: violation.type.replace('_', ' '),
        details: `Element: ${violation.element}, ${violation.details}`,
        page: 'Current'
      });
    });
    
  } catch (error) {
    console.log('Error checking page issues:', error.message);
  }
  
  return issues;
}

targetedAudit().catch(console.error);