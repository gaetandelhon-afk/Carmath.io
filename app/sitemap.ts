import { MetadataRoute } from 'next'
import { locales } from '@/lib/i18n'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://carmath.io'
  const paths = ['', '/car-payment-calculator'].flatMap(p => 
    locales.map(l => ({
      url: `${base}/${l}${p}`,
      changefreq: 'weekly' as const,
      priority: 0.8
    }))
  )
  return paths
}
