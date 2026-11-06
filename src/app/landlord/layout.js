import { Suspense } from 'react';
import DashboardApp from '@/components/dashboard/DashboardApp';
export default function LandlordLayout({ children }) {
    return <Suspense fallback={<div className="container-custom py-24 text-center text-[13px] text-[#777777]">Loading landlord workspace…</div>}><DashboardApp role="landlord">{children}</DashboardApp></Suspense>;
}
