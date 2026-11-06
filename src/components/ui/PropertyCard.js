import Image from 'next/image';
import Link from 'next/link';
import { Bath, Bed, MapPin, Maximize2 } from 'lucide-react';
import { formatTaka } from '@/data/rentease';
export default function PropertyCard({ property, priority = false }) {
    return (<article className="group -m-1.5 flex flex-col overflow-hidden rounded-lg border border-transparent bg-white p-1.5 transition-all duration-300 hover:border-[#E5E5E5]">
      <Link href={`/properties/${property.slug}`} className="relative block aspect-[4/3] w-full overflow-hidden rounded-md bg-[#F6F6F4] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#111111]">
        <Image src={property.image} alt={property.title} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" priority={priority} className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.035]"/>
        <span className="absolute left-3.5 top-3.5 rounded border border-[#E5E5E5]/60 bg-white/95 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-[#111111] shadow-sm backdrop-blur-md">
          {property.type}
        </span>
        <span className="absolute right-3.5 top-3.5 rounded border border-[#E5E5E5]/60 bg-white/95 px-2.5 py-1 text-[10px] font-semibold text-[#111111] shadow-sm backdrop-blur-md">
          {property.availability}
        </span>
      </Link>
      <div className="flex flex-1 flex-col justify-between px-1 pb-1 pt-3.5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <Link href={`/properties/${property.slug}`} className="inline-flex max-w-full items-center gap-1 rounded text-[16px] font-bold leading-snug text-[#111111] hover:text-[#555555] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#111111]">
              <span className="truncate">{property.title}</span>
            </Link>
            <div className="mt-1 flex items-center gap-1 text-[12px] text-[#595959]">
              <MapPin className="h-3.5 w-3.5 shrink-0"/>
              <span className="truncate">{property.city}</span>
            </div>
          </div>
          <div className="shrink-0 text-right">
            <span className="text-[16px] font-bold tracking-tight text-[#111111]">{formatTaka(property.rent)}</span>
            <span className="mt-0.5 block text-[10px] text-[#777777]">per month</span>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-4 border-t border-[#F0F0EE] pt-3 text-[12px] text-[#555555]">
          <span className="flex items-center gap-1.5" title="Bedrooms"><Bed className="h-3.5 w-3.5 text-[#999999]"/>{property.bedrooms} beds</span>
          <span className="flex items-center gap-1.5" title="Bathrooms"><Bath className="h-3.5 w-3.5 text-[#999999]"/>{property.bathrooms} baths</span>
          <span className="flex items-center gap-1.5" title="Floor area"><Maximize2 className="h-3.5 w-3.5 text-[#999999]"/>{property.area.toLocaleString()} sqft</span>
        </div>
      </div>
    </article>);
}
