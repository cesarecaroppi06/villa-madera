import { useEffect } from 'react';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Styleguide } from './pages/Styleguide';
import { NotFound } from './pages/NotFound';
import { Legal } from './pages/Legal';
import { resolve } from './routes';
import { headData } from './head';

/** Un'unica app per tutte le pagine: il percorso sceglie lingua e pagina. */
export function App({ url }: { url: string }) {
  const route = resolve(url);

  // In anteprima (senza prerender) aggiorna titolo e lingua del documento
  useEffect(() => {
    document.title = headData(route).title;
    document.documentElement.lang = route.locale;
  }, [route]);

  let page;
  switch (route.page) {
    case 'home':
      page = <Home locale={route.locale} />;
      break;
    case 'styleguide':
      page = <Styleguide />;
      break;
    case 'privacy':
    case 'cookie':
      page = <Legal locale={route.locale} kind={route.page} />;
      break;
    default:
      page = <NotFound locale={route.locale} />;
  }
  return (
    <Layout locale={route.locale} page={route.page}>
      {page}
    </Layout>
  );
}
