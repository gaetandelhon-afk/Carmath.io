import {getRequestConfig} from 'next-intl/server';
import {routing} from './routing';

export default getRequestConfig(async ({locale}) => {
  const {locales, defaultLocale} = routing;
  const safeLocale = (locales as readonly string[]).includes(locale as string)
    ? (locale as (typeof locales)[number])
    : (defaultLocale as (typeof locales)[number]);

  const messages = (await import(`../messages/${safeLocale}.json`)).default;

  return {
    messages
    // Tu peux ajouter ici: timeZone, formats, now, etc.
  };
});
