import { MetadataRoute } from 'next';
import { seedDemoData } from '@/data/rentease';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://rentease.demo';

  const staticRoutes = ['', '/properties', '/about', '/contact', '/login', '/register'].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1.0 : 0.8,
  }));

  const propertyRoutes = seedDemoData.properties.filter((property) => property.availability === 'Available' && property.approval === 'Approved').map((property) => ({
    url: `${baseUrl}/properties/${property.slug}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }));

  return [...staticRoutes, ...propertyRoutes];
}
