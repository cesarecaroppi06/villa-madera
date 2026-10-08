import type { ComponentType } from 'react';

// Componenti idratati nel browser sulle pagine prerenderizzate.
// Ogni isola è un chunk separato: si scarica solo se la pagina la contiene.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const islands: Record<string, () => Promise<{ default: ComponentType<any> }>> = {
  header: () => import('./components/Header'),
};
