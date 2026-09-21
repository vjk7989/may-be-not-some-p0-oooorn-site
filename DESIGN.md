---
version: "alpha"
name: Spartan AI Reference Replica
description: Exact observed Spartan AI typography, rounded framing, monochrome editorial scenes, neon-lime accents, and restrained Anime.js motion.
colors:
  primary: "#B9FF75"
  primary-hover: "#A7ED67"
  canvas: "#F1F1EF"
  surface: "#FFFFFF"
  ink: "#1A1A1A"
  muted: "#686867"
  border: "#D5D3CB"
  inverse: "#F7F6F1"
  dark-surface: "#1A1A1A"
typography:
  display:
    fontFamily: Inter Display
    fontSize: 12.5rem
    fontWeight: 500
    lineHeight: 1.1
    letterSpacing: -0.04em
  heading:
    fontFamily: Inter Display
    fontSize: 3.375rem
    fontWeight: 500
    lineHeight: 1.1
    letterSpacing: -0.04em
  body:
    fontFamily: Inter Display
    fontSize: 1rem
    fontWeight: 400
    lineHeight: 1.55
  label:
    fontFamily: Inter Display
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
    backgroundColor: "{colors.primary-hover}"
    textColor: "{colors.ink}"
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

Spartan reproduces the observed public reference: oversized 200px desktop marquees, 54px section headings, alternating warm-gray and charcoal scenes, 12px outer page gutters, 20px scene radii, the floating white pill navigation, and locally frozen reference media. Mobile uses the observed 128px marquees, 35px section headings, stacked grids, horizontal swipe rails, and logo-only header.

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
