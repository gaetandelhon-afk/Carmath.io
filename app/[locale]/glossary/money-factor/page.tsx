import Breadcrumbs from '@/components/Breadcrumbs';
export default function Page({params}:{params:{locale:string}}){
  const {locale}=params;
  return (
    <div className="grid gap-6">
      <Breadcrumbs items={[
        {name:'Home', url:`/${locale}`},
        {name:'Glossary', url:`/${locale}/glossary`},
        {name:'Money factor', url:`/${locale}/glossary/money-factor`}
      ]}/>
      <article className="card prose prose-neutral dark:prose-invert max-w-none">
        <h1>Money factor</h1>
        <p>Lease financing rate used by lenders. Approx APR = money factor × 2400.</p>
      </article>
    </div>
  );
}
