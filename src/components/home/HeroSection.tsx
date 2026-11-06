import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ShieldCheck } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="overflow-hidden bg-white pb-10 pt-8 lg:pb-14 lg:pt-12">
      <div className="container-custom">
        <div className="mb-8 grid grid-cols-1 items-start gap-6 lg:mb-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-8">
            <p className="animate-hero-desc mb-3 text-[11px] font-bold uppercase tracking-[0.2em] text-[#777777]">Renting, made more straightforward</p>
            <h1 className="animate-hero-title text-[38px] font-bold leading-[1.06] tracking-tight text-[#111111] sm:text-[54px] lg:text-[70px]">
              Find a place you<br className="hidden sm:inline" /> can call home.
            </h1>
            <div className="animate-hero-cta mt-6 flex flex-wrap items-center gap-3">
              <Link href="/properties" className="btn-primary group">Explore homes <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></Link>
              <Link href="/register?role=landlord" className="btn-secondary">List your property</Link>
            </div>
          </div>
          <div className="lg:col-span-4 lg:pt-8">
            <p className="animate-hero-desc text-[14px] leading-relaxed text-[#595959] sm:text-[15px]">
              Discover a home that fits your life, or manage your rental with less hassle. RentEase brings Bangladesh&apos;s tenants and landlords together in one clear, connected place.
            </p>
            <div className="mt-4 flex items-center gap-2 text-[12px] text-[#555555]">
              <ShieldCheck className="h-4 w-4" /><span>Clear listings · Simple rental management</span>
            </div>
          </div>
        </div>
        <div className="animate-hero-curtain group relative aspect-[16/9] w-full overflow-hidden rounded-xl bg-[#F6F6F4] shadow-[0_8px_30px_rgba(0,0,0,0.06)] sm:aspect-[21/9]">
          <Image src="/images/hero/hero-luxury-villa.jpg" alt="A calm, light-filled modern home" fill priority sizes="100vw" className="object-cover object-center transition-transform duration-1000 group-hover:scale-[1.025]" />
          <div className="animate-hero-badge absolute bottom-5 left-5 max-w-xs rounded-lg border border-[#E5E5E5] bg-white/95 px-4 py-3 shadow-lg backdrop-blur-md sm:bottom-7 sm:left-7">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#595959]">A home for your next chapter</p>
            <p className="mt-1 text-[13px] font-semibold">Discover homes across Bangladesh</p>
            <p className="text-[11px] text-[#555555]">Dhaka · Chattogram · Sylhet</p>
          </div>
        </div>
      </div>
    </section>
  );
}
