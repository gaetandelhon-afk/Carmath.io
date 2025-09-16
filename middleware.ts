import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { locales, defaultLocale, isLocale } from './lib/i18n'
import { countryToCurrency, defaultCurrency } from './lib/currency'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Ignore public files and API
  if (pathname.startsWith('/_next') || pathname.startsWith('/api') || pathname.startsWith('/favicon')) {
    return NextResponse.next()
  }

  // Already has locale
  const pathLocale = pathname.split('/')[1]
  if (isLocale(pathLocale)) {
    return NextResponse.next()
  }

  // Try cookie override
  const cookieLocale = request.cookies.get('app_locale')?.value
  let locale = (cookieLocale && locales.includes(cookieLocale as any)) ? cookieLocale : null

  // Detect from Accept-Language
  if (!locale) {
    const header = request.headers.get('accept-language') || ''
    const preferred = header.split(',').map(x => x.split(';')[0].trim())
    locale = preferred.find(l => locales.includes(l.split('-')[0] as any))?.split('-')[0] || defaultLocale
  }

  // Currency cookie or derive from country (Vercel edge geo or fallback by locale)
  let currency = request.cookies.get('app_currency')?.value
  if (!currency) {
    const country = (request.geo && request.geo.country) || // on Vercel
                    (locale === 'en' ? 'US' : locale === 'fr' ? 'FR' : locale === 'de' ? 'DE' : undefined)
    const cur = (country && countryToCurrency[country]) || defaultCurrency
    currency = cur.code
  }

  const url = request.nextUrl.clone()
  url.pathname = `/${locale}${pathname}`
  const response = NextResponse.redirect(url)
  response.cookies.set('app_locale', locale, { path: '/' })
  response.cookies.set('app_currency', currency, { path: '/' })
  return response
}

export const config = {
  matcher: ['/((?!_next|api|.*\..*).*)'],
}
