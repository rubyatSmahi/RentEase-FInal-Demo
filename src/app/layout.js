import { Suspense } from 'react';
import { Manrope } from 'next/font/google';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
const manrope = Manrope({
    subsets: ['latin'],
    variable: '--font-manrope',
    weight: ['300', '400', '500', '600', '700', '800'],
    display: 'swap',
});
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://rentease.demo';
export const metadata = {
    title: 'RentEase | Smart Rental Property Management',
    description: 'Find your next rental home or manage your property with RentEase, a smart rental platform for tenants and landlords across Bangladesh.',
    metadataBase: new URL(siteUrl),
    openGraph: {
        title: 'RentEase | Smart Rental Property Management',
        description: 'Find a home and manage your rental in one place.',
        images: ['/images/hero/hero-luxury-villa.jpg'],
        type: 'website',
        siteName: 'RentEase',
        locale: 'en_BD',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'RentEase | Smart Rental Property Management',
        description: 'Find a home and manage your rental in one place.',
        images: ['/images/hero/hero-luxury-villa.jpg'],
    },
};
const organizationJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'RealEstateAgent',
    name: 'RentEase',
    description: 'Rental property discovery and management platform for Bangladesh.',
    url: siteUrl,
    telephone: '+880-1700-000000',
    email: 'hello@rentease.demo',
    address: {
        '@type': 'PostalAddress',
        addressLocality: 'Dhaka',
        addressCountry: 'BD',
    },
    priceRange: '৳18,000–৳68,000 per month',
};
export default function RootLayout({ children, }) {
    return (<html lang="en-BD" className={`${manrope.variable} font-sans`}>
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}/>
      </head>
      <body className="min-h-screen bg-white text-[#111111] antialiased selection:bg-[#111111] selection:text-white flex flex-col">
        <Suspense fallback={null}>
          <Header />
        </Suspense>
        <main id="main-content" tabIndex={-1} className="flex-1 focus:outline-none">
          {children}
        </main>
        <Suspense fallback={null}>
          <Footer />
        </Suspense>
      </body>
    </html>);
}
