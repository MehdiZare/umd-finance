# Bond Duration Calculator

An interactive educational tool for Master of Finance students to understand bond duration, convexity, and interest rate risk.

## Features

### Interactive Calculator
- Adjust bond parameters (face value, coupon rate, maturity, YTM, payment frequency)
- Real-time calculation of Macaulay Duration, Modified Duration, Dollar Duration (DV01), and Convexity
- Visual feedback on bond pricing (premium/discount/par)

### Price Sensitivity Analysis
- Visualize how bond prices change with yield movements
- Compare duration-based approximations vs. actual price changes
- Understand the convexity benefit (asymmetric price behavior)

### Price-Yield Relationship
- Interactive chart showing the convex price-yield curve
- Duration approximation (tangent line) vs. actual curve
- See how duration underestimates/overestimates price changes

### Cash Flow Analysis
- Detailed breakdown of all cash flows
- Present value calculations for each payment
- Weighted PV contributions to Macaulay Duration

### Treasury Data Integration
- Real U.S. Treasury yield curve data from FRED (Federal Reserve Economic Data)
- Duration calculations for on-the-run treasuries
- Yield curve shape analysis (inverted vs. normal)
- Historical treasury rate trends

### Bond Comparison Tool
- Compare up to 5 bonds side-by-side
- Visual comparison using bar charts and radar charts
- Risk profile analysis across multiple dimensions

### Educational Content
- Comprehensive explanations of duration concepts
- Mathematical formulas with clear explanations
- Real-world applications (immunization, hedging, portfolio construction)
- Interactive accordions for easy navigation

## Technology Stack

- **React 19** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **shadcn/ui** components (Radix UI primitives)
- **Recharts** for data visualization
- **FRED API** for real treasury data

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Deployment on Render

This project includes a `render.yaml` file for easy deployment on [Render](https://render.com/).

### Steps:
1. Push code to GitHub
2. Connect your Render account to GitHub
3. Create a new Static Site on Render
4. Point to your repository
5. Render will automatically detect the build settings from `render.yaml`

Alternatively, manual configuration:
- **Build Command:** `npm install && npm run build`
- **Publish Directory:** `dist`

## Key Concepts Covered

1. **Macaulay Duration** - Weighted average time to receive cash flows
2. **Modified Duration** - Price sensitivity measure (% change per 1% yield change)
3. **Dollar Duration (DV01)** - Dollar change per 1 basis point yield change
4. **Convexity** - Second-order effect capturing price-yield curvature
5. **Effective Duration** - For bonds with embedded options
6. **Portfolio Duration** - Weighted average of component durations
7. **Duration Gap Analysis** - Bank interest rate risk management
8. **Immunization** - Matching asset and liability durations

## API Integration

The application fetches real treasury data from the **FRED API** (Federal Reserve Economic Data):
- No API key required for basic access
- Automatic fallback to sample data if API is unavailable
- CORS proxy used for browser requests

## Educational Use

This tool is designed for:
- Master of Finance programs
- Fixed Income courses
- CFA exam preparation
- Self-study in bond mathematics
- Understanding interest rate risk management

## Disclaimer

This tool is for **educational purposes only**. It should not be used for actual financial decision-making. The calculations are simplified and may not account for all real-world factors such as:
- Credit risk
- Liquidity risk
- Tax implications
- Transaction costs
- Day count conventions

## License

MIT License - Free for educational and commercial use.

## Contributing

Contributions are welcome! Please feel free to submit issues or pull requests for:
- Additional duration measures (e.g., key rate duration)
- More interactive visualizations
- Enhanced educational content
- Bug fixes and improvements
