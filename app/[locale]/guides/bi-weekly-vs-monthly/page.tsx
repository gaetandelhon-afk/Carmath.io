import Breadcrumbs from '@/components/Breadcrumbs';
import Link from 'next/link';

export const dynamic = 'force-static';

export default function Page({params}:{params:{locale:string}}){
  const {locale} = params;
  return (
    <div className="grid gap-6">
      <Breadcrumbs items={[
        {name:'Home', url:`/${locale}`},
        {name:'Guides', url:`/${locale}/guides`},
        {name:'Bi-weekly vs monthly', url:`/${locale}/guides/bi-weekly-vs-monthly`}
      ]}/>
      <article className="card prose prose-neutral dark:prose-invert max-w-none">
        <h1>Bi-weekly vs monthly: does it really save money?</h1>
        <p><strong>TL;DR:</strong> Bi-weekly adds one extra monthly payment per year (26 half-payments), reducing interest and term slightly.</p>
        <h2>How it saves</h2>
        <ul>
          <li>26 half-payments ≈ 13 full payments/year vs 12 monthly → principal drops faster.</li>
          <li>Interest calculated on a lower balance → total interest down.</li>
        </ul>
        <h2>When it makes sense</h2>
        <ul>
          <li>You’re paid every two weeks.</li>
          <li>No prepayment penalties.</li>
        </ul>
        <p>Experiment with extra payments in the <Link href={`/${locale}`}>calculator</Link>.</p>
      </article>
    </div>
  );
}
