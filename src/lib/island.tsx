import type { ReactNode } from 'react';

/**
 * Isola interattiva. Nel sito pubblicato le pagine sono HTML statico e il
 * browser idrata solo le isole (vedi src/main.tsx); in sviluppo e
 * nell'anteprima di Lovable l'intera app è renderizzata dal browser.
 * `props` deve essere serializzabile in JSON.
 */
export function Island({ name, props, children }: { name: string; props: object; children: ReactNode }) {
  return (
    <div data-island={name} data-props={JSON.stringify(props)} style={{ display: 'contents' }}>
      {children}
    </div>
  );
}
