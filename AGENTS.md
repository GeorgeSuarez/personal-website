# AGENTS.md - Development Guidelines for Personal Website

This document provides comprehensive guidelines for agentic coding assistants working on this personal website project. Follow these instructions to maintain code quality, consistency, and best practices.

## Project Overview

This is a vanilla JavaScript/HTML/CSS personal portfolio website with an Express.js server for local development. The site features:

- Single-page application with smooth scrolling navigation
- Particle effects background animation
- Responsive design with modular CSS architecture
- Clean, modern UI with dark theme

## Build/Lint/Test Commands

### Development Server

```bash
npm start          # Start Express server on port 3000
npm run dev        # Same as npm start
npm run serve      # Same as npm start
```

### Testing

```bash
npm test           # Currently shows "Error: no test specified"
```

**Note:** No testing framework is currently configured. When adding tests:

- Use Jest for unit testing JavaScript functions
- Consider Cypress or Playwright for end-to-end testing
- Add test scripts to package.json

### Linting & Code Quality

**Note:** No linting tools are currently configured. When setting up linting:

```bash
# Recommended setup
npm install --save-dev eslint prettier
npx eslint --init
```

### Building for Production

No build process currently exists. For production deployment:

- Files are served statically from GitHub Pages
- Consider adding a build step with minification if needed

## Code Style Guidelines

### JavaScript Style

#### Naming Conventions

- **Functions**: camelCase, descriptive names (`initNavigationHighlighting`, `updateActiveNavigation`)
- **Variables**: camelCase, descriptive (`observerOptions`, `navLinks`)
- **Constants**: UPPER_SNAKE_CASE for configuration values
- **Event handlers**: prefix with `handle` or `on` (`handleClick`, `onScroll`)

#### Function Structure

```javascript
// Preferred: Clear, descriptive function names with JSDoc comments
/**
 * Initializes dynamic navigation highlighting with intersection observer
 */
function initNavigationHighlighting() {
  // Function body with clear variable names
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.navigation-item');

  // Use early returns for error conditions
  if (!sections.length || !navLinks.length) return;

  // Implementation...
}
```

#### Event Handling

- Use modern `addEventListener` instead of inline handlers
- Always prevent default behavior when needed
- Clean up event listeners when components are removed

#### DOM Manipulation

- Cache DOM queries when used multiple times
- Use `classList` methods for class manipulation
- Prefer `textContent` over `innerHTML` when not inserting HTML

### CSS Architecture

#### File Organization

- **base.css**: CSS custom properties, resets, base styles
- **Component-specific files**: `home.css`, `navigation.css`, `about.css`, etc.
- **responsive.css**: Media queries and responsive overrides

#### CSS Custom Properties (Variables)

```css
:root {
  --color-primary: #ff4d5a;
  --color-bg-dark: #1a1a1a;
  --spacing-md: 3rem;
  --border-radius-md: 3px;
}
```

#### Class Naming

- Use BEM methodology: `block__element--modifier`
- Examples: `.navigation-item--active`, `.project-card__content`
- Hyphen-delimited for multi-word classes: `section-heading`

#### CSS Organization

```css
/* ==========================================================================
   Section Name
   ========================================================================== */

.selector {
  /* Properties organized by: positioning, box model, typography, visual */
  position: relative;
  display: block;
  margin: 0;
  padding: 1rem;
  font-size: 1.6rem;
  color: var(--color-text-light);
}
```

### HTML Structure

#### Semantic HTML

- Use semantic elements: `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`
- Proper heading hierarchy (h1 → h2 → h3)
- Meaningful alt text for images

#### Accessibility

- Include proper ARIA labels where needed
- Ensure keyboard navigation works
- Maintain sufficient color contrast
- Use semantic form elements with labels

### Error Handling

#### JavaScript Error Handling

```javascript
function updateActiveNavigation(activeSection) {
  try {
    // Implementation with potential failure points
    const activeNavItem = document.getElementById(`nav-${activeSection}`);
    if (!activeNavItem) {
      console.warn(`Navigation item for section "${activeSection}" not found`);
      return;
    }
    // Continue with implementation...
  } catch (error) {
    console.error('Error updating navigation:', error);
  }
}
```

#### DOM Query Safety

- Always check if elements exist before manipulation
- Use optional chaining where appropriate
- Provide fallback behavior for missing elements

### Performance Considerations

#### JavaScript

- Cache DOM queries outside of loops
- Use `requestAnimationFrame` for animations
- Debounce scroll/resize event handlers
- Minimize DOM manipulations in loops

#### CSS

- Use CSS transforms and opacity for animations (GPU acceleration)
- Minimize layout-thrashing properties
- Optimize selectors for performance

### Code Comments

#### When to Comment

- Complex algorithms or business logic
- Workarounds for browser bugs
- Public API functions
- Non-obvious code sections

#### Comment Style

```javascript
// Single line comment for simple explanations

/**
 * Multi-line JSDoc comment for functions
 * @param {string} paramName - Description of parameter
 * @returns {boolean} Description of return value
 */
function exampleFunction(paramName) {
  // Implementation
}
```

### Import/Export Patterns

Since this project uses vanilla JavaScript without modules, organize code as:

- Keep related functions in the same file
- Use clear function naming to indicate purpose
- Consider file size and maintainability when splitting code

### Browser Compatibility

- Target modern browsers (Chrome, Firefox, Safari, Edge)
- Use progressive enhancement
- Test on multiple screen sizes and devices
- Include fallbacks for critical functionality

### Git Workflow

#### Commit Messages

- Use imperative mood: "Add navigation highlighting", "Fix mobile layout"
- Keep first line under 50 characters
- Add detailed description for complex changes

#### Branch Naming

- Feature branches: `feature/navigation-highlighting`
- Bug fixes: `fix/mobile-responsive`
- Documentation: `docs/update-readme`

### Security Best Practices

- Validate and sanitize any user inputs
- Use HTTPS in production
- Avoid inline event handlers with user data
- Regularly update dependencies

### File Organization

```
/
├── index.html              # Main HTML file
├── javascript.js           # Main JavaScript file
├── server.js               # Express server
├── styles/
│   ├── base.css           # CSS variables, resets, base styles
│   ├── home.css           # Home section styles
│   ├── navigation.css     # Navigation styles
│   ├── about.css          # About section styles
│   ├── projects.css       # Projects section styles
│   ├── contact.css        # Contact section styles
│   └── responsive.css     # Media queries
├── images/                # Image assets
└── package.json           # Dependencies and scripts
```

### Dependencies

Current dependencies (package.json):

- **express**: ^4.21.2 (development server)

External dependencies:

- **Particles.js**: CDN hosted particle effects library
- **Google Fonts**: Space Mono font family

### Future Improvements

When expanding the project:

1. Add a proper build process (Webpack/Vite)
2. Implement testing framework (Jest)
3. Add linting (ESLint, Prettier)
4. Consider component-based architecture if adding interactivity
5. Add TypeScript for better type safety
6. Implement proper error boundaries
7. Add performance monitoring

### Code Review Checklist

- [ ] Code follows established naming conventions
- [ ] Functions are properly documented
- [ ] Error handling is implemented
- [ ] Performance considerations addressed
- [ ] Accessibility guidelines followed
- [ ] Responsive design tested
- [ ] Cross-browser compatibility verified
- [ ] No console.log statements in production code
- [ ] Dependencies are up to date and secure</content>
      <parameter name="filePath">/Users/georgesuarezmbp/Projects/personal-website/AGENTS.md
