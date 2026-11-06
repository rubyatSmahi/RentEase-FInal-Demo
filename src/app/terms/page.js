export const metadata = {
    title: 'Terms | RentEase',
    description: 'Demonstration terms for the RentEase rental management frontend.',
};
export default function TermsPage() {
    return <article className="container-custom max-w-3xl space-y-6 py-12 text-[14px] leading-relaxed text-[#555555] sm:py-16">
    <header><span className="text-[11px] font-bold uppercase tracking-wider text-[#777777]">RentEase</span><h1 className="mt-1 text-[36px] font-bold tracking-tight text-[#111111]">Demo terms</h1></header>
    <p>RentEase is a frontend-only university project demonstration. Listings, rent amounts, people, applications, payments, contact details and property records are sample content and do not represent real offers or transactions.</p>
    <h2 className="text-[18px] font-bold text-[#111111]">No real services or payments</h2>
    <p>This site does not provide legal tenancy agreements, verify listings, deliver property management services or process payments. Payment controls only update sample records in this browser.</p>
    <h2 className="text-[18px] font-bold text-[#111111]">Use of demo accounts</h2>
    <p>Demo accounts and changes are stored locally in the current browser. Please use only the credentials shown on the login page and avoid entering real confidential information.</p>
  </article>;
}
