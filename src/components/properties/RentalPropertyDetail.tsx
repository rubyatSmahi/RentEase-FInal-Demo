'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Bath, Bed, MapPin, Maximize2, MessageSquare, ShieldCheck } from 'lucide-react';
import { RentalProperty, DemoUser, seedDemoData, formatTaka } from '@/data/rentease';
import { createDemoId, createDemoNotification, readDemoData, readSession, updateDemoData } from '@/lib/demo-store';
import ConsultationModal from '@/components/ui/ConsultationModal';

export default function RentalPropertyDetail({ slug }: { slug: string }) {
  const router = useRouter();
  const [properties, setProperties] = useState<RentalProperty[]>(seedDemoData.properties);
  const [users, setUsers] = useState(seedDemoData.users);
  const [user, setUser] = useState<DemoUser | null>(null);
  const [notice, setNotice] = useState('');
  const [loading, setLoading] = useState(false);
  const [isInquiryOpen, setIsInquiryOpen] = useState(false);

  useEffect(() => {
    const sync = () => {
      const data = readDemoData();
      setProperties(data.properties);
      setUsers(data.users);
      setUser(readSession());
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

  const property = useMemo(() => properties.find((item) => item.slug === slug), [properties, slug]);

  function apply() {
    if (!user) {
      router.push(`/login?next=${encodeURIComponent(`/properties/${slug}`)}`);
      return;
    }
    if (user.role !== 'tenant') {
      setNotice('Rental applications are available to tenant accounts. Sign in as a tenant to continue.');
      return;
    }
    setLoading(true);
    const data = readDemoData();
    if (data.applications.some((application) => application.tenantId === user.id && application.propertyId === property?.id && application.status === 'Pending')) {
      setNotice('You already have a pending application for this home.');
    } else if (property) {
      updateDemoData((next) => {
        next.applications.unshift({
          id: createDemoId('application'),
          tenantId: user.id,
          propertyId: property.id,
          submittedAt: new Date().toISOString().slice(0, 10),
          status: 'Pending',
          message: 'I would like to be considered for this rental.',
        });
        next.notifications.unshift(createDemoNotification(
          property.landlordId,
          `A new rental application was submitted for ${property.title}.`,
          '/landlord/applications',
        ));
      });
      setNotice('Application submitted. You can follow its status in your tenant dashboard.');
    }
    setLoading(false);
  }

  if (!property) return <div className="container-custom py-20 text-center"><h1 className="text-[24px] font-bold">Home not found</h1><p className="mt-2 text-[13px] text-[#595959]">This listing may have been removed or archived.</p><Link href="/properties" className="btn-secondary mt-5">Browse available homes</Link></div>;

  const photos = [property.image, '/images/properties/floor-plan-sample.jpg', '/images/properties/serenity-tower.jpg'];

  return (
    <div className="container-custom py-8 sm:py-12">
      <Link href="/properties" className="mb-5 inline-flex items-center gap-2 text-[12px] text-[#595959] hover:text-[#111111]"><ArrowLeft className="h-3.5 w-3.5" />All homes</Link>
      <div className="grid gap-3 md:grid-cols-[1.4fr_1fr]">
        <div className="relative min-h-[260px] overflow-hidden rounded-lg bg-[#F6F6F4] md:row-span-2 md:min-h-[470px]">
          <Image src={photos[0]} alt={property.title} fill priority sizes="(max-width: 768px) 100vw, 60vw" className="object-cover" />
        </div>
        {photos.slice(1).map((photo, index) => <div key={photo} className="relative hidden min-h-[220px] overflow-hidden rounded-lg bg-[#F6F6F4] md:block">
          <Image src={photo} alt={`${property.title} view ${index + 2}`} fill sizes="40vw" className="object-cover" />
        </div>)}
      </div>
      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_350px]">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded border border-[#E5E5E5] bg-[#F6F6F4] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider">{property.type}</span>
            <span className="rounded bg-[#F6F6F4] px-2.5 py-1 text-[10px] font-semibold">{property.availability}</span>
          </div>
          <h1 className="mt-3 text-[30px] font-bold tracking-tight sm:text-[42px]">{property.title}</h1>
          <p className="mt-2 flex items-center gap-2 text-[13px] text-[#595959]"><MapPin className="h-4 w-4" />{property.address}, {property.city}, Bangladesh</p>
          <div className="mt-5 flex flex-wrap gap-5 border-y border-[#E5E5E5] py-4 text-[13px] text-[#555555]">
            <span className="flex items-center gap-2"><Bed className="h-4 w-4" />{property.bedrooms} bedrooms</span>
            <span className="flex items-center gap-2"><Bath className="h-4 w-4" />{property.bathrooms} bathrooms</span>
            <span className="flex items-center gap-2"><Maximize2 className="h-4 w-4" />{property.area.toLocaleString()} sqft</span>
          </div>
          <section className="mt-7"><h2 className="text-[18px] font-bold">About this home</h2><p className="mt-2 text-[13px] leading-relaxed text-[#595959]">{property.description}</p></section>
          <section className="mt-7"><h2 className="text-[18px] font-bold">Amenities</h2><div className="mt-3 flex flex-wrap gap-2">{property.amenities.map((amenity) => <span key={amenity} className="rounded-md border border-[#E5E5E5] px-3 py-2 text-[12px]">{amenity}</span>)}</div></section>
          <section className="mt-7 border-t border-[#E5E5E5] pt-6"><h2 className="text-[18px] font-bold">Location</h2><p className="mt-2 flex items-center gap-2 text-[13px] text-[#595959]"><MapPin className="h-4 w-4" />{property.address}, {property.city}</p><div className="mt-3 flex min-h-32 items-center justify-center rounded-lg border border-[#E5E5E5] bg-[#F6F6F4] text-center text-[12px] text-[#777777]">Map preview · {property.city}, Bangladesh</div></section>
        </div>
        <aside className="h-fit rounded-xl border border-[#E5E5E5] p-5 sm:p-6">
          <p className="text-[11px] font-bold uppercase tracking-wider text-[#777777]">Monthly rent</p>
          <p className="mt-1 text-[28px] font-extrabold tracking-tight">{formatTaka(property.rent)}<span className="ml-1 text-[13px] font-normal text-[#777777]">/ month</span></p>
          <p className="mt-2 text-[12px] text-[#595959]">Available from {new Date(`${property.availableFrom}T00:00:00`).toLocaleDateString('en-BD', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
          <button type="button" disabled={loading || property.availability !== 'Available'} onClick={apply} className="btn-primary mt-5 w-full disabled:cursor-not-allowed disabled:opacity-50">{loading ? 'Submitting…' : 'Apply for rental'}</button>
          <button type="button" onClick={() => setIsInquiryOpen(true)} className="btn-secondary mt-2 w-full"><MessageSquare className="mr-2 h-4 w-4" />Ask a question / request a viewing</button>
          {notice && <p role="status" className="mt-3 text-[12px] leading-relaxed text-[#444444]">{notice}</p>}
          <div className="mt-5 border-t border-[#E5E5E5] pt-4">
            <h2 className="text-[13px] font-semibold">Rental terms · sample</h2>
            <div className="mt-2 flex justify-between gap-3 text-[11px]"><span className="text-[#777777]">Minimum lease</span><span>12 months</span></div>
            <div className="mt-2 flex justify-between gap-3 text-[11px]"><span className="text-[#777777]">Security deposit</span><span>{formatTaka(property.rent)}</span></div>
            <p className="mt-2 text-[10px] leading-relaxed text-[#777777]">Illustrative terms only; the landlord may confirm actual conditions.</p>
          </div>
          <div className="mt-5 border-t border-[#E5E5E5] pt-4">
            <div className="flex items-center gap-2 text-[13px] font-semibold"><ShieldCheck className="h-4 w-4" />Landlord</div>
            <p className="mt-1 text-[13px]">{users.find((item) => item.id === property.landlordId)?.name ?? 'RentEase landlord'}</p>
            <p className="mt-1 text-[11px] text-[#777777]">Listing and contact details are sample data.</p>
          </div>
          <p className="mt-4 text-[11px] leading-relaxed text-[#777777]">No payment is taken when applying. This frontend demo stores the sample application in your browser.</p>
        </aside>
      </div>
      <ConsultationModal isOpen={isInquiryOpen} onClose={() => setIsInquiryOpen(false)} initialContext="Rental inquiry" propertyTitle={property.title} />
    </div>
  );
}
