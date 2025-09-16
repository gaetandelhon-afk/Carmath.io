'use client';

import { useEffect, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import { amortize } from '@/lib/finance';
import { formatCurrency } from '@/lib/currency';
import { jsPDF } from 'jspdf';

const PaymentChart = dynamic(() => import('./PaymentChart'), { ssr: false });

type Dict = {
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
  reportTitle: string;
  reportSummary: string; // ex: "Locale: {locale}   Currency: {currency}"
  reportAmortizationTitle: string; // ex: "Amortization (first {n} months)"
};

type Props = {
  locale: string;
  dict: Dict;
};

const CURRENCIES = ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'SEK', 'INR', 'BRL'] as const;

export default function CarPaymentCalculator({ locale, dict }: Props) {
  const [price, setPrice] = useState<number>(30000);
  const [down, setDown] = useState<number>(3000);
  const [apr, setApr] = useState<number>(6.9);
  const [months, setMonths] = useState<number>(60);
  const [extra, setExtra] = useState<number>(0);
  const [currency, setCurrency] = useState<string>('USD');

  // récupérer devise du cookie si présent (middleware)
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

  // Délimiteur CSV selon séparateur décimal de la locale
  const decimalComma = new Intl.NumberFormat(locale).format(1.1).includes(',');
  const csvSep = decimalComma ? ';' : ',';

  // ---- Export CSV (UTF-8 BOM + en-têtes traduits) ----
  const exportCSV = () => {
    const header = [dict.month, dict.payment, dict.interest, dict.principal, dict.balance];
    const rows = result.schedule.map((r) => [
      r.month.toString(),
      r.payment.toFixed(2),
      r.interest.toFixed(2),
      r.principalPaid.toFixed(2),
      r.balance.toFixed(2),
    ]);
    const toLine = (arr: string[]) =>
      arr
        .map((cell) => {
          const needsQuote = cell.includes(csvSep) || cell.includes('"') || cell.includes('\n');
          const c = cell.replace(/"/g, '""');
          return needsQuote ? `"${c}"` : c;
        })
        .join(csvSep);

    const csvContent = [toLine(header), ...rows.map(toLine)].join('\n');
    const blob = new Blob(
      ['\ufeff' + csvContent], // BOM pour Excel
      { type: 'text/csv;charset=utf-8;' }
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'car-payment-schedule.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  // ---- Export PDF (localisé) ----
  const exportPDF = () => {
    const doc = new jsPDF({ unit: 'pt', format: 'a4' });

    const marginX = 40;
    let y = 50;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.text(dict.reportTitle, marginX, y);
    y += 22;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    doc.text(dict.reportSummary.replace('{locale}', locale).replace('{currency}', currency), marginX, y);
    y += 16;

    doc.text(`${dict.vehiclePrice}: ${fmt(price)}   ${dict.downPayment}: ${fmt(down)}`, marginX, y); y += 14;
    doc.text(`${dict.apr}: ${apr}%   ${dict.termMonths}: ${months}   ${dict.extraPayment}: ${fmt(extra)}`, marginX, y); y += 18;

    doc.setFont('helvetica', 'bold');
    doc.text(dict.results, marginX, y);
    y += 16;
    doc.setFont('helvetica', 'normal');
    doc.text(`${dict.monthlyPayment}: ${fmt(result.payment)}`, marginX, y); y += 14;
    doc.text(`${dict.totalInterest}: ${fmt(result.totalInterest)}`, marginX, y); y += 14;
    doc.text(`${dict.totalPaid}: ${fmt(result.totalPaid)}`, marginX, y); y += 14;
    doc.text(`${dict.payoffTime}: ${result.payoffMonths} ${dict.termMonths.toLowerCase()}`, marginX, y); y += 22;

    doc.setFont('helvetica', 'bold');
    doc.text(dict.reportAmortizationTitle.replace('{n}', '24'), marginX, y);
    y += 16;
    doc.setFont('helvetica', 'normal');

    // En-têtes du tableau
    const headers = [dict.month, dict.payment, dict.interest, dict.principal, dict.balance];
    doc.text(headers.join('   '), marginX, y);
    y += 12;

    const maxRows = 24;
    for (const row of result.schedule.slice(0, maxRows)) {
      const line =
        `${row.month.toString().padStart(3)}   ` +
        `${row.payment.toFixed(2).padStart(10)}   ` +
        `${row.interest.toFixed(2).padStart(10)}   ` +
        `${row.principalPaid.toFixed(2).padStart(10)}   ` +
        `${row.balance.toFixed(2).padStart(10)}`;
      doc.text(line, marginX, y);
      y += 12;
      if (y > 780) { doc.addPage(); y = 50; }
    }

    doc.save('car-payment-report.pdf');
  };

  return (
    <div className="grid md:grid-cols-2 gap-8">
      {/* LEFT: Inputs */}
      <div className="grid gap-4">
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

        <div className="grid grid-cols-2 gap-4">
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

        <div className="flex gap-3 pt-2">
          <button className="btn primary" onClick={exportCSV}>{dict.exportCSV}</button>
          <button className="btn" onClick={exportPDF}>{dict.exportPDF}</button>
        </div>
      </div>

      {/* RIGHT: Results */}
      <div className="grid gap-6">
        <div className="card">
          <h2 className="mb-4">{dict.results}</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <small className="muted">{dict.monthlyPayment}</small>
              <div className="kpi">{fmt(result.payment)}</div>
            </div>
            <div>
              <small className="muted">{dict.totalInterest}</small>
              <div className="kpi">{fmt(result.totalInterest)}</div>
            </div>
            <div>
              <small className="muted">{dict.totalPaid}</small>
              <div className="kpi">{fmt(result.totalPaid)}</div>
            </div>
            <div>
              <small className="muted">{dict.payoffTime}</small>
              <div className="kpi">{result.payoffMonths} {dict.termMonths.toLowerCase()}</div>
            </div>
          </div>
        </div>

        <div className="card h-80">
          <h2 className="mb-4">{dict.amortizationChart}</h2>
          <div className="h-64">
            <PaymentChart
              data={chartData}
              yLabel={dict.balance}
              formatValue={fmt}
            />
          </div>
        </div>

        <div className="card overflow-x-auto">
          <h2 className="mb-3">{dict.first12Months}</h2>
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
                <tr key={row.month} className="border-t border-neutral-200/60 dark:border-neutral-800">
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
