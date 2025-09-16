import Breadcrumbs from '@/components/Breadcrumbs';
import Link from 'next/link';

export const dynamic = 'force-static';

export default function Page({params}:{params:{locale:string}}){
  const {locale}=params;
  return (
    <div className="grid gap-6">
      <Breadcrumbs items={[
        {name:'Home', url:`/${locale}`},
        {name:'Countries', url:`/${locale}/countries`},
        {name:'United States', url:`/${locale}/countries/us`}
      ]}/>
      <article className="card prose prose-neutral dark:prose-invert max-w-none">
        <h1>United States – car buying costs</h1>
        <h2>Typical items</h2>
        <ul>
          <li>Sales tax: 0–10% depending on state/city</li>
          <li>Title & registration: ~$50–$400</li>
          <li>Documentation/dealer fees: ~$100–$600</li>
          <li>Insurance: varies by state, driver profile</li>
          <li>Inspection/emissions: where applicable</li>
        </ul>
        <h2>Quick estimator</h2>
        <p>Run numbers in the <Link href={`/${locale}`}>Car Payment Calculator</Link> (set currency to USD).</p>
        <h2>References</h2>
        <ul>
          <li>State DMV websites (taxes/fees vary)</li>
        </ul>
      </article>
    </div>
  );
}
