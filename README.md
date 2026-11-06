# RentEase — Smart Rental Property Management System

RentEase is a frontend-only university demonstration for rental discovery and management in Bangladesh. It retains the Horizon Estate site's existing layout, components, typography, colors, and responsive styling while adapting the content and workflows for tenants, landlords, and administrators.

## Run locally

Requirements: Node.js compatible with the installed Next.js version and npm.

```bash
npm install
Copy-Item .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Environment configuration is optional. See [docs/SETUP.md](docs/SETUP.md) for Windows and cross-platform commands.

## Roles and routes

- Public: `/`, `/properties`, `/properties/[slug]`, `/about`, `/contact`
- Authentication: `/login`, `/register`
- Tenant: `/tenant/dashboard`, `/tenant/applications`, `/tenant/rental`, `/tenant/payments`, `/tenant/maintenance`
- Landlord: `/landlord/dashboard`, `/landlord/properties`, `/landlord/properties/add`, `/landlord/tenants`, `/landlord/rent-collection`, `/landlord/maintenance`, `/landlord/applications`
- Administrator: `/admin/dashboard`, `/admin/users`, `/admin/properties`, `/admin/applications`, `/admin/reports`

Protected dashboard layouts check the locally stored demo session and redirect users to their role's dashboard. This is a front-end demonstration, not production access control.

## Demo accounts

The login page's Demo access controls can fill these sample credentials:

| Role | Email | Password |
|---|---|---|
| Tenant | `tenant@rentease.demo` | `Tenant123!` |
| Landlord | `landlord@rentease.demo` | `Landlord123!` |
| Administrator | `admin@rentease.demo` | `Admin123!` |

Use only these illustrative credentials; do not enter a real password or confidential data.

## Persistence

The typed seed records live in `src/data/rentease.ts`; browser persistence and session helpers live in `src/lib/demo-store.ts`. On first use, the store copies the seed into `localStorage` under `rentease-demo-data`. It preserves later edits, migrates older records to include notifications, and restores the sample records when saved JSON is malformed or has an unsupported shape. Session storage keeps only the current user ID, in local storage when “Remember me” is selected, or in session storage otherwise.

Profiles, listings, applications, rental agreements, rent and utility payment records, maintenance requests, and notifications are saved in one shared data object. Updates dispatch a same-tab event and browser storage events refresh open tabs. Use **Reset demo data** in the dashboard profile menu and confirm to restore original records and sign out.

Local storage is limited to one browser profile and device, can be cleared by browser settings, and is editable by the user. Demo authentication stores sample account data and is not secure; payments, messaging, listings, and tenancy are not connected to real services. No backend or database is used.

## Quality checks

```bash
npm run lint
npx tsc --noEmit
npm run build
```

Feature details, data limitations, setup, structure, and development notes are in the [documentation index](docs/PROJECT_OVERVIEW.md#documentation).
