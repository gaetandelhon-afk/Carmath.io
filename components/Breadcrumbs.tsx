import Link from 'next/link';

type Crumb = { name: string; url: string };
export default function Breadcrumbs({items}:{items: Crumb[]}) {
  const ld = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i+1,
      name: it.name,
      item: it.url
    }))
  };
  return (
    <>
      <nav className="text-sm text-neutral-600 dark:text-neutral-300 mb-4">
        {items.map((it, i) => (
          <span key={it.url}>
            <Link href={it.url} className="hover:underline">{it.name}</Link>
            {i < items.length-1 && <span className="mx-2">/</span>}
          </span>
        ))}
      </nav>
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(ld)}} />
    </>
  );
}
