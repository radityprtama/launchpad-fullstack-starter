# 🚀 LaunchPad - Boilerplate-as-a-Service
## Complete SpecKit & Technical Specification

---

## 📋 Executive Summary

**LaunchPad** adalah platform SaaS yang menyediakan production-ready boilerplate templates untuk mempercepat development aplikasi. Platform ini memungkinkan developer untuk:
- Browse dan preview berbagai boilerplate templates
- Customize templates sesuai kebutuhan project
- Generate project dengan satu klik
- Deploy langsung ke hosting platform
- Access via web dashboard atau CLI tool

**Target Market:** Indie hackers, startup founders, development agencies, dan enterprise teams yang ingin mempercepat project initialization.

---

## 🎯 Core Features

### 1. **Template Marketplace**
- Katalog templates dengan preview dan demo
- Filter berdasarkan tech stack, category, dan use case
- Rating dan review system
- Template versioning dan changelog

### 2. **Project Generator**
- Interactive configuration wizard
- Real-time preview dari struktur project
- Custom variable injection (project name, API keys, etc.)
- Automated dependency installation

### 3. **Authentication & Authorization**
- Multi-tenant architecture dengan team support
- Role-based access control (Owner, Admin, Member, Viewer)
- OAuth integration (GitHub, Google, GitLab)
- API key management untuk CLI access

### 4. **Deployment Integration**
- One-click deployment ke Vercel, Netlify, Railway
- GitHub/GitLab repository creation
- Environment variable management
- Automated CI/CD setup

### 5. **CLI Tool**
- Interactive template selection
- Local project generation
- Git initialization dan first commit
- Quick deployment commands

### 6. **Template Studio (Pro Feature)**
- Create custom templates
- Template testing dan validation
- Marketplace publishing
- Revenue sharing untuk template creators

### 7. **Analytics Dashboard**
- Project generation metrics
- Template popularity tracking
- User behavior analytics
- Performance monitoring

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Client Layer                          │
├─────────────────┬───────────────────┬──────────────────────┤
│   Web App       │   Mobile Web      │   CLI Tool           │
│   (Next.js 16)  │   (Responsive)    │   (Node.js)          │
└────────┬────────┴───────────┬───────┴──────────┬───────────┘
         │                    │                   │
         └────────────────────┼───────────────────┘
                              │
                    ┌─────────▼─────────┐
                    │   API Gateway     │
                    │   (oRPC + tRPC)   │
                    └─────────┬─────────┘
                              │
         ┌────────────────────┼────────────────────┐
         │                    │                    │
    ┌────▼─────┐      ┌──────▼──────┐     ┌──────▼──────┐
    │  Auth    │      │   Core      │     │  Generator  │
    │  Service │      │   Service   │     │  Service    │
    └──────────┘      └──────────────┘     └─────────────┘
         │                    │                    │
         └────────────────────┼────────────────────┘
                              │
                    ┌─────────▼─────────┐
                    │   Data Layer      │
                    ├───────────────────┤
                    │  PostgreSQL       │
                    │  Redis Cache      │
                    │  S3/R2 Storage    │
                    └───────────────────┘
```

---

## 🛠️ Updated Tech Stack

### **Frontend (Next.js 16)**

#### Core Framework
- **Next.js 16** (App Router with React Server Components)
  - Server Actions untuk mutations
  - Streaming SSR untuk performance
  - Partial Prerendering (PPR)
- **React 19** - Latest features (Server Components, Actions, use())
- **TypeScript 5.7+** - Latest type system features

#### Styling & Components
- **Tailwind CSS 4.0** - Latest version dengan native CSS variables
- **shadcn/ui** - Pre-built accessible components
- **Radix UI Primitives** - Headless UI components
- **Framer Motion** - Advanced animations

#### State Management
- **Zustand 5** - Client state management
- **TanStack Query v5** - Server state dengan streaming support
- **nuqs** - Type-safe URL state management

#### Form & Validation
- **React Hook Form v7** - Performant forms
- **Zod** - Runtime validation
- **Conform** - Progressive enhancement untuk forms

---

### **Backend & API**

#### API Layer - **oRPC** ⭐ (New)
```typescript
// oRPC memberikan:
// - Type-safe RPC calls seperti tRPC
// - Better performance dengan streaming support
// - Native integration dengan Next.js Server Actions
// - Automatic request batching
// - Built-in error handling

import { createRouter } from '@orpc/server'

export const appRouter = createRouter({
  template: {
    list: procedure
      .input(z.object({ category: z.string() }))
      .query(async ({ input }) => {
        return await db.template.findMany({
          where: { category: input.category }
        })
      }),
    generate: procedure
      .input(generateSchema)
      .mutation(async ({ input }) => {
        // Background job untuk generation
        await queue.add('generate-project', input)
      })
  }
})
```

#### Runtime & Framework
- **Node.js 22 LTS** (latest stable)
- **Fastify 5** - Ultra-fast backend framework
  - Built-in schema validation
  - Excellent plugin ecosystem
  - Low memory footprint

#### Authentication
- **Clerk** - Complete auth solution dengan:
  - OAuth providers (GitHub, Google, GitLab)
  - Multi-factor authentication
  - Organization/team management
  - Webhook support
- **CASL** - Fine-grained authorization

---

### **Security Layer - Arcjet** ⭐ (New)

```typescript
// Arcjet memberikan protection layer:
// - Rate limiting dengan smart rules
// - Bot detection dan mitigation
// - Email validation
// - Shield untuk attacks (SQLi, XSS)

import arcjet, { shield, detectBot, rateLimit } from '@arcjet/next'

const aj = arcjet({
  key: process.env.ARCJET_KEY!,
  rules: [
    shield({ mode: 'LIVE' }),
    detectBot({
      mode: 'LIVE',
      allow: ['CATEGORY:SEARCH_ENGINE']
    }),
    rateLimit({
      mode: 'LIVE',
      window: '1h',
      max: 100,
      characteristics: ['userId']
    })
  ]
})

// Protect API routes
export async function POST(req: Request) {
  const decision = await aj.protect(req)
  if (decision.isDenied()) {
    return new Response('Forbidden', { status: 403 })
  }
  // Handle request...
}
```

**Arcjet Features untuk LaunchPad:**
- **Rate Limiting**: Prevent abuse pada project generation
- **Bot Protection**: Shield marketplace dari scrapers
- **Shield**: Real-time attack prevention
- **Email Validation**: Validate user emails saat signup
- **Custom Rules**: Per-user atau per-plan rate limits

---

### **Database & Storage**

#### Primary Database
- **PostgreSQL 16** dengan extensions:
  - `pg_trgm` - Full-text search
  - `uuid-ossp` - UUID generation
  - `pgcrypto` - Encryption
- **Prisma 6** - Type-safe ORM dengan:
  - Accelerate untuk connection pooling
  - Pulse untuk real-time subscriptions

#### Caching & Queue
- **Redis 7.x** (Upstash for serverless)
  - Session storage
  - Cache layer
  - Rate limit counters
- **BullMQ** - Reliable job queue untuk:
  - Project generation tasks
  - Email sending
  - Webhook processing

#### Object Storage
- **Cloudflare R2** - Zero egress fees untuk:
  - Template archives (.zip)
  - Generated project files
  - User avatars dan assets
- Alternative: **Vercel Blob** untuk simplicity

---

### **Infrastructure & DevOps**

#### Hosting & Deployment
- **Vercel** - Next.js frontend (native support untuk Next.js 16)
  - Edge Functions untuk global performance
  - Image optimization
  - Analytics dan monitoring
- **Railway** atau **Fly.io** - Backend services
  - Fastify API
  - BullMQ workers
  - Redis instance

#### CI/CD
- **GitHub Actions** dengan workflows:
  - Automated testing (unit, integration, E2E)
  - Type checking dan linting
  - Database migration checks
  - Security scanning
- **Turborepo** - Monorepo orchestration

#### Monitoring
- **Sentry** - Error tracking dengan:
  - Source maps
  - Performance monitoring
  - User feedback
- **Better Stack (Logtail)** - Log aggregation
- **Vercel Analytics** - Web vitals tracking

---

### **Background Jobs & Processing**

```typescript
// Worker setup dengan BullMQ
import { Worker } from 'bullmq'

const projectGenerationWorker = new Worker(
  'project-generation',
  async (job) => {
    const { templateId, config, userId } = job.data

    // 1. Fetch template dari S3/R2
    // 2. Process variables dengan Handlebars
    // 3. Generate file structure
    // 4. Create Git repository
    // 5. Push to GitHub/GitLab
    // 6. Trigger deployment (optional)

    return { projectId, repoUrl, deploymentUrl }
  },
  { connection: redis }
)
```

---

### **CLI Tool**

```bash
# Stack untuk CLI
- Commander.js - CLI framework
- Inquirer.js - Interactive prompts
- Ora - Loading spinners
- Chalk - Terminal colors
- Simple Git - Git operations
- Axios - API calls ke LaunchPad API
```

**CLI Commands:**
```bash
# Authentication
launchpad login
launchpad logout

# Template operations
launchpad list                    # Browse templates
launchpad search nextjs          # Search templates
launchpad info <template-id>     # Template details

# Project generation
launchpad create                 # Interactive wizard
launchpad create --template=nextjs-saas --name=myapp

# Deployment
launchpad deploy                 # Deploy current project
launchpad deploy --platform=vercel

# Configuration
launchpad config set API_KEY=xxx
launchpad whoami
```

---

## 📊 Database Schema

```prisma
// schema.prisma

model User {
  id            String    @id @default(cuid())
  clerkId       String    @unique
  email         String    @unique
  name          String?
  avatar        String?
  plan          Plan      @default(FREE)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  teams         TeamMember[]
  projects      Project[]
  templates     Template[]
  apiKeys       ApiKey[]
}

model Team {
  id            String    @id @default(cuid())
  name          String
  slug          String    @unique
  avatar        String?
  plan          Plan      @default(FREE)

  members       TeamMember[]
  projects      Project[]

  @@index([slug])
}

model TeamMember {
  id        String   @id @default(cuid())
  teamId    String
  userId    String
  role      Role     @default(MEMBER)
  joinedAt  DateTime @default(now())

  team      Team     @relation(fields: [teamId], references: [id])
  user      User     @relation(fields: [userId], references: [id])

  @@unique([teamId, userId])
}

model Template {
  id            String    @id @default(cuid())
  name          String
  slug          String    @unique
  description   String
  longDesc      String?   @db.Text
  category      Category
  tags          String[]

  // Tech stack
  techStack     Json      // { frontend: [], backend: [], database: [] }

  // Versions
  version       String    @default("1.0.0")
  changelog     Json?

  // Files
  storageKey    String    // S3/R2 key untuk template .zip
  fileSize      Int       // in bytes

  // Metadata
  downloads     Int       @default(0)
  rating        Float     @default(0)
  featured      Boolean   @default(false)
  published     Boolean   @default(false)

  // Relations
  authorId      String
  author        User      @relation(fields: [authorId], references: [id])
  projects      Project[]
  reviews       Review[]

  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  @@index([slug])
  @@index([category])
  @@index([published, featured])
}

model Project {
  id            String    @id @default(cuid())
  name          String
  description   String?

  // Template used
  templateId    String
  template      Template  @relation(fields: [templateId], references: [id])

  // Configuration
  config        Json      // User's custom config

  // Repository
  repoProvider  String?   // github, gitlab
  repoUrl       String?

  // Deployment
  deployed      Boolean   @default(false)
  deployUrl     String?
  deployPlatform String? // vercel, netlify, railway

  // Owner
  userId        String?
  user          User?     @relation(fields: [userId], references: [id])
  teamId        String?
  team          Team?     @relation(fields: [teamId], references: [id])

  // Status
  status        GenerationStatus @default(PENDING)
  generatedAt   DateTime?

  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  @@index([userId])
  @@index([teamId])
  @@index([templateId])
}

model Review {
  id          String   @id @default(cuid())
  templateId  String
  userId      String
  rating      Int      // 1-5
  comment     String?  @db.Text
  helpful     Int      @default(0)

  template    Template @relation(fields: [templateId], references: [id])

  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@unique([templateId, userId])
}

model ApiKey {
  id          String   @id @default(cuid())
  userId      String
  name        String
  key         String   @unique
  lastUsedAt  DateTime?
  expiresAt   DateTime?

  user        User     @relation(fields: [userId], references: [id])

  createdAt   DateTime @default(now())

  @@index([userId])
}

enum Plan {
  FREE
  PRO
  TEAM
  ENTERPRISE
}

enum Role {
  OWNER
  ADMIN
  MEMBER
  VIEWER
}

enum Category {
  FULLSTACK
  FRONTEND
  BACKEND
  MOBILE
  DESKTOP
  CLI
  API
  MICROSERVICE
}

enum GenerationStatus {
  PENDING
  PROCESSING
  COMPLETED
  FAILED
}
```

---

## 🔐 Security Implementation

### 1. **Arcjet Protection Layers**

```typescript
// app/api/generate/route.ts
import arcjet, { shield, rateLimit } from '@arcjet/next'

const aj = arcjet({
  key: process.env.ARCJET_KEY!,
  rules: [
    // Prevent attacks
    shield({ mode: 'LIVE' }),

    // Rate limit per user
    rateLimit({
      mode: 'LIVE',
      window: '1h',
      max: async (ctx) => {
        // Dynamic limits berdasarkan plan
        const plan = await getUserPlan(ctx.userId)
        return plan === 'PRO' ? 50 : 10
      },
      characteristics: ['userId']
    })
  ]
})

export async function POST(req: Request) {
  const decision = await aj.protect(req, { userId: user.id })

  if (decision.isDenied()) {
    if (decision.reason.isRateLimit()) {
      return Response.json(
        { error: 'Rate limit exceeded' },
        { status: 429 }
      )
    }
    return Response.json(
      { error: 'Forbidden' },
      { status: 403 }
    )
  }

  // Process generation...
}
```

### 2. **API Security**
- HTTPS only dengan HSTS headers
- CSRF protection via SameSite cookies
- Input validation dengan Zod schemas
- SQL injection prevention via Prisma
- XSS prevention via Content Security Policy

### 3. **Data Protection**
- Encryption at rest (PostgreSQL TDE)
- Encryption in transit (TLS 1.3)
- API keys hashed dengan bcrypt
- Environment variables via secrets management

---

## 🎨 User Interface & UX

### Key Pages

1. **Landing Page**
   - Hero section dengan demo video
   - Feature showcase
   - Template carousel
   - Pricing comparison
   - Social proof (testimonials, logos)

2. **Template Marketplace**
   - Grid/list view toggle
   - Advanced filters (category, tech stack, price)
   - Live search dengan instant results
   - Template cards dengan:
     - Preview image
     - Tech stack badges
     - Rating dan downloads
     - Quick actions (preview, generate)

3. **Template Detail Page**
   - Full description dan features
   - Live demo link
   - Code preview
   - Tech stack details
   - Reviews dan ratings
   - Related templates
   - CTA: "Generate Project" button

4. **Project Generator Wizard**
   - Step 1: Configure basics (name, description)
   - Step 2: Select features (optional modules)
   - Step 3: Set environment variables
   - Step 4: Choose deployment target
   - Step 5: Review dan generate

5. **Dashboard**
   - Recent projects
   - Quick actions
   - Usage statistics
   - Team members (for team plans)

6. **Project Detail**
   - Project information
   - Repository link
   - Deployment status
   - Logs dan build output
   - Environment variables management
   - Re-deploy button

---

## 📱 API Endpoints (oRPC)

```typescript
// oRPC router structure

export const appRouter = createRouter({
  // Auth procedures
  auth: {
    me: publicProcedure.query(),
    updateProfile: protectedProcedure.input(updateProfileSchema).mutation(),
  },

  // Template procedures
  template: {
    list: publicProcedure
      .input(z.object({
        category: z.nativeEnum(Category).optional(),
        search: z.string().optional(),
        page: z.number().default(1),
        limit: z.number().default(20),
      }))
      .query(),

    get: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(),

    create: protectedProcedure
      .input(createTemplateSchema)
      .mutation(),

    update: protectedProcedure
      .input(updateTemplateSchema)
      .mutation(),

    delete: protectedProcedure
      .input(z.object({ id: z.string() }))
      .mutation(),
  },

  // Project procedures
  project: {
    generate: protectedProcedure
      .input(generateProjectSchema)
      .mutation(),

    list: protectedProcedure
      .input(z.object({
        teamId: z.string().optional(),
      }))
      .query(),

    get: protectedProcedure
      .input(z.object({ id: z.string() }))
      .query(),

    deploy: protectedProcedure
      .input(deployProjectSchema)
      .mutation(),

    delete: protectedProcedure
      .input(z.object({ id: z.string() }))
      .mutation(),
  },

  // Team procedures
  team: {
    create: protectedProcedure.input(createTeamSchema).mutation(),
    update: protectedProcedure.input(updateTeamSchema).mutation(),
    addMember: protectedProcedure.input(addMemberSchema).mutation(),
    removeMember: protectedProcedure.input(removeMemberSchema).mutation(),
    updateRole: protectedProcedure.input(updateRoleSchema).mutation(),
  },

  // Analytics procedures
  analytics: {
    overview: protectedProcedure.query(),
    templateStats: protectedProcedure
      .input(z.object({ templateId: z.string() }))
      .query(),
  },
})

export type AppRouter = typeof appRouter
```

---

## 💰 Pricing Tiers

### FREE Plan ($0/month)
- 3 project generations per month
- Access to basic templates
- Community support
- GitHub integration
- CLI access

### PRO Plan ($29/month)
- 50 project generations per month
- Access to all templates
- Priority support
- Custom templates
- Advanced deployment options
- Team collaboration (up to 3 members)

### TEAM Plan ($99/month)
- Unlimited generations
- Template Studio access
- Revenue sharing (untuk published templates)
- Priority support
- Unlimited team members
- Custom branding
- API access dengan higher rate limits

### ENTERPRISE Plan (Custom pricing)
- Everything in TEAM
- Self-hosted option
- SLA guarantee
- Dedicated support
- Custom integrations
- Training dan onboarding

---

## 🚀 Development Roadmap

### Phase 1: MVP (Months 1-3)
- [ ] Setup monorepo dengan Turborepo
- [ ] Implement authentication dengan Clerk
- [ ] Build template marketplace (list, detail, search)
- [ ] Develop project generator (basic features)
- [ ] Setup PostgreSQL + Prisma
- [ ] Integrate Arcjet untuk security
- [ ] Implement oRPC API layer
- [ ] Create CLI tool (basic commands)
- [ ] Deploy to Vercel + Railway

### Phase 2: Core Features (Months 4-6)
- [ ] GitHub/GitLab integration
- [ ] One-click deployment (Vercel, Netlify)
- [ ] Team management
- [ ] Template versioning
- [ ] Review dan rating system
- [ ] Advanced search dengan filters
- [ ] Email notifications
- [ ] Usage analytics dashboard

### Phase 3: Advanced Features (Months 7-9)
- [ ] Template Studio (create custom templates)
- [ ] Marketplace untuk template creators
- [ ] Revenue sharing system
- [ ] Advanced customization options
- [ ] Template preview environments
- [ ] Webhook support
- [ ] Public API untuk integrations

### Phase 4: Scale & Optimize (Months 10-12)
- [ ] Performance optimization
- [ ] Advanced caching strategies
- [ ] Multi-region deployment
- [ ] Enterprise features
- [ ] Advanced analytics
- [ ] AI-powered template recommendations
- [ ] Documentation site

---

## 📈 Success Metrics

### Technical KPIs
- **API Response Time**: < 200ms (p95)
- **Project Generation Time**: < 60s (average)
- **Uptime**: 99.9% SLA
- **Error Rate**: < 0.1%

### Business KPIs
- **User Signups**: Track monthly growth
- **Conversion Rate**: Free → Pro (target: 5%)
- **Monthly Recurring Revenue (MRR)**: Track growth
- **Churn Rate**: < 5% monthly
- **Template Downloads**: Track popularity
- **CLI Active Users**: Daily/monthly active users

### User Experience KPIs
- **Time to First Project**: < 5 minutes
- **User Satisfaction Score (NPS)**: > 50
- **Support Ticket Resolution**: < 24 hours
- **Template Rating**: Average > 4.0 stars

---

## 🎯 Competitive Advantages

1. **Modern Tech Stack**: Next.js 16, oRPC, Arcjet
2. **Speed**: Project generation < 60 seconds
3. **Security-First**: Built-in protection dengan Arcjet
4. **Developer Experience**: Type-safe end-to-end
5. **Flexible Deployment**: Multiple platforms supported
6. **CLI + Web**: Choose your workflow
7. **Template Marketplace**: Community-driven growth
8. **Fair Pricing**: Generous free tier

---

## 📚 Technical Documentation

### Getting Started
```bash
# Clone monorepo
git clone https://github.com/your-org/launchpad.git

# Install dependencies
pnpm install

# Setup environment variables
cp .env.example .env

# Run database migrations
pnpm db:migrate

# Start development servers
pnpm dev

# Access:
# - Web: http://localhost:3000
# - API: http://localhost:3001
```

### Project Structure
```
launchpad/
├── apps/
│   ├── web/                 # Next.js 16 app
│   │   ├── app/            # App router
│   │   ├── components/     # React components
│   │   └── lib/            # Utilities
│   ├── api/                # Fastify backend
│   │   ├── src/
│   │   │   ├── routes/
│   │   │   ├── services/
│   │   │   └── plugins/
│   ├── cli/                # CLI tool
│   └── worker/             # BullMQ workers
├── packages/
│   ├── database/           # Prisma schema
│   ├── orpc/               # oRPC router
│   ├── ui/                 # Shared components
│   ├── types/              # TypeScript types
│   └── config/             # Shared configs
└── tooling/
    ├── eslint/
    └── typescript/
```

---

## 🔒 Environment Variables

```bash
# App
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000
API_URL=http://localhost:3001

# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/launchpad
REDIS_URL=redis://localhost:6379

# Authentication (Clerk)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_xxx
CLERK_SECRET_KEY=sk_xxx
CLERK_WEBHOOK_SECRET=whsec_xxx

# Security (Arcjet)
ARCJET_KEY=ajkey_xxx

# Storage (Cloudflare R2)
R2_ACCOUNT_ID=xxx
R2_ACCESS_KEY_ID=xxx
R2_SECRET_ACCESS_KEY=xxx
R2_BUCKET_NAME=launchpad-templates

# Integrations
GITHUB_CLIENT_ID=xxx
GITHUB_CLIENT_SECRET=xxx
VERCEL_TOKEN=xxx
STRIPE_SECRET_KEY=sk_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx

# Monitoring
SENTRY_DSN=https://xxx@sentry.io/xxx
LOGTAIL_SOURCE_TOKEN=xxx
```

---

## ✅ Tech Stack Summary

| Category | Technology | Purpose |
|----------|-----------|---------|
| **Frontend** | Next.js 16 | React framework |
| | React 19 | UI library |
| | TypeScript 5.7+ | Type safety |
| | Tailwind CSS 4 | Styling |
| | shadcn/ui | Components |
| **API** | oRPC | Type-safe RPC |
| | Fastify 5 | Backend framework |
| **Security** | Arcjet | Rate limiting, bot detection |
| | Clerk | Authentication |
| | CASL | Authorization |
| **Database** | PostgreSQL 16 | Primary database |
| | Prisma 6 | ORM |
| | Redis 7 | Caching & queue |
| **Storage** | Cloudflare R2 | Object storage |
| **Queue** | BullMQ | Background jobs |
| **Deployment** | Vercel | Frontend hosting |
| | Railway/Fly.io | Backend hosting |
| **Monitoring** | Sentry | Error tracking |
| | Better Stack | Logs |
| **CI/CD** | GitHub Actions | Automation |
| | Turborepo | Monorepo |

---

**Last Updated**: October 2025
**Version**: 1.0.0
