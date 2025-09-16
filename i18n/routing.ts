import {defineRouting} from 'next-intl/routing';

export const locales = ['en', 'fr', 'de'] as const;
export const defaultLocale = 'en';

export const routing = defineRouting({
  locales,
  defaultLocale,
  // Ajoute ici des pathnames si tu veux des alias par langue
  // pathnames: { '/': '/' }
});

export type Locale = typeof locales[number];
