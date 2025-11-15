# Bond Duration Calculator

[![Live Demo](https://img.shields.io/badge/Live%20Demo-umd--finance.onrender.com-blue)](https://umd-finance.onrender.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![GitHub](https://img.shields.io/badge/GitHub-MehdiZare%2Fumd--finance-black)](https://github.com/MehdiZare/umd-finance)

An interactive educational tool for Master of Finance students to understand bond duration, convexity, and interest rate risk.

**Live Demo:** [https://umd-finance.onrender.com/](https://umd-finance.onrender.com/)

**Repository:** [https://github.com/MehdiZare/umd-finance](https://github.com/MehdiZare/umd-finance)

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
- **Clear data status indicators** showing when live data is available vs. sample data
- Automatic retry functionality with user-friendly error messages

### Historical Yield Curve Animation (NEW)
- **Interactive timeline** showing yield curve evolution through major economic events
- Covers key periods: Pre-2008 Crisis, Lehman Collapse, COVID-19, Fed Hiking Cycles
- **Real-time metrics updates** showing how duration/convexity change with each event
- Educational insights explaining the significance of each period
- Playback controls with adjustable animation speed
- Risk metric analysis for each historical snapshot

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
# Clone the repository
git clone https://github.com/MehdiZare/umd-finance.git
cd umd-finance

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
3. Create a new Web Service on Render
4. Point to your repository
5. Render will automatically detect the build settings

Configuration:
- **Build Command:** `npm install && npm run build`
- **Start Command:** `npm run start`
- **Environment:** Node

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
- Clear indicators when using live vs. sample data
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

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contributing

Contributions are welcome! Please read our [Contributing Guidelines](CONTRIBUTING.md) and [Code of Conduct](CODE_OF_CONDUCT.md) before submitting pull requests.

Key areas for contribution:
- Additional duration measures (e.g., key rate duration)
- More interactive visualizations
- Enhanced educational content
- Bug fixes and improvements
- Internationalization support

## Security

For security concerns, please see our [Security Policy](SECURITY.md).

## Acknowledgments

- **FRED API** - Federal Reserve Economic Data from the St. Louis Fed
- **University of Maryland** - Master of Finance Program
- **shadcn/ui** - Beautiful UI components
- **Recharts** - Composable charting library

## Support

If you have questions or need help:
1. Check the [Issues](https://github.com/MehdiZare/umd-finance/issues) page
2. Open a new issue with detailed information
3. Review the educational content within the app

---

Built with React, TypeScript, and Tailwind CSS for finance education.
