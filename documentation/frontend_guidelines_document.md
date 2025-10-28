# Frontend Guideline Document

This document outlines the frontend architecture, design principles, and technologies used in the **`launchpad-fullstack-starter`** project. It is written in plain language so anyone can understand how the frontend is set up and why.

---

## 1. Frontend Architecture

**Frameworks & Libraries**
- **Next.js (App Router)**: Provides a unified place for pages, API routes, and layouts. We use server and client components to keep pages fast and SEO-friendly.
- **React & TypeScript**: Ensures type safety across UI code and API calls, reducing runtime errors and improving developer experience.
- **shadcn/ui**: A set of accessible, customizable UI primitives built on Radix UI.
- **Tailwind CSS v4**: A utility-first CSS framework for rapid, consistent styling without writing custom CSS from scratch.
- **Better Auth**: Handles user sign-up, login, session persistence, and role-based access control out of the box.

**How It Supports Scalability, Maintainability & Performance**
- **File-based Routing & Layouts**: Next.js App Router organizes pages under `/app`, making it easy to add new sections (e.g., dashboard, templates, settings) without boilerplate.
- **Server & Client Components**: Data-heavy logic runs on the server, keeping JavaScript payloads small. Interactive bits are isolated in client components.
- **TypeScript Everywhere**: Shared type definitions between frontend and backend (API routes, database schemas) eliminate guesswork and speed up refactors.
- **Utility CSS**: Tailwind’s atomic classes prevent style duplication and make global theming straightforward via `tailwind.config.js`.
- **Modular UI Primitives**: shadcn/ui components follow best practices (accessibility, theming), so features like forms, tables, and dialogs can be composed reliably.

---

## 2. Design Principles

1. **Usability**
   - Clear, consistent navigation patterns (sidebar, breadcrumbs) so users know where they are.
   - Forms with inline validation and helpful error messages.
   - Progressive disclosure: showing only what’s needed at each step of the template builder.

2. **Accessibility**
   - All interactive elements (buttons, links, form fields) use semantic HTML.
   - Keyboard-navigable UI and focus states provided by Radix-based shadcn/ui components.
   - Color contrast ratios meet WCAG AA standards.

3. **Responsiveness**
   - Mobile-first layout using Tailwind’s responsive utilities (`sm:`, `md:`, `lg:`).  
   - Flexible grid and flexbox patterns to adapt tables, forms, and dashboards to smaller screens.

4. **Consistency**
   - Reuse shared components (buttons, inputs, cards) across all pages.
   - Shared design tokens (colors, spacing, typography) live in `tailwind.config.js`.

---

## 3. Styling and Theming

**Styling Approach**
- **Tailwind CSS v4** for utility classes (e.g., `px-4`, `text-gray-700`, `bg-primary-500`).
- No separate SASS/LESS—custom styles go in small, component-scoped CSS files or inline via Tailwind.
- Use [class variance authority (CVA)](https://github.com/joe-bell/cva) patterns (optional) to manage complex class combinations.

**Theming**
- Centralized theme configuration in `tailwind.config.js` under `theme.extend`:
  - Colors, font sizes, spacing.
  - Light and dark mode enabled via `media` or `class` strategy.
- Use CSS variables (e.g., `--primary`, `--background`) for runtime theme switching if needed.

**Visual Style**
- **Style**: Modern flat design with subtle shadows and rounded corners (think a clean SaaS dashboard).
- **Color Palette**:
  - Primary: `#3B82F6` (blue-500)
  - Secondary: `#6366F1` (indigo-500)
  - Accent: `#14B8A6` (teal-500)
  - Neutral 100–900: `#F9FAFB` → `#111827` (gray scale)
  - Success: `#10B981` (green-500)
  - Warning: `#F59E0B` (amber-500)
  - Danger:  `#EF4444` (red-500)

**Typography**
- **Font Family**: Inter, system-fallback (`font-sans` in Tailwind).
- **Headings**: Clear hierarchy with `text-xl` → `text-3xl`, consistent font weights.
- **Body Text**: `text-base` with `leading-relaxed` spacing.

---

## 4. Component Structure

- **Organization**:
  - `/components/ui/`: Reusable primitives (Button, Input, Card, Modal).
  - `/components/dashboard/`: Higher-level composites (TemplateList, ProjectForm).
  - `/app/dashboard/`: Pages that assemble composites into full screens.

- **Best Practices**:
  - **Single Responsibility**: Each component does one thing (e.g., `Avatar` just shows a user avatar).
  - **Props-driven**: Configurable via props, minimal internal state.
  - **Composition**: Build complex UIs by nesting smaller primitives.

- **Benefits**:
  - Changes in a single primitive propagate everywhere.
  - Easy to test, document, and maintain individual components.
  - New features reuse existing building blocks, speeding development.

---

## 5. State Management

- **Local State**: React’s `useState` and `useReducer` inside client components for UI interactions (form inputs, modal open/close).

- **Global State**:
  - **Authentication Context**: Better Auth provides hooks/context to access `user` and `session` data anywhere.
  - **Custom React Context** can be added for shared UI state (e.g., theme toggle) if needed.

- **Data Fetching**:
  - Server components fetch data via async calls to API routes, reducing the need for client caching.
  - **Client-side Fetching**: Use built-in `fetch` in client components or integrate a library like SWR/React Query for caching and mutation if your feature demands it.

---

## 6. Routing and Navigation

- **File-based Routing**: Every folder under `/app` becomes a route. Example:
  - `/app/page.tsx` → `/`
  - `/app/dashboard/page.tsx` → `/dashboard`
  - `/app/dashboard/templates/[id]/page.tsx` → `/dashboard/templates/:id`

- **Layouts**:
  - Shared `layout.tsx` files wrap nested pages with common UI (e.g., sidebar, header).

- **Client-side Navigation**:
  - Use Next.js `<Link>` and `useRouter()` for programmatic transitions.
  - Preserve scroll position and loading states with `useTransition` for smooth UX.

---

## 7. Performance Optimization

- **Server Components**: Render static or data-fetched parts on the server to minimize client bundle size.
- **Code Splitting & Dynamic Imports**: Load heavy components (e.g., rich text editors) only when needed:
  ```jsx
  const RichEditor = dynamic(() => import('../components/RichEditor'), { ssr: false });
  ```
- **Image Optimization**: Use `next/image` for automatic resizing, format selection, and lazy loading.
- **Asset Compression**: Tailwind’s JIT compiler purges unused CSS in production. Next.js bundles and minifies JS.
- **Caching & CDN**: Leverage Next.js’s built-in caching headers and deploy behind a CDN for static assets.

---

## 8. Testing and Quality Assurance

**Unit Tests**
- **Framework**: Vitest + React Testing Library.
- **Scope**: Test individual components for rendering and behavior (e.g., Button click triggers callback).

**Integration Tests**
- **Framework**: Jest or Vitest with `msw` (Mock Service Worker).
- **Scope**: Test API interactions and component integration (e.g., form submits data and displays success).

**End-to-End Tests**
- **Framework**: Playwright or Cypress.
- **Scope**: Critical user flows:
  - User sign-up, login, logout.
  - Create, edit, and delete a template.
  - Generate a project and confirm notification appears.

**Linting & Formatting**
- **ESLint** with Next.js and Tailwind plugins to enforce code quality.
- **Prettier** for consistent code style across JS/TS, CSS, MD files.

---

## 9. Conclusion and Overall Frontend Summary

The frontend of **`launchpad-fullstack-starter`** is built on a modern, scalable foundation:
- Next.js App Router unifies pages, API routes, and layouts.
- TypeScript and shared types keep client and server in sync.
- Tailwind CSS and shadcn/ui accelerate UI development with consistency and accessibility.
- Built-in performance optimizations (server components, code splitting) ensure fast load times.
- A clear testing strategy (unit, integration, E2E) safeguards reliability as the codebase grows.

Together, these guidelines ensure that anyone working on this project can add features confidently, uphold quality standards, and deliver a polished, user-friendly interface for the LaunchPad platform.