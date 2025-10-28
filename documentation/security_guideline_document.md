# Security Guideline Document for `launchpad-fullstack-starter`

## 1. Introduction
This document outlines security best practices and actionable recommendations tailored to the `launchpad-fullstack-starter` codebase. Its goal is to embed security by design into every layer—from user authentication to background job processing—ensuring LaunchPad remains robust, compliant, and resilient against threats.

## 2. Core Security Principles
- **Security by Design:** Integrate security reviews during all development phases.  
- **Least Privilege:** Grant minimum required permissions to services, containers, database roles, and API consumers.  
- **Defense in Depth:** Layer controls (validation, authentication, logging, monitoring) so that single-point failures do not lead to system compromise.  
- **Fail Securely:** Default to deny; handle errors without leaking stack traces, internal paths, or PII.  
- **Secure Defaults & Simplicity:** Use safe configurations out of the box; avoid unnecessary complexity.

## 3. Authentication & Access Control

### 3.1 Better Auth Integration
- Enforce **strong password policies**: minimum length ≥ 12, complexity rules, periodic rotation.  
- Store passwords with **Argon2** or **bcrypt** plus a per-user salt.  
- **Session Management:**
  - Use secure, random session IDs stored in HttpOnly, Secure, SameSite=strict cookies.  
  - Implement idle (e.g., 15 min) and absolute timeouts (e.g., 12 hours).  
  - Provide explicit logout routes that invalidate sessions server-side.  
- **Multi-Factor Authentication (MFA):** Offer TOTP-based MFA for Pro and Team tiers.  

### 3.2 Role-Based Access Control (RBAC)
- Define roles (`user`, `admin`, `team_owner`, `team_member`) and associated permissions in middleware.  
- On every API route (`/app/api/*`), validate JWT/session and enforce role checks.  
- Use `better-auth` hooks or custom Next.js middleware to guard dashboard and generation endpoints.

## 4. Input Handling & Validation

### 4.1 Server-Side Validation
- Use **Zod** schemas for all API payloads: templates CRUD, `/api/generate`, team invites, billing operations.  
- Validate data before database operations or queuing jobs.  

### 4.2 Prevent Injection Attacks
- **Database Access:** Always interact via **Drizzle ORM**’s prepared statements. Never interpolate raw user data into SQL.  
- **Template Definitions:** Sanitize any dynamic content before passing to templating engines (Handlebars, Mustache).  

### 4.3 Secure File Uploads & Storage
- If enabling file uploads (e.g., custom assets in templates):  
  - Validate MIME types and file extensions against an allow-list.  
  - Scan files for malware (e.g., ClamAV).  
  - Store outside webroot or on object storage (AWS S3) with restricted access.  

## 5. Data Protection & Privacy

### 5.1 Encryption
- **In transit:** Enforce HTTPS/TLS 1.2+ for all endpoints; use HSTS.  
- **At rest:** Enable encryption for PostgreSQL data directories and any object storage.  

### 5.2 Secrets Management
- Do _not_ store JWT secrets, OAuth client secrets, or Stripe API keys in source code or `.env` files committed to repos.   
- Leverage a secrets vault (e.g., AWS Secrets Manager, HashiCorp Vault) or encrypted environment store.  

### 5.3 Sensitive Data Handling
- Mask PII (email addresses, tokens) in logs.  
- Exclude sensitive fields (GitHub OAuth tokens, Stripe customer IDs) from API responses.  
- Comply with GDPR/CCPA: provide user data export and deletion flows.

## 6. API & Service Security

### 6.1 Endpoint Hardening
- **HTTPS Only:** Redirect HTTP to HTTPS and reject non-TLS connections.  
- **Rate Limiting & Throttling:** Apply per-IP and per-user limits on login, template generation, and OAuth callbacks (e.g., via `express-rate-limit` or Next.js middleware).  
- **CORS:** Allow only trusted origins (your marketing site, dashboard domain) with strict methods and headers.  

### 6.2 API Design
- Enforce correct HTTP verbs: GET (read), POST (create), PUT/PATCH (update), DELETE (remove).  
- Verify JWT `alg`, `iss`, `aud`, and expiration (`exp`) on each request.  
- Version APIs (e.g., `/api/v1/templates`) to manage backward compatibility.

## 7. Web Application Security Hygiene

### 7.1 CSRF Protection
- For state-changing routes, implement CSRF tokens (Synchronizer Pattern) using a library like `next-csrf`.  

### 7.2 Security Headers
- Content-Security-Policy: restrict sources for scripts, styles, images, fonts.  
- Strict-Transport-Security (HSTS) with `max-age=31536000; includeSubDomains; preload`.  
- X-Content-Type-Options: `nosniff`.  
- X-Frame-Options: `DENY` or CSP `frame-ancestors 'none'`.  
- Referrer-Policy: `no-referrer-when-downgrade` or stricter.  

### 7.3 Secure Cookies
- All cookies: `HttpOnly; Secure; SameSite=Strict`.  
- Session cookies: consider rotating per-login to defend against fixation.

## 8. Infrastructure & Deployment

### 8.1 Docker Hardening
- Use minimal base images (e.g., Alpine).  
- Run processes as non-root within containers.  
- Scan images for vulnerabilities (`docker scan`).  
- Isolate the background worker container with a separate network and only necessary environment variables (e.g., DB host, Redis host).

### 8.2 Server & Cloud
- Disable unnecessary ports (expose only 80/443 and internal ports via private VPC).  
- Regularly patch OS and runtimes.  
- Use IAM roles with restricted permissions for managed services (e.g., RDS, S3).  

## 9. Dependency Management
- Maintain `package-lock.json` for deterministic installs.  
- Run automated SCA (e.g., GitHub Dependabot, Snyk) to identify vulnerable packages (including transitive).  
- Vet third-party libraries: prefer actively maintained, widely used components.

## 10. Background Job Queue Security

- **Queue Authentication:** Secure Redis with ACLs and password.  
- **Job Validation:** Re-validate job payload server-side before processing.  
- **Least Privilege Worker:** Worker container needs only DB read/write, Redis access, and GitHub API token—no direct user data.
- **Logging & Alerts:** Track job failures, retry counts, and anomalous patterns (e.g., mass generation requests).

## 11. CI/CD & DevOps Security

- Store secrets in CI vaults (GitHub Actions Secrets, GitLab CI/CD).  
- Enforce branch protection, require PR reviews, and pass security linters/tests before merge.  
- Include security scans (SAST) in pipelines (`eslint-plugin-security`, `npm audit`).  
- Deploy only signed/container-scanned artifacts to production.

## 12. Roadmap & Next Steps
1. **Authentication Audit:** Review Better Auth endpoints; enforce MFA and rotate secrets.  
2. **Validation Coverage:** Implement Zod for all existing and new API routes.  
3. **CSP & Headers:** Configure HTTP security headers in Next.js (`next.config.js` or middleware).  
4. **Secrets Vault Integration:** Migrate from `.env` to a managed secrets store.  
5. **Background Worker Isolation:** Harden the Docker container, secure Redis, and implement monitoring.  
6. **Penetration Testing:** Schedule periodic tests on critical flows (template builder, OAuth, payment).  
7. **Compliance:** Draft privacy policy and data retention guidelines for PII.  

---
By adhering to these guidelines, the `launchpad-fullstack-starter` platform will benefit from a multi-layered defense strategy, ensuring LaunchPad’s reliability, confidentiality, and integrity as you build out its core features.