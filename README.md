# ContentOS MVP

A dual-platform content management system for creating and managing social media posts for Twitter/X (English) and LinkedIn (Swedish).

## 🚀 Production URL

**Live Application**: https://contentos-mvp.vercel.app

*Note: Requires environment variables to be configured in Vercel dashboard for full functionality.*

## ✨ Features

- **📝 Dual-Language Content Creation**: Generate content for Twitter/X (English, 280 chars) and LinkedIn (Swedish, 3000 chars)
- **🤖 AI-Powered Generation**: Bulk content creation with Claude 3.5 Sonnet integration
- **🌐 Automatic Translation**: English to Swedish translation for LinkedIn posts
- **📅 Visual Calendar**: Drag-and-drop scheduling interface
- **💾 Auto-Save**: Real-time synchronization with Supabase database
- **📱 Mobile Responsive**: Fully responsive design for all devices
- **🎨 Dark Mode**: Light/dark theme support
- **📋 Copy to Clipboard**: Quick content copying for manual publishing
- **🏷️ Template System**: Story and Tool templates for different content types

## 🛠️ Tech Stack

- **Framework**: Next.js 15.5.2 with App Router and Turbopack
- **Language**: TypeScript 5 with strict mode
- **Styling**: Tailwind CSS v4 with CSS variables
- **UI Components**: shadcn/ui components
- **State Management**: Zustand with Supabase real-time sync
- **Database**: Supabase (PostgreSQL)
- **AI Integration**: Anthropic Claude API
- **Deployment**: Vercel

## 📋 Prerequisites

- Node.js 18.17 or later
- npm or yarn
- Supabase account
- Anthropic API key

## 🔧 Installation

1. **Clone the repository**:
```bash
git clone https://github.com/yourusername/contentos-mvp.git
cd contentos-mvp
```

2. **Install dependencies**:
```bash
npm install
```

3. **Set up environment variables**:

Create a `.env.local` file in the root directory:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Claude API Configuration
CLAUDE_API_KEY=your_anthropic_api_key
```

4. **Run database migrations**:

Execute the migration script in your Supabase SQL editor to set up the postcards table.

## 🏃‍♂️ Running Locally

**Development mode**:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000)

**Production build**:
```bash
npm run build
npm run start
```

**Linting**:
```bash
npm run lint
```

## 📁 Project Structure

```
src/
├── app/                 # Next.js app router pages
│   ├── api/            # API routes for AI and database
│   ├── calendar/       # Calendar scheduling interface
│   ├── dashboard/      # Dashboard overview
│   ├── editor/         # Postcard editor
│   ├── generate/       # AI content generation
│   └── postcards/      # Postcard management
├── components/         # React components
│   ├── ui/            # shadcn/ui components
│   └── [feature]/     # Feature-specific components
├── lib/               # Utilities and service clients
├── store/             # Zustand state management
├── hooks/             # Custom React hooks
└── types/             # TypeScript definitions
```

## 🚀 Deployment

The application is deployed on Vercel. To deploy your own instance:

1. Push your code to GitHub
2. Import the repository in Vercel
3. Configure environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `CLAUDE_API_KEY`
4. Deploy!

## 📝 Usage Guide

1. **Generate Content**: Navigate to `/generate` to create multiple posts from a phase description
2. **Edit Posts**: Click any postcard to edit content for both platforms
3. **Schedule Posts**: Drag postcards to calendar dates for scheduling
4. **Copy Content**: Use copy buttons to quickly grab content for manual publishing
5. **Track Status**: Monitor post states (draft, approved, scheduled, published)

## 🔐 Security Notes

- Never commit `.env.local` or expose API keys
- Use environment variables for all sensitive data
- Supabase Row Level Security (RLS) can be enabled for multi-user support

## 📄 License

MIT

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For issues or questions, please open a GitHub issue.

---

Built with ❤️ using Next.js, TypeScript, and Tailwind CSS

<!-- Deployment trigger: Force redeploy with critical UI fixes -->Deployment trigger Tue, Sep  9, 2025  2:38:25 PM
