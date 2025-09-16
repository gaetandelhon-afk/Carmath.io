import '../globals.css';
import { ReactNode } from 'react';
import Link from 'next/link';
import { NextIntlClientProvider } from 'next-intl';
import { isLocale, Locale, locales } from '@/lib/i18n';

async function getMessages(locale: Locale) {
  try {
    const messages = (await import(`../../messages/${locale}.json`)).default;
    return messages;
  } catch {
    const messages = (await import(`../../messages/en.json`)).default;
    return messages;
  }
}

export default async function RootLayout({
  children,
  params
}: {
  children: ReactNode;
  params: { locale: string };
}) {
  const locale = isLocale(params.locale) ? (params.locale as Locale) : 'en';
  const messages = await getMessages(locale);

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
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
          <main className="container py-8">
            {children}
          </main>
          <footer className="container py-10 text-sm text-neutral-500">
            © {new Date().getFullYear()} CarMath.io · Educational purposes only.
          </footer>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
