import Link from 'next/link';
import { ClipboardCheck, Home, Wrench } from 'lucide-react';
export const metadata = {
    title: 'About RentEase | Rental management made clearer',
    description: 'Learn how RentEase connects tenants and landlords across Bangladesh.',
};
const steps = [
    { icon: Home, title: 'Discover a home', text: 'Search rental listings by location, property type and monthly budget.' },
    { icon: ClipboardCheck, title: 'Apply and stay organized', text: 'Send an application, then keep your rental details and payment history together.' },
    { icon: Wrench, title: 'Manage the everyday', text: 'Tenants can report maintenance needs while landlords track requests and listing activity.' },
];
export default function AboutPage() {
    return (<div className="container-custom space-y-16 py-12 sm:py-16">
      <header className="max-w-3xl border-b border-[#E5E5E5] pb-10">
        <span className="text-[11px] font-bold uppercase tracking-wider text-[#777777]">About RentEase</span>
        <h1 className="mt-2 text-[36px] font-bold leading-tight tracking-tight sm:text-[52px]">A simpler way to rent and manage a home.</h1>
        <p className="mt-4 text-[15px] leading-relaxed text-[#595959]">RentEase is a rental property management concept designed for tenants and landlords in Bangladesh. It brings home discovery, applications and everyday rental tasks into one considered experience.</p>
      </header>
      <section>
        <div className="mb-8 max-w-2xl"><span className="text-[11px] font-bold uppercase tracking-wider text-[#777777]">How RentEase works</span><h2 className="mt-1 text-[28px] font-bold tracking-tight sm:text-[34px]">The rental journey, in a few clear steps.</h2></div>
        <div className="grid gap-8 md:grid-cols-3">
          {steps.map(({ icon: Icon, title, text }, index) => <article key={title} className="border-t border-[#E5E5E5] pt-5">
            <div className="flex items-center justify-between"><Icon className="h-5 w-5"/><span className="text-[12px] text-[#777777]">0{index + 1}</span></div>
            <h3 className="mt-5 text-[18px] font-bold">{title}</h3><p className="mt-2 text-[13px] leading-relaxed text-[#595959]">{text}</p>
          </article>)}
        </div>
      </section>
      <section className="grid gap-8 border-y border-[#E5E5E5] py-10 md:grid-cols-2">
        <div><h2 className="text-[20px] font-bold">For tenants</h2><p className="mt-2 max-w-lg text-[14px] leading-relaxed text-[#595959]">Compare local listings, submit an application and stay on top of rent, utilities and repair requests.</p></div>
        <div><h2 className="text-[20px] font-bold">For landlords</h2><p className="mt-2 max-w-lg text-[14px] leading-relaxed text-[#595959]">Publish available homes, review applications and coordinate tenants, payments and maintenance in one dashboard.</p></div>
      </section>
      <aside className="flex flex-col items-start justify-between gap-5 rounded-xl bg-[#F6F6F4] p-7 sm:flex-row sm:items-center sm:p-9">
        <div><h2 className="text-[22px] font-bold">Ready to explore?</h2><p className="mt-1 text-[13px] text-[#595959]">Browse homes or create a demo account to see RentEase in action.</p></div>
        <div className="flex flex-wrap gap-3"><Link href="/properties" className="btn-primary">Browse homes</Link><Link href="/register" className="btn-secondary">Create account</Link></div>
      </aside>
      <p className="text-[11px] text-[#777777]">RentEase is currently a frontend-only demonstration. Accounts, listings and transactions are sample data saved in this browser.</p>
    </div>);
}
