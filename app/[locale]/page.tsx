'use client';

import CarPaymentCalculator from '@/components/CarPaymentCalculator';
import { isLocale } from '@/lib/i18n';
import { useTranslations } from 'next-intl';

export default function Page({ params }: { params: { locale: string } }) {
  const locale = isLocale(params.locale) ? params.locale : 'en';
  const t = useTranslations();

  const dict = {
    currency: t('calculator.currency'),
    vehiclePrice: t('calculator.vehiclePrice'),
    downPayment: t('calculator.downPayment'),
    apr: t('calculator.apr'),
    termMonths: t('calculator.termMonths'),
    extraPayment: t('calculator.extraPayment'),
    exportCSV: t('calculator.exportCSV'),
    exportPDF: t('calculator.exportPDF'),
    results: t('calculator.results'),
    monthlyPayment: t('calculator.monthlyPayment'),
    totalInterest: t('calculator.totalInterest'),
    totalPaid: t('calculator.totalPaid'),
    payoffTime: t('calculator.payoffTime'),
    amortizationChart: t('calculator.amortizationChart'),
    first12Months: t('calculator.first12Months'),
    month: t('calculator.month'),
    payment: t('calculator.payment'),
    interest: t('calculator.interest'),
    principal: t('calculator.principal'),
    balance: t('calculator.balance'),
  };

  return (
    <div className="grid gap-6">
      <div className="card">
        <h1>{t('title')}</h1>
        <p className="mt-2 text-neutral-600">{t('tagline')}</p>
        <div className="mt-6">
          <CarPaymentCalculator locale={locale} dict={dict} />
        </div>
      </div>
    </div>
  );
}
