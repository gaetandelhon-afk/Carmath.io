import Link from 'next/link';
import Breadcrumbs from '@/components/Breadcrumbs';

export default function Page({params}:{params:{locale:string}}){
  const {locale}=params;
  const items = [
    {slug:'apr', title:'APR (Annual Percentage Rate)'},
    {slug:'ltv', title:'LTV (Loan-to-Value)'},
    {slug:'dti', title:'DTI (Debt-to-Income)'},
    {slug:'residual-value', title:'Residual value'},
    {slug:'money-factor', title:'Money factor'}
  ];
  return (
    <div className="grid gap-6">
      <Breadcrumbs items={[
        {name:'Home', url:`/${locale}`},
        {name:'Glossary', url:`/${locale}/glossary`}
      ]}/>
      <div className="card">
        <h1>Glossary</h1>
        <ul className="mt-4 grid gap-3">
          {items.map(i=>(
            <li key={i.slug} className="border rounded-2xl p-4 hover:bg-neutral-50 dark:hover:bg-neutral-900">
              <Link href={`/${locale}/glossary/${i.slug}`}>{i.title} →</Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
