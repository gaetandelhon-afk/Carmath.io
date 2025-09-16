import Breadcrumbs from '@/components/Breadcrumbs';
export default function Page({params}:{params:{locale:string}}){
  const {locale}=params;
  return (
    <div className="grid gap-6">
      <Breadcrumbs items={[
        {name:'Home', url:`/${locale}`},
        {name:'Glossary', url:`/${locale}/glossary`},
        {name:'APR', url:`/${locale}/glossary/apr`}
      ]}/>
      <article className="card prose prose-neutral dark:prose-invert max-w-none">
        <h1>APR (Annual Percentage Rate)</h1>
        <p>APR is the yearly cost of borrowing (interest + certain fees), expressed as a percentage.</p>
        <h2>Formula</h2>
        <p>Monthly rate <code>r = APR/12</code>. Use r in the payment formula.</p>
        <h2>Example</h2>
        <p>APR 6% → r = 0.5%/month.</p>
      </article>
    </div>
  );
}
