import Link from 'next/link';
import Breadcrumbs from '@/components/Breadcrumbs';

export default function Page({params}:{params:{locale:string}}) {
  const {locale} = params;
  const items = [
    {slug:'car-payment-explained', title:'Car payment formula explained (with examples)'},
    {slug:'bi-weekly-vs-monthly', title:'Bi-weekly vs monthly: does it really save money?'},
    {slug:'refinancing-car-loan', title:'Refinancing a car loan: when it makes sense'}
  ];
  return (
    <div className="grid gap-6">
      <Breadcrumbs items={[
        {name:'Home', url:`/${locale}`},
        {name:'Guides', url:`/${locale}/guides`}
      ]}/>
      <div className="card">
        <h1>Guides</h1>
        <p className="mt-2 text-neutral-600">Clear explanations, real numbers, no fluff.</p>
        <ul className="mt-4 grid gap-3">
          {items.map(g=>(
            <li key={g.slug} className="border rounded-2xl p-4 hover:bg-neutral-50 dark:hover:bg-neutral-900">
              <Link href={`/${locale}/guides/${g.slug}`}>{g.title} →</Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
