import { Suspense } from 'react';
import DashboardApp from '@/components/dashboard/DashboardApp';
export default function TenantLayout({ children }) {
    return <Suspense fallback={<div className="container-custom py-24 text-center text-[13px] text-[#777777]">Loading tenant workspace…</div>}><DashboardApp role="tenant">{children}</DashboardApp></Suspense>;
}
