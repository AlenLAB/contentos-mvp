const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

async function auditContentOSMVP() {
  const browser = await chromium.launch({
    headless: false, // Keep visible to see the audit
    slowMo: 1000 // Slow down for observation
  });
  
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
  });
  
  const page = await context.newPage();
  
  // Create audit directory
  const auditDir = path.join(process.cwd(), 'audit-results');
  if (!fs.existsSync(auditDir)) {
    fs.mkdirSync(auditDir);
  }
  
  const issues = [];
  const screenshots = [];
  
  console.log('🚀 Starting ContentOS MVP Visual Audit');
  console.log('📱 Target: https://contentos-mvp.vercel.app');
  
  try {
    // Phase 1: Initial Load Assessment
    console.log('\n📋 Phase 1: Initial Load Assessment');
    
    // Navigate to application
    console.log('⏳ Loading application...');
    await page.goto('https://contentos-mvp.vercel.app', { waitUntil: 'networkidle' });
    
    // Wait for initial render
    await page.waitForTimeout(3000);
    
    // Take initial screenshot
    const initialScreenshot = path.join(auditDir, '01-initial-load.png');
    await page.screenshot({ path: initialScreenshot, fullPage: true });
    screenshots.push('01-initial-load.png');
    console.log('📸 Initial load screenshot captured');
    
    // Check for JavaScript errors
    const consoleErrors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
        console.log('❌ Console Error:', msg.text());
      }
    });
    
    // Check if dark theme is loaded
    const isDarkTheme = await page.evaluate(() => {
      const html = document.documentElement;
      const body = document.body;
      const computedStyle = getComputedStyle(body);
      const bgColor = computedStyle.backgroundColor;
      
      return {
        htmlClass: html.className,
        bodyClass: body.className,
        backgroundColor: bgColor,
        isDarkTheme: html.classList.contains('dark') || bgColor.includes('9, 9, 11') // zinc-950
      };
    });
    
    console.log('🎨 Theme Analysis:', isDarkTheme);
    
    if (!isDarkTheme.isDarkTheme) {
      issues.push({
        severity: 'SEVERE',
        category: 'Theme',
        issue: 'Dark theme not properly loaded',
        details: `Background color: ${isDarkTheme.backgroundColor}, Classes: ${isDarkTheme.htmlClass}`,
        page: 'Initial Load'
      });
    }
    
    // Phase 2: Navigation System Testing
    console.log('\n📋 Phase 2: Navigation System Testing');
    
    // Test App Router navigation items
    const appRouterItems = [
      { name: 'Dashboard', selector: 'a[href*="dashboard"]' },
      { name: 'Calendar', selector: 'a[href*="calendar"]' },
      { name: 'All Posts', selector: 'a[href*="postcards"]' },
      { name: 'Editor', selector: 'a[href*="editor"]' },
      { name: 'Generate', selector: 'a[href*="generate"]' }
    ];
    
    // Test view-based navigation if present
    const viewBasedItems = [
      'dashboard', 'calendar', 'scheduler', 'team', 'audience', 'discovery', 'qc'
    ];
    
    // Test each navigation item
    for (let i = 0; i < appRouterItems.length; i++) {
      const item = appRouterItems[i];
      console.log(`🔍 Testing ${item.name} navigation...`);
      
      try {
        // Look for the navigation link
        const navLink = await page.locator(item.selector).first();
        
        if (await navLink.count() > 0) {
          // Check if link is visible and clickable
          const isVisible = await navLink.isVisible();
          const isClickable = await navLink.isEnabled();
          
          console.log(`  ✅ ${item.name}: Visible=${isVisible}, Clickable=${isClickable}`);
          
          if (isVisible && isClickable) {
            // Click and test
            await navLink.click();
            await page.waitForTimeout(2000); // Wait for navigation
            
            // Take screenshot
            const screenshotPath = path.join(auditDir, `02-nav-${item.name.toLowerCase().replace(' ', '-')}.png`);
            await page.screenshot({ path: screenshotPath, fullPage: true });
            screenshots.push(`02-nav-${item.name.toLowerCase().replace(' ', '-')}.png`);
            
            // Check for specific known issues
            await checkPageSpecificIssues(page, item.name, issues);
            
          } else {
            issues.push({
              severity: 'BLOCKING',
              category: 'Navigation',
              issue: `${item.name} navigation link not accessible`,
              details: `Visible: ${isVisible}, Clickable: ${isClickable}`,
              page: item.name
            });
          }
        } else {
          issues.push({
            severity: 'BLOCKING',
            category: 'Navigation',
            issue: `${item.name} navigation link not found`,
            details: `Selector: ${item.selector}`,
            page: 'Navigation'
          });
        }
      } catch (error) {
        issues.push({
          severity: 'SEVERE',
          category: 'Navigation',
          issue: `Error testing ${item.name} navigation`,
          details: error.message,
          page: item.name
        });
      }
    }
    
    // Phase 3: Theme and Visual Issues Check
    console.log('\n📋 Phase 3: Theme and Visual Issues Check');
    
    // Check for theme violations across the page
    const themeIssues = await page.evaluate(() => {
      const issues = [];
      
      // Check for white backgrounds that shouldn't be there
      const elements = document.querySelectorAll('*');
      elements.forEach(el => {
        const style = getComputedStyle(el);
        const bgColor = style.backgroundColor;
        
        // Look for white/light backgrounds in dark theme
        if (bgColor === 'rgb(255, 255, 255)' || bgColor === 'white') {
          const tagName = el.tagName.toLowerCase();
          const classList = Array.from(el.classList).join(' ');
          const id = el.id;
          
          issues.push({
            element: `${tagName}${id ? '#' + id : ''}${classList ? '.' + classList.replace(' ', '.') : ''}`,
            backgroundColor: bgColor,
            issue: 'White background in dark theme'
          });
        }
      });
      
      return issues;
    });
    
    themeIssues.forEach(issue => {
      issues.push({
        severity: 'UX',
        category: 'Theme',
        issue: 'White background violation',
        details: `Element: ${issue.element}, Background: ${issue.backgroundColor}`,
        page: 'Multiple'
      });
    });
    
    // Phase 4: Button Visibility Check
    console.log('\n📋 Phase 4: Button Visibility Check');
    
    const buttonIssues = await page.evaluate(() => {
      const issues = [];
      const buttons = document.querySelectorAll('button, a[role="button"], input[type="button"], input[type="submit"]');
      
      buttons.forEach(btn => {
        const style = getComputedStyle(btn);
        const bgColor = style.backgroundColor;
        const textColor = style.color;
        
        // Check for invisible text (black on black, white on white, etc.)
        const isInvisible = 
          (bgColor === 'rgb(0, 0, 0)' && textColor === 'rgb(0, 0, 0)') ||
          (bgColor === 'rgb(255, 255, 255)' && textColor === 'rgb(255, 255, 255)') ||
          (bgColor === textColor);
        
        if (isInvisible) {
          issues.push({
            element: btn.tagName.toLowerCase() + (btn.className ? '.' + btn.className.replace(' ', '.') : ''),
            backgroundColor: bgColor,
            textColor: textColor,
            text: btn.textContent?.trim() || 'No text'
          });
        }
      });
      
      return issues;
    });
    
    buttonIssues.forEach(issue => {
      issues.push({
        severity: 'SEVERE',
        category: 'Accessibility',
        issue: 'Invisible button text',
        details: `Element: ${issue.element}, Background: ${issue.backgroundColor}, Text Color: ${issue.textColor}, Text: "${issue.text}"`,
        page: 'Multiple'
      });
    });
    
    console.log('\n📊 Audit Summary:');
    console.log(`📸 Screenshots captured: ${screenshots.length}`);
    console.log(`⚠️ Issues found: ${issues.length}`);
    
    // Categorize issues by severity
    const blocking = issues.filter(i => i.severity === 'BLOCKING');
    const severe = issues.filter(i => i.severity === 'SEVERE');  
    const ux = issues.filter(i => i.severity === 'UX');
    
    console.log(`🚨 Blocking: ${blocking.length}`);
    console.log(`🔴 Severe: ${severe.length}`);
    console.log(`🟡 UX: ${ux.length}`);
    
    // Generate audit report
    const report = {
      timestamp: new Date().toISOString(),
      url: 'https://contentos-mvp.vercel.app',
      summary: {
        total_issues: issues.length,
        blocking: blocking.length,
        severe: severe.length,
        ux: ux.length,
        screenshots: screenshots.length
      },
      console_errors: consoleErrors,
      theme_analysis: isDarkTheme,
      issues: issues,
      screenshots: screenshots
    };
    
    // Save report
    const reportPath = path.join(auditDir, 'audit-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    console.log(`📝 Audit report saved to: ${reportPath}`);
    
    // Keep browser open for manual inspection
    console.log('\n🔍 Browser kept open for manual inspection. Press Enter to close...');
    
  } catch (error) {
    console.error('💥 Audit failed:', error);
    issues.push({
      severity: 'BLOCKING',
      category: 'System',
      issue: 'Audit script error',
      details: error.message,
      page: 'System'
    });
  }
  
  // Don't close immediately - allow for manual inspection
  await new Promise(resolve => {
    process.stdin.once('data', resolve);
  });
  
  await browser.close();
}

// Function to check page-specific issues
async function checkPageSpecificIssues(page, pageName, issues) {
  try {
    // Calendar specific checks
    if (pageName === 'Calendar') {
      console.log('  🔍 Checking Calendar-specific issues...');
      
      // Check for z-index issues with sidebar
      const sidebarOverlap = await page.evaluate(() => {
        const sidebar = document.querySelector('[data-sidebar], .sidebar, nav');
        const calendar = document.querySelector('[data-calendar], .calendar, .react-calendar');
        
        if (sidebar && calendar) {
          const sidebarRect = sidebar.getBoundingClientRect();
          const calendarRect = calendar.getBoundingClientRect();
          
          // Check if calendar overlaps sidebar
          return calendarRect.left < sidebarRect.right && calendarRect.right > sidebarRect.left;
        }
        
        return false;
      });
      
      if (sidebarOverlap) {
        issues.push({
          severity: 'BLOCKING',
          category: 'Layout',
          issue: 'Calendar grid covering sidebar navigation',
          details: 'Z-index issue causing calendar to overlay navigation',
          page: 'Calendar'
        });
      }
    }
    
    // Dashboard specific checks  
    if (pageName === 'Dashboard') {
      console.log('  🔍 Checking Dashboard-specific issues...');
      
      // Check for white background bleeding
      const whiteBgIssues = await page.evaluate(() => {
        const cards = document.querySelectorAll('.card, [data-card], .dashboard-card');
        let hasWhiteBg = false;
        
        cards.forEach(card => {
          const style = getComputedStyle(card);
          if (style.backgroundColor === 'rgb(255, 255, 255)' || style.backgroundColor === 'white') {
            hasWhiteBg = true;
          }
        });
        
        return hasWhiteBg;
      });
      
      if (whiteBgIssues) {
        issues.push({
          severity: 'SEVERE',
          category: 'Theme',
          issue: 'White background bleeding through dashboard cards',
          details: 'Cards showing white background instead of dark theme colors',
          page: 'Dashboard'
        });
      }
    }
    
  } catch (error) {
    console.log(`  ⚠️ Error checking ${pageName} specific issues:`, error.message);
  }
}

// Run the audit
auditContentOSMVP().catch(console.error);