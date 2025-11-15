# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |

## Reporting a Vulnerability

If you discover a security vulnerability in this project, please report it by:

1. **DO NOT** open a public GitHub issue
2. Email the maintainers directly at [your-email@domain.com] (replace with actual contact)
3. Include detailed information about the vulnerability
4. Allow up to 48 hours for an initial response

## Security Considerations

### Data Privacy
- This application does not collect or store any user data
- All calculations are performed client-side in the browser
- No personal information is transmitted to any server
- API calls to FRED are public and don't require authentication

### Third-Party Dependencies
- We regularly update dependencies to patch security vulnerabilities
- All dependencies are sourced from npm registry
- Critical security patches are applied promptly

### External APIs
- FRED API (Federal Reserve Economic Data) is a public, government-maintained service
- API requests are made via CORS proxy for browser compatibility
- No sensitive data is transmitted in API requests

## Best Practices for Users

1. **Always use HTTPS** when accessing the application
2. **Keep your browser updated** to the latest version
3. **Be cautious** of any modified versions of this application
4. **Verify the URL** matches the official deployment

## Disclaimer

This is an educational tool and should NOT be used for:
- Actual financial decision-making
- Trading or investment decisions
- Professional financial advice

The calculations provided are for educational purposes only and may not account for all real-world factors.
