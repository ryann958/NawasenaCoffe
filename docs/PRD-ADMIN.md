# TASK: Implement Nawasena Coffee Admin Dashboard

You are working on an existing Nawasena Coffee website project.

Your task is to implement a complete Admin Dashboard as an additional feature. The existing public-facing website has already been designed and implemented.

## 1. Critical Instructions

**DO NOT rebuild, redesign, or replace the existing public website.**

The current public website is already approved. Preserve its:
- Visual design and branding.
- Layout and section structure.
- Typography and color palette.
- Hero section and animations.
- Responsive behavior.
- Existing interactions and navigation.

Only modify existing public website code when strictly necessary to connect its content to the backend/database.

Do not add an Admin button, Admin link, or Admin navigation item anywhere on the public website.

Admin access must only be available through manually entering the dedicated URL.

## 2. Read Project Documentation First

Before writing or modifying code:

1. Read `docs/PRD.md`.
2. Read `docs/IMPLEMENTATION.md`.
3. Read `docs/PRD-ADMIN.md`.
4. Inspect the complete existing project structure.
5. Inspect all existing HTML, CSS, JavaScript, configuration, and data modules.
6. Understand the current implementation before making changes.

Do not assume the existing architecture. Verify it first.

## 3. Admin Routing

Implement the following routes:

- `/admin` — Admin entry point.
- `/admin/login` — Admin login page.
- `/admin/dashboard` — Protected dashboard.

Behavior:
- Unauthenticated users visiting `/admin` must be redirected to `/admin/login`.
- Authenticated admins visiting `/admin` or `/admin/login` must be redirected to `/admin/dashboard`.
- Unauthenticated users must never be able to access protected dashboard content.
- Handle invalid and expired sessions correctly.
- Do not expose dashboard navigation on the public website.

Ensure the routing works with the project's actual hosting configuration. Do not assume that arbitrary routes work on static hosting without configuring rewrites or equivalent routing.

## 4. Technology

Keep the existing public website technology:

- HTML
- CSS
- Vanilla JavaScript

Use:
- Supabase PostgreSQL for database.
- Supabase Auth for authentication.
- Supabase Storage for images.
- Supabase Row Level Security for database access control.

Use a compatible Supabase JavaScript client. Do not introduce an unnecessary frontend framework.

Do not expose Supabase service-role keys or other privileged secrets in frontend code.

Use environment/configuration practices appropriate to the project's hosting platform. Public Supabase configuration may be used in the browser only when RLS and storage policies are correctly configured.

## 5. Admin Dashboard Features

Implement the complete dashboard described in `docs/PRD-ADMIN.md`:

### Dashboard Overview
- Content statistics.
- Recent content activity.
- Quick actions.

### Menu Management
- Create, read, update, and delete menu items.
- Manage menu names, descriptions, prices, categories, images, visibility, availability, and ordering.

### Gallery Management
- Upload one or multiple images.
- Preview images before upload.
- Edit image metadata.
- Delete images.
- Control visibility and ordering.

### Promotions & Events
- CRUD operations.
- Banner image uploads.
- Start and end dates.
- Active/inactive status.
- Visibility controls.

### Testimonials
- CRUD operations.
- Customer name and testimonial content.
- Optional image and source.
- Visibility controls.

### Store Information
- Edit store name, description, address, WhatsApp, email, opening hours, map link, Instagram, GoFood, and GrabFood links.

### Website Settings
- Manage hero content, About content, Coffee Philosophy, footer content, SEO title, SEO description, and social links.

Do not invent real business information. Use empty states or clearly identified placeholder data until the client supplies actual content.

## 6. Authentication and Security

- No public registration.
- Admin accounts must be provisioned securely.
- Implement secure login and logout.
- Use Supabase Auth.
- Protect all admin routes.
- Enforce authorization through database RLS policies, not just frontend checks.
- Public visitors may only read published/public content.
- Only authorized admin accounts may create, update, or delete content.
- Validate inputs on both client and server/database boundaries.
- Validate image type and size.
- Prevent unauthorized storage uploads and deletions.
- Never expose privileged credentials in frontend JavaScript.

Do not consider hiding dashboard pages sufficient security.

## 7. Database and Storage

Create database migrations or SQL setup files for the tables specified in `docs/PRD-ADMIN.md`.

Include:
- Appropriate primary and foreign keys.
- Data types and constraints.
- Timestamps.
- Visibility/publishing fields.
- Ordering fields where needed.
- Indexes where useful.
- Secure RLS policies.
- Storage bucket setup and policies.

Do not silently skip database policies.

Document how to provision the first admin securely without adding public registration.

## 8. Public Website Integration

Connect existing content sections to the database:

- Digital Menu → menu data.
- Gallery → gallery data.
- Promotions → promotion data.
- Testimonials → testimonial data.
- Location & Hours → store settings.
- Hero/About/Footer → website settings.

Preserve the existing HTML structure and visual presentation as much as possible.

Requirements:
- Render data dynamically.
- Maintain the current visual design.
- Handle loading, empty, and error states gracefully.
- Do not let a database failure break the entire public website.
- Do not display unpublished content.
- Avoid unnecessary requests and duplicate data fetching.

## 9. Admin UI Design

The admin dashboard should be professional, responsive, and easy for a non-technical coffee shop owner to use.

Use Nawasena Coffee's existing visual identity:
- Dark brown.
- Warm cream.
- Caramel accent.
- Elegant typography.

The dashboard should have:
- Sidebar navigation on desktop.
- Responsive mobile navigation.
- Clear page titles.
- Consistent forms.
- Confirmation dialogs for destructive actions.
- Success and error feedback.
- Loading states.
- Empty states.
- Image previews.

Keep the admin experience practical and uncluttered.

## 10. Suggested Project Structure

Inspect the current structure before deciding where to place files. Adapt this structure to the actual project rather than duplicating existing files.

Suggested additions:

- `admin/`
  - `index.html`
  - `login.html`
  - `dashboard.html`
  - `css/`
  - `js/`
- `js/services/`
  - Supabase client.
  - Authentication service.
  - Content/data services.
- `supabase/`
  - Database migrations.
  - RLS policies.
  - Storage setup.
- `docs/`
  - Admin setup instructions.
  - Deployment instructions.

Keep public and admin code organized and avoid duplicating shared utilities.

## 11. Development Workflow

Work carefully in phases.

**Phase 0 — Audit and Architecture**
- Inspect the existing project.
- Identify the required changes.
- Propose the database schema and routing architecture.
- Identify hosting requirements and security considerations.
- Do not modify files yet.
- Report your findings and proposed implementation plan.

Wait for approval before proceeding to implementation.

After approval, implement the dashboard and backend integration in manageable phases. Do not attempt to finish everything in one uncontrolled operation.

## 12. Testing and Final Report

Test:

- Admin route access.
- Login/logout.
- Session persistence and expiration.
- Protected routes.
- Database CRUD.
- Image upload and deletion.
- RLS policies.
- Public content rendering.
- Unpublished content filtering.
- Mobile and desktop layouts.
- Existing public website functionality.
- Browser console and network errors.

At the end, report:

1. Files created.
2. Files modified.
3. Database tables and migrations.
4. Storage buckets and policies.
5. Authentication configuration.
6. Environment variables required.
7. Supabase setup instructions.
8. Hosting/deployment configuration.
9. Tests performed and results.
10. Remaining tasks requiring client credentials or actual business information.

**Important: Start with Phase 0 only. Do not modify any files until the audit and implementation plan have been presented and approved.**

Communicate with the project owner in Indonesian. Keep technical implementation clear and document all important decisions.