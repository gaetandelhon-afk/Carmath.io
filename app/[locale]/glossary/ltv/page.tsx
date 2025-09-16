import Breadcrumbs from '@/components/Breadcrumbs';
export default function Page({params}:{params:{locale:string}}){
  const {locale}=params;
  return (
    <div className="grid gap-6">
      <Breadcrumbs items={[
        {name:'Home', url:`/${locale}`},
        {name:'Glossary', url:`/${locale}/glossary`},
        {name:'LTV', url:`/${locale}/glossary/ltv`}
      ]}/>
      <article className="card prose prose-neutral dark:prose-invert max-w-none">
        <h1>LTV (Loan-to-Value)</h1>
        <p>LTV = loan amount ÷ vehicle value. Lower LTV often means better rates.</p>
        <h2>Example</h2>
        <p>Loan 20,000 on a car valued 25,000 → LTV 80%.</p>
      </article>
    </div>
  );
}
