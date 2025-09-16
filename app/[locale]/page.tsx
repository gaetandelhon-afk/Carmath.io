import CarPaymentCalculator from '@/components/CarPaymentCalculator';
import { isLocale } from '@/lib/i18n';
import Link from 'next/link';

export default async function Page({ params }: { params: { locale: string } }) {
  const locale = isLocale(params.locale) ? params.locale : 'en';
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
    reportTitle: messages.calculator.reportTitle,
    reportSummary: messages.calculator.reportSummary,
    reportAmortizationTitle: messages.calculator.reportAmortizationTitle
  };

  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type':'Question',
        name:'How is the car payment calculated?',
        acceptedAnswer:{'@type':'Answer', text:'With the standard amortization formula using APR divided by 12 and total months. Our calculator shows monthly payment, total interest and payoff time.'}
      },
      {
        '@type':'Question',
        name:'Can I save by paying extra?',
        acceptedAnswer:{'@type':'Answer', text:'Yes. Extra monthly payments reduce the balance faster, lowering interest and shortening the term.'}
      },
      {
        '@type':'Question',
        name:'Does the tool use my local currency?',
        acceptedAnswer:{'@type':'Answer', text:'Yes. We detect locale & currency; you can also switch manually.'}
      }
    ]
  };

  return (
    <div className="grid gap-6">
      <div className="card">
        <h1>{messages.title}</h1>
        <p className="mt-2 text-neutral-600">{messages.tagline}</p>

        <div className="mt-6">
          <CarPaymentCalculator locale={locale} dict={dict} />
        </div>

        <div className="mt-6 text-sm">
          <div className="flex gap-4 flex-wrap">
            <Link className="underline" href={`/${locale}/calculators`}>All calculators</Link>
            <Link className="underline" href={`/${locale}/guides`}>Guides</Link>
            <Link className="underline" href={`/${locale}/glossary`}>Glossary</Link>
            <Link className="underline" href={`/${locale}/countries`}>Countries</Link>
          </div>
        </div>
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(faqLd)}} />
    </div>
  );
}
