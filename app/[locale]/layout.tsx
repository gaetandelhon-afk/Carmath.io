import '../globals.css';
import { ReactNode } from 'react';
import Link from 'next/link';
import { isLocale, Locale, locales } from '@/lib/i18n';

export default function RootLayout({
  children,
  params
}: {
  children: ReactNode;
  params: { locale: string };
}) {
  const locale = isLocale(params.locale) ? (params.locale as Locale) : 'en';

  const orgLd = {
    '@context':'https://schema.org',
    '@type':'Organization',
    name:'CarMath.io',
    url:'https://carmath.io',
    logo:'https://carmath.io/icon.png'
  };
  const siteLd = {
    '@context':'https://schema.org',
    '@type':'WebSite',
    name:'CarMath.io',
    url:'https://carmath.io',
    potentialAction:{
      '@type':'SearchAction',
      target:'https://carmath.io/{search_term_string}',
      'query-input':'required name=search_term_string'
    }
  };

  return (
    <html lang={locale}>
      <body>
        <header className="border-b border-neutral-200 dark:border-neutral-800">
          <div className="container py-4 flex items-center gap-4">
            <Link href={`/${locale}`} className="text-xl font-semibold">CarMath</Link>
            <nav className="ml-auto flex items-center gap-3">
              {locales.map((l) => (
                <a key={l} href={`/${l}`} className="text-sm px-2 py-1 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800">
                  {l.toUpperCase()}
                </a>
              ))}
            </nav>
          </div>
        </header>
        <main className="container py-8">{children}</main>
        <footer className="container py-10 text-sm text-neutral-500">
          © {new Date().getFullYear()} CarMath.io · Educational purposes only.
        </footer>
        <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(orgLd)}} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(siteLd)}} />
      </body>
    </html>
  );
}
