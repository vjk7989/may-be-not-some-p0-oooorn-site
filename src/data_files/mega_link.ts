import type { IconName } from '@components/ui/icons/icons';

/**
 * Structure of the optional mega menu (`NavbarMegaMenu.astro`): ids, icons
 * and URLs. Titles and descriptions live in `copy.nav.megaMenu`.
 */
export type MegaMenuServiceId =
  'guides' | 'integrations' | 'experts' | 'tools' | 'plans' | 'community';

export const megaMenuServices: {
  id: MegaMenuServiceId;
  icon: IconName;
  url: string;
}[] = [
  { id: 'guides', icon: 'guides', url: '/welcome-to-docs/' },
  { id: 'integrations', icon: 'puzzle', url: '/services' },
  { id: 'experts', icon: 'rocket', url: '/services#ai-security' },
  { id: 'tools', icon: 'hammer', url: '/products' },
  { id: 'plans', icon: 'sparks', url: '/services#secure-inference' },
  { id: 'community', icon: 'community', url: '/services#custom-ai' },
];

export const megaMenuSuccessStory = {
  image: '/media/buckleson-execution-boundary-960.webp',
  learnMoreUrl: '/products',
};
