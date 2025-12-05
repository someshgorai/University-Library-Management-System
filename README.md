### Library Management System

Modern web application for managing a university/college library: user authentication, browsing/searching books, borrowing records, and admin features. Built with Next.js App Router, TypeScript, Drizzle ORM (PostgreSQL/Neon), and Upstash services for rate limiting, workflows, and Redis. Image hosting is handled via ImageKit, and transactional emails via Resend (through Upstash QStash).

Open http://localhost:3000 to access the app in development.

#### Live Demo
- Deployed app: https://university-library-management-system-nmkntzmcl.vercel.app/

---

#### Tech Stack
- Next.js 15 (App Router) + React 19 + TypeScript
- Tailwind CSS
- Drizzle ORM with PostgreSQL (Neon Serverless driver)
- NextAuth v5 (Credentials provider)
- Upstash: Redis, Ratelimit, Workflow, QStash
- ImageKit for media hosting
- Resend for email (via QStash integration)

---

### Requirements
- Node.js 18.18+ (recommended: 20 LTS)
- npm (this repo includes a package-lock.json; npm is assumed)
- PostgreSQL database (Neon recommended) with a connection URL
- Upstash accounts for Redis and QStash (optional only if related features are used)
- ImageKit account (for image upload/serving)
- Resend account/token (for emails)

---

### Project Structure

```
library-management-system/
  app/                      # Next.js App Router pages/layouts and API routes
    (root)/                 # Public routes (home, search, book details, profile)
    (auth)/                 # Auth pages (sign-in)
    admin/                  # Admin UI
    api/                    # Route handlers (REST-like endpoints & workflows)
  components/               # UI and feature components
  database/                 # Drizzle config: schema.ts, drizzle.ts, seed.ts, redis.ts
  drizzle/                  # Drizzle migrations output (generated)
  lib/                      # Utilities: config, actions, ratelimit, workflow, etc.
  public/                   # Static assets (if any)
  styles/                   # Tailwind/global styles
  types.d.ts                # Shared types
  auth.ts                   # NextAuth v5 configuration (Credentials)
  drizzle.config.ts         # Drizzle Kit configuration
  next.config.ts            # Next.js configuration
  package.json              # Scripts and dependencies
```

Notable entry points
- App Router pages: files under `app/**/page.tsx`
- API routes: files under `app/api/**/route.ts` (e.g., `api/books`, `api/workflows/*`)
- Auth handler: `auth.ts` (exported handlers used by NextAuth route)

---

### Environment Variables
Create a `.env.local` file at the project root with the following keys as needed. Only set what you actually use in your environment.

Public app/API endpoints
- `NEXT_PUBLIC_API_ENDPOINT` — Base URL for the app API in development (used by workflows/clients)
- `NEXT_PUBLIC_PROD_API_ENDPOINT` — Base URL for the app API in production (used by workflows/clients)

Database
- `DATABASE_URL` — Postgres connection string (Neon serverless supported). Used by Drizzle ORM and Drizzle Kit.

ImageKit
- `NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY` — Public key
- `NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT` — Public URL endpoint
- `IMAGEKIT_PRIVATE_KEY` — Private key (server-side)

Upstash / QStash / Redis
- `UPSTASH_REDIS_REST_URL` — Redis REST URL
- `UPSTASH_REDIS_REST_TOKEN` — Redis REST token
- `QSTASH_URL` — Upstash QStash base URL
- `QSTASH_TOKEN` — Upstash QStash token

Email (Resend)
- `RESEND_TOKEN` — Resend API token (used via QStash provider)

Auth / Security
- `PASSWORD_SALT_ROUNDS` — Number of bcrypt salt rounds for password hashing
- TODO: NextAuth requires a secret in production (`AUTH_SECRET`). Define this before deploying.

Notes
- `drizzle.config.ts` loads `.env.local` to access `DATABASE_URL` for generate/migrate commands.
- `next.config.ts` allows external images from `placehold.co`, `m.media-amazon.com`, and `ik.imagekit.io`.

---

### Setup
1. Install dependencies
   ```bash
   npm install
   ```
2. Create `.env.local` and fill in required environment variables (see above).
3. Generate and apply database migrations (Drizzle)
   ```bash
   # Generate SQL from schema changes
   npm run db:generate
   # Apply migrations to the database
   npm run db:migrate
   # (Optional) Open Drizzle Studio
   npm run db:studio
   ```
4. Seed sample data (optional)
   ```bash
   npm run seed
   ```

---

### Running

Development
```bash
npm run dev
```
Open http://localhost:3000

Production
```bash
npm run build
npm start
```

Lint
```bash
npm run lint
```

---

### Available Scripts
- `dev` — Start Next.js in development with Turbopack
- `build` — Build the production bundle
- `start` — Start the production server
- `lint` — Run ESLint
- `seed` — Run database seeding script (`database/seed.ts`)
- `db:generate` — Generate Drizzle migrations from `database/schema.ts`
- `db:migrate` — Apply Drizzle migrations
- `db:studio` — Open Drizzle Studio UI

---

### Tests
No automated tests are configured yet. TODO:
- Add a testing framework (e.g., Vitest or Jest + React Testing Library)
- Set up basic unit/integration tests for critical modules (auth, actions, API routes)

---

### Deployment
- This is a standard Next.js application. It can be deployed to platforms that support Node.js servers (e.g., Vercel, Render, Fly.io, AWS, etc.).
- Image domains must be allowed in `next.config.ts`.
- TODO: Confirm deployment target and add provider-specific steps (including required env vars like `AUTH_SECRET`).

---

### Additional Resources
- Next.js Docs: https://nextjs.org/docs
- Learn Next.js: https://nextjs.org/learn
- Drizzle ORM: https://orm.drizzle.team/
- Upstash QStash: https://upstash.com/docs/qstash
- Upstash Redis/Ratelimit: https://upstash.com/docs/redis
- ImageKit: https://docs.imagekit.io/
- Resend: https://resend.com/docs

---

### License
This project is licensed under the MIT License.

MIT License Copyright (c) 2025 SOMESH GORAI

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

