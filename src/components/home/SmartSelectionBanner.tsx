'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import ConsultationModal from '@/components/ui/ConsultationModal';
import ScrollReveal from '@/components/ui/ScrollReveal';

export default function SmartSelectionBanner() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <section className="py-16 sm:py-24 bg-white">
      <div className="container-custom">
        <ScrollReveal direction="up" distance={20} duration={600}>
          <div className="relative bg-[#F6F6F4] rounded-2xl overflow-hidden p-8 sm:p-12 lg:p-16 border border-[#E5E5E5]">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              {/* Left Content */}
              <div className="lg:col-span-7 space-y-6">
                <h2 className="text-[32px] sm:text-[46px] font-bold text-[#111111] leading-[1.1] tracking-tight max-w-xl">
                  Smart selection <br />of premium real estate
                </h2>
                <p className="text-[14px] sm:text-[15px] leading-relaxed text-[#666666] max-w-lg font-normal">
                  We offer a selection of premium real estate — from modern villas to historical residences — each chosen for its architectural integrity, location, and long-term value.
                </p>

                <div className="pt-2 flex flex-wrap items-center gap-4">
                  <Link
                    href="/properties"
                    className="btn-primary"
                  >
                    Explore properties
                  </Link>
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="btn-white"
                  >
                    Get consultation
                  </button>
                </div>
              </div>

              {/* Right Overlapping Images (matching Reference 3) */}
              <div className="lg:col-span-5 relative min-h-[300px] sm:min-h-[360px] flex items-center justify-center">
                {/* Back Villa Photo */}
                <div className="relative w-48 sm:w-64 aspect-[4/5] rounded-xl overflow-hidden shadow-lg border-2 border-white -translate-x-10 sm:-translate-x-14 -rotate-3 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:rotate-0 hover:scale-[1.03]">
                  <Image
                    src="/images/hero/banner-villa.jpg"
                    alt="Luxury modern estate architecture"
                    fill
                    sizes="260px"
                    className="object-cover"
                  />
                </div>

                {/* Front Couple Photo */}
                <div className="absolute w-52 sm:w-68 aspect-[4/5] rounded-xl overflow-hidden shadow-2xl border-4 border-white translate-x-10 sm:translate-x-12 rotate-3 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:rotate-0 hover:scale-[1.03]">
                  <Image
                    src="/images/hero/couple-keys.jpg"
                    alt="Happy homeowners holding keys to luxury home"
                    fill
                    sizes="280px"
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>

      <ConsultationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialContext="Smart Selection Banner"
      />
    </section>
  );
}
