import Breadcrumbs from '@/components/Breadcrumbs';
export default function Page({params}:{params:{locale:string}}){
  const {locale}=params;
  return (
    <div className="grid gap-6">
      <Breadcrumbs items={[
        {name:'Home', url:`/${locale}`},
        {name:'Glossary', url:`/${locale}/glossary`},
        {name:'Residual value', url:`/${locale}/glossary/residual-value`}
      ]}/>
      <article className="card prose prose-neutral dark:prose-invert max-w-none">
        <h1>Residual value</h1>
        <p>The estimated value of a vehicle at the end of a lease or over time.</p>
        <h2>Why it matters</h2>
        <p>Higher residual → lower depreciation cost, often lower lease payment.</p>
      </article>
    </div>
  );
}
