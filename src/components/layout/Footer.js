'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MapPin, Mail, Phone } from 'lucide-react';
export default function Footer() {
    const pathname = usePathname();
    if (/^\/(tenant|landlord|admin)(\/|$)/.test(pathname))
        return null;
    return (<footer className="border-t border-[#E5E5E5] bg-white py-12 text-[#111111]">
      <div className="container-custom">
        <div className="grid gap-10 border-b border-[#E5E5E5] pb-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4 lg:col-span-2">
            <Link href="/" className="inline-flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#111111] text-[16px] font-bold text-white">R</span>
              <span className="text-[16px] font-extrabold tracking-[0.16em]">RENTEASE</span>
            </Link>
            <p className="max-w-md text-[13px] leading-relaxed text-[#666666]">
              A clearer way to find a home and manage your rental. Bringing tenants and landlords together across Bangladesh.
            </p>
            <p className="text-[11px] text-[#777777]">A frontend demo. Listings, payments and account details are sample data only.</p>
          </div>
          <div>
            <h2 className="mb-3 text-[11px] font-bold uppercase tracking-[0.14em]">Explore</h2>
            <div className="grid gap-2 text-[13px] text-[#666666]">
              <Link href="/properties" className="hover:text-[#111111]">Available homes</Link>
              <Link href="/about" className="hover:text-[#111111]">How RentEase works</Link>
              <Link href="/contact" className="hover:text-[#111111]">Contact</Link>
              <Link href="/register" className="hover:text-[#111111]">List your property</Link>
              <Link href="/privacy" className="hover:text-[#111111]">Privacy notice</Link>
              <Link href="/terms" className="hover:text-[#111111]">Demo terms</Link>
            </div>
          </div>
          <div className="space-y-3">
            <h2 className="text-[11px] font-bold uppercase tracking-[0.14em]">Dhaka, Bangladesh</h2>
            <p className="flex items-start gap-2 text-[13px] text-[#666666]"><MapPin className="mt-0.5 h-4 w-4 shrink-0"/> Gulshan Avenue, Dhaka 1212</p>
            <a href="mailto:hello@rentease.demo" className="flex items-center gap-2 text-[13px] text-[#666666] hover:text-[#111111]"><Mail className="h-4 w-4"/> hello@rentease.demo</a>
            <a href="tel:+8801700000000" className="flex items-center gap-2 text-[13px] text-[#666666] hover:text-[#111111]"><Phone className="h-4 w-4"/> +880 1700-000000</a>
          </div>
        </div>
        <div className="flex flex-col justify-between gap-2 pt-5 text-[11px] text-[#777777] sm:flex-row">
          <span>© 2026 RentEase · Smart Rental Property Management System</span>
          <span>Demo experience · No real payments or tenancy agreements are processed.</span>
        </div>
      </div>
    </footer>);
}
