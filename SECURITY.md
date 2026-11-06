# Security Policy

## Supported Versions

We actively maintain the latest major release of the Horizon Estate template.

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| < 1.0   | :x:                |

---

## Reporting a Vulnerability

If you discover a potential security vulnerability within **Horizon Estate**, please disclose it responsibly. Do **not** open a public issue.

Instead, please email:
**`security@horizonestate.dev`**

Include the following information in your advisory:
1. Description of the vulnerability and affected component/file.
2. Step-by-step reproduction instructions or a minimal proof of concept.
3. Impact assessment (e.g. potential for XSS, client injection, or denial of service).
4. Proposed patch or mitigation if available.

### Disclosure Timeline
- **Initial Response**: Within 48 hours of receipt.
- **Triage & Assessment**: Within 5 business days.
- **Resolution & Release**: A patched release will be issued alongside public credit (unless anonymity is requested).

---

## Deployment Security Best Practices

When deploying this template for commercial or client usage:
- **Environment Variables**: Store sensitive production keys (`RESEND_API_KEY`, private tokens) in server-side environment variables only. Never prefix sensitive secrets with `NEXT_PUBLIC_`.
- **Content Security Policy (CSP)**: Configure strict CSP headers in `next.config.ts` or edge middleware.
- **Input Sanitization**: If integrating a live backend or custom form submission handler, sanitize all user inputs before persistence or email dispatch.
