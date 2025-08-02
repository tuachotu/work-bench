# Contributing to work-bench.dev 🤝

Thank you for your interest in contributing to work-bench.dev! We welcome contributions from the community.

## 🚀 Quick Start

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/yourusername/work-bench.dev.git
   cd work-bench.dev
   ```
3. **Install dependencies**:
   ```bash
   npm install
   ```
4. **Start development server**:
   ```bash
   npm run dev
   ```

## 📋 Development Guidelines

### Code Style
- Use **functional components** with hooks (no class components)
- Follow **existing naming conventions**
- Use **CSS variables** for theming
- Keep components **small and focused**
- Add **proper error handling**

### File Naming
- Components: `PascalCase.jsx` (e.g., `JsonFormatter.jsx`)
- Hooks: `camelCase.js` starting with `use` (e.g., `useTheme.js`)
- Utils: `camelCase.js` (e.g., `formatters.js`)
- Styles: `kebab-case.css` (e.g., `globals.css`)

### Component Structure
```jsx
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

export default function YourComponent({ prop1, prop2 }) {
  const [state, setState] = useState('')

  useEffect(() => {
    // Effect logic
  }, [])

  const handleAction = () => {
    // Event handler logic
  }

  return (
    <div style={{ /* inline styles for simplicity */ }}>
      {/* Component JSX */}
    </div>
  )
}
```

## 🛠️ Adding New Tools

### 1. Create Tool Component
```bash
mkdir src/components/Tools/YourTool
touch src/components/Tools/YourTool/YourTool.jsx
```

### 2. Basic Tool Template
```jsx
import { useState } from 'react'
import { copyToClipboard } from '../../../utils/clipboard'

export default function YourTool() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')

  const handleProcess = () => {
    try {
      // Your tool logic here
      const result = processInput(input)
      setOutput(result)
      setError('')
    } catch (err) {
      setError(err.message)
    }
  }

  const handleCopy = async () => {
    try {
      await copyToClipboard(output)
      // Show success message
    } catch (err) {
      setError('Failed to copy to clipboard')
    }
  }

  return (
    <div style={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Tool UI */}
    </div>
  )
}
```

### 3. Add Route
In `src/App.jsx`:
```jsx
import YourTool from './components/Tools/YourTool/YourTool'

// Add to routes
<Route path="/your-tool" element={<YourTool />} />
```

### 4. Add to Homepage
In `src/components/Home/HomePage.jsx`:
```jsx
// Add to appropriate category
{ name: 'your-tool', path: '/your-tool' }
```

### 5. Add Page Title
In `src/components/Layout/Layout.jsx`:
```jsx
'/your-tool': 'your tool name'
```

## 🎨 Styling Guidelines

### Use CSS Variables
```css
/* Good */
color: var(--text-primary);
background: var(--bg-secondary);

/* Avoid */
color: #ffffff;
background: #111111;
```

### Responsive Design
```jsx
// Use inline styles with CSS variables
<div style={{
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
  gap: '1rem',
  padding: '1rem 2rem'
}}>
```

### Theme Support
- Always use CSS variables for colors
- Test in both light and dark themes
- Ensure good contrast ratios

## 🧪 Testing

### Manual Testing Checklist
- [ ] Tool works correctly with valid input
- [ ] Error handling for invalid input
- [ ] Copy to clipboard functionality
- [ ] Responsive design (mobile/tablet/desktop)
- [ ] Dark and light theme support
- [ ] Keyboard shortcuts (if applicable)
- [ ] PWA offline functionality

### Browser Testing
Test in at least:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers

## 📝 Pull Request Process

### Before Submitting
1. **Test thoroughly** on multiple devices/browsers
2. **Run build** to ensure no errors: `npm run build`
3. **Check code style** with: `npm run lint`
4. **Update documentation** if needed

### PR Guidelines
1. **Create feature branch**: `git checkout -b feature/amazing-tool`
2. **Write clear commit messages**:
   ```
   Add UUID generator tool
   
   - Generates v4 UUIDs
   - Validates existing UUIDs
   - Copy to clipboard support
   - Responsive design
   ```
3. **Update README** if adding new tool category
4. **Keep PRs focused** (one feature per PR)

### PR Template
```markdown
## Description
Brief description of what this PR does.

## Type of Change
- [ ] New tool
- [ ] Bug fix
- [ ] Feature enhancement
- [ ] Documentation update

## Testing
- [ ] Tested on desktop
- [ ] Tested on mobile
- [ ] Tested in both themes
- [ ] Verified offline functionality

## Screenshots
(If applicable)
```

## 🐛 Bug Reports

### Before Reporting
1. **Check existing issues** on GitHub
2. **Test in latest version**
3. **Try different browsers**
4. **Clear cache/try incognito mode**

### Bug Report Template
```markdown
**Describe the bug**
A clear description of the bug.

**To Reproduce**
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '...'
3. Enter '...'
4. See error

**Expected behavior**
What you expected to happen.

**Screenshots**
If applicable, add screenshots.

**Environment:**
 - OS: [e.g. iOS, Windows, macOS]
 - Browser: [e.g. chrome, safari]
 - Version: [e.g. 22]
 - Device: [e.g. iPhone 12, Desktop]
```

## 💡 Feature Requests

### Suggest New Tools
We're always looking for new tools to add! Consider:
- **Developer utility** (not generic tools)
- **Privacy-focused** (client-side processing)
- **Unique value** (not duplicating existing tools)

### Popular Tool Ideas
- Hash generators (MD5, SHA1, SHA256)
- QR code generator
- Color palette tools
- Regular expression tester
- Markdown to HTML converter
- Image format converters
- Password generators

## 📞 Getting Help

- **GitHub Issues** - Bug reports and feature requests
- **GitHub Discussions** - Questions and general discussion
- **Documentation** - Check README.md first

## 🏆 Recognition

Contributors will be:
- **Listed in README** acknowledgments
- **Credited in commit messages**
- **Thanked in release notes**

Thank you for helping make work-bench.dev better! 🚀