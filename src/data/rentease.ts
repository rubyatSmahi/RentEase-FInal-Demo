export type UserRole = 'tenant' | 'landlord' | 'admin';
export type ApplicationStatus = 'Pending' | 'Approved' | 'Rejected' | 'Cancelled';
export type MaintenanceStatus = 'Open' | 'In progress' | 'Resolved';

export interface DemoUser {
  id: string;
  name: string;
  email: string;
  password: string;
  phone: string;
  role: UserRole;
  status: 'Active' | 'Suspended';
}

export interface RentalProperty {
  id: string;
  slug: string;
  title: string;
  type: 'Apartment' | 'House' | 'Studio';
  address: string;
  city: string;
  rent: number;
  bedrooms: number;
  bathrooms: number;
  area: number;
  image: string;
  landlordId: string;
  availability: 'Available' | 'Occupied' | 'Archived';
  approval: 'Approved' | 'Pending' | 'Rejected';
  description: string;
  amenities: string[];
  availableFrom: string;
}

export interface RentalApplication {
  id: string;
  tenantId: string;
  propertyId: string;
  submittedAt: string;
  status: ApplicationStatus;
  message: string;
}

export interface RentalAgreement {
  id: string;
  tenantId: string;
  propertyId: string;
  startDate: string;
  endDate: string;
  rent: number;
  status: 'Active' | 'Ending soon' | 'Ended';
}

export interface DemoPayment {
  id: string;
  rentalId: string;
  kind: 'Rent' | 'Water' | 'Electricity' | 'Internet';
  amount: number;
  dueDate: string;
  status: 'Paid' | 'Due' | 'Overdue';
  paidAt?: string;
}

export interface MaintenanceRequest {
  id: string;
  tenantId: string;
  propertyId: string;
  category: string;
  description: string;
  priority: 'Low' | 'Normal' | 'Urgent';
  status: MaintenanceStatus;
  submittedAt: string;
}

export interface DemoNotification {
  id: string;
  userId: string;
  message: string;
  href: string;
  createdAt: string;
  readAt?: string;
}

export interface DemoData {
  users: DemoUser[];
  properties: RentalProperty[];
  applications: RentalApplication[];
  rentals: RentalAgreement[];
  payments: DemoPayment[];
  maintenance: MaintenanceRequest[];
  notifications: DemoNotification[];
}

export const demoAccounts = [
  { role: 'tenant', email: 'tenant@rentease.demo', password: 'Tenant123!' },
  { role: 'landlord', email: 'landlord@rentease.demo', password: 'Landlord123!' },
  { role: 'admin', email: 'admin@rentease.demo', password: 'Admin123!' },
] as const;

export const seedDemoData: DemoData = {
  users: [
    { id: 'tenant-1', name: 'Nusrat Jahan', email: demoAccounts[0].email, password: demoAccounts[0].password, phone: '+880 1712-345678', role: 'tenant', status: 'Active' },
    { id: 'landlord-1', name: 'Farhan Ahmed', email: demoAccounts[1].email, password: demoAccounts[1].password, phone: '+880 1812-345678', role: 'landlord', status: 'Active' },
    { id: 'admin-1', name: 'Samira Rahman', email: demoAccounts[2].email, password: demoAccounts[2].password, phone: '+880 1912-345678', role: 'admin', status: 'Active' },
    { id: 'tenant-2', name: 'Tanvir Hasan', email: 'tanvir@example.com', password: 'Demo123!', phone: '+880 1612-345678', role: 'tenant', status: 'Active' },
    { id: 'landlord-2', name: 'Rashida Karim', email: 'rashida@example.com', password: 'Demo123!', phone: '+880 1512-345678', role: 'landlord', status: 'Active' },
  ],
  properties: [
    { id: 'property-1', slug: 'gulshan-garden-residence', title: 'Gulshan Garden Residence', type: 'Apartment', address: 'House 18, Road 42, Gulshan 2', city: 'Dhaka', rent: 68000, bedrooms: 3, bathrooms: 3, area: 1850, image: '/images/properties/serenity-tower.jpg', landlordId: 'landlord-1', availability: 'Occupied', approval: 'Approved', description: 'A bright, well-kept family apartment on a quiet Gulshan street, close to parks, schools and everyday conveniences.', amenities: ['Lift', 'Generator', 'Security', 'Parking', 'Balcony'], availableFrom: '2026-12-01' },
    { id: 'property-2', slug: 'banani-lakeview-flat', title: 'Banani Lakeview Flat', type: 'Apartment', address: 'House 7, Road 11, Banani', city: 'Dhaka', rent: 52000, bedrooms: 3, bathrooms: 2, area: 1550, image: '/images/properties/belgrave-penthouse.jpg', landlordId: 'landlord-1', availability: 'Available', approval: 'Approved', description: 'Comfortable city living with generous rooms and a balcony overlooking a leafy residential lane.', amenities: ['Lift', 'Generator', 'Security', 'Balcony'], availableFrom: '2026-11-15' },
    { id: 'property-3', slug: 'dhanmondi-family-home', title: 'Dhanmondi Family Home', type: 'Apartment', address: 'House 32, Road 8/A, Dhanmondi', city: 'Dhaka', rent: 42000, bedrooms: 3, bathrooms: 2, area: 1420, image: '/images/properties/ocean-breeze-retreat.jpg', landlordId: 'landlord-2', availability: 'Occupied', approval: 'Approved', description: 'A welcoming, sunlit home close to Dhanmondi Lake, local markets and public transport.', amenities: ['Lift', 'Generator', 'Security', 'Play area'], availableFrom: '2026-11-01' },
    { id: 'property-4', slug: 'uttara-modern-apartment', title: 'Uttara Modern Apartment', type: 'Apartment', address: 'Sector 4, Road 12, Uttara', city: 'Dhaka', rent: 32000, bedrooms: 2, bathrooms: 2, area: 1120, image: '/images/properties/azura-villa.jpg', landlordId: 'landlord-2', availability: 'Available', approval: 'Approved', description: 'A practical, airy apartment in a well-connected Uttara neighborhood with thoughtful building amenities.', amenities: ['Lift', 'Security', 'Parking', 'Balcony'], availableFrom: '2026-11-10' },
    { id: 'property-5', slug: 'chattogram-hill-residence', title: 'Chattogram Hill Residence', type: 'Apartment', address: 'Road 3, Khulshi, Panchlaish', city: 'Chattogram', rent: 38000, bedrooms: 3, bathrooms: 2, area: 1380, image: '/images/properties/mountain-lodge.jpg', landlordId: 'landlord-1', availability: 'Available', approval: 'Approved', description: 'A peaceful residence in Khulshi with open views, family-friendly surroundings and easy access to the city.', amenities: ['Lift', 'Generator', 'Security', 'Parking'], availableFrom: '2026-11-20' },
    { id: 'property-6', slug: 'sylhet-riverside-home', title: 'Sylhet Riverside Home', type: 'House', address: 'Block C, Shahjalal Upashahar', city: 'Sylhet', rent: 28000, bedrooms: 3, bathrooms: 2, area: 1600, image: '/images/properties/comporta-beach-house.jpg', landlordId: 'landlord-2', availability: 'Available', approval: 'Approved', description: 'A standalone home with a small garden in a calm neighborhood, suited to families who want more room.', amenities: ['Garden', 'Parking', 'Balcony', 'Security'], availableFrom: '2026-12-01' },
    { id: 'property-7', slug: 'mirpur-compact-studio', title: 'Mirpur Compact Studio', type: 'Studio', address: 'Section 10, Mirpur', city: 'Dhaka', rent: 18000, bedrooms: 1, bathrooms: 1, area: 620, image: '/images/properties/tulum-eco-retreat.jpg', landlordId: 'landlord-1', availability: 'Available', approval: 'Approved', description: 'A tidy, budget-friendly studio near transit, shops and essential services.', amenities: ['Lift', 'Security', 'Generator'], availableFrom: '2026-11-08' },
  ],
  applications: [
    { id: 'application-1', tenantId: 'tenant-1', propertyId: 'property-2', submittedAt: '2026-10-28', status: 'Pending', message: 'I am looking for a long-term home close to my workplace.' },
    { id: 'application-2', tenantId: 'tenant-2', propertyId: 'property-5', submittedAt: '2026-10-21', status: 'Pending', message: 'My family is relocating to Chattogram next month.' },
  ],
  rentals: [
    { id: 'rental-1', tenantId: 'tenant-1', propertyId: 'property-1', startDate: '2026-01-01', endDate: '2026-12-31', rent: 68000, status: 'Active' },
    { id: 'rental-2', tenantId: 'tenant-2', propertyId: 'property-3', startDate: '2026-04-01', endDate: '2027-03-31', rent: 42000, status: 'Active' },
  ],
  payments: [
    { id: 'payment-1', rentalId: 'rental-1', kind: 'Rent', amount: 68000, dueDate: '2026-11-05', status: 'Due' },
    { id: 'payment-2', rentalId: 'rental-1', kind: 'Electricity', amount: 2850, dueDate: '2026-10-25', status: 'Paid', paidAt: '2026-10-23' },
    { id: 'payment-3', rentalId: 'rental-1', kind: 'Water', amount: 650, dueDate: '2026-10-25', status: 'Paid', paidAt: '2026-10-23' },
    { id: 'payment-4', rentalId: 'rental-1', kind: 'Rent', amount: 68000, dueDate: '2026-10-05', status: 'Paid', paidAt: '2026-10-03' },
    { id: 'payment-5', rentalId: 'rental-2', kind: 'Rent', amount: 42000, dueDate: '2026-11-05', status: 'Due' },
    { id: 'payment-6', rentalId: 'rental-2', kind: 'Internet', amount: 1200, dueDate: '2026-11-08', status: 'Due' },
  ],
  maintenance: [
    { id: 'maintenance-1', tenantId: 'tenant-1', propertyId: 'property-1', category: 'Plumbing', description: 'The kitchen tap is leaking and needs a washer replacement.', priority: 'Normal', status: 'In progress', submittedAt: '2026-10-30' },
    { id: 'maintenance-2', tenantId: 'tenant-2', propertyId: 'property-3', category: 'Electrical', description: 'The hallway light is not working.', priority: 'Low', status: 'Open', submittedAt: '2026-11-01' },
  ],
  notifications: [
    { id: 'notification-1', userId: 'tenant-1', message: 'Your November rent is due soon.', href: '/tenant/payments', createdAt: '2026-11-01T09:00:00.000Z' },
    { id: 'notification-2', userId: 'landlord-1', message: 'A new rental application is waiting for review.', href: '/landlord/applications', createdAt: '2026-10-28T10:00:00.000Z' },
  ],
};

export function formatTaka(amount: number) {
  return `৳${new Intl.NumberFormat('en-BD', { maximumFractionDigits: 0 }).format(amount)}`;
}
