'use client';

import { useEffect, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import { amortize } from '@/lib/finance';
import { formatCurrency } from '@/lib/currency';
import { jsPDF } from 'jspdf';

const PaymentChart = dynamic(() => import('./PaymentChart'), { ssr: false });

type Props = {
  locale: string;
  dict: {
    currency: string;
    vehiclePrice: string;
    downPayment: string;
    apr: string;
    termMonths: string;
    extraPayment: string;
    exportCSV: string;
    exportPDF: string;
    results: string;
    monthlyPayment: string;
    totalInterest: string;
    totalPaid: string;
    payoffTime: string;
    amortizationChart: string;
    first12Months: string;
    month: string;
    payment: string;
    interest: string;
    principal: string;
    balance: string;
  };
};

const CURRENCIES = ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'SEK', 'INR', 'BRL'] as const;

export default function CarPaymentCalculator({ locale, dict }: Props) {
  // Inputs
  const [price, setPrice] = useState<number>(30000);
  const [down, setDown] = useState<number>(3000);
  const [apr, setApr] = useState<number>(6.9);
  const [months, setMonths] = useState<number>(60);
  const [extra, setExtra] = useState<number>(0);
  const [currency, setCurrency] = useState<string>('USD');

  // currency depuis cookie (middleware)
  useEffect(() => {
    const m = document.cookie.match(/(?:^|; )app_currency=([^;]+)/);
    if (m && CURRENCIES.includes(decodeURIComponent(m[1]) as any)) {
      setCurrency(decodeURIComponent(m[1]));
    }
  }, []);

  const principal = Math.max(0, price - down);
  const result = useMemo(
    () => amortize({ principal, apr, months, extraPayment: extra }),
    [principal, apr, months, extra]
  );

  const chartData = useMemo(
    () => result.schedule.map((row) => ({ month: row.month, balance: Math.max(0, row.balance) })),
    [result.schedule]
  );

  const fmt = (n: number) => formatCurrency(locale, currency, n);

  // CSV
  const exportCSV = () => {
    const header = [dict.month, dict.payment, dict.interest, dict.principal, dict.balance];
    const rows = result.schedule.map((r) => [
      r.month,
      r.payment.toFixed(2),
      r.interest.toFixed(2),
      r.principalPaid.toFixed(2),
      r.balance.toFixed(2),
    ]);
    const csv = [header, ...rows].map((arr) => arr.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'car-payment-schedule.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  // PDF
  const exportPDF = () => {
    const doc = new jsPDF({ unit: 'pt', format: 'a4' });
    const line = (y: number, text: string) => doc.text(text, 40, y);
    let y = 40;

    doc.setFontSize(16);
    line(y, 'Car Payment Report'); y += 10;
    doc.setFontSize(10);
    y += 20;

    line(y, `Locale: ${locale}   Currency: ${currency}`); y += 14;
    line(y, `${dict.vehiclePrice}: ${fmt(price)}   ${dict.downPayment}: ${fmt(down)}`); y += 14;
    line(y, `${dict.apr}: ${apr}%   ${dict.termMonths}: ${months}   ${dict.extraPayment}: ${fmt(extra)}`); y += 18;

    line(y, `${dict.monthlyPayment}: ${fmt(result.payment)}   ${dict.totalInterest}: ${fmt(result.totalInterest)}`); y += 14;
    line(y, `${dict.totalPaid}: ${fmt(result.totalPaid)}   ${dict.payoffTime}: ${result.payoffMonths}`); y += 20;

    doc.setFontSize(12);
    line(y, 'Amortization (first 24 months)'); y += 16;
    doc.setFontSize(9);
    line(y, `${dict.month}   ${dict.payment}   ${dict.interest}   ${dict.principal}   ${dict.balance}`); y += 12;

    const maxRows = 24;
    for (const row of result.schedule.slice(0, maxRows)) {
      const text =
        `${row.month.toString().padStart(5)}   ` +
        `${row.payment.toFixed(2).padStart(10)}   ` +
        `${row.interest.toFixed(2).padStart(10)}   ` +
        `${row.principalPaid.toFixed(2).padStart(10)}   ` +
        `${row.balance.toFixed(2).padStart(10)}`;
      line(y, text);
      y += 12;
      if (y > 780) { doc.addPage(); y = 40; }
    }

    doc.save('car-payment-report.pdf');
  };

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* LEFT: Inputs */}
      <div className="grid gap-3">
        <div>
          <label className="label">{dict.currency}</label>
          <select className="input" value={currency} onChange={(e) => setCurrency(e.target.value)}>
            {CURRENCIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="label">{dict.vehiclePrice}</label>
          <input className="input" type="number" value={price} onChange={(e) => setPrice(Number(e.target.value))} />
        </div>

        <div>
          <label className="label">{dict.downPayment}</label>
          <input className="input" type="number" value={down} onChange={(e) => setDown(Number(e.target.value))} />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label">{dict.apr}</label>
            <input className="input" type="number" step="0.01" value={apr} onChange={(e) => setApr(Number(e.target.value))} />
          </div>
          <div>
            <label className="label">{dict.termMonths}</label>
            <input className="input" type="number" value={months} onChange={(e) => setMonths(Number(e.target.value))} />
          </div>
        </div>

        <div>
          <label className="label">{dict.extraPayment}</label>
          <input className="input" type="number" value={extra} onChange={(e) => setExtra(Number(e.target.value))} />
        </div>

        <div className="flex gap-2 pt-2">
          <button className="btn" onClick={exportCSV}>{dict.exportCSV}</button>
          <button className="btn" onClick={exportPDF}>{dict.exportPDF}</button>
        </div>
      </div>

      {/* RIGHT: Results */}
      <div className="grid gap-3">
        <div className="card">
          <h2 className="mb-2">{dict.results}</h2>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <small className="muted">{dict.monthlyPayment}</small>
              <div className="text-2xl font-semibold">{fmt(result.payment)}</div>
            </div>
            <div>
              <small className="muted">{dict.totalInterest}</small>
              <div className="text-2xl font-semibold">{fmt(result.totalInterest)}</div>
            </div>
            <div>
              <small className="muted">{dict.totalPaid}</small>
              <div className="text-2xl font-semibold">{fmt(result.totalPaid)}</div>
            </div>
            <div>
              <small className="muted">{dict.payoffTime}</small>
              <div className="text-2xl font-semibold">{result.payoffMonths} {dict.termMonths.toLowerCase()}</div>
            </div>
          </div>
        </div>

        <div className="card h-72">
          <h2 className="mb-2">{dict.amortizationChart}</h2>
          <div className="h-56">
            <PaymentChart
              data={chartData}
              yLabel={dict.balance}
              formatValue={fmt}
            />
          </div>
        </div>

        <div className="card overflow-x-auto">
          <h2 className="mb-2">{dict.first12Months}</h2>
          <table className="w-full text-sm">
            <thead className="text-left">
              <tr>
                <th className="py-2 pr-4">{dict.month}</th>
                <th className="py-2 pr-4">{dict.payment}</th>
                <th className="py-2 pr-4">{dict.interest}</th>
                <th className="py-2 pr-4">{dict.principal}</th>
                <th className="py-2 pr-4">{dict.balance}</th>
              </tr>
            </thead>
            <tbody>
              {result.schedule.slice(0, 12).map((row) => (
                <tr key={row.month} className="border-t border-neutral-200 dark:border-neutral-800">
                  <td className="py-2 pr-4">{row.month}</td>
                  <td className="py-2 pr-4">{fmt(row.payment)}</td>
                  <td className="py-2 pr-4">{fmt(row.interest)}</td>
                  <td className="py-2 pr-4">{fmt(row.principalPaid)}</td>
                  <td className="py-2 pr-4">{fmt(row.balance)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
