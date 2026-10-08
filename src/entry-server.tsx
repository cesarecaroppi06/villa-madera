import { renderToString } from 'react-dom/server';
import { App } from './App';
import { renderHead, allRoutes } from './head';
import { resolve } from './routes';

export { allRoutes };

export function render(url: string) {
  const route = resolve(url);
  return {
    html: renderToString(<App url={url} />),
    head: renderHead(route),
    lang: route.locale,
  };
}
