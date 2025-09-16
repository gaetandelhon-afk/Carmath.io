import Link from 'next/link';
import Breadcrumbs from '@/components/Breadcrumbs';

export default function Page({params}:{params:{locale:string}}) {
  const {locale} = params;
  return (
    <div className="grid gap-6">
      <Breadcrumbs items={[
        {name:'Home', url:`/${locale}`},
        {name:'Calculators', url:`/${locale}/calculators`}
      ]}/>
      <div className="card">
        <h1>Calculators</h1>
        <p className="mt-2 text-neutral-600">Fast, accurate tools with local currency.</p>
        <ul className="mt-4 grid sm:grid-cols-2 gap-3">
          <li className="border rounded-2xl p-4 hover:bg-neutral-50 dark:hover:bg-neutral-900">
            <Link href={`/${locale}`}>Car Payment Calculator →</Link>
            <p className="text-sm text-neutral-600 mt-1">Monthly payment, total interest & payoff time.</p>
          </li>
        </ul>
      </div>
    </div>
  );
}
