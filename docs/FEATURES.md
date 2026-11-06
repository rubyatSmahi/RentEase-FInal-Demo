# Features

## Public website

- Homepage retains its existing section order and visual composition while presenting RentEase rental content.
- Properties catalog filters available, approved listings by search text, city, home type, bedrooms, bathrooms, and maximum monthly rent; supports sorting and grid/list views.
- Property detail pages show sample rent, amenities, location, and application controls.
- About and contact routes describe the demo; the contact form validates input and provides local confirmation without sending a message.

## Authentication

- Tenant and landlord registration and demo account login.
- Demo access controls for seeded tenant, landlord, and administrator accounts.
- Session persistence follows the Remember me choice.
- Role-specific dashboards redirect users to their own role route and include logout.
- This is client-side demo authentication, not production security.

## Tenant dashboard

- Overview of active rental, applications, upcoming payments, and maintenance.
- Application status tracking.
- Rental agreement details.
- Rent and utility bill records with a local-only demo payment action and receipt download.
- Maintenance request submission and status tracking.

## Landlord dashboard

- Overview of listings, occupancy, current tenants, and paid rent totals.
- Add/edit property listings; new listings await administrator review.
- Tenant and rental information, rent collection with a demo mark-received action, application review, and maintenance status updates.

## Administrator dashboard

- Overview metrics and report filtering/export.
- User profile edits and account suspension/activation.
- Property listing review, approval/rejection, and archive action.
- Application status administration.

## Shared demo data

Application, tenancy, payment, listing, maintenance, and notification updates operate on shared browser records. The public listing pages and role dashboards refresh from the same data. The seed includes illustrative Bangladeshi names and properties in Dhaka, Chattogram, and Sylhet, with BDT rent amounts.

## Limitations

All data and authentication are simulated in the browser. No backend, remote multi-user synchronization, real payment processing, messaging, or listing verification is included. Data is limited to the browser profile and can be edited or cleared by the user.
