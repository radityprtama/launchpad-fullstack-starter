# Backend Structure Document

This document outlines the backend setup for the **LaunchPad** Boilerplate-as-a-Service platform. It explains how the system is built, how data is managed, where it lives, how it’s secured, and how all the pieces work together.

---

## 1. Backend Architecture

**Overall Design**
- We use **Next.js App Router** as a unified framework for both frontend pages and backend APIs. This means marketing pages, dashboards, and server-side logic live under the same codebase.  
- **API Routes** are file-based under `/app/api`. Each route handles one area of functionality (e.g., templates, teams, generation jobs).  
- **Better Auth** provides user registration, login, session management, and supports freemium, Pro, and Team models out of the box.  
- **Drizzle ORM** sits between our code and the PostgreSQL database, giving us a type-safe way to define and query tables.  
- We add a separate **worker service** (in its own container) for long-running tasks like project generation, connected via a job queue.

**Key Patterns & Benefits**
- **Separation of Concerns**: UI components (`/components`), API logic (`/app/api`), database schemas (`/db`), and workers (`/workers` or `/services`) are all in clear folders.
- **Type Safety**: Using TypeScript end-to-end (Next.js + Drizzle ORM + client code) catches many errors at compile time.
- **Scalability**: You can spin up many API server instances, scale the database, and add more worker containers as load grows.
- **Maintainability**: Modular code and shared types mean new features (e.g., billing, new API routes) slot in smoothly.
- **Performance**: Lightweight API routes, optimized data fetching, and caching (Redis) keep response times low.

---

## 2. Database Management

**Technology Choice**
- **PostgreSQL** (Relational SQL database) for reliable, ACID-compliant storage.  
- **Drizzle ORM** to define tables and queries in TypeScript, ensuring the shape of data stays consistent.  

**Data Structure & Storage**
- Tables cover users, teams, templates, subscriptions, and generation jobs.  
- Drizzle handles migrations and schema definitions under `/db/schema`.  
- Data is accessed via Drizzle’s query builder, which returns typed results and prevents SQL injection.

**Data Management Practices**
- **Migrations**: Versioned scripts track schema changes.  
- **Backups**: Regular snapshots of the Postgres database.  
- **Connection Pooling**: Ensures efficient reuse of database connections under heavy load.

---

## 3. Database Schema

Below is a human-readable overview of our main tables and their key fields.  

Users
- id (UUID)  
- email (text, unique)  
- hashed_password (text)  
- role (enum: Free, Pro, Team Owner, Team Member)  
- created_at, updated_at (timestamps)

Teams
- id (UUID)  
- name (text)  
- owner_id (references users.id)  
- created_at, updated_at (timestamps)

Team_Memberships
- id (UUID)  
- team_id (references teams.id)  
- user_id (references users.id)  
- role (enum: Member, Admin)  
- joined_at (timestamp)

Templates
- id (UUID)  
- name (text)  
- definition (JSON) – file structure, variables, settings  
- version (integer)  
- owner_id (references users.id)  
- created_at, updated_at (timestamps)

Subscriptions
- id (UUID)  
- user_id (references users.id)  
- plan (enum: Free, Pro, Team)  
- stripe_customer_id (text)  
- stripe_subscription_id (text)  
- status (enum: active, past_due, canceled)  
- start_date, end_date (timestamps)

Generation_Jobs
- id (UUID)  
- user_id (references users.id)  
- template_id (references templates.id)  
- status (enum: pending, processing, completed, failed)  
- log (JSON) – progress updates, error messages  
- created_at, updated_at (timestamps)

---

**SQL Schema (PostgreSQL)**
```sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  hashed_password TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('Free', 'Pro', 'Team Owner', 'Team Member')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Teams
CREATE TABLE teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  owner_id UUID REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Team Memberships
CREATE TABLE team_memberships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID REFERENCES teams(id),
  user_id UUID REFERENCES users(id),
  role TEXT NOT NULL CHECK (role IN ('Member', 'Admin')),
  joined_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Templates
CREATE TABLE templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  definition JSONB NOT NULL,
  version INTEGER NOT NULL DEFAULT 1,
  owner_id UUID REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Subscriptions
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  plan TEXT NOT NULL CHECK (plan IN ('Free', 'Pro', 'Team')),
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  status TEXT NOT NULL CHECK (status IN ('active','past_due','canceled')),
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ
);

-- Generation Jobs
CREATE TABLE generation_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  template_id UUID REFERENCES templates(id),
  status TEXT NOT NULL CHECK (status IN ('pending','processing','completed','failed')),
  log JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```  

---

## 4. API Design and Endpoints

We follow a **RESTful** style using Next.js API Routes. Each route folder maps to a URL path under `/api`.

**Authentication**
- `POST /api/auth/signup` – register new user.  
- `POST /api/auth/login` – user login, returns session cookie.  
- `POST /api/auth/logout` – clear user session.

**Templates**
- `GET /api/templates` – list all templates accessible by the user (personal, team).  
- `POST /api/templates` – create a new template.  
- `GET /api/templates/{id}` – fetch a single template’s data.  
- `PUT /api/templates/{id}` – update a template’s definition.  
- `DELETE /api/templates/{id}` – remove a template.

**Generation**
- `POST /api/generate` – enqueue a generation job (requires template ID and project variables).  
- `GET /api/generate/{jobId}` – check status and logs of a job.

**Teams & Membership**
- `GET /api/teams` – list teams user belongs to.  
- `POST /api/teams` – create a new team.  
- `POST /api/teams/{id}/invite` – add a member to a team.  
- `DELETE /api/teams/{id}/members/{userId}` – remove member.

**Billing & Subscriptions**
- `GET /api/subscriptions` – current user subscription details.  
- `POST /api/subscriptions/checkout` – create Stripe checkout session.  
- `POST /api/webhooks/stripe` – receive events from Stripe.

Each endpoint validates input with **Zod** schemas and checks user permissions via middleware.  

---

## 5. Hosting Solutions

**Application Servers**
- Hosted on a cloud provider (e.g., AWS ECS, Google Cloud Run, or Vercel).  
- Docker containers ensure consistent runtime (Node.js + Next.js).  
- Auto-scaling based on CPU/requests.

**Database**
- Managed PostgreSQL service (Amazon RDS, Azure Database, or Google Cloud SQL).  
- Automatic backups, multi-zone replicas for high availability.

**Worker Service**
- Deployed as a separate Docker container.  
- Reads jobs from Redis and runs the generation logic.  
- Can scale independently from the API servers.

**Local Development**
- `docker-compose.yml` spins up API, Postgres, Redis, and worker containers locally.

---

## 6. Infrastructure Components

**Load Balancer**
- Distributes traffic across multiple API server instances.  

**Caching & Queue**
- **Redis** serves two roles:  
  • Caching frequently accessed data (e.g., templates list)  
  • Backing BullMQ job queue for generation tasks

**CDN**
- Static assets (JS, CSS, images) served via a CDN (e.g., Vercel edge network or Cloudflare) to accelerate global delivery.

**Background Worker**
- Uses **BullMQ** connected to Redis.  
- Processes generation jobs, communicates status back to Postgres, and notifies users via in-app events or email.

**Container Orchestration**
- Docker Compose locally, and Kubernetes/ECS in production if needed.

---

## 7. Security Measures

**Authentication & Authorization**
- **Better Auth** handles secure password storage, session cookies, and CSRF protection.  
- Role-based access: Free, Pro, Team Owner, Team Member determine permitted actions.

**OAuth Integration**
- GitHub (or GitLab) OAuth via `next-auth` or a similar library.  
- Secure storage of access tokens in the database (encrypted at rest).

**Data Encryption**
- TLS (HTTPS) enforced for all traffic.  
- Database encryption at rest via managed service.

**Input Validation & Sanitization**
- **Zod** schemas validate all incoming requests.  
- Prevents malformed data and injection attacks.

**Secrets Management**
- Environment variables stored securely (AWS Secrets Manager, GCP Secret Manager, or Vercel Environment Settings).  
- No credentials checked into code.

**Error Handling & Logging**
- Central middleware captures errors and sends structured logs to a log service (e.g., ELK, Datadog).  
- Worker failures are retried and reported.

**Compliance**
- GDPR-friendly data practices: users can request data exports/deletions.  
- Stripe PCI compliance for billing.

---

## 8. Monitoring and Maintenance

**Monitoring Tools**
- **APM** (Datadog, New Relic, or Prometheus + Grafana) to track server response times and errors.  
- **Redis & Postgres** metrics for memory, connections, and CPU.

**Logging**
- **Pino** or **Winston** logs structured JSON to a centralized service.  
- Worker logs include job-level details for debugging.

**Health Checks**
- API health endpoints (`/api/health`) polled by load balancer.  
- Worker liveness/readiness probes.

**Maintenance Strategy**
- **CI/CD Pipelines**: automated builds, tests (unit, integration, end-to-end), and deployments.  
- **Database Migrations**: run as part of deployment, with rollback support.  
- **Dependency Updates**: scheduled checks for vulnerable packages (Dependabot).  
- **Backups & Disaster Recovery**: daily DB backups, periodic restore drills.

---

## 9. Conclusion and Overall Backend Summary

LaunchPad’s backend is built on a **modern, unified** Next.js framework that handles both UI and server logic in one place. We use:

- Bullet list of core tech:
  • Next.js App Router & TypeScript  
  • Better Auth for user management  
  • PostgreSQL with Drizzle ORM  
  • Docker + Docker Compose for containers  
  • Redis + BullMQ for background jobs  
  • Zod for input validation  
  • Stripe for billing & subscriptions

This setup ensures:
- **Scalability**: independent scaling of web servers, database, and workers.  
- **Maintainability**: clear folder structure, shared types, and modular code.  
- **Performance**: CDN, caching, optimized API routes.  
- **Security**: encrypted data, role-based access, validated inputs, and secure secrets handling.

**Unique Aspects**
- A single Next.js codebase for marketing, dashboard, and API simplifies development.  
- Type-safe ORM and end-to-end TypeScript dramatically reduce runtime errors.  
- Containerized background workers make long-running jobs safe and isolated.

With this backend structure in place, building core LaunchPad features—like the Visual Template Builder, project generation, and team workflows—becomes a matter of extending well-defined pieces, not reinventing foundational plumbing.