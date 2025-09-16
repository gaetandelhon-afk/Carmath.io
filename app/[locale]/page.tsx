import CarPaymentCalculator from '@/components/CarPaymentCalculator'
import { isLocale } from '@/lib/i18n'

export default function Page({ params }: { params: { locale: string } }) {
  const locale = isLocale(params.locale) ? params.locale : 'en'
  return (
    <div className="grid gap-6">
      <div className="card">
        <h1>Car Payment Calculator</h1>
        <p className="mt-2 text-neutral-600">Fast, accurate, privacy-friendly. Localized currency, no signup.</p>
        <div className="mt-6">
          <CarPaymentCalculator locale={locale} />
        </div>
      </div>
    </div>
  )
}
