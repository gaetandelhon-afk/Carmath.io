'use client'

import { useMemo, useState } from 'react'
import { amortize } from '@/lib/finance'
import { formatCurrency } from '@/lib/currency'

type Props = { locale: string }

export default function CarPaymentCalculator({ locale }: Props) {
  const [price, setPrice] = useState(30000)
  const [down, setDown] = useState(3000)
  const [apr, setApr] = useState(6.9)
  const [months, setMonths] = useState(60)
  const [extra, setExtra] = useState(0)
  const [currency, setCurrency] = useState('USD')

  const principal = Math.max(0, price - down)

  const result = useMemo(() => amortize({ principal, apr, months, extraPayment: extra }), [principal, apr, months, extra])

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="grid gap-3">
        <div>
          <label className="label">Currency</label>
          <select className="input" value={currency} onChange={(e) => setCurrency(e.target.value)}>
            {['USD','EUR','GBP','CAD','AUD','SEK','INR','BRL'].map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="label">Vehicle price</label>
          <input className="input" type="number" value={price} onChange={e=>setPrice(Number(e.target.value))} />
        </div>
        <div>
          <label className="label">Down payment</label>
          <input className="input" type="number" value={down} onChange={e=>setDown(Number(e.target.value))} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label">APR (%)</label>
            <input className="input" type="number" step="0.01" value={apr} onChange={e=>setApr(Number(e.target.value))} />
          </div>
          <div>
            <label className="label">Term (months)</label>
            <input className="input" type="number" value={months} onChange={e=>setMonths(Number(e.target.value))} />
          </div>
        </div>
        <div>
          <label className="label">Extra monthly payment</label>
          <input className="input" type="number" value={extra} onChange={e=>setExtra(Number(e.target.value))} />
        </div>
      </div>

      <div className="grid gap-3">
        <div className="card">
          <h2 className="mb-2">Results</h2>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <small className="muted">Monthly payment</small>
              <div className="text-2xl font-semibold">{formatCurrency(locale, currency, result.payment)}</div>
            </div>
            <div>
              <small className="muted">Total interest</small>
              <div className="text-2xl font-semibold">{formatCurrency(locale, currency, result.totalInterest)}</div>
            </div>
            <div>
              <small className="muted">Total paid</small>
              <div className="text-2xl font-semibold">{formatCurrency(locale, currency, result.totalPaid)}</div>
            </div>
            <div>
              <small className="muted">Payoff time</small>
              <div className="text-2xl font-semibold">{result.payoffMonths} months</div>
            </div>
          </div>
        </div>

        <div className="card overflow-x-auto">
          <h2 className="mb-2">First 12 months (table)</h2>
          <table className="w-full text-sm">
            <thead className="text-left">
              <tr>
                <th className="py-2 pr-4">Month</th>
                <th className="py-2 pr-4">Payment</th>
                <th className="py-2 pr-4">Interest</th>
                <th className="py-2 pr-4">Principal</th>
                <th className="py-2 pr-4">Balance</th>
              </tr>
            </thead>
            <tbody>
              {result.schedule.slice(0,12).map(row => (
                <tr key={row.month} className="border-t border-neutral-200 dark:border-neutral-800">
                  <td className="py-2 pr-4">{row.month}</td>
                  <td className="py-2 pr-4">{formatCurrency(locale, currency, row.payment)}</td>
                  <td className="py-2 pr-4">{formatCurrency(locale, currency, row.interest)}</td>
                  <td className="py-2 pr-4">{formatCurrency(locale, currency, row.principalPaid)}</td>
                  <td className="py-2 pr-4">{formatCurrency(locale, currency, row.balance)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
