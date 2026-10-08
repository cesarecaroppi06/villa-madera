import type { Locale } from '../../config/site';
import { it, type Dict } from './it';
import { en } from './en';
import { de } from './de';

export type { Dict };
export const dictionaries: Record<Locale, Dict> = { it, en, de };
export const t = (locale: Locale): Dict => dictionaries[locale];

/** Sostituisce i segnaposto {nome} in una stringa. */
export function fill(s: string, vars: Record<string, string | number>): string {
  return s.replace(/\{(\w+)\}/g, (_, k: string) => String(vars[k] ?? `{${k}}`));
}

export function formatNumber(locale: Locale, n: number, digits = 2): string {
  return new Intl.NumberFormat(locale, { minimumFractionDigits: digits, maximumFractionDigits: digits }).format(n);
}
