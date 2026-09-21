import ogImageSrc from '@images/buckleson/agent-identity.avif';

const siteOrigin = (import.meta.env.SITE ?? 'https://buckleson.com').replace(
  /\/$/,
  ''
);
const basePath =
  import.meta.env.BASE_URL === '/'
    ? ''
    : import.meta.env.BASE_URL.replace(/\/$/, '');

export const SITE = {
  title: 'Buckleson',
  tagline: 'Trust and Execution Infrastructure for AI',
  description:
    'Buckleson helps organizations protect information, control AI execution, manage agent authority, and preserve attributable evidence around AI workflows.',
  description_short:
    'Trust and execution infrastructure for safer, more accountable AI workflows.',
  url: `${siteOrigin}${basePath}`,
  author: 'Buckleson',
};

export const OG = { image: ogImageSrc };

/** No customer or partner relationships are claimed on the public site. */
export const partnersData: [] = [];
