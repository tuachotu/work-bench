# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Core Commands
- `npm run dev` - Start development server with hot module replacement (Vite) at http://localhost:5173
- `npm run build` - Build optimized production bundle 
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint code quality checks with React-specific rules

### Testing
No automated tests are currently configured in this project.

## Project Architecture

### Technology Stack
- **React 18** with functional components and hooks
- **Vite** as the build tool with PWA plugin
- **React Router 6** for client-side routing
- **CSS Variables** for theming (dark/light themes)
- **PWA** with service worker and offline functionality

### Key Architecture Patterns

#### Tool Component Structure
All tools follow a consistent two-panel layout pattern:
```
Tool Component
├── State management (input, output, error, success)
├── Utility function integration (from utils/formatters.js)
├── Two-panel UI (input textarea | output display)
├── Action buttons with keyboard shortcuts
└── Error/success messaging with clipboard integration
```

#### Utility Functions Pattern
All processing logic is centralized in `src/utils/formatters.js` with consistent return format:
```javascript
// Success response
{
  success: true,
  result: processedData,
  message: "Operation completed! ✅"
}

// Error response (thrown)
throw new Error("Detailed error message")
```

#### Routing Architecture
- Main app component (`src/App.jsx`) defines all routes
- Layout wrapper (`src/components/Layout/Layout.jsx`) provides consistent header/navigation
- Tools organized by category: Formatters, List Operations, String Operations, Generators, etc.
- Notebook system allows combining multiple tools in Jupyter-style workflow

### Core Components

#### Notebook System (`src/components/Tools/Notebook/`)
- **ToolNotebook.jsx** - Main notebook container with drag-and-drop cell management
- **ToolCell.jsx** - Individual tool wrapper with lazy loading and state isolation  
- **ToolSelector.jsx** - Tool picker dropdown with categories

#### Layout Components (`src/components/Layout/`)
- **Layout.jsx** - Main layout wrapper with theme context and page titles
- **Header.jsx** - Navigation bar with theme toggle and install button
- **InstallButton.jsx** - PWA installation prompt

### State Management
- React hooks for local component state
- Custom hooks in `src/hooks/`:
  - `useTheme.js` - Dark/light theme management with localStorage
  - `useLocalStorage.js` - Persistent storage utilities
  - `usePWAInstall.js` - PWA installation detection

### Styling System
- CSS variables in `src/styles/globals.css` for theme management
- Terminal-inspired design with monospace fonts
- Responsive grid layout for tool cards
- Dark theme default with light theme override

### Tool Categories
1. **Notebook** - Jupyter-style workflow combining multiple tools
2. **Formatters** - JSON, YAML, SQL formatting and validation
3. **List Operations** - Compare, deduplicate, sort, unique operations  
4. **String Operations** - Length analysis, cleanup, escaping, slugification
5. **Generators** - UUID, Short ID, Nano ID generation with validation
6. **Time & Date** - Timezone conversion, epoch timestamp conversion
7. **Conversion** - CSV/XML/YAML to JSON conversion
8. **Images** - Find pixel coordinates tool
9. **Text Processing** - Random text generation, formatting, cleanup
10. **Games** - Mini-games (Pacman, Mario, Bomberman, Tank)

## Development Guidelines

### Adding New Tools
1. Create utility function in `src/utils/formatters.js` following the standard pattern
2. Create tool component in appropriate category folder under `src/components/Tools/`
3. Add route in `src/App.jsx`
4. Add to `AVAILABLE_TOOLS` in `src/components/Tools/Notebook/ToolSelector.jsx` for notebook integration
5. Add to `TOOL_COMPONENTS` mapping in `src/components/Tools/Notebook/ToolCell.jsx`
6. Update homepage tool grid in `src/components/Home/HomePage.jsx`

### Keyboard Shortcuts Standard
- **Ctrl+Enter** - Execute primary tool function (format, convert, generate)
- **Ctrl+K** - Clear all inputs
- **Ctrl+Shift+C** - Copy output to clipboard

### Error Handling Pattern
- Utility functions should throw detailed error messages for invalid input
- Components catch errors and display user-friendly messages with context
- JSON formatter includes auto-fix suggestions for common issues

### PWA Configuration
- Manifest in `vite.config.js` defines app metadata, shortcuts, and icons
- Service worker handles offline caching with Workbox
- Install prompts available across the application

## Important Files
- `src/utils/formatters.js` - All processing logic for tools
- `src/utils/clipboard.js` - Cross-browser clipboard functionality with fallbacks
- `src/App.jsx` - Main routing configuration
- `vite.config.js` - Build configuration with PWA settings
- `src/styles/globals.css` - Theme definitions and component styles