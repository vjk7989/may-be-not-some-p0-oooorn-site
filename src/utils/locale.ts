/**
 * Marketing-site locale module.
 *
 * Owns everything the marketing pages need to know about the single English
 * locale: how to resolve the current request and build stable site paths.
 *
 * Docs (Starlight) have their own locale handling; this module is not used
 * there.
 *
 * Every function here is pure so it can be unit-tested without Astro.
 */

export const MARKETING_LOCALES = ['en'] as const;
export type MarketingLocale = (typeof MARKETING_LOCALES)[number];

export const DEFAULT_LOCALE: MarketingLocale = 'en';

/** Locales that carry a URL prefix (every locale except the default). */
const PREFIXED_LOCALES: readonly MarketingLocale[] = MARKETING_LOCALES.filter(
  locale => locale !== DEFAULT_LOCALE
);
const BASE_PATH =
  import.meta.env.BASE_URL === '/'
    ? ''
    : import.meta.env.BASE_URL.replace(/\/$/, '');

/** Per-locale constants: display label, language tags and Intl tag. */
export const LOCALE_INFO: Record<
  MarketingLocale,
  {
    /** Human label for the language picker. */
    label: string;
    /** `<html lang>` and `hreflang` value. */
    lang: string;
    /** `og:locale` value. */
    ogLocale: string;
    /** schema.org `inLanguage` value. */
    inLanguage: string;
    /** BCP 47 tag for `Intl` formatting. */
    intl: string;
  }
> = {
  en: {
    label: 'English',
    lang: 'en',
    ogLocale: 'en_US',
    inLanguage: 'en-US',
    intl: 'en-US',
  },
};

export function isMarketingLocale(value: unknown): value is MarketingLocale {
  return (
    typeof value === 'string' &&
    (MARKETING_LOCALES as readonly string[]).includes(value)
  );
}

/**
 * Resolve an unprefixed English marketing path.
 */
export function splitLocale(pathname: string): {
  locale: MarketingLocale;
  path: string;
} {
  let normalized = pathname.startsWith('/') ? pathname : `/${pathname}`;
  if (BASE_PATH && normalized.startsWith(`${BASE_PATH}/`)) {
    normalized = normalized.slice(BASE_PATH.length);
  } else if (normalized === BASE_PATH) {
    normalized = '/';
  }
  for (const locale of PREFIXED_LOCALES) {
    const prefix = `/${locale}`;
    if (normalized === prefix) return { locale, path: '/' };
    if (normalized.startsWith(`${prefix}/`)) {
      return { locale, path: normalized.slice(prefix.length) };
    }
  }
  return { locale: DEFAULT_LOCALE, path: normalized };
}

/**
 * Resolve the locale of the current request. The pathname is authoritative
 * for marketing pages; `Astro.currentLocale` (driven by Starlight's i18n
 * config) is only a fallback.
 */
export function resolveLocale(
  pathname: string,
  currentLocale?: string | undefined
): MarketingLocale {
  const { locale } = splitLocale(pathname);
  if (locale !== DEFAULT_LOCALE) return locale;
  if (isMarketingLocale(currentLocale)) return currentLocale;
  return DEFAULT_LOCALE;
}

/**
 * Build a site-relative path for a locale.
 *
 *   localePath('en', '/products')  -> '/products'
 *   localePath('en', '#')          -> '#'   (fragments and absolute URLs pass through)
 */
export function localePath(locale: MarketingLocale, path = '/'): string {
  if (path.startsWith('#') || /^[a-z]+:/i.test(path)) return path;
  const clean = path.startsWith('/') ? path : `/${path}`;
  if (locale === DEFAULT_LOCALE) return `${BASE_PATH}${clean}` || '/';
  if (clean === '/') return `${BASE_PATH}/${locale}`;
  return `${BASE_PATH}/${locale}${clean}`;
}

/**
 * The English page mapping used by canonical and hreflang metadata.
 */
export function alternatePaths(
  pathname: string
): Record<MarketingLocale, string> {
  const { path } = splitLocale(pathname);
  return Object.fromEntries(
    MARKETING_LOCALES.map(locale => [locale, localePath(locale, path)])
  ) as Record<MarketingLocale, string>;
}
