# Product

## Register

brand

## Product Purpose

This repository is a one-to-one static Next.js reconstruction of the public Spartan AI Framer website. Its acceptance criterion is observed visual, content, responsive, and interaction parity across the complete public route inventory before any later user-directed redesign.

## Users

Visitors exploring Spartan AI services, work, Digital Brain, company information, pricing, articles, contact, and policies on desktop or mobile.

## Required Experience

- Match the reference’s exact visible navigation, headings, metrics, project names, testimonials, team profiles, prices, FAQs, article labels, template CTA, and footer hierarchy.
- Match the long-form scene order, oversized editorial typography, rounded floating navigation, cinematic media crops, alternating light/dark surfaces, horizontal rails, pricing toggle, capability/process panels, and disclosure behavior.
- Keep all render-time fonts, imagery, video, and Anime.js code local. Production must not request the reference or Framer hosts.
- Preserve the 16 statically exported routes, trailing slashes, nested custom 404, sitemap, robots, canonical metadata, and GitHub Pages base path.
- Preserve complete server-rendered content without JavaScript and suppress nonessential movement under reduced motion.

## Route Inventory

- `/`
- `/digital-brain/`
- `/project/` and five project details
- `/about/`
- `/articles/` and three article details
- `/contact/`
- `/policies/terms-conditions/`
- `/policies/privacy-policy/`
- custom nested-path 404

## YAGNI Boundary

No CMS, authentication, database, analytics, payments, newsletter delivery, form-submission backend, or speculative compatibility layer. Contact conversion uses the observed external destinations only.

## Accessibility and Quality

Semantic headings and landmarks, keyboard-operable native controls, visible focus, reduced-motion support, no horizontal overflow, local-only production resources, and zero serious/critical Axe findings remain release gates even where nonvisual semantics improve on the reference.
