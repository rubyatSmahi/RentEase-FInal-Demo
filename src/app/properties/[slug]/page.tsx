import type { Metadata } from 'next';
import { Suspense } from 'react';
import RentalPropertyDetail from '@/components/properties/RentalPropertyDetail';

export const metadata: Metadata = {
  title: 'Rental home details | RentEase',
  description: 'View rental home details and apply with RentEase.',
};

async function PropertyDetailContent({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <div className="min-h-screen bg-white"><RentalPropertyDetail slug={slug} /></div>;
}

export default function PropertyDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  return <Suspense fallback={<div className="container-custom py-24 text-center text-[13px] text-[#777777]">Loading home details…</div>}><PropertyDetailContent params={params} /></Suspense>;
}
