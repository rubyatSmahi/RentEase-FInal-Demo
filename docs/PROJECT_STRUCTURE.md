# Project structure

```text
src/
├── app/
│   ├── page.tsx                 # Homepage composition
│   ├── layout.tsx               # Shared metadata, font, header, and footer
│   ├── globals.css              # Existing design tokens, utilities, and motion
│   ├── properties/              # Searchable catalog and dynamic detail route
│   ├── about/ contact/          # Public information and contact form
│   ├── login/ register/          # Simulated demo authentication
│   ├── tenant/                  # Tenant dashboard route layouts and pages
│   ├── landlord/                # Landlord dashboard route layouts and pages
│   └── admin/                   # Administrator dashboard route layouts and pages
├── components/
│   ├── layout/                  # Shared public header and footer
│   ├── home/                    # Existing homepage hero, search, and property sections
│   ├── properties/              # Catalog filtering and property detail interactions
│   ├── dashboard/               # Shared role-aware dashboard workflows
│   ├── auth/                    # Login and registration forms
│   └── ui/                      # Existing property cards and shared UI elements
├── data/
│   └── rentease.ts              # Demo types, Bangladesh sample records, and credentials
└── lib/
    └── demo-store.ts            # Centralized localStorage/session persistence
```

Additional project files:

- `public/images/` contains the bundled sample property and page photography used by existing components.
- `docs/` contains setup, feature, structure, overview, and development documentation.
- `next.config.ts`, `tsconfig.json`, and `package.json` define the Next.js, TypeScript, and package scripts configuration.

All tenant, landlord, and admin route pages are composed inside their role layout and reuse `DashboardApp`; the page files provide route boundaries rather than separate dashboard templates.
