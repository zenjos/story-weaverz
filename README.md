<div align="center">

# Story Weaverz

**AI-powered novel-to-comic-drama engine**

Paste any novel, get a comic with consistent characters.

[Features](#features) · [Quick Start](#quick-start) · [How It Works](#how-it-works) · [Tech Stack](#tech-stack) · [Contributing](#contributing)

</div>

---

## Features

- **Novel → Comic, automatically** — Paste any fiction text, AI reads it and breaks it down into characters, scenes, and storyboard panels.
- **Character consistency** — Each character gets a frozen visual description that's injected into every panel, so the same person looks the same across all frames.
- **Multiple art styles** — Japanese anime, Chinese ink-wash, semi-realistic, and watercolorstorybook presets built in.
- **Adjustable panel count** — Choose 3–10 storyboard frames per generation.
- **Real-time progress** — Watch the pipeline run step by step with a live log.
- **Result viewer** — Browse generated panels, character reference sheets, and scene details in one interface.

## Quick Start

### Prerequisites

- Node.js 18+ or [Bun](https://bun.sh/)
- A [Z.AI API key](https://z.ai) (for the AI model + image generation)

### Setup

```bash
# Clone
git clone https://github.com/zenjos/story-weaverz.git
cd story-weaverz

# Install dependencies
npm install  # or: bun install

# Add your API key
cp .env.example .env.local
# Edit .env.local and set ZAI_API_KEY=your_key_here

# Run
npm run dev  # or: bun dev
```

Open [http://localhost:3000](http://localhost:3000) and paste any novel text.

## How It Works

```
Novel Text
    │
    ▼
┌─────────────────────────────────────────┐
│  1. Analyze (LLM)                       │
│     Extract characters, scenes,          │
│     dialogue, mood, visual prompts       │
└──────────────┬──────────────────────────┘
               │
    ┌──────────┴──────────┐
    ▼                     ▼
┌──────────┐      ┌───────────────┐
│ 2. Character       │ 3. Scene       │
│    Art (img gen)   │    Art (img gen)│
│                   │               │
│ Frozen visual     │ Injects char   │
│ description →     │ descriptions   │
│ reference sheet   │ into each panel│
└──────────┘      └───────────────┘
    │                     │
    └──────────┬──────────┘
               ▼
       ┌──────────────┐
       │ 4. Assemble   │
       │ Comic viewer  │
       └──────────────┘
```

The key to character consistency: each character's `visualPrompt` (a detailed English description of appearance, clothing, etc.) is generated once during analysis, then **injected into every scene panel prompt**. This way the image model receives the same character description every time.

## Project Structure

```
story-weaverz/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── analyze/              # LLM: novel → structured JSON
│   │   │   ├── generate-character/   # Image gen: character reference sheet
│   │   │   └── generate-scene/       # Image gen: comic panel
│   │   ├── page.tsx                  # Zustand-driven view router
│   │   ├── layout.tsx
│   │   └── globals.css               # Dark-first theme + custom utilities
│   ├── components/
│   │   ├── site/
│   │   │   ├── landing.tsx           # Hero + feature grid
│   │   │   ├── novel-input.tsx       # Textarea + style/scene controls
│   │   │   ├── processing.tsx        # Pipeline progress + live log
│   │   │   └── result-viewer.tsx     # Comic panel browser + character cards
│   │   └── ui/                       # shadcn/ui (Button, Toast)
│   ├── lib/
│   │   ├── store.ts                  # Zustand global state
│   │   ├── story-engine.ts           # Types + prompt templates
│   │   └── utils.ts                  # cn() helper
│   └── hooks/
│       └── use-toast.ts
├── public/
├── package.json
└── README.md
```

## Tech Stack

| Layer | Tech |
|-------|------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 4 + custom CSS |
| UI Components | shadcn/ui (New York) |
| State | Zustand |
| Animation | Framer Motion |
| AI Model | Z.AI SDK (`z-ai-web-dev-sdk`) |
| Icons | Lucide React |

## Adding Your Own Art Style

Edit `src/lib/story-engine.ts`:

```ts
export const STYLE_PRESETS = {
  // ...existing presets
  pixel: {
    label: 'Pixel Art',
    keyword: 'pixel art style, 16-bit, retro game aesthetic, limited palette',
  },
}
```

The `keyword` string is appended to every image generation prompt.

## Contributing

Contributions are welcome! Whether it's bug reports, feature requests, new art style presets, or UI improvements — please open an issue first to discuss what you'd like to change.

1. Fork the repo
2. Create your branch (`git checkout -b feature/amazing-feature`)
3. Commit (`git commit -m 'Add amazing feature'`)
4. Push (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT — see [LICENSE](LICENSE).

---

<div align="center">

Built with [Z.AI SDK](https://z.ai) · Powered by AI image generation

</div>
