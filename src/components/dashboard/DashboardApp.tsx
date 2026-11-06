'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import {
  Activity, ArrowDownToLine, ArrowUpRight, Bell, Building2, Check, ChevronDown,
  CircleDollarSign, ClipboardList, CreditCard, FileText, Home, LayoutDashboard,
  LogOut, Menu, Plus, Search, Users, Wrench, X,
} from 'lucide-react';
import {
  ApplicationStatus, DemoData, DemoPayment, DemoUser, MaintenanceStatus,
  RentalProperty, UserRole, formatTaka, seedDemoData,
} from '@/data/rentease';
import {
  createDemoId, createDemoNotification, readDemoData, readSession, resetDemoData,
  updateDemoData, writeSession,
} from '@/lib/demo-store';

type NavItem = { label: string; href: string; icon: typeof Home };

const navigation: Record<UserRole, NavItem[]> = {
  tenant: [
    { label: 'Overview', href: '/tenant/dashboard', icon: LayoutDashboard },
    { label: 'Applications', href: '/tenant/applications', icon: ClipboardList },
    { label: 'My rental', href: '/tenant/rental', icon: Home },
    { label: 'Payments', href: '/tenant/payments', icon: CreditCard },
    { label: 'Maintenance', href: '/tenant/maintenance', icon: Wrench },
  ],
  landlord: [
    { label: 'Overview', href: '/landlord/dashboard', icon: LayoutDashboard },
    { label: 'Properties', href: '/landlord/properties', icon: Building2 },
    { label: 'Tenants', href: '/landlord/tenants', icon: Users },
    { label: 'Rent collection', href: '/landlord/rent-collection', icon: CircleDollarSign },
    { label: 'Applications', href: '/landlord/applications', icon: ClipboardList },
    { label: 'Maintenance', href: '/landlord/maintenance', icon: Wrench },
  ],
  admin: [
    { label: 'Overview', href: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Users', href: '/admin/users', icon: Users },
    { label: 'Properties', href: '/admin/properties', icon: Building2 },
    { label: 'Applications', href: '/admin/applications', icon: ClipboardList },
    { label: 'Reports', href: '/admin/reports', icon: Activity },
  ],
};

const buttonClass = 'inline-flex items-center justify-center gap-2 rounded-full bg-[#111111] px-4 py-2.5 text-[12px] font-medium text-white transition-colors hover:bg-black disabled:cursor-not-allowed disabled:opacity-50';
const secondaryClass = 'inline-flex items-center justify-center gap-2 rounded-full border border-[#E5E5E5] bg-white px-4 py-2.5 text-[12px] font-medium text-[#111111] transition-colors hover:bg-[#F6F6F4]';

function Status({ value }: { value: string }) {
  const tone = ['Paid', 'Approved', 'Active', 'Resolved'].includes(value)
    ? 'bg-emerald-50 text-emerald-800 border-emerald-100'
    : ['Rejected', 'Overdue', 'Suspended', 'Archived'].includes(value)
      ? 'bg-rose-50 text-rose-700 border-rose-100'
      : 'bg-amber-50 text-amber-800 border-amber-100';
  return <span className={`inline-flex whitespace-nowrap rounded-full border px-2.5 py-1 text-[10px] font-semibold ${tone}`}>{value}</span>;
}

function SectionTitle({ title, description, action }: { title: string; description?: string; action?: React.ReactNode }) {
  return <div className="mb-6 flex flex-col justify-between gap-4 border-b border-[#E5E5E5] pb-5 sm:flex-row sm:items-end">
    <div><h1 className="text-[25px] font-bold tracking-tight sm:text-[30px]">{title}</h1>{description && <p className="mt-1 text-[12px] text-[#777777]">{description}</p>}</div>
    {action}
  </div>;
}

function Stat({ label, value, note, icon: Icon }: { label: string; value: string | number; note?: string; icon: typeof Home }) {
  return <article className="rounded-lg border border-[#E5E5E5] bg-white p-4 sm:p-5">
    <div className="flex items-start justify-between"><span className="text-[11px] font-medium text-[#666666]">{label}</span><Icon className="h-4 w-4 text-[#888888]" /></div>
    <p className="mt-3 text-[24px] font-bold tracking-tight">{value}</p>{note && <p className="mt-1 text-[10px] text-[#777777]">{note}</p>}
  </article>;
}

function EmptyState({ title, text, action }: { title: string; text: string; action?: React.ReactNode }) {
  return <div className="rounded-lg border border-dashed border-[#D8D8D5] bg-white px-5 py-12 text-center">
    <p className="text-[15px] font-semibold">{title}</p><p className="mx-auto mt-2 max-w-md text-[12px] leading-relaxed text-[#777777]">{text}</p>{action && <div className="mt-4">{action}</div>}
  </div>;
}

function PropertyEditor({ initial, onSave, onCancel }: { initial: RentalProperty | null; onSave: (property: RentalProperty) => void; onCancel: () => void }) {
  const [values, setValues] = useState({
    title: initial?.title ?? '',
    type: initial?.type ?? 'Apartment',
    address: initial?.address ?? '',
    city: initial?.city ?? 'Dhaka',
    rent: String(initial?.rent ?? ''),
    bedrooms: String(initial?.bedrooms ?? '2'),
    bathrooms: String(initial?.bathrooms ?? '1'),
    area: String(initial?.area ?? ''),
    description: initial?.description ?? '',
    amenities: initial?.amenities.join(', ') ?? '',
    image: initial?.image ?? '/images/properties/serenity-tower.jpg',
    availability: initial?.availability ?? 'Available',
  });
  const [error, setError] = useState('');
  const set = (key: keyof typeof values, value: string) => setValues((current) => ({ ...current, [key]: value }));

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const rent = Number(values.rent);
    const area = Number(values.area);
    if (!values.title.trim() || !values.address.trim() || !values.description.trim() || rent <= 0 || area <= 0) {
      setError('Complete the required fields and enter a valid monthly rent and area.');
      return;
    }
    const slug = values.title.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    onSave({
      id: initial?.id ?? createDemoId('property'),
      slug: initial ? initial.slug : `${slug}-${Date.now().toString().slice(-5)}`,
      title: values.title.trim(),
      type: values.type as RentalProperty['type'],
      address: values.address.trim(),
      city: values.city,
      rent,
      bedrooms: Number(values.bedrooms),
      bathrooms: Number(values.bathrooms),
      area,
      image: values.image,
      landlordId: initial?.landlordId ?? '',
      availability: values.availability as RentalProperty['availability'],
      approval: initial?.approval ?? 'Pending',
      description: values.description.trim(),
      amenities: values.amenities.split(',').map((item) => item.trim()).filter(Boolean),
      availableFrom: initial?.availableFrom ?? new Date().toISOString().slice(0, 10),
    });
  }

  const field = 'mt-1.5 w-full rounded-md border border-[#E5E5E5] bg-white px-3 py-2.5 text-[12px] font-normal normal-case tracking-normal';
  return <form onSubmit={submit} className="rounded-lg border border-[#E5E5E5] bg-white p-5 sm:p-7">
    {error && <p role="alert" className="mb-4 rounded-md bg-rose-50 p-3 text-[12px] text-rose-700">{error}</p>}
    <div className="grid gap-4 sm:grid-cols-2">
      <label className="text-[10px] font-semibold uppercase tracking-wider sm:col-span-2">Property title *<input required value={values.title} onChange={(event) => set('title', event.target.value)} className={field} /></label>
      <label className="text-[10px] font-semibold uppercase tracking-wider">Property type<select value={values.type} onChange={(event) => set('type', event.target.value)} className={field}><option>Apartment</option><option>House</option><option>Studio</option></select></label>
      <label className="text-[10px] font-semibold uppercase tracking-wider">City<select value={values.city} onChange={(event) => set('city', event.target.value)} className={field}><option>Dhaka</option><option>Chattogram</option><option>Sylhet</option></select></label>
      <label className="text-[10px] font-semibold uppercase tracking-wider sm:col-span-2">Street address *<input required value={values.address} onChange={(event) => set('address', event.target.value)} className={field} placeholder="House, road and neighborhood" /></label>
      <label className="text-[10px] font-semibold uppercase tracking-wider">Monthly rent (BDT) *<input required type="number" min="1" value={values.rent} onChange={(event) => set('rent', event.target.value)} className={field} /></label>
      <label className="text-[10px] font-semibold uppercase tracking-wider">Floor area (sqft) *<input required type="number" min="1" value={values.area} onChange={(event) => set('area', event.target.value)} className={field} /></label>
      <label className="text-[10px] font-semibold uppercase tracking-wider">Bedrooms<input type="number" min="0" value={values.bedrooms} onChange={(event) => set('bedrooms', event.target.value)} className={field} /></label>
      <label className="text-[10px] font-semibold uppercase tracking-wider">Bathrooms<input type="number" min="0" value={values.bathrooms} onChange={(event) => set('bathrooms', event.target.value)} className={field} /></label>
      <label className="text-[10px] font-semibold uppercase tracking-wider sm:col-span-2">Description *<textarea required rows={4} value={values.description} onChange={(event) => set('description', event.target.value)} className={field} /></label>
      <label className="text-[10px] font-semibold uppercase tracking-wider">Amenities<input value={values.amenities} onChange={(event) => set('amenities', event.target.value)} className={field} placeholder="Lift, generator, parking" /></label>
      <label className="text-[10px] font-semibold uppercase tracking-wider">Property image<select value={values.image} onChange={(event) => set('image', event.target.value)} className={field}><option value="/images/properties/serenity-tower.jpg">Home exterior</option><option value="/images/properties/belgrave-penthouse.jpg">Apartment interior</option><option value="/images/properties/ocean-breeze-retreat.jpg">Bright living room</option><option value="/images/properties/azura-villa.jpg">Modern residence</option><option value="/images/properties/mountain-lodge.jpg">Family home</option><option value="/images/properties/comporta-beach-house.jpg">Garden home</option></select></label>
      <label className="text-[10px] font-semibold uppercase tracking-wider sm:col-span-2">Availability<select value={values.availability} onChange={(event) => set('availability', event.target.value)} className={field}><option>Available</option><option>Occupied</option><option>Archived</option></select></label>
    </div>
    <p className="mt-3 text-[10px] text-[#777777]">New listings are marked pending until reviewed by an administrator. Images use existing demo photography.</p>
    <div className="mt-5 flex flex-wrap gap-2"><button className={buttonClass} type="submit">{initial ? 'Save changes' : 'Add property'}</button><button type="button" onClick={onCancel} className={secondaryClass}>Cancel</button></div>
  </form>;
}

function UserEditor({ initial, onSave, onCancel }: { initial: DemoUser; onSave: (user: DemoUser) => void; onCancel: () => void }) {
  const [name, setName] = useState(initial.name);
  const [email, setEmail] = useState(initial.email);
  const [phone, setPhone] = useState(initial.phone);
  const [role, setRole] = useState<UserRole>(initial.role);
  const [error, setError] = useState('');
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" role="dialog" aria-modal="true" aria-labelledby="edit-user-title">
    <form className="w-full max-w-md rounded-xl border border-[#E5E5E5] bg-white p-6 shadow-xl" onSubmit={(event) => {
      event.preventDefault();
      if (name.trim().length < 2 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
        setError('Enter a valid name and email address.');
        return;
      }
      onSave({ ...initial, name: name.trim(), email: email.trim().toLowerCase(), phone: phone.trim(), role });
    }}>
      <h2 id="edit-user-title" className="text-[18px] font-bold">Edit user</h2>
      {error && <p role="alert" className="mt-3 rounded bg-rose-50 p-2 text-[11px] text-rose-700">{error}</p>}
      <label className="mt-4 block text-[10px] font-semibold uppercase tracking-wider">Full name<input value={name} onChange={(event) => setName(event.target.value)} className="mt-1.5 w-full rounded-md border border-[#E5E5E5] px-3 py-2.5 text-[12px] font-normal normal-case tracking-normal" /></label>
      <label className="mt-3 block text-[10px] font-semibold uppercase tracking-wider">Email<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="mt-1.5 w-full rounded-md border border-[#E5E5E5] px-3 py-2.5 text-[12px] font-normal normal-case tracking-normal" /></label>
      <label className="mt-3 block text-[10px] font-semibold uppercase tracking-wider">Phone<input value={phone} onChange={(event) => setPhone(event.target.value)} className="mt-1.5 w-full rounded-md border border-[#E5E5E5] px-3 py-2.5 text-[12px] font-normal normal-case tracking-normal" /></label>
      <label className="mt-3 block text-[10px] font-semibold uppercase tracking-wider">Role<select value={role} onChange={(event) => setRole(event.target.value as UserRole)} className="mt-1.5 w-full rounded-md border border-[#E5E5E5] bg-white px-3 py-2.5 text-[12px] font-normal normal-case tracking-normal"><option value="tenant">Tenant</option><option value="landlord">Landlord</option><option value="admin">Administrator</option></select></label>
      <div className="mt-5 flex gap-2"><button className={buttonClass} type="submit">Save user</button><button className={secondaryClass} type="button" onClick={onCancel}>Cancel</button></div>
    </form>
  </div>;
}

export default function DashboardApp({ role, children }: { role: UserRole; children?: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<DemoUser | null>(null);
  const [data, setData] = useState<DemoData>(seedDemoData);
  const [ready, setReady] = useState(false);
  const [notice, setNotice] = useState('');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [reportPeriod, setReportPeriod] = useState('all');
  const [propertyEditor, setPropertyEditor] = useState<'new' | string | null>(null);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [maintenanceForm, setMaintenanceForm] = useState(false);
  const signingOut = useRef(false);
  const currentPage = pathname.split('/').filter(Boolean).slice(1).join('/') || 'dashboard';
  const pageKey = currentPage.split('/').at(-1) ?? 'dashboard';

  useEffect(() => {
    const sync = () => {
      setData(readDemoData());
      setUser(readSession());
      setReady(true);
    };
    sync();
    window.addEventListener('rentease-data-change', sync);
    window.addEventListener('rentease-session-change', sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener('rentease-data-change', sync);
      window.removeEventListener('rentease-session-change', sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  useEffect(() => {
    if (!ready) return;
    if (!user && signingOut.current) return;
    if (!user) router.replace(`/login?next=${encodeURIComponent(pathname)}`);
    else if (user.role !== role) router.replace(`/${user.role}/dashboard`);
  }, [ready, user, role, pathname, router]);

  const ownedProperties = useMemo(() => role === 'admin'
    ? data.properties
    : data.properties.filter((property) => property.landlordId === user?.id), [data.properties, role, user?.id]);
  const tenantRentals = data.rentals.filter((rental) => rental.tenantId === user?.id);
  const landlordRentals = data.rentals.filter((rental) => ownedProperties.some((property) => property.id === rental.propertyId));
  const propertyById = (id: string) => data.properties.find((property) => property.id === id);
  const userById = (id: string) => data.users.find((item) => item.id === id);
  const userApplications = role === 'tenant'
    ? data.applications.filter((application) => application.tenantId === user?.id)
    : data.applications.filter((application) => ownedProperties.some((property) => property.id === application.propertyId));
  const visibleApplications = role === 'admin' ? data.applications : userApplications;
  const relevantRentals = role === 'tenant' ? tenantRentals : landlordRentals;
  const currentProperty = relevantRentals[0] ? propertyById(relevantRentals[0].propertyId) : undefined;

  const update = (mutate: (next: DemoData) => void) => {
    const next = updateDemoData(mutate);
    setData(next);
  };
  const notify = (text: string) => {
    setNotice(text);
    window.setTimeout(() => setNotice(''), 3500);
  };
  const logout = () => {
    signingOut.current = true;
    writeSession(null);
    router.replace('/');
  };
  const resetDemo = () => {
    if (!window.confirm('Reset all RentEase demo records to their original sample data? This also signs you out and cannot be undone.')) return;
    signingOut.current = true;
    const seed = resetDemoData();
    setData(seed);
    setUser(null);
    router.replace('/');
  };

  const pageNav = navigation[role];
  const visibleUsers = data.users.filter((item) => `${item.name} ${item.email} ${item.role}`.toLowerCase().includes(query.toLowerCase()));
  const visibleProperties = ownedProperties.filter((item) => `${item.title} ${item.city} ${item.address}`.toLowerCase().includes(query.toLowerCase()));
  const editingUser = data.users.find((item) => item.id === editingUserId);
  const duePayments = data.payments.filter((payment) => relevantRentals.some((rental) => rental.id === payment.rentalId) && payment.status !== 'Paid');
  const pendingApplications = visibleApplications.filter((application) => application.status === 'Pending');
  const userNotifications = data.notifications
    .filter((notification) => notification.userId === user?.id)
    .sort((left, right) => right.createdAt.localeCompare(left.createdAt));
  const unreadNotifications = userNotifications.filter((notification) => !notification.readAt);

  function updateApplication(id: string, status: ApplicationStatus) {
    if (status === 'Approved') {
      const application = data.applications.find((item) => item.id === id);
      const property = application && propertyById(application.propertyId);
      if (!property || property.availability !== 'Available' || property.approval !== 'Approved') {
        notify('This home is no longer available or has not been approved for listing.');
        return;
      }
    }
    update((next) => {
      const application = next.applications.find((item) => item.id === id);
      if (!application) return;
      application.status = status;
      next.notifications.unshift(createDemoNotification(
        application.tenantId,
        `Your application for ${propertyById(application.propertyId)?.title ?? 'a rental home'} was ${status.toLowerCase()}.`,
        '/tenant/applications',
      ));
      if (status === 'Approved') {
        const alreadyRented = next.rentals.some((rental) => rental.tenantId === application.tenantId && rental.propertyId === application.propertyId && rental.status === 'Active');
        if (!alreadyRented) {
          const property = next.properties.find((item) => item.id === application.propertyId);
          if (property) {
          const rentalId = createDemoId('rental');
          next.rentals.push({
            id: rentalId,
            tenantId: application.tenantId,
            propertyId: property.id,
              startDate: new Date().toISOString().slice(0, 10),
              endDate: new Date(Date.now() + 365 * 86400000).toISOString().slice(0, 10),
              rent: property.rent,
              status: 'Active',
            });
            property.availability = 'Occupied';
            next.payments.unshift({
              id: createDemoId('payment'),
              rentalId,
              kind: 'Rent',
              amount: property.rent,
              dueDate: new Date().toISOString().slice(0, 10),
              status: 'Due',
            });
          }
        }
      }
    });
    notify(`Application ${status.toLowerCase()}.`);
  }

  function payPayment(paymentId: string) {
    update((next) => {
      const payment = next.payments.find((item) => item.id === paymentId);
      if (payment) {
        payment.status = 'Paid';
        payment.paidAt = new Date().toISOString().slice(0, 10);
        const rental = next.rentals.find((item) => item.id === payment.rentalId);
        const property = rental && next.properties.find((item) => item.id === rental.propertyId);
        if (property) next.notifications.unshift(createDemoNotification(
          property.landlordId,
          `${payment.kind} payment received for ${property.title}.`,
          '/landlord/rent-collection',
        ));
      }
    });
    notify('Demo payment recorded successfully.');
  }

  function markPaymentReceived(paymentId: string) {
    update((next) => {
      const payment = next.payments.find((item) => item.id === paymentId);
      if (!payment || payment.status === 'Paid') return;
      payment.status = 'Paid';
      payment.paidAt = new Date().toISOString().slice(0, 10);
      const rental = next.rentals.find((item) => item.id === payment.rentalId);
      const property = rental && next.properties.find((item) => item.id === rental.propertyId);
      if (rental && property) next.notifications.unshift(createDemoNotification(
        rental.tenantId,
        `${payment.kind} payment for ${property.title} was marked received by your landlord.`,
        '/tenant/payments',
      ));
    });
    notify('Payment marked received in the demo records.');
  }

  function downloadReceipt(payment: DemoPayment) {
    const rental = data.rentals.find((item) => item.id === payment.rentalId);
    const property = rental && propertyById(rental.propertyId);
    if (!rental || !property) {
      notify('Receipt details are unavailable for this demo payment.');
      return;
    }
    const receipt = [
      'RentEase · Demo receipt',
      `Receipt: ${payment.id}`,
      `Date paid: ${payment.paidAt ? date(payment.paidAt) : 'Not recorded'}`,
      `Tenant: ${userById(rental.tenantId)?.name ?? 'Tenant'}`,
      `Property: ${property.title}`,
      `Payment type: ${payment.kind}`,
      `Amount: ${money(payment.amount)}`,
      `Due date: ${date(payment.dueDate)}`,
      `Status: ${payment.status}`,
      '',
      'Illustrative frontend receipt only. No payment was processed.',
    ].join('\n');
    const url = URL.createObjectURL(new Blob([receipt], { type: 'text/plain;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = `rentease-receipt-${payment.id}.txt`;
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    notify('Demo receipt downloaded.');
  }

  function saveProperty(property: RentalProperty) {
    update((next) => {
      property.landlordId = user?.id ?? property.landlordId;
      const existing = next.properties.findIndex((item) => item.id === property.id);
      if (existing < 0) next.properties.unshift(property);
      else next.properties[existing] = property;
      if (existing < 0) {
        next.users.filter((item) => item.role === 'admin').forEach((admin) => {
          next.notifications.unshift(createDemoNotification(
            admin.id,
            `${property.title} was submitted for listing review.`,
            '/admin/properties',
          ));
        });
      }
    });
    setPropertyEditor(null);
    notify(property.approval === 'Pending' ? 'Property saved and sent for admin review.' : 'Property changes saved.');
    router.replace('/landlord/properties');
  }

  function updateMaintenance(id: string, status: MaintenanceStatus) {
    update((next) => {
      const request = next.maintenance.find((item) => item.id === id);
      if (request) {
        request.status = status;
        next.notifications.unshift(createDemoNotification(
          request.tenantId,
          `Your ${request.category.toLowerCase()} maintenance request is ${status.toLowerCase()}.`,
          '/tenant/maintenance',
        ));
      }
    });
    notify('Maintenance status updated.');
  }

  function downloadReport() {
    const csvRows = [
      ['RentEase demo report', 'Generated', new Date().toLocaleDateString()],
      ['Properties', String(data.properties.length)],
      ['Users', String(data.users.length)],
      ['Applications', String(data.applications.length)],
      ['Payments', String(data.payments.length)],
      [],
      ['Name', 'Email', 'Role', 'Status'],
      ...data.users.map((item) => [item.name, item.email, item.role, item.status]),
    ];
    const content = csvRows.map((row) => row.map((field) => `"${String(field ?? '').replaceAll('"', '""')}"`).join(',')).join('\n');
    const url = URL.createObjectURL(new Blob([content], { type: 'text/csv;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'rentease-demo-report.csv';
    link.click();
    URL.revokeObjectURL(url);
    notify('Report exported as CSV.');
  }

  function saveMaintenance(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!user || !currentProperty) return;
    const form = new FormData(event.currentTarget);
    const description = String(form.get('description') ?? '').trim();
    if (!description) return;
    update((next) => {
      next.maintenance.unshift({
        id: createDemoId('maintenance'),
        tenantId: user.id,
        propertyId: currentProperty.id,
        category: String(form.get('category')),
        description,
        priority: String(form.get('priority')) as 'Low' | 'Normal' | 'Urgent',
        status: 'Open',
        submittedAt: new Date().toISOString().slice(0, 10),
      });
      const property = next.properties.find((item) => item.id === currentProperty.id);
      if (property) next.notifications.unshift(createDemoNotification(
        property.landlordId,
        `A new ${String(form.get('category')).toLowerCase()} maintenance request was submitted.`,
        '/landlord/maintenance',
      ));
    });
    setMaintenanceForm(false);
    notify('Maintenance request submitted.');
  }

  const money = (value: number) => formatTaka(value);
  const date = (value: string) => new Date(`${value}T00:00:00`).toLocaleDateString('en-BD', { day: 'numeric', month: 'short', year: 'numeric' });

  if (!ready || !user || user.role !== role) return <div className="container-custom py-24 text-center text-[13px] text-[#777777]">Loading your secure demo workspace…</div>;

  const renderOverview = () => {
    if (role === 'tenant') {
      const nextPayment = duePayments[0];
      return <>
        <SectionTitle title={`Good to see you, ${user.name.split(' ')[0]}`} description="Here is the latest on your rental." action={<Link href="/properties" className={buttonClass}><Search className="h-3.5 w-3.5" />Find a home</Link>} />
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <Stat label="Active rental" value={currentProperty?.title ?? 'No active rental'} note={currentProperty?.city ?? 'Explore homes to get started'} icon={Home} />
          <Stat label="Applications" value={userApplications.filter((item) => item.status === 'Pending').length} note={`${userApplications.length} submitted`} icon={ClipboardList} />
          <Stat label="Next payment" value={nextPayment ? money(nextPayment.amount) : 'All paid'} note={nextPayment ? `Due ${date(nextPayment.dueDate)}` : 'No pending payments'} icon={CreditCard} />
          <Stat label="Open requests" value={data.maintenance.filter((item) => item.tenantId === user.id && item.status !== 'Resolved').length} note="Maintenance updates" icon={Wrench} />
        </div>
        <div className="mt-6 grid gap-5 lg:grid-cols-[1.25fr_0.75fr]">
          <div className="rounded-lg border border-[#E5E5E5] bg-white p-5"><h2 className="text-[14px] font-bold">Your current rental</h2>{currentProperty && relevantRentals[0] ? <div className="mt-4 grid gap-4 sm:grid-cols-[180px_1fr]"><div className="relative min-h-32 overflow-hidden rounded-md"><Image src={currentProperty.image} alt={currentProperty.title} fill sizes="180px" className="object-cover" /></div><div><h3 className="text-[16px] font-semibold">{currentProperty.title}</h3><p className="mt-1 text-[11px] text-[#777777]">{currentProperty.address}, {currentProperty.city}</p><p className="mt-3 text-[13px] font-semibold">{money(relevantRentals[0].rent)} <span className="font-normal text-[#777777]">/ month</span></p><Link href="/tenant/rental" className="mt-3 inline-block text-[11px] font-semibold underline underline-offset-2">View rental details</Link></div></div> : <EmptyState title="No active rental yet" text="Find a home and submit an application to get started." action={<Link href="/properties" className={secondaryClass}>Browse homes</Link>} />}</div>
          <div className="rounded-lg border border-[#E5E5E5] bg-white p-5"><h2 className="text-[14px] font-bold">Quick actions</h2><div className="mt-4 grid gap-2"><Link href="/tenant/applications" className={secondaryClass}>Track applications <ArrowUpRight className="h-3.5 w-3.5" /></Link><Link href="/tenant/payments" className={secondaryClass}>Review payments <ArrowUpRight className="h-3.5 w-3.5" /></Link><Link href="/tenant/maintenance" className={secondaryClass}>Request maintenance <ArrowUpRight className="h-3.5 w-3.5" /></Link></div></div>
        </div>
        <div className="mt-5 rounded-lg border border-[#E5E5E5] bg-white p-5"><h2 className="text-[14px] font-bold">Recent transactions</h2><div className="mt-3 divide-y divide-[#F0F0EE]">{data.payments.filter((payment) => relevantRentals.some((rental) => rental.id === payment.rentalId)).slice(0, 4).map((payment) => <div key={payment.id} className="flex items-center justify-between gap-3 py-3 text-[12px]"><div><p className="font-medium">{payment.kind}</p><p className="mt-0.5 text-[10px] text-[#777777]">Due {date(payment.dueDate)}</p></div><div className="flex items-center gap-3"><span className="font-semibold">{money(payment.amount)}</span><Status value={payment.status} /></div></div>)}</div></div>
      </>;
    }

    if (role === 'landlord') {
      const occupied = ownedProperties.filter((item) => item.availability === 'Occupied').length;
      const income = data.payments.filter((payment) => payment.status === 'Paid' && landlordRentals.some((rental) => rental.id === payment.rentalId) && payment.kind === 'Rent').reduce((sum, payment) => sum + payment.amount, 0);
      return <>
        <SectionTitle title={`Welcome, ${user.name.split(' ')[0]}`} description="Your rental portfolio at a glance." action={<Link href="/landlord/properties/add" className={buttonClass}><Plus className="h-3.5 w-3.5" />Add property</Link>} />
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <Stat label="Total properties" value={ownedProperties.length} note={`${ownedProperties.filter((item) => item.availability === 'Available').length} available`} icon={Building2} />
          <Stat label="Occupied homes" value={occupied} note={`${ownedProperties.length - occupied} vacant`} icon={Home} />
          <Stat label="Active tenants" value={landlordRentals.length} note="Current rental agreements" icon={Users} />
          <Stat label="Collected this period" value={money(income)} note="Paid rent in demo records" icon={CircleDollarSign} />
        </div>
        <div className="mt-6 grid gap-5 lg:grid-cols-2">
          <div className="rounded-lg border border-[#E5E5E5] bg-white p-5"><div className="flex items-center justify-between"><h2 className="text-[14px] font-bold">Pending applications</h2><Link href="/landlord/applications" className="text-[11px] font-semibold underline">Review all</Link></div>
            {pendingApplications.slice(0, 4).map((application) => <div key={application.id} className="flex items-center justify-between gap-3 border-b border-[#F0F0EE] py-3 last:border-0"><div><p className="text-[12px] font-medium">{userById(application.tenantId)?.name ?? 'Tenant'}</p><p className="mt-0.5 text-[10px] text-[#777777]">{propertyById(application.propertyId)?.title} · {date(application.submittedAt)}</p></div><Status value={application.status} /></div>)}
            {!pendingApplications.length && <p className="py-8 text-center text-[12px] text-[#777777]">No pending applications.</p>}
          </div>
          <div className="rounded-lg border border-[#E5E5E5] bg-white p-5"><h2 className="text-[14px] font-bold">Portfolio activity</h2>{data.maintenance.filter((item) => ownedProperties.some((property) => property.id === item.propertyId)).slice(0, 4).map((item) => <div key={item.id} className="flex items-center justify-between gap-3 border-b border-[#F0F0EE] py-3 last:border-0"><div><p className="text-[12px] font-medium">{item.category} request</p><p className="mt-0.5 text-[10px] text-[#777777]">{propertyById(item.propertyId)?.title} · {date(item.submittedAt)}</p></div><Status value={item.status} /></div>)}</div>
        </div>
      </>;
    }

    const roleCounts = {
      tenants: data.users.filter((item) => item.role === 'tenant').length,
      landlords: data.users.filter((item) => item.role === 'landlord').length,
      properties: data.properties.length,
      rentals: data.rentals.filter((item) => item.status === 'Active').length,
    };
    return <>
      <SectionTitle title="Platform overview" description="Monitor RentEase demo activity and listing health." action={<Link href="/admin/reports" className={secondaryClass}><FileText className="h-3.5 w-3.5" />View reports</Link>} />
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Total users" value={data.users.length} note={`${roleCounts.tenants} tenants · ${roleCounts.landlords} landlords`} icon={Users} />
        <Stat label="Property listings" value={roleCounts.properties} note={`${data.properties.filter((item) => item.approval === 'Pending').length} pending review`} icon={Building2} />
        <Stat label="Active rentals" value={roleCounts.rentals} note={`${data.applications.filter((item) => item.status === 'Pending').length} applications pending`} icon={Home} />
        <Stat label="Paid transactions" value={money(data.payments.filter((item) => item.status === 'Paid').reduce((sum, item) => sum + item.amount, 0))} note="Sample payments only" icon={CircleDollarSign} />
      </div>
      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        <div className="rounded-lg border border-[#E5E5E5] bg-white p-5"><h2 className="text-[14px] font-bold">Platform activity</h2><div className="mt-5 grid grid-cols-3 gap-3 text-center">{[['Users', data.users.length], ['Listings', data.properties.length], ['Applications', data.applications.length]].map(([label, count]) => <div key={label} className="rounded-md bg-[#F6F6F4] p-4"><p className="text-[22px] font-bold">{count}</p><p className="mt-1 text-[10px] text-[#777777]">{label}</p></div>)}</div><div className="mt-5 flex items-center gap-2 text-[11px] text-[#595959]"><Activity className="h-4 w-4" /> Latest records are stored in this browser.</div></div>
        <div className="rounded-lg border border-[#E5E5E5] bg-white p-5"><h2 className="text-[14px] font-bold">Listing status</h2>{(['Approved', 'Pending', 'Rejected'] as const).map((status) => {const count = data.properties.filter((property) => property.approval === status).length; return <div key={status} className="mt-4"><div className="mb-1.5 flex justify-between text-[11px]"><span>{status}</span><span>{count}</span></div><div className="h-2 overflow-hidden rounded bg-[#F0F0EE]"><div className="h-full bg-[#111111]" style={{ width: `${data.properties.length ? count / data.properties.length * 100 : 0}%` }} /></div></div>})}</div>
      </div>
    </>;
  };

  const renderApplications = () => <><SectionTitle title="Rental applications" description={role === 'tenant' ? 'Track applications you have submitted.' : 'Review and respond to tenant applications.'} />
    {visibleApplications.length ? <div className="overflow-x-auto rounded-lg border border-[#E5E5E5] bg-white"><table className="w-full min-w-[700px] text-left text-[11px]"><thead className="bg-[#F6F6F4] text-[10px] uppercase tracking-wider text-[#666666]"><tr><th className="p-3.5">Property / landlord</th><th className="p-3.5">Tenant / message</th><th className="p-3.5">Submitted</th><th className="p-3.5">Status</th><th className="p-3.5">Actions</th></tr></thead><tbody className="divide-y divide-[#F0F0EE]">{visibleApplications.map((application) => {const property = propertyById(application.propertyId); return <tr key={application.id}><td className="p-3.5"><p className="font-semibold">{property?.title ?? 'Property'}</p><p className="mt-1 text-[10px] text-[#777777]">{property?.city}{role === 'admin' && property ? ` · ${userById(property.landlordId)?.name ?? 'Landlord'}` : ''}</p></td><td className="max-w-[250px] p-3.5"><p>{userById(application.tenantId)?.name ?? 'Tenant'}</p><p className="mt-1 line-clamp-2 text-[10px] text-[#777777]" title={application.message}>{application.message}</p></td><td className="p-3.5">{date(application.submittedAt)}</td><td className="p-3.5"><Status value={application.status} /></td><td className="p-3.5"><div className="flex gap-2">{role === 'tenant' && application.status === 'Pending' && <button className={secondaryClass} onClick={() => updateApplication(application.id, 'Cancelled')}>Cancel</button>}{role !== 'tenant' && application.status === 'Pending' && <><button className={`${buttonClass} !px-3 !py-2`} onClick={() => updateApplication(application.id, 'Approved')}><Check className="h-3 w-3" />Approve</button><button className={secondaryClass} onClick={() => updateApplication(application.id, 'Rejected')}>Decline</button></>}</div></td></tr>})}</tbody></table></div> : <EmptyState title="No applications yet" text="Rental applications will appear here when a tenant applies to one of your available listings." />}</>;

  const renderRental = () => <><SectionTitle title="My rental" description="Your active rental and agreement details." />
    {tenantRentals.length ? tenantRentals.map((rental) => {const property = propertyById(rental.propertyId); const landlord = property && userById(property.landlordId); return <article key={rental.id} className="rounded-lg border border-[#E5E5E5] bg-white p-5 sm:p-7"><div className="flex flex-col justify-between gap-4 sm:flex-row"><div><Status value={rental.status} /><h2 className="mt-3 text-[20px] font-bold">{property?.title}</h2><p className="mt-1 text-[12px] text-[#777777]">{property?.address}, {property?.city}</p></div><p className="text-[22px] font-bold">{money(rental.rent)}<span className="text-[11px] font-normal text-[#777777]"> / month</span></p></div><div className="mt-6 grid gap-4 border-t border-[#E5E5E5] pt-5 sm:grid-cols-3"><div><p className="text-[10px] uppercase text-[#777777]">Landlord</p><p className="mt-1 text-[12px] font-medium">{landlord?.name ?? 'Landlord'}</p></div><div><p className="text-[10px] uppercase text-[#777777]">Agreement starts</p><p className="mt-1 text-[12px] font-medium">{date(rental.startDate)}</p></div><div><p className="text-[10px] uppercase text-[#777777]">Agreement ends</p><p className="mt-1 text-[12px] font-medium">{date(rental.endDate)}</p></div></div>    <div className="mt-6 grid gap-3 border-t border-[#E5E5E5] pt-4 sm:grid-cols-2"><div><p className="text-[10px] uppercase text-[#777777]">Minimum lease</p><p className="mt-1 text-[12px] font-medium">12 months · sample term</p></div><div><p className="text-[10px] uppercase text-[#777777]">Security deposit</p><p className="mt-1 text-[12px] font-medium">{money(rental.rent)} · illustrative, refundable</p></div></div><p className="mt-4 text-[11px] text-[#777777]">Demo agreement summary · No legal agreement is generated or signed by this frontend.</p></article>}) : <EmptyState title="No active rental" text="Once an application is approved, your rental agreement details will be available here." action={<Link href="/properties" className={secondaryClass}>Browse homes</Link>} />}</>;

  const renderPayments = () => {
    const payments = data.payments.filter((payment) => relevantRentals.some((rental) => rental.id === payment.rentalId)).sort((a, b) => b.dueDate.localeCompare(a.dueDate));
    return <><SectionTitle title={role === 'tenant' ? 'Payments & bills' : 'Rent collection'} description="Review sample rent and utility transactions." action={<button className={secondaryClass} onClick={() => window.print()}><ArrowDownToLine className="h-3.5 w-3.5" />Print statement</button>} />
      {payments.length ? <div className="overflow-x-auto rounded-lg border border-[#E5E5E5] bg-white"><table className="w-full min-w-[680px] text-left text-[11px]"><thead className="bg-[#F6F6F4] text-[10px] uppercase tracking-wider text-[#666666]"><tr><th className="p-3.5">Payment</th><th className="p-3.5">Property / tenant</th><th className="p-3.5">Due date</th><th className="p-3.5">Amount</th><th className="p-3.5">Status</th><th className="p-3.5">Action</th></tr></thead><tbody className="divide-y divide-[#F0F0EE]">{payments.map((payment) => {const rental = data.rentals.find((item) => item.id === payment.rentalId); const property = rental && propertyById(rental.propertyId); return <tr key={payment.id}><td className="p-3.5 font-medium">{payment.kind}{payment.paidAt && <p className="mt-1 text-[10px] font-normal text-[#777777]">Paid {date(payment.paidAt)}</p>}</td><td className="p-3.5"><p>{property?.title}</p>{role !== 'tenant' && <p className="mt-1 text-[10px] text-[#777777]">{rental && userById(rental.tenantId)?.name}</p>}</td><td className="p-3.5">{date(payment.dueDate)}</td><td className="p-3.5 font-semibold">{money(payment.amount)}</td><td className="p-3.5"><Status value={payment.status} /></td><td className="p-3.5">{role === 'tenant' && payment.status !== 'Paid' ? <button onClick={() => payPayment(payment.id)} className={`${buttonClass} !px-3 !py-2`}><CreditCard className="h-3 w-3" />Pay demo</button> : role === 'landlord' && payment.status !== 'Paid' ? <button onClick={() => markPaymentReceived(payment.id)} className={`${buttonClass} !px-3 !py-2`}>Mark received</button> : payment.status === 'Paid' ? <button onClick={() => downloadReceipt(payment)} className={secondaryClass}>Download receipt</button> : <span className="text-[#777777]">Awaiting tenant</span>}</td></tr>})}</tbody></table></div> : <EmptyState title="No payments to show" text="Payment records will appear here after a rental agreement is active." />}
      <p className="mt-4 text-[10px] text-[#777777]">Payment buttons update only the local demo data. No real money is processed.</p>
    </>;
  };

  const renderMaintenance = () => {
    const requests = role === 'tenant' ? data.maintenance.filter((item) => item.tenantId === user.id) : data.maintenance.filter((item) => ownedProperties.some((property) => property.id === item.propertyId));
    return <><SectionTitle title="Maintenance" description={role === 'tenant' ? 'Report an issue and track its progress.' : 'Review and update tenant maintenance requests.'} action={role === 'tenant' && currentProperty ? <button className={buttonClass} onClick={() => setMaintenanceForm((open) => !open)}><Plus className="h-3.5 w-3.5" />New request</button> : undefined} />
      {role === 'tenant' && maintenanceForm && <form onSubmit={saveMaintenance} className="mb-5 grid gap-3 rounded-lg border border-[#E5E5E5] bg-white p-5 sm:grid-cols-3"><label className="text-[10px] font-semibold uppercase tracking-wider">Category<select name="category" className="mt-1.5 w-full rounded-md border border-[#E5E5E5] bg-white px-3 py-2.5 text-[12px]"><option>Plumbing</option><option>Electrical</option><option>Appliance</option><option>Structural</option><option>Other</option></select></label><label className="text-[10px] font-semibold uppercase tracking-wider">Priority<select name="priority" className="mt-1.5 w-full rounded-md border border-[#E5E5E5] bg-white px-3 py-2.5 text-[12px]"><option>Normal</option><option>Low</option><option>Urgent</option></select></label><label className="text-[10px] font-semibold uppercase tracking-wider sm:col-span-3">Describe the issue<textarea name="description" rows={3} required minLength={8} className="mt-1.5 w-full rounded-md border border-[#E5E5E5] px-3 py-2.5 text-[12px]" /></label><div className="flex gap-2 sm:col-span-3"><button className={buttonClass} type="submit">Submit request</button><button className={secondaryClass} type="button" onClick={() => setMaintenanceForm(false)}>Cancel</button></div></form>}
      {requests.length ? <div className="grid gap-3">{requests.map((request) => <article key={request.id} className="rounded-lg border border-[#E5E5E5] bg-white p-4 sm:p-5"><div className="flex flex-wrap items-start justify-between gap-3"><div><div className="flex flex-wrap items-center gap-2"><h2 className="text-[13px] font-bold">{request.category}</h2><Status value={request.priority} /></div><p className="mt-2 text-[12px] leading-relaxed text-[#595959]">{request.description}</p><p className="mt-2 text-[10px] text-[#777777]">{propertyById(request.propertyId)?.title} · Submitted {date(request.submittedAt)}{role !== 'tenant' ? ` · ${userById(request.tenantId)?.name ?? ''}` : ''}</p></div><div className="flex items-center gap-2"><Status value={request.status} />{role !== 'tenant' && <select aria-label="Update request status" value={request.status} onChange={(event) => updateMaintenance(request.id, event.target.value as MaintenanceStatus)} className="rounded border border-[#E5E5E5] bg-white px-2 py-1.5 text-[10px]"><option>Open</option><option>In progress</option><option>Resolved</option></select>}</div></div></article>)}</div> : <EmptyState title="No maintenance requests" text="Requests will show here when they are submitted." />}</>;
  };

  const renderProperties = () => {
    const editing = propertyEditor && propertyEditor !== 'new' ? data.properties.find((item) => item.id === propertyEditor) ?? null : null;
    if (pageKey === 'add' || propertyEditor) return <><SectionTitle title={propertyEditor === 'new' || pageKey === 'add' ? 'Add a property' : 'Edit property'} description="Add the details tenants need to make an informed decision." /><PropertyEditor key={editing?.id ?? 'new'} initial={editing} onSave={saveProperty} onCancel={() => { setPropertyEditor(null); if (pageKey === 'add') router.push('/landlord/properties'); }} /></>;
    return <><SectionTitle title="Your properties" description="Manage listings and update their availability." action={<Link href="/landlord/properties/add" className={buttonClass}><Plus className="h-3.5 w-3.5" />Add property</Link>} />
      <div className="mb-4 relative max-w-sm"><Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#777777]" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search properties" className="w-full rounded-md border border-[#E5E5E5] py-2.5 pl-9 pr-3 text-[12px]" /></div>
      {visibleProperties.length ? <div className="overflow-x-auto rounded-lg border border-[#E5E5E5] bg-white"><table className="w-full min-w-[730px] text-left text-[11px]"><thead className="bg-[#F6F6F4] text-[10px] uppercase tracking-wider text-[#666666]"><tr><th className="p-3.5">Property</th><th className="p-3.5">Monthly rent</th><th className="p-3.5">Occupancy</th><th className="p-3.5">Listing review</th><th className="p-3.5">Actions</th></tr></thead><tbody className="divide-y divide-[#F0F0EE]">{visibleProperties.map((property) => <tr key={property.id}><td className="p-3.5"><div className="flex items-center gap-3"><div className="relative h-12 w-16 shrink-0 overflow-hidden rounded"><Image src={property.image} alt="" fill sizes="64px" className="object-cover" /></div><div><p className="font-semibold">{property.title}</p><p className="mt-1 text-[10px] text-[#777777]">{property.address}, {property.city}</p></div></div></td><td className="p-3.5 font-semibold">{money(property.rent)} / mo</td><td className="p-3.5"><Status value={property.availability} /></td><td className="p-3.5"><Status value={property.approval} /></td><td className="p-3.5"><div className="flex gap-2"><button className={secondaryClass} onClick={() => setPropertyEditor(property.id)}>Edit</button><Link href={`/properties/${property.slug}`} target="_blank" className={secondaryClass}>View</Link><button className={secondaryClass} onClick={() => {if (window.confirm(`Archive ${property.title}?`)) update((next) => {const item = next.properties.find((entry) => entry.id === property.id); if (item) item.availability = 'Archived';});}}>Archive</button></div></td></tr>)}</tbody></table></div> : <EmptyState title="No matching properties" text="Add a property to start building your rental portfolio." action={<Link href="/landlord/properties/add" className={secondaryClass}>Add property</Link>} />}
    </>;
  };

  const renderTenants = () => {
    const rentals = data.rentals.filter((rental) => ownedProperties.some((property) => property.id === rental.propertyId));
    return <><SectionTitle title="Tenants" description="Current tenant and rental agreement details." />{rentals.length ? <div className="overflow-x-auto rounded-lg border border-[#E5E5E5] bg-white"><table className="w-full min-w-[640px] text-left text-[11px]"><thead className="bg-[#F6F6F4] text-[10px] uppercase tracking-wider text-[#666666]"><tr><th className="p-3.5">Tenant</th><th className="p-3.5">Property</th><th className="p-3.5">Agreement</th><th className="p-3.5">Monthly rent</th><th className="p-3.5">Payment</th></tr></thead><tbody className="divide-y divide-[#F0F0EE]">{rentals.map((rental) => {const payment = data.payments.find((item) => item.rentalId === rental.id && item.kind === 'Rent' && item.status !== 'Paid'); return <tr key={rental.id}><td className="p-3.5"><p className="font-semibold">{userById(rental.tenantId)?.name}</p><p className="mt-1 text-[10px] text-[#777777]">{userById(rental.tenantId)?.email}</p></td><td className="p-3.5">{propertyById(rental.propertyId)?.title}</td><td className="p-3.5">{date(rental.startDate)} – {date(rental.endDate)}</td><td className="p-3.5 font-semibold">{money(rental.rent)}</td><td className="p-3.5"><Status value={payment?.status ?? 'Paid'} /></td></tr>})}</tbody></table></div> : <EmptyState title="No current tenants" text="Approved rental applications will create tenant agreements here." />}</>;
  };

  const renderAdminUsers = () => <><SectionTitle title="Users" description="Search and manage demo tenant, landlord and administrator accounts." />
    <div className="mb-4 relative max-w-sm"><Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#777777]" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search name, email or role" className="w-full rounded-md border border-[#E5E5E5] py-2.5 pl-9 pr-3 text-[12px]" /></div>
    <div className="overflow-x-auto rounded-lg border border-[#E5E5E5] bg-white"><table className="w-full min-w-[650px] text-left text-[11px]"><thead className="bg-[#F6F6F4] text-[10px] uppercase tracking-wider text-[#666666]"><tr><th className="p-3.5">User</th><th className="p-3.5">Phone</th><th className="p-3.5">Role</th><th className="p-3.5">Status</th><th className="p-3.5">Action</th></tr></thead><tbody className="divide-y divide-[#F0F0EE]">{visibleUsers.map((item) => <tr key={item.id}><td className="p-3.5"><p className="font-semibold">{item.name}</p><p className="mt-1 text-[10px] text-[#777777]">{item.email}</p></td><td className="p-3.5">{item.phone || '—'}</td><td className="p-3.5 capitalize">{item.role}</td><td className="p-3.5"><Status value={item.status} /></td><td className="p-3.5"><div className="flex gap-2"><button className={secondaryClass} onClick={() => setEditingUserId(item.id)}>Edit</button>{item.id === user.id ? <span className="self-center text-[10px] text-[#777777]">Current account</span> : <button className={secondaryClass} onClick={() => update((next) => {const target = next.users.find((entry) => entry.id === item.id); if (target) target.status = target.status === 'Active' ? 'Suspended' : 'Active';})}>{item.status === 'Active' ? 'Suspend' : 'Activate'}</button>}</div></td></tr>)}</tbody></table></div>
  </>;

  const renderAdminProperties = () => <><SectionTitle title="Property listings" description="Review listings submitted by landlords." />
    <div className="mb-4 relative max-w-sm"><Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#777777]" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search title, location or landlord" className="w-full rounded-md border border-[#E5E5E5] py-2.5 pl-9 pr-3 text-[12px]" /></div>
    <div className="overflow-x-auto rounded-lg border border-[#E5E5E5] bg-white"><table className="w-full min-w-[720px] text-left text-[11px]"><thead className="bg-[#F6F6F4] text-[10px] uppercase tracking-wider text-[#666666]"><tr><th className="p-3.5">Listing</th><th className="p-3.5">Landlord</th><th className="p-3.5">Rent / month</th><th className="p-3.5">Review status</th><th className="p-3.5">Actions</th></tr></thead><tbody className="divide-y divide-[#F0F0EE]">{data.properties.filter((property) => `${property.title} ${property.city} ${userById(property.landlordId)?.name ?? ''}`.toLowerCase().includes(query.toLowerCase())).map((property) => <tr key={property.id}><td className="p-3.5"><p className="font-semibold">{property.title}</p><p className="mt-1 text-[10px] text-[#777777]">{property.city} · {property.availability}</p></td><td className="p-3.5">{userById(property.landlordId)?.name ?? 'Landlord'}</td><td className="p-3.5 font-semibold">{money(property.rent)}</td><td className="p-3.5"><Status value={property.approval} /></td><td className="p-3.5"><div className="flex gap-2"><Link href={`/properties/${property.slug}`} target="_blank" className={secondaryClass}>View</Link>{property.approval === 'Pending' && <><button className={`${buttonClass} !px-3 !py-2`} onClick={() => update((next) => {const item = next.properties.find((entry) => entry.id === property.id); if (item) item.approval = 'Approved';})}>Approve</button><button className={secondaryClass} onClick={() => update((next) => {const item = next.properties.find((entry) => entry.id === property.id); if (item) item.approval = 'Rejected';})}>Reject</button></>}<button className={secondaryClass} onClick={() => {if (window.confirm(`Archive ${property.title}?`)) update((next) => {const item = next.properties.find((entry) => entry.id === property.id); if (item) item.availability = 'Archived';});}}>Archive</button></div></td></tr>)}</tbody></table></div>
  </>;

  const renderReports = () => {
    const cutoff = new Date();
    if (reportPeriod === '30') cutoff.setDate(cutoff.getDate() - 30);
    if (reportPeriod === 'year') cutoff.setMonth(0, 1);
    cutoff.setHours(0, 0, 0, 0);
    const inPeriod = (value: string) => reportPeriod === 'all' || new Date(`${value}T00:00:00`).getTime() >= cutoff.getTime();
    const reportApplications = data.applications.filter((application) => inPeriod(application.submittedAt));
    const reportPayments = data.payments.filter((payment) => inPeriod(payment.dueDate));
    const counts = [
      ['Tenants', data.users.filter((item) => item.role === 'tenant').length],
      ['Landlords', data.users.filter((item) => item.role === 'landlord').length],
      ['Properties', data.properties.length],
      ['Active rentals', data.rentals.filter((item) => item.status === 'Active').length],
      ['Applications', reportApplications.length],
      ['Payments paid', reportPayments.filter((item) => item.status === 'Paid').length],
    ] as const;
    return <><SectionTitle title="Reports" description="A summary of activity in this browser's demo data." action={<button className={buttonClass} onClick={downloadReport}><ArrowDownToLine className="h-3.5 w-3.5" />Export CSV</button>} />
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-[#E5E5E5] bg-white p-4"><label className="text-[11px] text-[#595959]">Reporting period <select value={reportPeriod} onChange={(event) => setReportPeriod(event.target.value)} className="ml-2 rounded-md border border-[#E5E5E5] bg-white px-3 py-2 text-[11px]"><option value="all">All demo records</option><option value="30">Last 30 days</option><option value="year">This year</option></select></label><button className={secondaryClass} onClick={() => window.print()}>Print report</button></div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">{counts.map(([label, count]) => <Stat key={label} label={label} value={count} note="Current sample records" icon={Activity} />)}</div>
      <div className="mt-6 rounded-lg border border-[#E5E5E5] bg-white p-5"><h2 className="text-[14px] font-bold">Payments by status</h2><div className="mt-5 grid gap-4 sm:grid-cols-3">{(['Paid', 'Due', 'Overdue'] as const).map((status) => <div key={status}><div className="mb-1.5 flex justify-between text-[11px]"><span>{status}</span><span>{reportPayments.filter((item) => item.status === status).length}</span></div><div className="h-2 rounded bg-[#F0F0EE]"><div className="h-full rounded bg-[#111111]" style={{ width: `${reportPayments.length ? reportPayments.filter((item) => item.status === status).length / reportPayments.length * 100 : 0}%` }} /></div></div>)}</div></div>
      <p className="mt-4 text-[10px] text-[#777777]">Application and payment totals follow the selected date range. Records stay in this browser.</p>
    </>;
  };

  let content: React.ReactNode;
  if (pageKey === 'dashboard') content = renderOverview();
  else if (pageKey === 'applications') content = renderApplications();
  else if (pageKey === 'rental' && role === 'tenant') content = renderRental();
  else if ((pageKey === 'payments' && role === 'tenant') || (pageKey === 'rent-collection' && role === 'landlord')) content = renderPayments();
  else if (pageKey === 'maintenance') content = renderMaintenance();
  else if (pageKey === 'properties' && role === 'landlord') content = renderProperties();
  else if (pageKey === 'add' && role === 'landlord') content = renderProperties();
  else if (pageKey === 'tenants' && role === 'landlord') content = renderTenants();
  else if (pageKey === 'users' && role === 'admin') content = renderAdminUsers();
  else if (pageKey === 'properties' && role === 'admin') content = renderAdminProperties();
  else if (pageKey === 'reports' && role === 'admin') content = renderReports();
  else content = children ?? renderOverview();

  const roleTitle = role === 'admin' ? 'Administrator' : role === 'landlord' ? 'Landlord portal' : 'Tenant portal';
  return <div className="min-h-screen bg-[#FAFAF9]">
    <header className="sticky top-0 z-30 border-b border-[#E5E5E5] bg-white/95 backdrop-blur-md">
      <div className="flex h-[62px] items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <button type="button" onClick={() => setMobileNavOpen((open) => !open)} className="btn-icon lg:hidden" aria-label="Toggle dashboard navigation">{mobileNavOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}</button>
          <Link href="/" className="flex items-center gap-2"><span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#111111] text-[14px] font-bold text-white">R</span><span className="text-[14px] font-extrabold tracking-[0.14em]">RENTEASE</span></Link>
          <span className="hidden border-l border-[#E5E5E5] pl-3 text-[11px] text-[#777777] sm:inline">{roleTitle}</span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/" className="hidden text-[11px] text-[#595959] hover:text-[#111111] sm:inline">Visit public site</Link>
          <button type="button" className="btn-icon relative" aria-label={`${unreadNotifications.length} unread notifications`} onClick={() => {
            const notification = unreadNotifications[0] ?? userNotifications[0];
            if (notification) {
              update((next) => {
                const item = next.notifications.find((entry) => entry.id === notification.id);
                if (item) item.readAt = new Date().toISOString();
              });
              router.push(notification.href);
            } else if (pendingApplications.length) router.push(`/${role}/applications`);
            else notify('You are all caught up.');
          }}>
            <Bell className="h-4 w-4" />{unreadNotifications.length > 0 && <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-[#111111]" />}
          </button>
          <details className="relative">
            <summary className="flex cursor-pointer list-none items-center gap-2 rounded-md px-2 py-1.5 hover:bg-[#F6F6F4]">
              <span className="hidden text-right sm:block"><span className="block text-[11px] font-semibold">{user.name}</span><span className="block text-[10px] capitalize text-[#777777]">{user.role}</span></span>
              <ChevronDown className="h-3.5 w-3.5 text-[#777777]" />
            </summary>
            <div className="absolute right-0 top-full z-40 mt-2 w-60 rounded-lg border border-[#E5E5E5] bg-white p-3 shadow-[0_12px_32px_rgba(0,0,0,0.10)]">
              <p className="text-[12px] font-semibold">{user.name}</p><p className="mt-1 break-all text-[10px] text-[#777777]">{user.email}</p>
              <p className="mt-1 text-[10px] capitalize text-[#777777]">{roleTitle} · {user.status}</p>
              <div className="my-3 border-t border-[#E5E5E5]" />
              <Link href="/" className="block rounded px-2 py-2 text-[11px] hover:bg-[#F6F6F4]">Visit public site</Link>
              <button type="button" onClick={resetDemo} className="block w-full rounded px-2 py-2 text-left text-[11px] text-[#777777] hover:bg-[#F6F6F4] hover:text-[#111111]">Reset demo data</button>
              <button type="button" onClick={logout} className="flex w-full items-center gap-2 rounded px-2 py-2 text-left text-[11px] hover:bg-[#F6F6F4]"><LogOut className="h-3.5 w-3.5" />Sign out</button>
            </div>
          </details>
        </div>
      </div>
    </header>
    {mobileNavOpen && <nav className="fixed inset-0 top-[62px] z-20 bg-white p-4 lg:hidden" aria-label="Mobile dashboard navigation"><div className="mb-5 flex items-center justify-between"><div><p className="text-[13px] font-semibold">{user.name}</p><p className="text-[11px] capitalize text-[#777777]">{roleTitle}</p></div><button className="btn-icon" onClick={() => setMobileNavOpen(false)} aria-label="Close navigation"><X className="h-4 w-4" /></button></div>{pageNav.map(({ label, href, icon: Icon }) => <Link key={href} href={href} onClick={() => setMobileNavOpen(false)} className={`flex items-center gap-3 rounded-md px-3 py-3 text-[13px] ${pathname === href ? 'bg-[#F6F6F4] font-semibold' : 'text-[#595959]'}`}><Icon className="h-4 w-4" />{label}</Link>)}</nav>}
    <div className="mx-auto max-w-[1600px] lg:flex">
      <aside className="sticky top-[62px] hidden h-[calc(100vh-62px)] w-60 shrink-0 flex-col border-r border-[#E5E5E5] bg-white px-4 py-6 lg:flex">
        <p className="px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-[#777777]">{roleTitle}</p>
        <nav className="mt-4 grid gap-1" aria-label="Dashboard navigation">{pageNav.map(({ label, href, icon: Icon }) => <Link key={href} href={href} className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-[12px] transition-colors ${pathname === href || (href === '/landlord/properties' && pathname.startsWith('/landlord/properties/')) ? 'bg-[#F6F6F4] font-semibold text-[#111111]' : 'text-[#595959] hover:bg-[#F6F6F4] hover:text-[#111111]'}`}><Icon className="h-4 w-4" />{label}</Link>)}</nav>
        <div className="mt-auto border-t border-[#E5E5E5] px-3 pt-4 text-[10px] leading-relaxed text-[#777777]">RentEase demo workspace<br />Sample data stays in this browser.</div>
      </aside>
      <div className="min-w-0 flex-1">
      <div className="mx-auto max-w-[1440px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      {notice && <div role="status" className="mb-4 flex items-center justify-between gap-3 rounded-md border border-[#E5E5E5] bg-white px-4 py-3 text-[12px] shadow-sm"><span>{notice}</span><button aria-label="Dismiss notification" onClick={() => setNotice('')}><X className="h-3.5 w-3.5" /></button></div>}
      {content}
      {role === 'admin' && editingUser && <UserEditor initial={editingUser} onCancel={() => setEditingUserId(null)} onSave={(edited) => {
        const duplicate = data.users.some((item) => item.id !== edited.id && item.email.toLowerCase() === edited.email.toLowerCase());
        if (duplicate) {
          notify('That email address is already assigned to another demo account.');
          return;
        }
        update((next) => {
          const target = next.users.find((item) => item.id === edited.id);
          if (target) Object.assign(target, edited);
        });
        setEditingUserId(null);
        notify('User details updated.');
      }} />}
      <footer className="mt-10 border-t border-[#E5E5E5] pt-4 text-[10px] text-[#777777]">RentEase demo · Sample data saved in this browser · No real payment processing</footer>
    </div>
      </div>
    </div>
  </div>;
}
