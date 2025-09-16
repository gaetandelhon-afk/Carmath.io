import {getRequestConfig} from 'next-intl/server';

export const locales = ['en', 'fr', 'de'] as const;
export type Locale = typeof locales[number];

export default getRequestConfig(async ({locale}) => {
  // Sécurise le fallback si la locale demandée n'existe pas
  const safeLocale = locales.includes(locale as Locale) ? (locale as Locale) : 'en';
  const messages = (await import(`./messages/${safeLocale}.json`)).default;
  return {messages};
});
