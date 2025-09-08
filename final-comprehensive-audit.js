const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

async function comprehensiveAudit() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 }
  });
  const page = await context.newPage();
  const auditDir = path.join(process.cwd(), 'audit-results');

  console.log('🚀 COMPREHENSIVE CONTENTOS MVP VISUAL AUDIT');
  console.log('=' .repeat(50));
  
  const issues = [];
  const screenshots = [];
  
  try {
    // Phase 1: Initial Load and Theme Analysis
    console.log('\n📋 PHASE 1: Initial Load & Theme Analysis');
    await page.goto('https://contentos-mvp.vercel.app', { waitUntil: 'networkidle' });
    await page.waitForTimeout(3000);

    // Capture initial screenshot
    const initialShot = 'comprehensive-01-initial-load.png';
    await page.screenshot({ path: path.join(auditDir, initialShot), fullPage: true });
    screenshots.push(initialShot);
    console.log('✅ Initial screenshot captured');

    // Deep theme analysis
    const themeAnalysis = await page.evaluate(() => {
      const getColorInfo = (element) => {
        const style = getComputedStyle(element);
        return {
          backgroundColor: style.backgroundColor,
          color: style.color,
          borderColor: style.borderColor
        };
      };
      
      const html = document.documentElement;
      const body = document.body;
      
      return {
        isDarkMode: html.classList.contains('dark') || html.className.includes('dark'),
        htmlClasses: html.className,
        bodyClasses: body.className,
        bodyColors: getColorInfo(body),
        cssVariables: {
          background: getComputedStyle(html).getPropertyValue('--background'),
          foreground: getComputedStyle(html).getPropertyValue('--foreground'),
          card: getComputedStyle(html).getPropertyValue('--card'),
          cardForeground: getComputedStyle(html).getPropertyValue('--card-foreground'),
          primary: getComputedStyle(html).getPropertyValue('--primary'),
        }
      };
    });

    console.log('🎨 Theme Analysis:', JSON.stringify(themeAnalysis, null, 2));

    // Check if dark theme is properly applied
    const expectedDarkTheme = themeAnalysis.isDarkMode || 
      themeAnalysis.bodyColors.backgroundColor.includes('9, 9, 11') ||
      themeAnalysis.cssVariables.background.includes('9, 9, 11');

    if (!expectedDarkTheme) {
      issues.push({
        severity: 'SEVERE',
        category: 'Theme',
        issue: 'Dark theme not properly activated',
        details: `Expected zinc-950 (#09090b), got: ${themeAnalysis.bodyColors.backgroundColor}`,
        selector: 'html, body',
        page: 'Initial Load'
      });
    }

    // Phase 2: Navigation Discovery
    console.log('\n📋 PHASE 2: Navigation System Discovery');
    
    const navigationData = await page.evaluate(() => {
      const navigation = {
        sidebarElements: [],
        navigationLinks: [],
        buttons: [],
        tabs: []
      };
      
      // Find sidebar/navigation containers
      const sidebarSelectors = ['[data-sidebar]', '.sidebar', 'aside', 'nav[role="navigation"]'];
      sidebarSelectors.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => {
          navigation.sidebarElements.push({
            selector,
            className: el.className,
            textContent: el.textContent?.trim().substring(0, 200),
            visible: el.offsetWidth > 0 && el.offsetHeight > 0
          });
        });
      });
      
      // Find all clickable navigation items
      const clickableElements = document.querySelectorAll('a, button, [role="button"], [data-tab], [role="tab"]');
      clickableElements.forEach(el => {
        const text = el.textContent?.trim();
        const href = el.href;
        
        if (text && text.length > 0 && text.length < 100) {
          const item = {
            tagName: el.tagName,
            text,
            href: href || '',
            className: el.className,
            id: el.id,
            visible: el.offsetWidth > 0 && el.offsetHeight > 0,
            position: el.getBoundingClientRect()
          };
          
          if (el.tagName === 'A') navigation.navigationLinks.push(item);
          else if (el.tagName === 'BUTTON' || el.getAttribute('role') === 'button') navigation.buttons.push(item);
          if (el.getAttribute('role') === 'tab' || el.getAttribute('data-tab')) navigation.tabs.push(item);
        }
      });
      
      return navigation;
    });

    console.log(`🧭 Navigation Discovery Results:`);
    console.log(`  Sidebar elements: ${navigationData.sidebarElements.length}`);
    console.log(`  Navigation links: ${navigationData.navigationLinks.length}`);
    console.log(`  Buttons: ${navigationData.buttons.length}`);
    console.log(`  Tabs: ${navigationData.tabs.length}`);

    // Identify main navigation items
    const mainNavItems = [
      ...navigationData.navigationLinks,
      ...navigationData.buttons,
      ...navigationData.tabs
    ].filter(item => {
      const text = item.text.toLowerCase();
      return text.includes('dashboard') || text.includes('calendar') || 
             text.includes('post') || text.includes('editor') || 
             text.includes('generate') || text.includes('scheduler') ||
             text.includes('analytics') || text.includes('overview');
    });

    console.log('\n🎯 Main Navigation Items Found:');
    mainNavItems.forEach((item, i) => {
      console.log(`  ${i+1}. ${item.tagName}: "${item.text}" ${item.href ? `(${item.href})` : ''}`);
    });

    // Phase 3: Navigation Testing
    console.log('\n📋 PHASE 3: Navigation Testing');
    
    if (mainNavItems.length === 0) {
      issues.push({
        severity: 'BLOCKING',
        category: 'Navigation',
        issue: 'No main navigation items found',
        details: 'Could not identify Dashboard, Calendar, Editor, or other main nav items',
        selector: 'Navigation discovery failed',
        page: 'Navigation'
      });
    } else {
      // Test each navigation item (limit to first 6 for speed)
      for (let i = 0; i < Math.min(mainNavItems.length, 6); i++) {
        const navItem = mainNavItems[i];
        console.log(`🖱️ Testing: "${navItem.text}"`);
        
        try {
          // Create a unique selector for this element
          let selector = '';
          if (navItem.id) {
            selector = `#${navItem.id}`;
          } else if (navItem.text) {
            selector = `text=${navItem.text}`;
          } else {
            selector = `${navItem.tagName}${navItem.className ? '.' + navItem.className.split(' ')[0] : ''}`;
          }
          
          // Try to click the element
          if (navItem.id) {
            await page.click(`#${navItem.id}`);
          } else {
            await page.getByText(navItem.text).first().click();
          }
          
          await page.waitForTimeout(2000);
          
          // Take screenshot of this page
          const navScreenshot = `comprehensive-02-nav-${i+1}-${navItem.text.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase().substring(0, 20)}.png`;
          await page.screenshot({ path: path.join(auditDir, navScreenshot), fullPage: true });
          screenshots.push(navScreenshot);
          
          console.log(`  ✅ Successfully navigated to "${navItem.text}"`);
          
          // Analyze current page for issues
          const pageIssues = await analyzeCurrentPage(page, navItem.text);
          issues.push(...pageIssues);
          
        } catch (error) {
          console.log(`  ❌ Failed to navigate to "${navItem.text}": ${error.message}`);
          issues.push({
            severity: 'BLOCKING',
            category: 'Navigation',
            issue: `Cannot navigate to "${navItem.text}"`,
            details: `Error: ${error.message}`,
            selector: selector,
            page: 'Navigation Test'
          });
        }
      }
    }

    // Phase 4: Layout and Visual Issues
    console.log('\n📋 PHASE 4: Layout & Visual Issues Analysis');
    
    // Go back to main page for layout analysis
    await page.goto('https://contentos-mvp.vercel.app');
    await page.waitForTimeout(2000);
    
    const layoutIssues = await page.evaluate(() => {
      const issues = [];
      
      // Check for z-index issues
      const elements = Array.from(document.querySelectorAll('*'));
      const potentialOverlays = elements.filter(el => {
        const style = getComputedStyle(el);
        const zIndex = parseInt(style.zIndex) || 0;
        const position = style.position;
        return zIndex > 10 && (position === 'fixed' || position === 'absolute');
      });
      
      potentialOverlays.forEach(el => {
        const rect = el.getBoundingClientRect();
        // Check if this element might be covering navigation
        if (rect.left < 300 && rect.top < 100) {
          issues.push({
            type: 'z_index_overlap',
            element: `${el.tagName}.${el.className || 'no-class'}`,
            zIndex: getComputedStyle(el).zIndex,
            position: getComputedStyle(el).position,
            bounds: { x: rect.x, y: rect.y, width: rect.width, height: rect.height }
          });
        }
      });
      
      // Check for theme violations
      elements.forEach(el => {
        const style = getComputedStyle(el);
        const bgColor = style.backgroundColor;
        const textColor = style.color;
        
        // White backgrounds in dark theme
        if (bgColor === 'rgb(255, 255, 255)' || bgColor === 'white') {
          issues.push({
            type: 'theme_violation',
            subtype: 'white_background',
            element: `${el.tagName}.${el.className || 'no-class'}`,
            backgroundColor: bgColor
          });
        }
        
        // Invisible text (same color as background)
        if (bgColor === textColor || 
           (bgColor.includes('0, 0, 0') && textColor.includes('0, 0, 0')) ||
           (bgColor.includes('255, 255, 255') && textColor.includes('255, 255, 255'))) {
          issues.push({
            type: 'accessibility_issue',
            subtype: 'invisible_text',
            element: `${el.tagName}.${el.className || 'no-class'}`,
            backgroundColor: bgColor,
            textColor: textColor,
            text: el.textContent?.trim().substring(0, 50)
          });
        }
      });
      
      return issues;
    });
    
    // Convert layout issues to standard format
    layoutIssues.forEach(issue => {
      let severity = 'UX';
      if (issue.type === 'z_index_overlap') severity = 'BLOCKING';
      if (issue.subtype === 'invisible_text') severity = 'SEVERE';
      
      issues.push({
        severity,
        category: issue.type === 'z_index_overlap' ? 'Layout' : 
                 issue.type === 'theme_violation' ? 'Theme' : 'Accessibility',
        issue: issue.subtype ? issue.subtype.replace('_', ' ') : issue.type.replace('_', ' '),
        details: JSON.stringify(issue, null, 2),
        selector: issue.element,
        page: 'Layout Analysis'
      });
    });

    console.log(`🔍 Found ${layoutIssues.length} layout/visual issues`);

    // Phase 5: Mobile Responsiveness
    console.log('\n📋 PHASE 5: Mobile Responsiveness Check');
    
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(2000);
    
    const mobileScreenshot = 'comprehensive-03-mobile-view.png';
    await page.screenshot({ path: path.join(auditDir, mobileScreenshot), fullPage: true });
    screenshots.push(mobileScreenshot);
    
    const mobileIssues = await page.evaluate(() => {
      const issues = [];
      
      // Check for horizontal scrolling
      const hasHorizontalScroll = document.body.scrollWidth > window.innerWidth;
      if (hasHorizontalScroll) {
        issues.push({
          type: 'mobile_issue',
          issue: 'horizontal_scroll',
          details: `Page width: ${document.body.scrollWidth}, Viewport: ${window.innerWidth}`
        });
      }
      
      // Check for elements that might be too small to tap
      const clickableElements = document.querySelectorAll('button, a, [role="button"]');
      clickableElements.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.width < 44 || rect.height < 44) {
          issues.push({
            type: 'mobile_issue',
            issue: 'tap_target_too_small',
            element: `${el.tagName}.${el.className || 'no-class'}`,
            size: { width: rect.width, height: rect.height },
            text: el.textContent?.trim().substring(0, 30)
          });
        }
      });
      
      return issues;
    });
    
    mobileIssues.forEach(issue => {
      issues.push({
        severity: 'UX',
        category: 'Mobile',
        issue: issue.issue.replace('_', ' '),
        details: JSON.stringify(issue, null, 2),
        selector: issue.element || 'mobile-viewport',
        page: 'Mobile View'
      });
    });

    console.log(`📱 Found ${mobileIssues.length} mobile issues`);
    
    // Final Summary
    console.log('\n' + '=' .repeat(50));
    console.log('📊 FINAL AUDIT SUMMARY');
    console.log('=' .repeat(50));
    
    const severityGroups = {
      BLOCKING: issues.filter(i => i.severity === 'BLOCKING'),
      SEVERE: issues.filter(i => i.severity === 'SEVERE'),
      UX: issues.filter(i => i.severity === 'UX')
    };
    
    console.log(`🚨 BLOCKING Issues: ${severityGroups.BLOCKING.length}`);
    console.log(`🔴 SEVERE Issues: ${severityGroups.SEVERE.length}`);
    console.log(`🟡 UX Issues: ${severityGroups.UX.length}`);
    console.log(`📸 Screenshots: ${screenshots.length}`);
    console.log(`⚠️ TOTAL ISSUES: ${issues.length}`);
    
    if (severityGroups.BLOCKING.length > 0) {
      console.log('\n🚨 CRITICAL BLOCKING ISSUES:');
      severityGroups.BLOCKING.forEach((issue, i) => {
        console.log(`  ${i+1}. ${issue.issue} (${issue.category})`);
        console.log(`     Details: ${issue.details}`);
        console.log(`     Page: ${issue.page}`);
      });
    }
    
    // Create comprehensive report
    const finalReport = {
      timestamp: new Date().toISOString(),
      url: 'https://contentos-mvp.vercel.app',
      audit_type: 'comprehensive_visual_audit',
      theme_analysis: themeAnalysis,
      navigation_data: navigationData,
      main_nav_items: mainNavItems,
      summary: {
        total_issues: issues.length,
        blocking: severityGroups.BLOCKING.length,
        severe: severityGroups.SEVERE.length,
        ux: severityGroups.UX.length,
        screenshots_captured: screenshots.length,
        pages_tested: mainNavItems.length + 1
      },
      issues_by_category: {
        Navigation: issues.filter(i => i.category === 'Navigation').length,
        Theme: issues.filter(i => i.category === 'Theme').length,
        Layout: issues.filter(i => i.category === 'Layout').length,
        Accessibility: issues.filter(i => i.category === 'Accessibility').length,
        Mobile: issues.filter(i => i.category === 'Mobile').length
      },
      all_issues: issues,
      screenshots: screenshots,
      recommendations: generateRecommendations(issues)
    };
    
    // Save comprehensive report
    const reportPath = path.join(auditDir, 'comprehensive-audit-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(finalReport, null, 2));
    
    console.log(`\n✅ Comprehensive audit report saved to: ${reportPath}`);
    
    return finalReport;
    
  } catch (error) {
    console.error('💥 Comprehensive audit failed:', error);
    throw error;
  } finally {
    await browser.close();
  }
}

// Function to analyze current page for issues
async function analyzeCurrentPage(page, pageName) {
  const issues = [];
  
  try {
    const pageIssues = await page.evaluate((pageName) => {
      const issues = [];
      
      // Check for calendar z-index issues if this is calendar page
      if (pageName.toLowerCase().includes('calendar')) {
        const calendar = document.querySelector('.react-calendar, [data-calendar], .calendar');
        const sidebar = document.querySelector('[data-sidebar], .sidebar, nav');
        
        if (calendar && sidebar) {
          const calendarRect = calendar.getBoundingClientRect();
          const sidebarRect = sidebar.getBoundingClientRect();
          
          if (calendarRect.left < sidebarRect.right && calendarRect.right > sidebarRect.left) {
            issues.push({
              type: 'calendar_overlap',
              details: 'Calendar overlapping sidebar navigation'
            });
          }
        }
      }
      
      // Check for dashboard white background issues
      if (pageName.toLowerCase().includes('dashboard')) {
        const cards = document.querySelectorAll('.card, [data-card], .dashboard-card');
        cards.forEach(card => {
          const style = getComputedStyle(card);
          if (style.backgroundColor === 'rgb(255, 255, 255)') {
            issues.push({
              type: 'dashboard_white_bg',
              details: 'Dashboard card with white background in dark theme'
            });
          }
        });
      }
      
      return issues;
    }, pageName);
    
    pageIssues.forEach(issue => {
      let severity = 'UX';
      if (issue.type === 'calendar_overlap') severity = 'BLOCKING';
      if (issue.type === 'dashboard_white_bg') severity = 'SEVERE';
      
      issues.push({
        severity,
        category: issue.type.includes('calendar') ? 'Layout' : 'Theme',
        issue: issue.type.replace('_', ' '),
        details: issue.details,
        selector: 'page-specific',
        page: pageName
      });
    });
    
  } catch (error) {
    console.log(`Error analyzing ${pageName}:`, error.message);
  }
  
  return issues;
}

// Function to generate recommendations
function generateRecommendations(issues) {
  const recommendations = [];
  
  const themeIssues = issues.filter(i => i.category === 'Theme').length;
  const navIssues = issues.filter(i => i.category === 'Navigation').length;
  const layoutIssues = issues.filter(i => i.category === 'Layout').length;
  
  if (themeIssues > 0) {
    recommendations.push({
      priority: 'HIGH',
      category: 'Theme',
      recommendation: 'Fix dark theme implementation - ensure CSS variables are properly set and dark mode class is applied to HTML element',
      technical_details: 'Add dark class to <html>, verify --background: #09090b and --foreground: #ffffff CSS variables'
    });
  }
  
  if (navIssues > 0) {
    recommendations.push({
      priority: 'CRITICAL',
      category: 'Navigation',
      recommendation: 'Fix navigation system - ensure navigation links are properly structured and clickable',
      technical_details: 'Review navigation component rendering, ensure proper href attributes and click handlers'
    });
  }
  
  if (layoutIssues > 0) {
    recommendations.push({
      priority: 'HIGH', 
      category: 'Layout',
      recommendation: 'Fix z-index and overlay issues - prevent calendar from covering sidebar navigation',
      technical_details: 'Adjust z-index values, ensure proper stacking context, review fixed/absolute positioning'
    });
  }
  
  return recommendations;
}

// Run the comprehensive audit
comprehensiveAudit()
  .then(report => {
    console.log('\n🎉 Comprehensive audit completed successfully!');
    console.log(`📋 Total issues found: ${report.summary.total_issues}`);
    console.log(`📸 Screenshots captured: ${report.summary.screenshots_captured}`);
    process.exit(0);
  })
  .catch(error => {
    console.error('💥 Audit failed:', error);
    process.exit(1);
  });