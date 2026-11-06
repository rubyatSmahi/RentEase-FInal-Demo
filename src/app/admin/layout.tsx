import { ReactNode } from 'react';
import { Suspense } from 'react';
import DashboardApp from '@/components/dashboard/DashboardApp';

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <Suspense fallback={<div className="container-custom py-24 text-center text-[13px] text-[#777777]">Loading administrator workspace…</div>}><DashboardApp role="admin">{children}</DashboardApp></Suspense>;
}
