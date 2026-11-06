export const metadata = {
    title: 'Privacy | RentEase',
    description: 'How data is handled in the RentEase frontend demonstration.',
};
export default function PrivacyPage() {
    return <article className="container-custom max-w-3xl space-y-6 py-12 text-[14px] leading-relaxed text-[#555555] sm:py-16">
    <header><span className="text-[11px] font-bold uppercase tracking-wider text-[#777777]">RentEase</span><h1 className="mt-1 text-[36px] font-bold tracking-tight text-[#111111]">Privacy notice</h1></header>
    <p>RentEase is a frontend-only project demonstration. Demo accounts, listings, applications, payments and maintenance records are stored in the browser&apos;s local storage so the sample workflows work after refresh.</p>
    <h2 className="text-[18px] font-bold text-[#111111]">What is not connected</h2>
    <p>This site does not send data to a backend, payment provider, email service or analytics platform. Contact forms only provide local demo feedback. Do not enter real passwords, payment information or sensitive personal data.</p>
    <h2 className="text-[18px] font-bold text-[#111111]">Removing demo data</h2>
    <p>You can clear this demonstration&apos;s records by removing the <code>rentease-demo-data</code> and <code>rentease-demo-session</code> browser storage entries for this site.</p>
    <p className="text-[11px] text-[#777777]">This notice describes the university project demo and is not legal advice.</p>
  </article>;
}
