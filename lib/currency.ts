export type Currency = {
  code: string;
  symbol: string;
};

// Minimal country->currency map (can be extended)
export const countryToCurrency: Record<string, Currency> = {
  US: { code: 'USD', symbol: '$' },
  GB: { code: 'GBP', symbol: '£' },
  CA: { code: 'CAD', symbol: '$' },
  AU: { code: 'AUD', symbol: '$' },
  SE: { code: 'SEK', symbol: 'kr' },
  DE: { code: 'EUR', symbol: '€' },
  FR: { code: 'EUR', symbol: '€' },
  NL: { code: 'EUR', symbol: '€' },
  BR: { code: 'BRL', symbol: 'R$' },
  IN: { code: 'INR', symbol: '₹' },
};

export const defaultCurrency: Currency = { code: 'EUR', symbol: '€' };

export function formatCurrency(locale: string, code: string, value: number) {
  try {
    return new Intl.NumberFormat(locale, { style: 'currency', currency: code }).format(value);
  } catch {
    return `${code} ${value.toFixed(2)}`;
  }
}
