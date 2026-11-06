'use client';

import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import { useState } from 'react';

export default function RentalSearchPanel() {
  const router = useRouter();
  const [location, setLocation] = useState('');
  const [type, setType] = useState('');

  function search(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const params = new URLSearchParams();
    if (location) params.set('location', location);
    if (type) params.set('type', type);
    router.push(`/properties${params.size ? `?${params}` : ''}`);
  }

  return (
    <section className="relative z-10 -mt-2 border-b border-[#E5E5E5]/70 bg-white pb-14 pt-2">
      <div className="container-custom">
        <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#777777]">Find your next home</span>
            <h2 className="mt-1 text-[25px] font-bold tracking-tight sm:text-[32px]">A better place to rent</h2>
          </div>
          <p className="max-w-md text-[13px] leading-relaxed text-[#595959]">Search verified demo listings across Dhaka, Chattogram and Sylhet.</p>
        </div>
        <form onSubmit={search} className="grid gap-3 rounded-xl border border-[#E5E5E5] bg-white p-4 shadow-[0_4px_24px_rgba(0,0,0,0.03)] sm:grid-cols-[1fr_1fr_auto] sm:p-5">
          <label className="text-[11px] font-semibold uppercase tracking-wider text-[#555555]">
            Location
            <select value={location} onChange={(event) => setLocation(event.target.value)} className="mt-1.5 block w-full rounded-md border border-[#E5E5E5] bg-white px-3 py-2.5 text-[13px] font-normal normal-case tracking-normal text-[#111111]">
              <option value="">All locations</option><option>Dhaka</option><option>Chattogram</option><option>Sylhet</option>
            </select>
          </label>
          <label className="text-[11px] font-semibold uppercase tracking-wider text-[#555555]">
            Home type
            <select value={type} onChange={(event) => setType(event.target.value)} className="mt-1.5 block w-full rounded-md border border-[#E5E5E5] bg-white px-3 py-2.5 text-[13px] font-normal normal-case tracking-normal text-[#111111]">
              <option value="">Any property type</option><option>Apartment</option><option>House</option><option>Studio</option>
            </select>
          </label>
          <button type="submit" className="btn-primary self-end"><Search className="h-4 w-4" />Search homes</button>
        </form>
      </div>
    </section>
  );
}
