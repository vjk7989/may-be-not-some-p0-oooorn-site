import type { MarketingLocale } from '@utils/locale';
import { en } from './en';

/**
 * Copy module: one typed table of UI strings per marketing locale.
 *
 * Components read the current table from `Astro.locals.copy`; code that
 * already has a locale in hand can call `getCopy(locale)`.
 */
export type Copy = typeof en;

const tables: Record<MarketingLocale, Copy> = { en };

export function getCopy(locale: MarketingLocale): Copy {
  return tables[locale];
}
