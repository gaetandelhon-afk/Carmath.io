// app/[locale]/page.tsx
import CarPaymentCalculator from '@/components/CarPaymentCalculator';
import { isLocale } from '@/lib/i18n';

export default async function Page({ params }: { params: { locale: string } }) {
  const locale = isLocale(params.locale) ? params.locale : 'en';

  // Chargement direct des messages selon la locale
  const messages = (await import(`../../messages/${locale}.json`)).default as any;

  const dict = {
    currency: messages.calculator.currency,
    vehiclePrice: messages.calculator.vehiclePrice,
    downPayment: messages.calculator.downPayment,
    apr: messages.calculator.apr,
    termMonths: messages.calculator.termMonths,
    extraPayment: messages.calculator.extraPayment,
    exportCSV: messages.calculator.exportCSV,
    exportPDF: messages.calculator.exportPDF,
    results: messages.calculator.results,
    monthlyPayment: messages.calculator.monthlyPayment,
    totalInterest: messages.calculator.totalInterest,
    totalPaid: messages.calculator.totalPaid,
    payoffTime: messages.calculator.payoffTime,
    amortizationChart: messages.calculator.amortizationChart,
    first12Months: messages.calculator.first12Months,
    month: messages.calculator.month,
    payment: messages.calculator.payment,
    interest: messages.calculator.interest,
    principal: messages.calculator.principal,
    balance: messages.calculator.balance,
    // 🔽 ajout des 3 clés attendues par le composant
    reportTitle: messages.calculator.reportTitle,
    reportSummary: messages.calculator.reportSummary,
    reportAmortizationTitle: messages.calculator.reportAmortizationTitle
  };

  return (
    <div className="grid gap-6">
      <div className="card">
        <h1>{messages.title}</h1>
        <p className="mt-2 text-neutral-600">{messages.tagline}</p>
        <div className="mt-6">
          <CarPaymentCalculator locale={locale} dict={dict} />
        </div>
      </div>
    </div>
  );
}
