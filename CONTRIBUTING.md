# Contributing to Bond Duration Calculator

First off, thank you for considering contributing to the Bond Duration Calculator! It's people like you that make this educational tool better for finance students worldwide.

## Code of Conduct

By participating in this project, you are expected to uphold our Code of Conduct:

- Use welcoming and inclusive language
- Be respectful of differing viewpoints and experiences
- Gracefully accept constructive criticism
- Focus on what is best for the community
- Show empathy towards other community members

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check existing issues to avoid duplicates. When you create a bug report, include as many details as possible:

- **Use a clear and descriptive title**
- **Describe the exact steps to reproduce the problem**
- **Provide specific examples** (e.g., bond parameters that cause issues)
- **Describe the behavior you observed and what you expected**
- **Include screenshots** if applicable
- **Note your browser and operating system**

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion:

- **Use a clear and descriptive title**
- **Provide a detailed description** of the suggested enhancement
- **Explain why this enhancement would be useful** to finance students
- **List any alternative solutions** you've considered

### Pull Requests

1. **Fork the repository** and create your branch from `main`
2. **Install dependencies**: `npm install`
3. **Make your changes** and test locally: `npm run dev`
4. **Ensure the build passes**: `npm run build`
5. **Follow the coding style** (TypeScript, React best practices)
6. **Write meaningful commit messages**
7. **Update documentation** if needed
8. **Submit your pull request**

## Development Setup

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/umd-finance.git

# Navigate to the project
cd umd-finance

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Project Structure

```
src/
├── components/          # React components
│   ├── ui/             # Reusable UI components (shadcn/ui)
│   └── ...             # Feature components
├── utils/              # Utility functions
│   ├── duration.ts     # Bond duration calculations
│   └── fred-api.ts     # FRED API integration
├── lib/                # Shared libraries
└── App.tsx             # Main application component
```

## Areas for Contribution

### High Priority
- Additional duration measures (key rate duration, spread duration)
- More interactive visualizations
- Improved mobile responsiveness
- Performance optimizations

### Educational Content
- Additional explanations and examples
- Step-by-step calculation walkthroughs
- Real-world case studies
- Quiz/assessment features

### Data & Analytics
- Additional data sources (corporate bonds, international)
- Historical analysis tools
- Portfolio construction features
- Risk metrics (VaR, CVaR)

### Technical Improvements
- Unit tests for duration calculations
- E2E testing with Playwright
- Accessibility improvements (WCAG compliance)
- Internationalization (i18n)

## Style Guidelines

### TypeScript
- Use strict mode
- Define proper types for all functions
- Avoid `any` type where possible
- Document complex functions with JSDoc comments

### React
- Use functional components with hooks
- Keep components focused and reusable
- Use proper prop types
- Follow React naming conventions

### CSS/Tailwind
- Use Tailwind utility classes
- Follow the shadcn/ui patterns
- Ensure responsive design
- Maintain consistent spacing

## Questions?

Feel free to open an issue with your question or reach out through the repository discussions.

## Attribution

This contributing guide is adapted from various open source project templates.
