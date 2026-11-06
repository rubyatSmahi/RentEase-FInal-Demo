'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { seedDemoData } from '@/data/rentease';
import PropertyCard from '@/components/ui/PropertyCard';
import { ArrowRight } from 'lucide-react';
import { readDemoData } from '@/lib/demo-store';
export default function NewPropertiesGrid() {
    const [properties, setProperties] = useState(seedDemoData.properties);
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
    const featuredProperties = properties.filter((property) => property.availability === 'Available' && property.approval === 'Approved').slice(0, 3);
    return (<section className="py-14 sm:py-20 bg-white">
      <div className="container-custom">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <h2 className="text-[28px] sm:text-[36px] font-bold text-[#111111] tracking-tight">Homes ready to rent</h2>
              <p className="text-[14px] text-[#595959] mt-1 font-normal">
                Browse available homes and find the right fit for your next move.
              </p>
            </div>
            <Link href="/properties" className="group inline-flex items-center gap-2 text-[13.5px] font-medium text-[#111111] hover:text-[#555555]">
              <span>View all homes</span><ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1"/>
            </Link>
          </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
          {featuredProperties.map((property, index) => (<PropertyCard key={property.id} property={property} priority={index === 0}/>))}
        </div>
        <div className="mt-10 sm:hidden text-center">
          <Link href="/properties" className="btn-secondary w-full">
            <span>View all homes</span><ArrowRight className="h-4 w-4"/>
          </Link>
        </div>
      </div>
    </section>);
}
