'use client'

import { useEffect, useMemo, useState } from 'react'
import { amortize } from '@/lib/finance'
import { formatCurrency } from '@/lib/currency'
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts'
import { jsPDF } from 'jspdf'

type Props = { locale: string }

const CURRENCIES = ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'SEK', 'INR', 'BRL'] as const

export default function CarPaymentCalculator({ locale }: Props) {
  // Inputs
  const [price, setPrice] = useState<number>(30000)
  const [down, setDown] = useState<number>(3000)
  const [apr, setApr] = useState<number>(6.9)
  const [months, setMonths] = useState<number>(60)
  const [extra, setExtra] = useState<number>(0)
  const [currency, setCurrency] = useState<string>('USD')

  // Read currency from cookie if available (set by middleware)
  useEffect(() => {
    const m = document.cookie.match(/(?:^|; )app_currency=([^;]+)/)
    if (m && CURRENCIES.includes(decodeURIComponent(m[1]) as any)) {
      setCurrency(decodeURIComponent(m[1]))
    }
  }, [])

  const principal = Math.max(0, price - down)

  const result = useMemo(
    () => amortize({ principal, apr, months, extraPayment: extra }),
    [principal, apr, months, extra]
  )

  const chartData = useMemo(
    () =>
      result.schedule.map((row) => ({
        month: row.month,
        balance: Math.max(0, row.balance),
      })),
    [result.schedule]
  )

  function fmt(n: number) {
    return formatCurrency(locale, currency, n)
  }

  // ---- Export CSV ----
  const exportCSV = () => {
    const header = ['Month', 'Payment', 'Interest', 'Principal', 'Balance']
    const rows = result.schedule.map((r) => [
      r.month,
      r.payment.toFixed(2),
      r.interest.toFixed(2),
      r.principalPaid.toFixed(2),
      r.balance.toFixed(2),
    ])
    const csv =
      [header, ...rows].map((arr) => arr.join(',')).join('\n')

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'car-payment-schedule.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  // ---- Export PDF (summary + first 24 rows) ----
  const exportPDF = () => {
    const doc = new jsPDF({ unit: 'pt', format: 'a4' })
    const line = (y: number, text: string) => doc.text(text, 40, y)

    let y = 40
    doc.setFontSize(16)
    line(y, 'Car Payment Report'); y += 10
    doc.setFontSize(10)
    y += 20
    line(y, `Locale: ${locale}   Currency: ${currency}`); y += 14
    line(y, `Vehicle price: ${fmt(price)}   Down payment: ${fmt(down)}`); y += 14
    line(y, `APR: ${apr}%   Term: ${months} months   Extra: ${fmt(extra)}`); y += 18

    line(y, `Monthly payment: ${fmt(result.payment)}   Total interest: ${fmt(result.totalInterest)}`); y += 14
    line(y, `Total paid: ${fmt(result.totalPaid)}   Payoff time: ${result.payoffMonths} months`); y += 20

    doc.setFontSize(12)
    line(y, 'Amortization (first 24 months)'); y += 16
    doc.setFontSize(9)
    line(y, 'Month   Payment      Interest     Principal    Balance'); y += 12

    const maxRows = 24
    for (const row of result.schedule.slice(0, maxRows)) {
      const text = `${row.month.toString().padStart(5)}   `
        + `${row.payment.toFixed(2).padStart(10)}   `
        + `${row.interest.toFixed(2).padStart(10)}   `
        + `${row.principalPaid.toFixed(2).padStart(10)}   `
        + `${row.balance.toFixed(2).padStart(10)}`
      line(y, text)
      y += 12
      if (y > 780) { doc.addPage(); y = 40 }
    }

    doc.save('car-payment-report.pdf')
  }

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* LEFT: Inputs */}
      <div className="grid gap-3">
        <div>
          <label className="label">Currency</label>
          <select className="input" value={currency} onChange={(e) => setCurrency(e.target.value)}>
            {CURRENCIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="label">Vehicle price</label>
          <input className="input" type="number" value={price} onChange={(e) => setPrice(Number(e.target.value))} />
        </div>

        <div>
          <label className="label">Down payment</label>
          <input className="input" type="number" value={down} onChange={(e) => setDown(Number(e.target.value))} />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label">APR (%)</label>
            <input className="input" type="number" step="0.01" value={apr} onChange={(e) => setApr(Number(e.target.value))} />
          </div>
          <div>
            <label className="label">Term (months)</label>
            <input className="input" type="number" value={months} onChange={(e) => setMonths(Number(e.target.value))} />
          </div>
        </div>

        <div>
          <label className="label">Extra monthly payment</label>
          <input className="input" type="number" value={extra} onChange={(e) => setExtra(Number(e.target.value))} />
        </div>

        <div className="flex gap-2 pt-2">
          <button className="btn" onClick={exportCSV}>Export CSV</button>
          <button className="btn" onClick={exportPDF}>Export PDF</button>
        </div>
      </div>

      {/* RIGHT: Results */}
      <div className="grid gap-3">
        <div className="card">
          <h2 className="mb-2">Results</h2>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <small className="muted">Monthly payment</small>
              <div className="text-2xl font-semibold">{fmt(result.payment)}</div>
            </div>
            <div>
              <small className="muted">Total interest</small>
              <div className="text-2xl font-semibold">{fmt(result.totalInterest)}</div>
            </div>
            <div>
              <small className="muted">Total paid</small>
              <div className="text-2xl font-semibold">{fmt(result.totalPaid)}</div>
            </div>
            <div>
              <small className="muted">Payoff time</small>
              <div className="text-2xl font-semibold">{result.payoffMonths} months</div>
            </div>
          </div>
        </div>

        <div className="card h-72">
          <h2 className="mb-2">Amortization chart (balance)</h2>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ left: 8, right: 8, top: 8, bottom: 8 }}>
                <defs>
                  <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopOpacity={0.8}/>
                    <stop offset="100%" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={(v) => formatCurrency(locale, currency, v).replace(/[^\d.,-]/g, '')} />
                <Tooltip
                  formatter={(value: number) => [fmt(value as number), 'Balance']}
                  labelFormatter={(label) => `Month ${label}`}
                />
                <Area type="monotone" dataKey="balance" strokeOpacity={1} fillOpacity={0.2} fill="url(#g)" />
