# Repo to ChatGPT

🚀 Transform GitHub repositories into documentation and generate ChatGPT deeplinks for AI-powered project analysis.

## Features

✨ **GitHub Repository Parser** - Automatically fetch and analyze any public GitHub repository

🔗 **ChatGPT Deeplink Generator** - Create shareable links that open ChatGPT with your repo documentation pre-loaded

🌳 **Folder Tree Visualization** - Beautiful ASCII representation of repository structure

📋 **Copy & Export** - Easily copy documentation to clipboard or download as markdown

📱 **Responsive UI** - Modern, mobile-friendly interface built with Tailwind CSS and shadcn/ui

## Tech Stack

- **React 19.1.1** - Latest React with concurrent features
- **TypeScript 5.9.3** - Type-safe development
- **Vite 7.1.7** - Lightning-fast build tool
- **Tailwind CSS 4.1.16** - Utility-first styling
- **shadcn/ui** - Beautiful, accessible components
- **React Router 7.9.4** - Client-side routing
- **Sonner** - Elegant toast notifications

## Getting Started

### Installation

```bash
# Clone the repository
git clone https://github.com/filiksyos/repo-to-chatgpt.git

# Navigate to project directory
cd repo-to-chatgpt

# Install dependencies
npm install

# Start development server
npm run dev
```

### Usage

1. Open the application in your browser (usually `http://localhost:5173`)
2. Enter a GitHub repository URL (e.g., `https://github.com/facebook/react`)
3. Click "Generate" to analyze the repository
4. View the generated documentation and folder structure
5. Click "Open ChatGPT" to start an AI-powered conversation about the repo
6. Copy or download the documentation as needed

## How It Works

1. **Parse Repository URL** - Extract owner and repo name from GitHub URL
2. **Fetch Repository Data** - Use GitHub API to get repo metadata and file structure
3. **Generate Documentation** - Create formatted markdown documentation
4. **Create Deeplink** - Encode documentation into ChatGPT-compatible URL
5. **Display Results** - Show folder tree, documentation, and deeplink

## ChatGPT Deeplink Format

The generated deeplink follows this pattern:
```
https://chat.openai.com/?q=ENCODED_PROMPT
```

The prompt includes:
- Repository URL
- Generated documentation
- Analysis questions
- Setup instructions request

## Project Structure

```
repo-to-chatgpt/
├── src/
│   ├── components/        # React components
│   │   ├── ui/           # Reusable UI components
│   │   ├── RepoInput.tsx
│   │   ├── DocumentationOutput.tsx
│   │   ├── FolderTree.tsx
│   │   └── DeeplinkGenerator.tsx
│   ├── lib/              # Utility libraries
│   │   ├── github.ts     # GitHub API client
│   │   ├── documentation.ts # Doc generation
│   │   ├── deeplink.ts   # Deeplink creation
│   │   └── utils.ts      # Helper functions
│   ├── pages/            # Page components
│   │   └── Index.tsx
│   ├── hooks/            # Custom React hooks
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── package.json
├── vite.config.ts
├── tsconfig.json
└── tailwind.config.ts
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## API Rate Limits

This app uses the GitHub API without authentication, which has a rate limit of 60 requests per hour. For higher limits, you can add a GitHub personal access token.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this project for any purpose.

## Inspiration

This project was inspired by [gittodoc](https://github.com/filiksyos/gittodoc) and enhanced with Next.js-style architecture and ChatGPT deeplink generation.

---

**Built with ❤️ using React 19, TypeScript, and Vite**
