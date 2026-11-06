import React, { Suspense } from 'react';
import PropertiesClient from '@/components/properties/PropertiesClient';
export const metadata = {
    title: 'Rental homes in Bangladesh | RentEase',
    description: 'Search rental homes across Dhaka, Chattogram and Sylhet.',
};
export default function PropertiesPage() {
    return (<div className="bg-white min-h-screen py-10 sm:py-14">
      <Suspense fallback={<div className="container-custom py-20 text-center">
          <div className="inline-block w-8 h-8 border-2 border-[#111111] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-[13px] text-[#777777] mt-3">Loading available homes...</p>
        </div>}>
        <PropertiesClient />
      </Suspense>
    </div>);
}
