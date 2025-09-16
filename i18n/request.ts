import {getRequestConfig} from 'next-intl/server';

export const locales = ['en', 'fr', 'de'] as const;
export type Locale = typeof locales[number];
export const defaultLocale: Locale = 'en';

export default getRequestConfig(async ({locale}) => {
  const safeLocale = (locales as readonly string[]).includes(locale as string)
    ? (locale as Locale)
    : defaultLocale;

  const messages = (await import(`../messages/${safeLocale}.json`)).default;

  return {
    messages
    // Tu peux ajouter ici: timeZone, formats, now, etc.
  };
});
