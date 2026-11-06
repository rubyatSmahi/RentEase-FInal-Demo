import React from 'react';
import HeroSection from '@/components/home/HeroSection';
import RentalSearchPanel from '@/components/home/RentalSearchPanel';
import NewPropertiesGrid from '@/components/home/NewPropertiesGrid';
import Link from 'next/link';
import { ArrowRight, ClipboardCheck, KeyRound, Wrench } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="w-full">
      <HeroSection />
      <RentalSearchPanel />
      <NewPropertiesGrid />
      <section className="border-y border-[#E5E5E5] py-14 sm:py-16">
        <div className="container-custom">
          <div className="mb-7"><span className="text-[11px] font-bold uppercase tracking-wider text-[#777777]">Browse by type</span><h2 className="mt-1 text-[27px] font-bold tracking-tight sm:text-[34px]">Find the kind of home that fits.</h2></div>
          <div className="grid gap-3 sm:grid-cols-3">
            {[['Apartment', 'Connected city living'], ['House', 'Room to settle in'], ['Studio', 'A simpler space']].map(([type, description]) => <Link key={type} href={`/properties?type=${type}`} className="group border-t border-[#D8D8D5] py-4 transition-colors hover:border-[#111111]">
              <span className="text-[17px] font-semibold">{type}</span><span className="mt-1 block text-[12px] text-[#777777]">{description}</span><span className="mt-4 inline-flex items-center gap-2 text-[11px] font-medium">Explore <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" /></span>
            </Link>)}
          </div>
        </div>
      </section>
      <section className="border-y border-[#E5E5E5] bg-[#F6F6F4] py-16 sm:py-20">
        <div className="container-custom">
          <div className="mb-10 max-w-2xl">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#777777]">How RentEase works</span>
            <h2 className="mt-1 text-[30px] font-bold tracking-tight sm:text-[38px]">A smoother rental, from search to stay.</h2>
            <p className="mt-3 text-[14px] leading-relaxed text-[#595959]">From finding a place to keeping up with rent and repairs, the essentials are easier to manage in one place.</p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              { icon: KeyRound, title: 'Find a home', text: 'Search Bangladesh-based listings, compare details and submit an application in a few steps.' },
              { icon: ClipboardCheck, title: 'Manage your tenancy', text: 'Keep rental details, due dates and payment history together in your tenant dashboard.' },
              { icon: Wrench, title: 'Stay on top of repairs', text: 'Send a maintenance request and follow its status without losing track of the conversation.' },
            ].map(({ icon: Icon, title, text }) => <article key={title} className="border-t border-[#D8D8D5] pt-5">
              <Icon className="h-5 w-5" /><h3 className="mt-4 text-[17px] font-bold">{title}</h3><p className="mt-2 text-[13px] leading-relaxed text-[#595959]">{text}</p>
            </article>)}
          </div>
        </div>
      </section>
      <section className="py-16 sm:py-20">
        <div className="container-custom flex flex-col items-start justify-between gap-6 border-b border-[#E5E5E5] pb-12 sm:flex-row sm:items-end">
          <div className="max-w-2xl">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#777777]">A clearer rental journey</span>
            <h2 className="mt-1 text-[30px] font-bold tracking-tight sm:text-[38px]">Good homes. Better managed.</h2>
            <p className="mt-3 text-[14px] leading-relaxed text-[#595959]">RentEase gives tenants and landlords simple tools to make the rental experience more organized and transparent.</p>
          </div>
          <Link href="/about" className="btn-secondary group">How RentEase works <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></Link>
        </div>
        <div className="container-custom mt-12 grid gap-8 md:grid-cols-2">
          <div><p className="text-[11px] font-bold uppercase tracking-wider text-[#777777]">For tenants</p><p className="mt-2 text-[18px] font-semibold">Find, apply and keep your rental details close.</p><Link href="/properties" className="mt-4 inline-block text-[13px] font-semibold underline underline-offset-4">Browse available homes</Link></div>
          <div><p className="text-[11px] font-bold uppercase tracking-wider text-[#777777]">For landlords</p><p className="mt-2 text-[18px] font-semibold">Manage listings, applications and requests in one place.</p><Link href="/register?role=landlord" className="mt-4 inline-block text-[13px] font-semibold underline underline-offset-4">Get started as a landlord</Link></div>
        </div>
      </section>
      <section className="border-y border-[#E5E5E5] bg-[#F6F6F4] py-16 sm:py-20">
        <div className="container-custom">
          <div className="mb-8 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div><span className="text-[11px] font-bold uppercase tracking-wider text-[#777777]">Built for better rental relationships</span><h2 className="mt-1 text-[28px] font-bold tracking-tight sm:text-[36px]">A little more peace of mind.</h2></div>
            <span className="text-[10px] text-[#777777]">Sample feedback for demonstration purposes</span>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              ['“It was easier to compare homes and keep track of the application.”', 'Nusrat Jahan', 'Tenant · Dhaka'],
              ['“Having requests and rent information together makes the process clearer.”', 'Farhan Ahmed', 'Landlord · Dhaka'],
              ['“A simple way to stay organized during a move to a new city.”', 'Tanvir Hasan', 'Tenant · Chattogram'],
            ].map(([quote, name, role]) => <figure key={name} className="flex min-h-44 flex-col justify-between border-t border-[#D8D8D5] bg-white p-5">
              <blockquote className="text-[13px] leading-relaxed text-[#333333]">{quote}</blockquote><figcaption className="mt-5 border-t border-[#F0F0EE] pt-3"><span className="block text-[12px] font-semibold">{name}</span><span className="text-[10px] text-[#777777]">{role} · Sample profile</span></figcaption>
            </figure>)}
          </div>
        </div>
      </section>
      <section className="bg-[#111111] py-14 text-white sm:py-16">
        <div className="container-custom flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <div><h2 className="text-[26px] font-bold tracking-tight sm:text-[32px]">Your next home starts here.</h2><p className="mt-2 text-[13px] text-white/70">Explore a better way to rent with RentEase.</p></div>
          <Link href="/properties" className="btn-white group">Find a home <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></Link>
        </div>
      </section>
    </div>
  );
}
