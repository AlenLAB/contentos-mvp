# ContentOS Visual Audit Prompt

## Initial Setup Command
After `/init` is complete, use this exact prompt:

---

**IMPORTANT: You are about to perform a VISUAL AUDIT ONLY. Do NOT make any code changes until the full audit is complete and approved.**

I need you to perform a comprehensive visual audit of ContentOS using Playwright MCP. This is a dark-themed content management system for dual-platform posting (X/Twitter and LinkedIn).

## Phase 1: Visual Discovery (DO NOT CHANGE CODE)

Use Playwright MCP to:
1. Navigate to http://localhost:3000
2. Take screenshots of EVERY page and state
3. Document ALL visual issues, no matter how small
4. Test ALL interactive elements
5. Check ALL responsive breakpoints

## Core Design System to PRESERVE
**DO NOT CHANGE THESE FUNDAMENTALS:**
- Dark theme (zinc-900/950 backgrounds)
- Emerald accent colors (emerald-500 primary)
- Glassmorphic top navigation bar
- Collapsible sidebar navigation
- Split view for dual-platform editing

## Required Inspection Checklist

### 1. Navigation & Layout
- [ ] Top navigation bar contrast and readability
- [ ] Sidebar navigation item alignment
- [ ] Active state indicators consistency
- [ ] Hover states on all clickable elements
- [ ] Mobile hamburger menu functionality
- [ ] Sidebar collapse/expand animation smoothness
- [ ] Logo and branding consistency
- [ ] Navigation icon alignment and sizing

### 2. Color Consistency
- [ ] Background colors (should be zinc-900/950)
- [ ] Text colors (white primary, zinc-400 secondary)
- [ ] Border colors (zinc-800 for all borders)
- [ ] Button colors and states
- [ ] Badge colors for different states (draft, scheduled, published)
- [ ] Hover state color changes
- [ ] Focus ring colors
- [ ] Error/success/warning color usage

### 3. Typography & Spacing
- [ ] Font sizes consistency across similar elements
- [ ] Line height and paragraph spacing
- [ ] Heading hierarchy (h1, h2, h3)
- [ ] Letter spacing consistency
- [ ] Text truncation and overflow handling
- [ ] Padding consistency within cards/components
- [ ] Margin consistency between sections
- [ ] Grid gaps and alignment

### 4. Component Inspection
- [ ] Card components (borders, shadows, padding)
- [ ] Button sizes and padding consistency
- [ ] Form input styling consistency
- [ ] Modal/dialog styling and backdrop
- [ ] Dropdown menu styling
- [ ] Badge styling and positioning
- [ ] Icon sizes and alignment
- [ ] Loading states and skeletons

### 5. Interactive Elements
- [ ] All buttons have proper hover states
- [ ] Form inputs have focus states
- [ ] Disabled states are visually distinct
- [ ] Click targets are adequate size (min 44x44px mobile)
- [ ] Keyboard navigation works properly
- [ ] Tab order is logical
- [ ] Tooltips appear correctly
- [ ] Transitions are smooth (not jarring)

### 6. Page-Specific Checks

#### Dashboard (/dashboard or /)
- [ ] Stats cards alignment
- [ ] Chart/graph rendering
- [ ] Welcome message positioning
- [ ] Quick action buttons
- [ ] Recent activity section

#### Postcards (/postcards)
- [ ] Card grid layout consistency
- [ ] Card hover effects
- [ ] Empty state appearance
- [ ] Action buttons visibility
- [ ] State badges positioning
- [ ] Character count displays

#### Editor (/editor/new)
- [ ] Editor layout and spacing
- [ ] Preview pane styling
- [ ] Character counter positioning
- [ ] Template selector styling
- [ ] Save/publish button states

#### Calendar (/calendar)
- [ ] Calendar grid alignment
- [ ] Day/week/month view consistency
- [ ] Event cards within calendar
- [ ] Navigation controls
- [ ] Date picker styling

#### Generate (/generate)
- [ ] Form layout and spacing
- [ ] Phase configuration sections
- [ ] Progress indicators
- [ ] Enhanced generator dialog
- [ ] Summary cards

### 7. Split View Editor
- [ ] X/Twitter preview accuracy
- [ ] LinkedIn preview accuracy
- [ ] Character counters visibility
- [ ] Platform icons and labels
- [ ] Divider between platforms
- [ ] Save button positioning

### 8. Responsive Design
Test at these breakpoints:
- [ ] Mobile: 375px (iPhone SE)
- [ ] Mobile: 390px (iPhone 14)
- [ ] Tablet: 768px (iPad Mini)
- [ ] Desktop: 1024px (small laptop)
- [ ] Desktop: 1440px (standard)
- [ ] Desktop: 1920px (full HD)

### 9. Accessibility Issues
- [ ] Color contrast (WCAG AA minimum)
- [ ] Focus indicators visible
- [ ] Screen reader labels present
- [ ] Alt text for images
- [ ] ARIA labels where needed
- [ ] Keyboard navigation complete

### 10. Visual Bugs to Find
- [ ] Z-index conflicts (elements overlapping incorrectly)
- [ ] Overflow issues (content cut off)
- [ ] Alignment problems (things not centered)
- [ ] Inconsistent gaps/spacing
- [ ] Border radius inconsistencies
- [ ] Shadow inconsistencies
- [ ] Animation glitches
- [ ] Flash of unstyled content (FOUC)
- [ ] Scrollbar styling issues
- [ ] Text wrapping problems

## Output Format Required

After inspection, provide a report structured as:

```markdown
# ContentOS Visual Audit Report

## Critical Issues (Breaking functionality)
1. [Issue description]
   - Location: [Page/Component]
   - Screenshot: [Reference]
   - Impact: [User impact]
   - Fix approach: [How to fix WITHOUT breaking existing features]

## High Priority (Very noticeable)
[Same format]

## Medium Priority (Noticeable to some users)
[Same format]

## Low Priority (Polish items)
[Same format]

## Positive Findings (What's working well)
- [List what should NOT be changed]

## Recommended Fix Order
1. [Prioritized list of fixes]
```

## Constraints for Fixes

**NEVER:**
- Change the dark theme to light
- Remove the glassmorphic effect
- Change emerald accent colors without approval
- Delete existing features or tabs
- Modify the core layout structure
- Remove the collapsible sidebar
- Change the split view editor concept

**ALWAYS:**
- Preserve existing functionality
- Maintain dark theme aesthetic
- Keep all current features
- Fix issues incrementally
- Test after each fix
- Ask before major changes

## Screenshot Documentation

Take screenshots of:
1. Full page views of each route
2. Close-ups of any issues found
3. Hover/active states
4. Mobile view of each page
5. Any animation issues (multiple frames)
6. Before/after comparisons for proposed fixes

## Start Inspection

Begin with:
```
Use Playwright MCP to navigate to http://localhost:3000 and start comprehensive visual audit of ContentOS
```

Document EVERYTHING you see, even minor inconsistencies. We want to catch issues that might not be immediately obvious.

---

## After Audit Completion

Only after providing the full audit report, ask:
"Would you like me to create a fix plan for these issues, starting with the critical ones?"

Then create incremental fixes that preserve all existing functionality.