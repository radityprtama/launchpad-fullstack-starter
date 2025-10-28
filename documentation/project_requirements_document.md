# Project Requirements Document (PRD)

## 1. Project Overview

**LaunchPad** is a Boilerplate-as-a-Service platform that lets developers create, manage, and instantly spin up fully configured codebases based on visual templates. Instead of manually setting up authentication, database connections, UI components, and deployment pipelines for each new project, users define a reusable template once in a drag-and-drop UI. With a single click or API call, LaunchPad generates a fresh code repository—complete with user management, database schema, UI scaffolding, and Docker setup—then pushes it to the user's GitHub account.

We’re building LaunchPad to solve the repetitive, error-prone work of bootstrapping new web applications. The key objectives for version 1 are:
- Provide a secure sign-up, login, and session management experience.  
- Offer a visual template builder that defines files, folders, variables, and code snippets.  
- Generate a working codebase on demand and push it to GitHub via OAuth.  
- Support individual and team accounts with role-based access.  

Success is measured by a user’s ability to go from template definition to live GitHub repo in under two minutes, with zero manual setup beyond filling a few form fields.

---

## 2. In-Scope vs. Out-of-Scope

### In-Scope (Version 1)
- User registration, login, logout, and session persistence using Better Auth.  
- Role-based access: Free, Pro, and Team roles (feature gating only; no paid billing flow).  
- Visual Template Builder: define file/folder tree, code snippets, and variable placeholders.  
- Template CRUD (Create, Read, Update, Delete) via Next.js API routes.  
- Project generation endpoint `/api/generate` that queues jobs and runs them in a worker.  
- GitHub OAuth integration: authenticate, store tokens encrypted, push generated code.  
- Dashboard UI: list personal, team, and public templates; trigger generation; view status.  
- Background worker with BullMQ & Redis to process generation jobs asynchronously.  
- Docker setup for both web app and worker containers via Docker Compose.  
- PostgreSQL database with Drizzle ORM for type-safe schema and queries.  
- UI built with shadcn/ui components and Tailwind CSS.  

### Out-of-Scope (Planned for Later Phases)
- Stripe billing integration and automated subscription payments.  
- Public template marketplace with template ratings or comments.  
- GitLab or Bitbucket OAuth (only GitHub in v1).  
- CLI (`launchpad-cli`) for headless invocations (will build a separate package later).  
- Advanced analytics or audit logging.  
- Multi-region deployment or Kubernetes orchestration.  
- End-to-end testing scripts (Playwright/Cypress) and test environment automation.

---

## 3. User Flow

A new user lands on the marketing homepage, clicks “Sign Up,” and registers via email/password. After verifying their email, they’re redirected to the **Dashboard**. A left sidebar offers navigation links: **Templates**, **Teams**, and **Account**. On the **Templates** page, they see a table of existing templates (initially empty) and a “Create New Template” button.

Clicking “Create New Template” opens the **Visual Template Builder**: a split-screen interface where on the left users build a file/folder tree and on the right they define file contents with code editors and placeholder variables. After saving, the template appears in their list. To generate a project, they click “Use Template,” fill in project name and variable values in a modal, and hit “Generate.” Behind the scenes, a job is queued; the user sees a progress indicator. When the worker finishes, a success notification appears with a link to the newly created GitHub repository.

---

## 4. Core Features

- **Authentication & Authorization**  
  • Email/password sign up, login, logout.  
  • Session management and role checks (Free/Pro/Team).  

- **Template Management**  
  • Create, edit, delete visual templates (file structure & variable placeholders).  
  • Store template definitions in PostgreSQL (JSON or structured tables).  

- **Visual Template Builder UI**  
  • Drag-and-drop file tree editor.  
  • In-browser code editor with syntax highlighting and variable interpolation.  
  • Live preview of variables.  

- **Project Generation Service**  
  • API endpoint (`/api/generate`) to enqueue jobs.  
  • Background worker (BullMQ + Redis) that reads template, replaces variables, and runs Git commands.  
  • GitHub OAuth integration to create repos and push code.  
  • Job status tracking and user notifications.  

- **Dashboard & Navigation**  
  • Sidebar with links to Templates, Teams, and Account pages.  
  • Template list with search, sort, and status indicators.  

- **Team Management**  
  • Create teams, invite members via email.  
  • Role assignments (Admin vs. Member).  
  • Share templates within teams.  

- **Infrastructure & Deployment**  
  • Docker Compose for multi-container setup (web + worker + Redis + Postgres).  
  • Environment variable management for secrets (OAuth tokens, DB URL).  

---

## 5. Tech Stack & Tools

- Frontend & Backend Framework: **Next.js (App Router)** with **TypeScript**  
- UI Components: **shadcn/ui** + **Tailwind CSS** v4  
- Authentication: **Better Auth** for user session management  
- Database: **PostgreSQL**  
- ORM: **Drizzle ORM** (type-safe schema & queries)  
- Queue & Worker: **BullMQ** + **Redis**  
- OAuth & GitHub Integration: **next-auth** or custom OAuth flow  
- Templating Engine: Handlebars / Mustache / EJS (pick one for variable substitution)  
- Containerization: **Docker** & **Docker Compose**  
- Editor & IDE Tools: VSCode; recommended extensions—ESLint, Prettier, Tailwind CSS IntelliSense  

---

## 6. Non-Functional Requirements

- **Performance**:  
  • Dashboard page must load within 300ms on a cold start.  
  • API response times under 200ms for template CRUD.  

- **Scalability**:  
  • Worker queue must scale horizontally; Redis should handle 1,000 jobs/min.  

- **Security & Compliance**:  
  • Use HTTPS everywhere.  
  • Encrypt OAuth tokens at rest.  
  • Sanitize all user inputs; use Zod for schema validation.  
  • Follow OWASP Top 10 guidelines.  

- **Usability**:  
  • Responsive design for desktop and tablet.  
  • Keyboard accessibility in template builder.  

- **Reliability**:  
  • Automatic retries for transient job failures (up to 3 attempts).  
  • Centralized logging (console + optional external logger).  

---

## 7. Constraints & Assumptions

- **GitHub API rate limits** (5,000 req/hr per token). Worker must batch or back off.  
- **Redis & PostgreSQL** must be running in the same VPC for low latency.  
- Users will provide valid GitHub account with repo creation permissions.  
- We assume a single region deployment initially (no global distribution).  
- Better Auth service endpoints must be available and support our scale.  

---

## 8. Known Issues & Potential Pitfalls

- **Template Injection Risks**: Unchecked variables could lead to malicious code. Mitigation: strict Zod schemas and whitelisted templating.  
- **Long-Running Jobs**: Some templates might take tens of seconds to generate. Mitigation: display progress and implement a timeout.  
- **OAuth Token Expiry**: GitHub tokens can expire or be revoked. Mitigation: check token validity before job and prompt re-auth.  
- **Redis Queue Starvation**: If queue floods, web requests may slow. Mitigation: prioritize API queue, scale worker containers.  
- **Docker Resource Limits**: On dev machines, Docker containers may run out of memory. Mitigation: set conservative `mem_limit` in Docker Compose.  


---

This PRD provides a clear blueprint for AI or development teams to build LaunchPad’s first version end-to-end without guesswork. All details—features, flows, tech choices, constraints—are explicitly stated to guide subsequent technical designs and implementation documents.