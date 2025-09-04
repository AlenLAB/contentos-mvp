# CLAUDE: Execute these tasks in order

## Task 2.2: Database Schema
Run this SQL in Supabase SQL Editor:
```sql
CREATE TABLE postcards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  english_content TEXT NOT NULL,
  swedish_content TEXT NOT NULL,
  state TEXT DEFAULT 'draft' CHECK (state IN ('draft', 'approved', 'scheduled', 'published')),
  template TEXT CHECK (template IN ('story', 'tool')),
  scheduled_date TIMESTAMPTZ,
  published_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_postcards_updated_at BEFORE UPDATE ON postcards
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

## Task 2.3: Create Supabase Client
Create `src/lib/supabase.ts`:
```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Postcard = {
  id: string
  english_content: string
  swedish_content: string
  state: 'draft' | 'approved' | 'scheduled' | 'published'
  template: 'story' | 'tool' | null
  scheduled_date: string | null
  published_date: string | null
  created_at: string
  updated_at: string
}
```

## Task 2.4: Test Database Connection
Create `src/app/api/test-db/route.ts`:
```typescript
import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  const { data, error } = await supabase
    .from('postcards')
    .select('*')
    .limit(1)
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  
  return NextResponse.json({ success: true, data })
}
```

## Task 3.1: Dashboard Component
Go to v0.dev and paste:
```
Create a ContentOS dashboard using shadcn/ui with:
- Header with title "ContentOS" and subtitle "14 Postcards in 14 Days"
- Stats cards in a grid (4 cards):
  - Total Postcards (number and label)
  - Scheduled (number and label) 
  - Published (number and label)
  - Drafts (number and label)
- Sidebar navigation with icons:
  - Dashboard (LayoutDashboard icon)
  - Create New (PlusCircle icon)
  - Calendar (Calendar icon)
  - Generate Phase (Sparkles icon)
- Quick actions section with buttons:
  - "Generate Phase Content" (primary button)
  - "Create Single Post" (secondary button)
- Recent postcards list showing 5 items with title, state badge, and date
- Dark mode support with zinc color scheme
```
Save as: `src/components/dashboard/Dashboard.tsx`

## Task 3.2: Postcard Editor Component
Go to v0.dev and paste:
```
Create a dual-editor component for ContentOS using shadcn/ui.

Requirements:
- Two side-by-side text areas
- Left: "X/Twitter (English)" with 280 character limit
- Right: "LinkedIn (Swedish)" with 3000 character limit
- Real-time character count with color coding:
  - Green: under 80% of limit
  - Yellow: 80-95% of limit
  - Red: over 95% of limit
- Top bar with:
  - Postcard title (editable input)
  - State badge (Draft/Approved/Scheduled/Published)
  - Template selector dropdown (Story/Tool)
- Bottom bar with:
  - Save button
  - Approve button
  - Copy buttons for each platform with icons
  - Auto-save indicator
- Responsive: stack vertically on mobile
- Use lucide-react icons
```
Save as: `src/components/editor/PostcardEditor.tsx`

## Task 3.3: Calendar Component  
Go to v0.dev and paste:
```
Create a 14-day calendar view for ContentOS using shadcn/ui.

Features:
- Grid layout showing next 14 days (2 rows, 7 columns)
- Each day cell shows:
  - Date number (large)
  - Day of week abbreviation
  - Month if first day of month
  - Scheduled postcard preview if exists (first 50 chars)
  - State badge (draft/scheduled/published)
  - Empty state with dashed border and "+" icon
- Today highlighted with primary color border
- Hover effects on cells
- Click to edit postcard
- Drag and drop visual feedback (optional)
- Responsive grid that adapts to mobile
- Use date-fns for date formatting
```
Save as: `src/components/calendar/CalendarView.tsx`

## Task 3.4: Phase Generator Dialog
Go to v0.dev and paste:
```
Create phase content generator dialog using shadcn/ui Dialog component.

Requirements:
- Dialog trigger button: "Generate Phase Content"
- Form fields:
  - Phase name (input)
  - Phase description (textarea, 3 rows)
  - Number of posts (select: 7, 14, 21, 30)
  - Template preference (radio: Story-focused, Tool-focused, Mixed)
  - Target audience (input)
  - Key topics (textarea, placeholder: "Enter comma-separated topics")
- Footer buttons:
  - Cancel (closes dialog)
  - Generate with AI (primary, shows loading state)
- Loading state with spinner and "Generating X posts..." text
- Success state showing "Generated X postcards successfully!"
- Error handling with red alert
- Smooth animations
```
Save as: `src/components/generate/PhaseGenerator.tsx`

## Task 3.5: Postcard List Component
Go to v0.dev and paste:
```
Create postcard list component using shadcn/ui data table.

Requirements:
- Columns:
  - Checkbox for selection
  - Title (truncated at 50 chars with tooltip for full)
  - State (badge: draft/approved/scheduled/published)
  - Platform icons (Twitter bird, LinkedIn logo)
  - Scheduled Date (formatted as "Jan 15, 2025")
  - Actions (dropdown menu with Edit, Duplicate, Delete)
- Top bar with:
  - Search input (searches title and content)
  - Filter dropdown for state
  - Bulk actions when items selected (Delete selected)
- Pagination (10 items per page)
- Empty state with illustration and "No postcards yet" message
- Sortable columns (click header to sort)
- Row hover effects
- Mobile responsive (cards on mobile instead of table)
```
Save as: `src/components/list/PostcardList.tsx`

## Task 4.1-4.4: AI Integration
Create `src/lib/claude.ts`:
```typescript
import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({
  apiKey: process.env.CLAUDE_API_KEY!,
})

export async function generatePhaseContent(
  description: string,
  count: number = 14,
  template: 'story' | 'tool' | 'mixed' = 'mixed'
) {
  const prompt = `Generate ${count} social media postcards for a personal brand campaign.
  
Phase description: ${description}
Template style: ${template}

For each postcard, provide:
1. English version (max 280 characters for X/Twitter)
2. Swedish version (max 3000 characters for LinkedIn)

Format as JSON array with structure:
[{
  "english_content": "...",
  "swedish_content": "...",
  "template": "story" or "tool"
}]

Make content engaging, valuable, and authentic.`

  const message = await anthropic.messages.create({
    model: 'claude-3-opus-20240229',
    max_tokens: 4000,
    messages: [{ role: 'user', content: prompt }],
  })

  return JSON.parse(message.content[0].text)
}

export async function translateToSwedish(englishText: string) {
  const message = await anthropic.messages.create({
    model: 'claude-3-opus-20240229',
    max_tokens: 3000,
    messages: [{
      role: 'user',
      content: `Translate and expand this X/Twitter post to a LinkedIn post in Swedish. 
      
Original (280 chars max): ${englishText}
      
Create a professional LinkedIn version in Swedish (up to 3000 chars) that:
- Maintains the core message
- Adds relevant context and depth
- Uses professional Swedish tone
- Includes relevant emojis sparingly
- Ends with a call-to-action or question`
    }],
  })

  return message.content[0].text
}
```

Create `src/app/api/generate/route.ts`:
```typescript
import { NextRequest, NextResponse } from 'next/server'
import { generatePhaseContent } from '@/lib/claude'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { description, count, template } = body

    const postcards = await generatePhaseContent(description, count, template)
    
    // Save to database
    const { data, error } = await supabase
      .from('postcards')
      .insert(postcards)
      .select()

    if (error) throw error

    return NextResponse.json({ success: true, data })
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
```

## Task 5: Create app pages
Create `src/app/dashboard/page.tsx`:
```typescript
import Dashboard from '@/components/dashboard/Dashboard'

export default function DashboardPage() {
  return <Dashboard />
}
```

Create `src/app/editor/[id]/page.tsx`:
```typescript
import PostcardEditor from '@/components/editor/PostcardEditor'

export default function EditorPage({ params }: { params: { id: string } }) {
  return <PostcardEditor postcardId={params.id} />
}
```

Create `src/app/calendar/page.tsx`:
```typescript
import CalendarView from '@/components/calendar/CalendarView'

export default function CalendarPage() {
  return <CalendarView />
}
```

Update `src/app/page.tsx`:
```typescript
import { redirect } from 'next/navigation'

export default function Home() {
  redirect('/dashboard')
}
```