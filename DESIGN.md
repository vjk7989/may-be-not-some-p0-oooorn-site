---
version: "alpha"
name: Spartan Editorial Systems
description: Monumental editorial layouts, cinematic technical imagery, and restrained violet motion for an independent AI systems studio.
colors:
  primary: "#6748E0"
  primary-hover: "#5E43E5"
  canvas: "#F2F1EC"
  surface: "#FFFFFF"
  ink: "#101010"
  muted: "#686867"
  border: "#D5D3CB"
  inverse: "#F7F6F1"
  dark-surface: "#111111"
typography:
  display:
    fontFamily: Arial
    fontSize: 6rem
    fontWeight: 600
    lineHeight: 0.92
    letterSpacing: -0.06em
  heading:
    fontFamily: Arial
    fontSize: 3rem
    fontWeight: 600
    lineHeight: 1
    letterSpacing: -0.04em
  body:
    fontFamily: Arial
    fontSize: 1rem
    fontWeight: 400
    lineHeight: 1.55
  label:
    fontFamily: Arial
    fontSize: 0.75rem
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: 0.08em
rounded:
  sm: 8px
  md: 16px
  lg: 28px
spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  2xl: 48px
  3xl: 72px
  4xl: 112px
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.inverse}"
    typography: "{typography.label}"
    rounded: "{rounded.sm}"
    padding: 14px
    height: 48px
  button-primary-hover:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.inverse}"
  content-panel:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: 24px
  technical-panel:
    backgroundColor: "{colors.dark-surface}"
    textColor: "{colors.inverse}"
    rounded: "{rounded.lg}"
    padding: 32px
---

## Overview

Spartan uses a monumental editorial silhouette: oversized type, high-contrast light and dark scenes, locally authored cinematic technical imagery, and generous spatial rhythm. The visual language is inspired by the observed public composition while all identity, copy, and media remain original.

## Color and typography

Warm off-white is the default field, near-black creates immersive process and project scenes, and violet is a controlled signal for focus and motion. Arial is used as a deterministic system sans; hierarchy comes from scale, compressed leading, and weight rather than ornamental type.

## Layout

The shell is fluid up to 1440px. Desktop sections alternate asymmetric editorial grids, large media fields, ruled lists, and dense card systems. Mobile collapses to one readable column without changing source order. The floating rounded header remains compact and becomes an accessible Sheet below the desktop breakpoint.

## Motion

Anime.js is limited to progressively enhanced section and item entrances. The server-rendered first frame is complete. Timelines are scoped, observers disconnect on unmount, background work pauses when hidden, and reduced-motion users receive no scripted transforms.

## Components

- Buttons, cards, badges, separators, and the mobile Sheet reuse the installed shadcn primitives.
- Native `details` and `summary` provide FAQ disclosure with a usable no-JavaScript state.
- Responsive `picture` elements use only local AVIF and WebP derivatives with fixed dimensions.
- Focus rings are always visible; touch targets are at least 44px; dark scenes maintain WCAG AA contrast.

## Content boundaries

Project records are clearly presented as concepts, not customer claims. Engagements use “Custom engagement” and “Contact for scope”; no fabricated prices, testimonials, metrics, certifications, or logos appear. The only external conversion is the approved Cal.com destination. No runtime resource is requested from Framer or the observed reference.
