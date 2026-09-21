import type { APIRoute } from 'astro';

export const GET: APIRoute = async () => {
  const basePath = import.meta.env.BASE_URL.endsWith('/')
    ? import.meta.env.BASE_URL
    : `${import.meta.env.BASE_URL}/`;
  const manifest = {
    short_name: 'Buckleson',
    name: 'Buckleson',
    icons: [
      {
        src: `${basePath}brand/buckleson-icon-v2.svg`,
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'any',
      },
    ],
    display: 'minimal-ui',
    id: basePath,
    start_url: basePath,
    theme_color: '#facc15',
    background_color: '#262626',
  };

  return new Response(JSON.stringify(manifest));
};
