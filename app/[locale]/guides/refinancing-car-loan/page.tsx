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
        {name:'Refinancing', url:`/${locale}/guides/refinancing-car-loan`}
      ]}/>
      <article className="card prose prose-neutral dark:prose-invert max-w-none">
        <h1>Refinancing a car loan: when it makes sense</h1>
        <p><strong>TL;DR:</strong> Refinance if your credit improved, rates fell, or you want a shorter term. Watch fees and remaining term.</p>
        <h2>Good scenarios</h2>
        <ul>
          <li>APR drop ≥ 1–2 percentage points</li>
          <li>Current term is long and you can afford faster payoff</li>
        </ul>
        <h2>What to avoid</h2>
        <ul>
          <li>Extending the term too much → lower monthly but higher total interest</li>
          <li>Prepayment penalties</li>
        </ul>
        <p>Run your numbers in the <Link href={`/${locale}`}>calculator</Link>.</p>
      </article>
    </div>
  );
}
