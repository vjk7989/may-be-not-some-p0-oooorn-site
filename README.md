# Buckleson

Buckleson is an English-only static Astro site for enterprise AI trust and
execution infrastructure. It presents four products—Hyper Tern, Hyper-ABS,
Hyper-0x, and Hyper Wallet—plus services, field guides, product documentation,
and UI-only contact/demo flows.

## Upstream provenance

The application layout and component system are based on the MIT-licensed
[ScrewFast](https://github.com/mearashadowfax/ScrewFast) template, pinned to
commit `54d1daa00214deb5b97613d2a61cf9f997df2218`. The upstream `LICENSE` is
retained. Customer-facing branding, copy, content, metadata, and imagery are
Buckleson-specific and use local assets.

## Development

Node tooling must run through the workspace wrapper so caches and temporary
files stay under `D:\high-quality`:

```powershell
.\scripts\Invoke-WorkspaceNodeTool.ps1 npm install
.\scripts\Invoke-WorkspaceNodeTool.ps1 npm run dev
.\scripts\Invoke-WorkspaceNodeTool.ps1 npm run build
.\scripts\Invoke-WorkspaceNodeTool.ps1 npm run test:contract
.\scripts\Invoke-WorkspaceNodeTool.ps1 npm run test:smoke
```

The production build is emitted to `dist/`. `SITE_URL` and `BASE_PATH` control
the canonical origin and repository-scoped deployment path.

## Content map

- `src/copy/en.ts` — shared interface copy.
- `src/data_files/` — navigation, product-feature, FAQ, and engagement data.
- `src/content/{products,blog,insights}/en/` — typed content collections.
- `src/content/docs/` — English Starlight documentation.
- `src/images/buckleson/` — local optimized presentation images.
- `public/brand/` and `public/media/source/` — byte-preserved brand and source media.

Forms are demonstrations only. The site has no authentication, payment,
custody, database, CMS, analytics, or form-submission backend.
