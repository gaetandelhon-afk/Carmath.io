import Link from 'next/link';
import Breadcrumbs from '@/components/Breadcrumbs';

export default function Page({params}:{params:{locale:string}}){
  const {locale}=params;
  const items = [
    {slug:'us', title:'United States – car buying costs'},
    {slug:'fr', title:'France – coûts d’achat automobile'}
  ];
  return (
    <div className="grid gap-6">
      <Breadcrumbs items={[
        {name:'Home', url:`/${locale}`},
        {name:'Countries', url:`/${locale}/countries`}
      ]}/>
      <div className="card">
        <h1>Countries</h1>
        <ul className="mt-4 grid gap-3">
          {items.map(i=>(
            <li key={i.slug} className="border rounded-2xl p-4 hover:bg-neutral-50 dark:hover:bg-neutral-900">
              <Link href={`/${locale}/countries/${i.slug}`}>{i.title} →</Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
