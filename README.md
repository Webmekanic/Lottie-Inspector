# 🎨 Lottie Inspector

A powerful web-based tool for inspecting, debugging, and editing complex Lottie animations with real-time preview and AI-powered natural language editing capabilities.

![Lottie Inspector](https://img.shields.io/badge/React-18-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue)
![Vite](https://img.shields.io/badge/Vite-6.x-646CFF)
![XState](https://img.shields.io/badge/XState-6.x-orange)
![License](https://img.shields.io/badge/license-MIT-green)


## ✨ Overview

Lottie Inspector is built to provide structural transparency and runtime control over vector-based animations.

It enables engineers and designers to:

- Explore animation layers hierarchically
- Inspect and edit transform properties in real time
- Scrub timelines frame-by-frame
- Analyze animation structure at the JSON level
- Generate keyframes using natural language (AI-assisted editing)

The goal is to bridge the gap between animation design and production-level debugging.

## 🧠 Features

### 🔍 Animation Inspector
- **Layer Browser**: Hierarchical view of all layers in your Lottie animation
- **Real-time Preview**: Instant visualization of your animations in the center panel
- **Timeline Control**: Precise frame-by-frame navigation with playback controls
- **Property Inspector**: Detailed view of layer properties and transformations
- **AI Editing**: Natural language → structured Lottie keyframes
- **State Machine Orchestration**: Predictable animation control using XState

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- A Lottie JSON file to inspect
- (Optional) Anthropic API key for AI editing features

### Development

```bash
# Clone the repository
git clone https://github.com/yourusername/lottie-inspector.git
cd lottie-inspector

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Using AI Chat

1. Upload or load a Lottie animation
2. Select a layer from the Layers tab
3. Switch to the **AI Chat** tab (marked with "NEW" badge)
4. Click the settings icon (⚙️) and enter your Anthropic API key
5. Start chatting! Try: "Make this layer bounce"

**Get an API key**: Visit [console.anthropic.com](https://console.anthropic.com/) (requires credits, starting at $5)

## 🏗️ Technology Stack

| Technology | Purpose |
|------------|---------|
| **React 18** | UI framework with hooks and functional components |
| **TypeScript 5.6** | Type-safe development |
| **Vite 6.x** | Fast build tool and dev server |
| **XState 6.x** | State machine for animation state management |
| **styled-components 6.x** | CSS-in-JS styling with theme support |
| **lottie-web 5.13** | Official Lottie animation renderer |
| **Claude Sonnet 4** | Anthropic AI for natural language understanding |
| **Lucide React** | Modern icon library |
| **Tailwind CSS** | Utility-first CSS framework |

## 📁 Project Structure

```
lottie-inspector/
├── src/
│   ├── app/
│   │   └── components/
│   │       ├── AIChat.tsx              # AI chat interface
│   │       ├── LeftPanel.tsx           # Layers browser & AI tabs
│   │       ├── CenterPanel.tsx         # Animation preview
│   │       ├── RightPanel.tsx          # Property inspector
│   │       ├── BottomTimeLine.tsx      # Timeline controls
│   │       ├── TopNavBar.tsx           # Top navigation
│   │       └── ui/                     # Reusable UI components
│   ├── hooks/
│   │   └── useLottieHandlers.ts        # Lottie event handlers
│   ├── machines/
│   │   └── lottieStateMachine.ts       # XState animation state
│   ├── stores/
│   │   └── uiStore.ts                  # UI state management
│   ├── styles/
│   │   ├── AIChatStyles.ts             # Styled components for AI Chat
│   │   ├── LeftPanelStyles.ts          # Styled components for panels
│   │   ├── index.css                   # Global styles
│   │   └── theme.css                   # Theme variables
│   ├── types/
│   │   └── lottie.ts                   # TypeScript type definitions
│   ├── App.tsx                         # Root component
│   └── main.tsx                        # Entry point
├── api/
│   └── anthropic.ts                    # Vercel serverless function
├── public/                              # Static assets
├── index.html                           # HTML template
├── vite.config.ts                       # Vite configuration
├── tailwind.config.js                   # Tailwind configuration
├── tsconfig.json                        # TypeScript configuration
├── vercel.json                          # Vercel deployment config
├── DEPLOYMENT.md                        # Deployment guide with AI flow docs
├── package.json                         # Dependencies
└── README.md                            # This file
```

## 🎯 How It Works

### Animation State Management

Lottie Inspector uses XState to manage animation state with a finite state machine:

1. **Idle State**: Waiting for animation to load
2. **Loaded State**: Animation JSON parsed and ready
3. **Playing State**: Animation actively playing
4. **Paused State**: Animation paused at current frame
5. **Error State**: Handles invalid or corrupted animations

### AI Chat Architecture

```
User Input → Validation → Context Building → Claude API → Response Parsing → Preview → Apply → Update Animation
```

**Key Flow**:
1. User selects a layer and types a natural language command
2. System builds context with layer properties and animation metadata
3. Claude Sonnet 4 analyzes the request and generates Lottie JSON
4. Preview shows old vs new values
5. User clicks "Apply Changes"
6. XState machine updates animation state
7. lottie-web re-renders with new keyframes


### Environment Setup

**Development**: Uses Vite proxy to bypass CORS
- Proxy endpoint: `/api/anthropic/v1/messages`
- Automatically forwards API keys from browser

**Production**: Uses Vercel serverless functions
- Endpoint: `/api/anthropic`
- Deployed automatically on git push

**Alternative**: Connect your GitHub repo at [vercel.com/new](https://vercel.com/new) for automatic deployments on every push.

### Costs
- **Hosting**: FREE (Vercel Hobby plan)
- **AI API**: ~$0.01-0.05 per conversation (Anthropic pay-as-you-go)
- **Total**: $0 hosting + usage-based AI costs

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit your changes**: `git commit -m 'Add amazing feature'`
4. **Push to the branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

## 🐛 Troubleshooting

### AI Chat not working?
- ✅ Check your API key is valid at [console.anthropic.com](https://console.anthropic.com/)
- ✅ Ensure you have credits in your Anthropic account ($5 minimum)
- ✅ Make sure a layer is selected before chatting
- ✅ Try clearing browser cache and re-entering API key

### Build issues?
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install

# Check Node version
node --version  # Should be 18+
```

### Proxy errors in development?
```bash
# Restart dev server after vite.config.ts changes
npm run dev
```

## 📝 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🙏 Acknowledgments

- **Lottie**: Airbnb's amazing animation format
- **lottie-web**: Official Lottie player
- **Anthropic**: Claude AI for natural language understanding
- **Vercel**: Free hosting and serverless functions
- **React Community**: Awesome ecosystem and tools

## 📧 Contact

For questions, issues, or suggestions:
- Open an issue on GitHub
- Email: davidaniebo001@gmail.com
- X: [@webmekanic_](https://x.com/webmekanic_)

---

**Built with ❤️ for animators and developers**

