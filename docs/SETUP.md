# Setup

## Requirements

- Node.js supported by the installed Next.js 16 release.
- npm (the repository includes `package-lock.json`).

## Install and run

```powershell
npm install
Copy-Item .env.example .env.local
npm run dev
```

Open `http://localhost:3000`. To use Command Prompt instead of PowerShell, copy the example with `copy .env.example .env.local`. On macOS/Linux, use `cp .env.example .env.local`.

The environment file is optional. `NEXT_PUBLIC_SITE_URL` configures the public metadata, `robots.txt`, and sitemap base URL; its default is `https://rentease.demo`. For local development, set it to `http://localhost:3000`.

## Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Start the Next.js development server. |
| `npm run lint` | Run ESLint. |
| `npm run build` | Create the production build. |
| `npm run start` | Serve a previously built application. |

## Demo access

Open `/login` and use the Demo access buttons:

| Role | Email | Password |
|---|---|---|
| Tenant | `tenant@rentease.demo` | `Tenant123!` |
| Landlord | `landlord@rentease.demo` | `Landlord123!` |
| Admin | `admin@rentease.demo` | `Admin123!` |

Registration creates a local tenant or landlord sample account. Admin account creation is available only through the included seed account.

## Persistence and reset

The application uses JavaScript with JSX in `.js` files. The `jsconfig.json` file configures the `@/` alias for imports from `src/`. The application has no backend. Sample records are initialized from `src/data/rentease.js` on first browser access and stored under `rentease-demo-data`; session identity is stored under `rentease-demo-session`. Open a dashboard profile menu and choose **Reset demo data** to restore the seed and sign out. Reset requires confirmation.

Browser storage is local to the current browser profile, is not synchronized to other devices, can be cleared by the user, and must not contain real credentials or sensitive information. See [Project overview](PROJECT_OVERVIEW.md#data-persistence) for record and synchronization details.
