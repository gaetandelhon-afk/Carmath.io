import { MetadataRoute } from 'next';
import { locales } from '@/lib/i18n';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://carmath.io';
  const pages = [
    '',                 // home (calculator)
    '/calculators',
    '/guides',
    '/guides/car-payment-explained',
    '/guides/bi-weekly-vs-monthly',
    '/guides/refinancing-car-loan',
    '/glossary',
    '/glossary/apr',
    '/glossary/ltv',
    '/glossary/dti',
    '/glossary/residual-value',
    '/glossary/money-factor',
    '/countries',
    '/countries/us',
    '/countries/fr'
  ];

  const urls = pages.flatMap(p =>
    locales.map(l => ({
      url: `${base}/${l}${p}`,
      changefreq: 'weekly' as const,
      priority: p === '' ? 1.0 : 0.7
    }))
  );
  return urls;
}
