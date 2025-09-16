import Breadcrumbs from '@/components/Breadcrumbs';
import Link from 'next/link';

export const dynamic = 'force-static';

export default function Page({params}:{params:{locale:string}}){
  const {locale}=params;
  return (
    <div className="grid gap-6">
      <Breadcrumbs items={[
        {name:'Accueil', url:`/${locale}`},
        {name:'Pays', url:`/${locale}/countries`},
        {name:'France', url:`/${locale}/countries/fr`}
      ]}/>
      <article className="card prose prose-neutral dark:prose-invert max-w-none">
        <h1>France – coûts d’achat automobile</h1>
        <h2>Éléments typiques</h2>
        <ul>
          <li>TVA: 20% (incluse sur véhicules neufs)</li>
          <li>Carte grise: dépend de la région et de la puissance fiscale</li>
          <li>Frais de dossier (concession): variable</li>
          <li>Assurance: selon profil et assureur</li>
          <li>Contrôle technique: obligatoire pour véhicules d’occasion (≥ 4 ans)</li>
        </ul>
        <h2>Estimateur rapide</h2>
        <p>Faites vos calculs avec le <Link href={`/${locale}`}>Calculateur de mensualités</Link> (devise EUR).</p>
        <h2>Sources</h2>
        <ul>
          <li>ANTS / Service-public (immatriculation)</li>
        </ul>
      </article>
    </div>
  );
}
