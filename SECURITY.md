# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| latest  | :white_check_mark: |

## Reporting a Vulnerability

If you discover a security vulnerability, please:

1. **DO NOT** open a public issue
2. Email the maintainers with details
3. Include steps to reproduce if possible
4. Allow reasonable time for a fix before disclosure

## Security Measures

This application implements several security measures:

### Input Validation
- File type validation (only images allowed)
- File size limits (50MB max)
- MIME type checking

### API Security
- Rate limiting (10 requests/minute per IP)
- CORS configuration
- Security headers (X-Frame-Options, CSP, etc.)

### Data Handling
- No persistent storage of uploaded images
- Memory-only processing
- Automatic cleanup after processing

### Dependencies
- Regular dependency updates
- Security patches applied promptly
- Automated vulnerability scanning

## Best Practices for Deployment

1. Always use HTTPS in production
2. Set `ALLOWED_ORIGIN` to your specific domain
3. Monitor rate limiting effectiveness
4. Keep dependencies updated
5. Review logs for suspicious activity