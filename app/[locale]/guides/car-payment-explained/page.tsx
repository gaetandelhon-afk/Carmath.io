import Breadcrumbs from '@/components/Breadcrumbs';
import Link from 'next/link';

export const dynamic = 'force-static';

export default function Page({params}:{params:{locale:string}}){
  const {locale} = params;
  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type':'Question',
        name:'How do I calculate a car payment?',
        acceptedAnswer:{'@type':'Answer', text:'Use the amortization formula: P = (L*r)/(1-(1+r)^-n). L=loan, r=monthly rate (APR/12), n=months.'}
      },
      {
        '@type':'Question',
        name:'What APR should I use?',
        acceptedAnswer:{'@type':'Answer', text:'Use your offer’s APR. If unknown, test a range (e.g., 3%–12%) to see sensitivity.'}
      }
    ]
  };
  return (
    <div className="grid gap-6">
      <Breadcrumbs items={[
        {name:'Home', url:`/${locale}`},
        {name:'Guides', url:`/${locale}/guides`},
        {name:'Car payment formula', url:`/${locale}/guides/car-payment-explained`}
      ]}/>
      <article className="card prose prose-neutral dark:prose-invert max-w-none">
        <h1>Car payment formula explained (with examples)</h1>
        <p><strong>TL;DR:</strong> Monthly Payment = <code>(L × r) / (1 − (1 + r)<sup>-n</sup>)</code>, where <em>r</em> is APR/12 and <em>n</em> is number of months.</p>
        <h2>What inputs matter?</h2>
        <ul>
          <li><strong>Loan amount (L)</strong>: vehicle price − down payment</li>
          <li><strong>APR</strong>: annual percentage rate (not monthly)</li>
          <li><strong>Term</strong>: number of monthly payments</li>
          <li><strong>Extra payment</strong>: optional, reduces interest and term</li>
        </ul>
        <h2>Worked example</h2>
        <p>Price 30,000, down 3,000, APR 6.9%, term 60 months → loan 27,000. r = 0.069/12 ≈ 0.00575. Payment ≈ 533.33.</p>
        <p>Try it in our <Link href={`/${locale}`}>Car Payment Calculator</Link>.</p>
        <h2>Tips</h2>
        <ul>
          <li>Small APR drops can save thousands over long terms.</li>
          <li>Adding even 50 extra per month can shave months off.</li>
        </ul>
      </article>
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(faqLd)}} />
    </div>
  );
}
