'use client';
import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { seedDemoData } from '@/data/rentease';
import { readDemoData } from '@/lib/demo-store';
import PropertyCard from '@/components/ui/PropertyCard';
import { Search, SlidersHorizontal } from 'lucide-react';
export default function PropertiesClient() {
    const searchParams = useSearchParams();
    const [properties, setProperties] = useState(seedDemoData.properties);
    const [location, setLocation] = useState(searchParams.get('location') ?? '');
    const [query, setQuery] = useState('');
    const [type, setType] = useState(searchParams.get('type') ?? '');
    const [bedrooms, setBedrooms] = useState('');
    const [bathrooms, setBathrooms] = useState('');
    const [maxRent, setMaxRent] = useState('');
    const [sort, setSort] = useState('recommended');
    const [view, setView] = useState('grid');
    useEffect(() => {
        const sync = () => setProperties(readDemoData().properties);
        sync();
        window.addEventListener('rentease-data-change', sync);
        window.addEventListener('storage', sync);
        return () => {
            window.removeEventListener('rentease-data-change', sync);
            window.removeEventListener('storage', sync);
        };
    }, []);
    const results = useMemo(() => properties.filter((property) => {
        if (property.availability !== 'Available' || property.approval !== 'Approved')
            return false;
        const search = `${property.title} ${property.city} ${property.address}`.toLowerCase();
        if (query && !search.includes(query.toLowerCase()))
            return false;
        if (location && property.city.toLowerCase() !== location.toLowerCase())
            return false;
        if (type && property.type !== type)
            return false;
        if (bedrooms && property.bedrooms < Number(bedrooms))
            return false;
        if (bathrooms && property.bathrooms < Number(bathrooms))
            return false;
        if (maxRent && property.rent > Number(maxRent))
            return false;
        return true;
    }).sort((a, b) => sort === 'rent-low' ? a.rent - b.rent : sort === 'rent-high' ? b.rent - a.rent : a.title.localeCompare(b.title)), [properties, query, location, type, bedrooms, bathrooms, maxRent, sort]);
    return (<div className="container-custom">
      <header className="border-b border-[#E5E5E5] pb-7">
        <span className="text-[11px] font-bold uppercase tracking-wider text-[#777777]">Rentals in Bangladesh</span>
        <h1 className="mt-1 text-[32px] font-bold tracking-tight sm:text-[44px]">Find your next home</h1>
        <p className="mt-2 max-w-2xl text-[14px] leading-relaxed text-[#595959]">Explore homes available to rent, with clear monthly prices and practical details.</p>
      </header>
      <section className="grid gap-3 border-b border-[#E5E5E5] py-5 sm:grid-cols-2 lg:grid-cols-7" aria-label="Filter rental listings">
        <label className="text-[11px] font-semibold uppercase tracking-wider text-[#595959] lg:col-span-2">Search
          <div className="relative mt-1.5"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#777777]"/><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Location or property name" className="w-full rounded-md border border-[#E5E5E5] py-2.5 pl-9 pr-3 text-[13px] font-normal normal-case tracking-normal"/></div>
        </label>
        <label className="text-[11px] font-semibold uppercase tracking-wider text-[#595959]">City
          <select value={location} onChange={(event) => setLocation(event.target.value)} className="mt-1.5 w-full rounded-md border border-[#E5E5E5] bg-white px-3 py-2.5 text-[13px] font-normal normal-case tracking-normal"><option value="">All cities</option><option>Dhaka</option><option>Chattogram</option><option>Sylhet</option></select>
        </label>
        <label className="text-[11px] font-semibold uppercase tracking-wider text-[#595959]">Home type
          <select value={type} onChange={(event) => setType(event.target.value)} className="mt-1.5 w-full rounded-md border border-[#E5E5E5] bg-white px-3 py-2.5 text-[13px] font-normal normal-case tracking-normal"><option value="">Any type</option><option>Apartment</option><option>House</option><option>Studio</option></select>
        </label>
        <label className="text-[11px] font-semibold uppercase tracking-wider text-[#595959]">Bedrooms
          <select value={bedrooms} onChange={(event) => setBedrooms(event.target.value)} className="mt-1.5 w-full rounded-md border border-[#E5E5E5] bg-white px-3 py-2.5 text-[13px] font-normal normal-case tracking-normal"><option value="">Any</option><option value="1">1+</option><option value="2">2+</option><option value="3">3+</option></select>
        </label>
        <label className="text-[11px] font-semibold uppercase tracking-wider text-[#595959]">Bathrooms
          <select value={bathrooms} onChange={(event) => setBathrooms(event.target.value)} className="mt-1.5 w-full rounded-md border border-[#E5E5E5] bg-white px-3 py-2.5 text-[13px] font-normal normal-case tracking-normal"><option value="">Any</option><option value="1">1+</option><option value="2">2+</option><option value="3">3+</option></select>
        </label>
        <label className="text-[11px] font-semibold uppercase tracking-wider text-[#595959]">Max monthly rent
          <select value={maxRent} onChange={(event) => setMaxRent(event.target.value)} className="mt-1.5 w-full rounded-md border border-[#E5E5E5] bg-white px-3 py-2.5 text-[13px] font-normal normal-case tracking-normal"><option value="">Any budget</option><option value="25000">Up to ৳25,000</option><option value="40000">Up to ৳40,000</option><option value="55000">Up to ৳55,000</option></select>
        </label>
      </section>
      <div className="flex flex-wrap items-center justify-between gap-3 py-5">
        <p className="text-[13px] text-[#595959]"><SlidersHorizontal className="mr-1 inline h-3.5 w-3.5"/>{results.length} available {results.length === 1 ? 'home' : 'homes'}</p>
        <div className="flex items-center gap-3">
          <label className="text-[12px] text-[#595959]">Sort
            <select value={sort} onChange={(event) => setSort(event.target.value)} className="ml-2 rounded-md border border-[#E5E5E5] bg-white px-2.5 py-2 text-[12px] text-[#111111]"><option value="recommended">Recommended</option><option value="rent-low">Rent: low to high</option><option value="rent-high">Rent: high to low</option><option value="name">Name</option></select>
          </label>
          <div className="hidden gap-1 sm:flex" aria-label="Listing view">
            <button type="button" aria-pressed={view === 'grid'} onClick={() => setView('grid')} className={`rounded border px-2.5 py-2 text-[11px] ${view === 'grid' ? 'bg-[#111111] text-white' : ''}`}>Grid</button>
            <button type="button" aria-pressed={view === 'list'} onClick={() => setView('list')} className={`rounded border px-2.5 py-2 text-[11px] ${view === 'list' ? 'bg-[#111111] text-white' : ''}`}>List</button>
          </div>
        </div>
      </div>
      {results.length ? (<div className={`grid gap-x-7 gap-y-10 pb-16 ${view === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1 md:grid-cols-2'}`}>
          {results.map((property) => <PropertyCard key={property.id} property={property}/>)}
        </div>) : (<div className="border-y border-[#E5E5E5] py-16 text-center">
          <h2 className="text-[19px] font-bold">No homes match those filters</h2>
          <p className="mt-2 text-[13px] text-[#595959]">Try changing your city, home type or budget.</p>
          <button type="button" className="btn-secondary mt-4" onClick={() => { setLocation(''); setType(''); setBedrooms(''); setBathrooms(''); setMaxRent(''); setQuery(''); }}>Clear filters</button>
        </div>)}
      <p className="border-t border-[#E5E5E5] py-5 text-[11px] text-[#777777]">All listings and prices are sample data for the RentEase demo.</p>
    </div>);
}
