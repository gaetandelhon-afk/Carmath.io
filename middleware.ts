// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { locales, defaultLocale, isLocale } from './lib/i18n';
import { countryToCurrency, defaultCurrency } from './lib/currency';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ⚠️ Laisser passer les fichiers/actifs spéciaux (pas de redirection locale)
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/favicon') ||
    pathname === '/robots.txt' ||
    pathname === '/sitemap.xml' ||
    pathname === '/manifest.webmanifest' ||
    pathname.startsWith('/opengraph-image') ||
    pathname.startsWith('/twitter-image') ||
    pathname.startsWith('/icon') ||
    pathname.startsWith('/apple-icon') ||
    pathname.includes('.') // toute ressource avec une extension (.txt, .xml, .png, etc.)
  ) {
    return NextResponse.next();
  }

  // Si l'URL possède déjà un préfixe de langue, ne rien faire
  const pathLocale = pathname.split('/')[1];
  if (isLocale(pathLocale)) {
    return NextResponse.next();
  }

  // 1) Locale : cookie > Accept-Language > défaut
  const cookieLocale = request.cookies.get('app_locale')?.value;
  let locale =
    (cookieLocale && locales.includes(cookieLocale as any) && cookieLocale) ||
    null;

  if (!locale) {
    const header = request.headers.get('accept-language') || '';
    const preferred = header.split(',').map((x) => x.split(';')[0].trim());
    locale =
      preferred.find((l) => locales.includes(l.split('-')[0] as any))?.split('-')[0] ||
      defaultLocale;
  }

  // 2) Devise : cookie > pays edge (Vercel) > fallback par locale > défaut
  let currency = request.cookies.get('app_currency')?.value;
  if (!currency) {
    const country =
      (request.geo && request.geo.country) ||
      (locale === 'en' ? 'US' : locale === 'fr' ? 'FR' : locale === 'de' ? 'DE' : undefined);

    const cur = (country && countryToCurrency[country]) || defaultCurrency;
    currency = cur.code;
  }

  // Redirection vers la route localisée (ex: /en, /fr, /de)
  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname || ''}`;

  const response = NextResponse.redirect(url);
  response.cookies.set('app_locale', locale, { path: '/' });
  response.cookies.set('app_currency', currency, { path: '/' });
  return response;
}

// Appliquer le middleware à toutes les routes sauf _next/api et fichiers statiques
export const config = {
  matcher: ['/((?!_next|api|.*\\..*).*)'],
};
