# Kraaft - All In One Tools

All In One Tools is a monorepo web platform for free browser-based utilities across productivity, developer, PDF, media, and everyday categories.

## Live Website

[Visit Kraaft](https://kraaft.manieshsanwal.in)

[![Kraaft Website Preview](apps/web/public/image.png)](https://kraaft.manieshsanwal.in)

The web app is built with Next.js and a shared UI package, and currently includes:
- Category and tool discovery (`36` categories)
- Registry-driven tool routing (`300+` tools listed, `110+` live and fully functional)
- Auth system (email/password + Google OAuth)
- Saved tool outputs for authenticated users
- Tool pinning per user

## Tech Stack

### Core
- Next.js 16 (App Router, Turbopack in dev)
- React 19
- TypeScript
- Tailwind CSS v4
- shadcn/ui (via shared `@workspace/ui` package)
- Turborepo
- MongoDB + Mongoose
- JWT auth (access + refresh token flow)
- Zod validation
- Framer Motion

### Specialized Libraries
- **PDF**: `pdf-lib`, `pdfjs-dist`, `@pdfsmaller/pdf-encrypt-lite`
- **Data & Files**: `papaparse` (CSV), `js-yaml` (YAML), `jszip` (ZIP)
- **Visuals**: `qrcode.react`, `jsbarcode`, `lucide-react`, `@phosphor-icons/react`
- **Content**: `marked` (Markdown)
- **Security**: `bcryptjs`, `jsonwebtoken`
- **Communication**: `nodemailer` (SMTP/Email)
- **Networking**: `rdap` protocol integration
- **Media**: `exifreader` (EXIF metadata)

## Monorepo Structure

```text
apps/
  web/                  # Next.js application
packages/
  ui/                   # Shared UI components/styles/hooks
  eslint-config/        # Shared ESLint configs
  typescript-config/    # Shared tsconfig presets
```

## Prerequisites

- Node.js `>=20`
- npm (project uses npm workspaces and Turborepo)

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create `apps/web/.env.local`:
   ```env
   MONGODB_URI=

   ACCESS_TOKEN_SECRET=
   REFRESH_TOKEN_SECRET=
   ACCESS_TOKEN_EXPIRES_IN=15m
   REFRESH_TOKEN_EXPIRES_IN=7d

   SMTP_HOST=
   SMTP_PORT=587
   SMTP_USER=
   SMTP_PASS=
   EMAIL_FROM=

   NEXT_PUBLIC_APP_URL=http://localhost:3000
   NEXT_PUBLIC_GOOGLE_CLIENT_ID=
   ```

3. Start development:
   ```bash
   npm run dev
   ```

4. Open `http://localhost:3000`.

## Scripts (Root)

- `npm run dev` - Run all workspace dev tasks through Turbo
- `npm run build` - Production build
- `npm run lint` - Lint all workspaces
- `npm run typecheck` - Type-check all workspaces
- `npm run format` - Format all workspaces

## App Highlights

- **Active Categories Built!**
  - **Clock & Time**: World Clocks, Timers, Sunrise/Sunset calculators.
  - **Weather**: Forecasts, Air Quality, Wind Speed Compasses, Widget Generators.
  - **To-Do & Tasks**: Smart local-storage To-Do lists, Grocery planners, Kanban boards, Priority Matrices.
  - **Text & Writing**: Diff Checkers, Base Converters, Fancy Styling, Flesch-Kincaid Readability Analyzers.
  - **Converters & Calculators**: Live global Currency Exchange fetching, Unit Mapping, Statistics, Mifflin-St Jeor TDEE parsing.
  - **Image Tools**: Format Converter, Compressor, Resizer, Watermark Adder, Color Picker, **Bulk Renamer**, **EXIF Viewer**.
  - **Social Media**: Social Image Resizer (9 platform presets), **YouTube Title Tester**, **Instagram Caption Formatter**.
  - **Design & Color**: Placeholder Image Generator, Gradient Builder, Contrast Checker, Color Palette Generator, **Font Pairing Suggester**.
  - **SEO & Web Tools**: Meta Tag Generator, Robots.txt Generator, **Sitemap Generator**, **Domain Age Checker**, **Website Screenshot**.
- Dynamic category page: `apps/web/app/[category]/page.tsx`
- Dynamic tool page: `apps/web/app/[category]/[tool]/page.tsx`
- Tool registry: `apps/web/lib/tools-registry.ts`
- Category registry: `apps/web/lib/categories.ts`
- Search index logic: `apps/web/lib/search.ts`
- Live example tool: `apps/web/components/tools/pdf/pdf-merger-tool.tsx`

## Authentication and Data

Implemented API routes include:
- `/api/auth/register`, `/api/auth/login`, `/api/auth/google`
- `/api/auth/verify`, `/api/auth/refresh`, `/api/auth/logout`, `/api/auth/me`
- `/api/saved-data`
- `/api/user/pinned`

Auth supports:
- Local registration with email verification
- Google sign-in
- JWT access tokens + refresh token cookie flow

## Adding a New Live Tool

1. Add tool metadata to `apps/web/lib/tools-registry.ts` (`status: "live"`).
2. Create tool component under `apps/web/components/tools/<category>/`.
3. Wire rendering logic in `apps/web/app/[category]/[tool]/page.tsx`.
4. If persistence is needed, integrate with `/api/saved-data`.

## shadcn/ui Usage

For app-level components:
```bash
npx shadcn@latest add <component-name> -c apps/web
```

For shared UI package updates, add/edit components in `packages/ui/src/components`.

## Security Notes

- Never commit real secrets in `.env.local`.
- Rotate credentials immediately if any secret is exposed.
- Prefer keeping `.env.local` local-only and using deployment environment variables for production.

## Support

If you want to support the project, use the donation section on the home page (`/#donate`).

UPI ID used in-app: `kraaft@ptaxis`.
