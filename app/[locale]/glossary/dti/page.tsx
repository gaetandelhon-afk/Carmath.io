import Breadcrumbs from '@/components/Breadcrumbs';
export default function Page({params}:{params:{locale:string}}){
  const {locale}=params;
  return (
    <div className="grid gap-6">
      <Breadcrumbs items={[
        {name:'Home', url:`/${locale}`},
        {name:'Glossary', url:`/${locale}/glossary`},
        {name:'DTI', url:`/${locale}/glossary/dti`}
      ]}/>
      <article className="card prose prose-neutral dark:prose-invert max-w-none">
        <h1>DTI (Debt-to-Income)</h1>
        <p>DTI = monthly debts ÷ monthly income. Lenders prefer lower DTI.</p>
        <h2>Rule of thumb</h2>
        <p>Total DTI &lt; 36% is commonly cited as healthy.</p>
      </article>
    </div>
  );
}
