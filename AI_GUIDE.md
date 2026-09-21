# Buckleson Astro Guide

This project uses Astro 7, Tailwind CSS 4, Preline UI, Starlight, Lenis, and
GSAP. It is a static, English-only customization of the pinned ScrewFast
template described in `README.md`.

## Boundaries

- Marketing routes are file-based under `src/pages/`; there is no localized route tree.
- Shared user-facing strings live in `src/copy/en.ts`.
- Stable navigation and section data live in `src/data_files/`.
- Products, blog posts, and insights live in English content collections.
- Documentation is English-only under `src/content/docs/`.
- Build links through `localePath()` and content links through `pathFor()` so the configured Astro base path is preserved.
- Keep media local. Do not add remote runtime images, fonts, analytics, or trackers.
- Preserve product responsibilities: Hyper Tern controls execution; Hyper-ABS reduces pre-inference exposure; Hyper-0x supports evidence, verification, audit, and settlement; Hyper Wallet manages agent identity, credentials, policy-bound permissions, and delegated approvals.
- Hyper Wallet is available now but is not a digital-asset custody or payment product and does not guarantee secure outcomes.

Run every npm/npx command through `scripts/Invoke-WorkspaceNodeTool.ps1`.
