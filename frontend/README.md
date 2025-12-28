# ScholarAI Frontend

Next.js-based frontend for ScholarAI - an ethical AI-powered research writing assistant.

## Features

- **Rich Text Editor**: TipTap-powered editor with formatting tools
- **Template Selection**: Multiple journal formats (IEEE, Springer, Elsevier, ACM, APA, MLA)
- **AI Assistant**: Chat with AI for writing help and suggestions
- **AI Detector**: Analyze content for AI patterns (for transparency)
- **Brainstorm Tool**: Generate paper outlines and structure
- **Export**: Export papers to formatted DOCX documents
- **Responsive Design**: Clean, professional UI with Tailwind CSS

## Prerequisites

- Node.js 18+
- Backend API running (see backend README)

## Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
# Create .env.local file
echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > .env.local
```

## Running the Application

### Development
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build
```bash
npm run build
npm start
```

### Docker
```bash
docker build -t scholarai-frontend .
docker run -p 3000:3000 -e NEXT_PUBLIC_API_URL=http://localhost:8000 scholarai-frontend
```

## Project Structure

```
frontend/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Main page
│   │   └── globals.css         # Global styles
│   ├── components/
│   │   ├── Header.tsx          # Top navigation
│   │   ├── Sidebar.tsx         # Template & sections
│   │   ├── Editor.tsx          # Rich text editor
│   │   ├── AIAssistantPanel.tsx    # AI chat
│   │   ├── AIDetectorPanel.tsx     # AI detection
│   │   ├── BrainstormPanel.tsx     # Outline generator
│   │   ├── ExportModal.tsx         # Export dialog
│   │   └── Providers.tsx           # Context providers
│   └── lib/
│       ├── api.ts              # API client
│       ├── store.ts            # Zustand store
│       └── utils.ts            # Utilities
├── public/                     # Static assets
├── Dockerfile
├── package.json
├── tailwind.config.ts
├── tsconfig.json
├── next.config.js
└── README.md
```

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Editor**: TipTap
- **State Management**: Zustand
- **HTTP Client**: Axios
- **UI Components**: Radix UI
- **Icons**: Lucide React

## Key Components

### Header
Top navigation with panel toggles (Brainstorm, AI Assistant, AI Detector) and action buttons (Save, Export).

### Sidebar
- Template selector for journal formats
- List of paper sections with word counts
- Quick add recommended sections

### Editor
- Rich text editor with formatting toolbar
- Bold, italic, headings, lists, quotes, code
- Real-time word count
- Section-based editing

### AI Assistant Panel
- Quick actions (improve clarity, make formal, simplify, expand, summarize, fix grammar)
- Chat interface for writing help
- Context-aware suggestions

### AI Detector Panel
- Analyze text for AI-generated patterns
- Score and level indicators (low/medium/high)
- Flagged sections with suggestions
- Generate AI disclosure statements

### Brainstorm Panel
- Input topic, field, and research type
- Generate title suggestions
- Recommended paper structure
- Key points and methodology suggestions
- Reference topics

### Export Modal
- Review paper information
- Optional AI disclosure
- Export to formatted DOCX

## State Management

Using Zustand for simple, efficient state management:
- Paper data (title, authors, keywords, abstract)
- Sections and active section
- Template selection
- Detection results
- Panel visibility states

## API Integration

All API calls are centralized in `src/lib/api.ts`:
- Template API
- Detector API
- Brainstorm API
- Writing API
- Chat API
- Export API

## Environment Variables

- `NEXT_PUBLIC_API_URL` - Backend API URL (default: http://localhost:8000)

## Development Tips

1. **Hot Reload**: Changes are instantly reflected in development mode
2. **Type Safety**: TypeScript ensures type safety across components
3. **Styling**: Use Tailwind utility classes for consistent styling
4. **State**: Use Zustand hooks to access/modify global state
5. **API Calls**: Always handle errors and loading states

## Building for Production

The Dockerfile uses multi-stage builds for optimized production images:
1. Builder stage: Install dependencies and build
2. Runner stage: Copy only necessary files for smaller image size

## Ethical Usage

This tool is designed for **ethical academic writing assistance**:
- AI detection is for transparency, not evasion
- Always disclose AI usage appropriately
- Use AI as a writing aid, not a replacement
- Maintain academic integrity

## License

MIT License - See LICENSE file for details
