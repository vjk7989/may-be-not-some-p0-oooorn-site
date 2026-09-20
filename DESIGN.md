---
version: "alpha"
name: Buckleson Branded Technical
description: A precise trust-infrastructure identity that makes AI execution controls legible without crypto spectacle.
colors:
  primary: "#6D28D9"
  primary-hover: "#5820B2"
  canvas: "#F6F5F2"
  surface: "#FFFFFF"
  ink: "#111114"
  muted: "#5F6068"
  soft-violet: "#EDE9FE"
  verified: "#137A55"
  verified-soft: "#E2F3EC"
  blocked: "#B42318"
  blocked-soft: "#FCEBE8"
  border: "#D9D9E0"
  inverse: "#FFFFFF"
  dark-surface: "#18151F"
typography:
  display:
    fontFamily: Onest
    fontSize: 4.75rem
    fontWeight: 680
    lineHeight: 0.98
    letterSpacing: -0.035em
  heading:
    fontFamily: Onest
    fontSize: 2.75rem
    fontWeight: 650
    lineHeight: 1.08
    letterSpacing: -0.025em
  body:
    fontFamily: Onest
    fontSize: 1rem
    fontWeight: 420
    lineHeight: 1.65
  label:
    fontFamily: Onest
    fontSize: 0.875rem
    fontWeight: 620
    lineHeight: 1.35
    letterSpacing: 0.01em
rounded:
  sm: 6px
  md: 10px
  lg: 16px
spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  2xl: 48px
  3xl: 64px
  4xl: 96px
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.inverse}"
    typography: "{typography.label}"
    rounded: "{rounded.sm}"
    padding: 12px
    height: 48px
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
    textColor: "{colors.inverse}"
  button-secondary:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.sm}"
    padding: 12px
    height: 48px
  status-current:
    backgroundColor: "{colors.verified-soft}"
    textColor: "{colors.verified}"
    typography: "{typography.label}"
    rounded: "{rounded.sm}"
  status-designed:
    backgroundColor: "{colors.soft-violet}"
    textColor: "{colors.primary-hover}"
    typography: "{typography.label}"
    rounded: "{rounded.sm}"
  technical-panel:
    backgroundColor: "{colors.dark-surface}"
    textColor: "{colors.inverse}"
    rounded: "{rounded.lg}"
    padding: 24px
  content-panel:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: 24px
  muted-copy:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.muted}"
  structural-line:
    backgroundColor: "{colors.border}"
    textColor: "{colors.ink}"
---

## Overview

Buckleson should feel like a carefully engineered control boundary made visible: bright, calm working light; dark technical cutaways; precise violet paths; and green only when the interface is stating a verified current condition. The system is branded technical rather than generic cyberpunk, crypto-native, or editorial.

Taste settings are **variance 6**, **motion 5**, and **density 4**. Pages vary their composition while keeping the same grid, type hierarchy, navigation, and evidence boundaries.

## Colors

- **Primary violet (#6D28D9):** Actions, active navigation, platform paths, and focused controls.
- **Canvas (#F6F5F2):** Neutral application field with only a slight violet relationship; never beige or parchment.
- **Ink (#111114):** Primary text and structural silhouettes.
- **Verified green (#137A55):** Reserved for current or verified states. Never decorative.
- **Blocked red (#B42318):** Reserved for detected harmful activity and blocked states; pair it with explicit status text and a non-color symbol.
- **Dark surface (#18151F):** Technical cutaways such as the Hyper-0x evidence section.
- **Soft violet (#EDE9FE):** Designed-for and explanatory states that must not be confused with verified capability.
- **Muted (#5F6068), border (#D9D9E0), and surface white (#FFFFFF):** Supporting copy, dividers, and readable content surfaces.

Use solid colors throughout content surfaces. Do not use gradients, neon glows, or color as the sole carrier of status. The shared navigation is the sole glass-material exception: a translucent floating surface with explicit solid fallbacks for unsupported blur, reduced transparency, and increased contrast.

## Typography

Onest is the single family for display and body copy. It is loaded as a variable font and self-hosted by the build. Headlines are compact and assured rather than enormous; body copy remains at least 1rem with a maximum measure of 70 characters. Use weight and space for hierarchy instead of uppercase eyebrow labels on every section.

## Layout

Use a 4px-derived spacing system, a maximum 1200px shell, and mobile-first compositions. Related information stays tight; distinct ideas receive 48-96px separation. Alternate split layouts, ruled lists, and technical diagrams instead of repeating equal card grids. Desktop diagrams read left to right; mobile diagrams become an ordered top-to-bottom narrative.

## Elevation & Depth

The interface is predominantly flat. Depth comes from overlap, line weight, tonal contrast, and an occasional short shadow on floating navigation surfaces. No decorative glow or stacked-card shadow system.

## Shapes

Controls use 6px corners, content surfaces 10px, and major technical panels 16px. Pills are reserved for compact status badges. Buckleson logo instances use the approved subtle rounded-edge mask while preserving the source artwork, proportions, and colors; other brand artwork is never masked, stretched, cropped, recolored, or filtered.

## Components

- **Buttons:** 48px minimum height, verb-led labels, visible focus ring, violet primary and white/outlined secondary variants.
- **Cards:** Used only for independently actionable or comparable content; never nested.
- **Status badges:** Always pair color with explicit text such as “Current capability,” “Pilot stage,” “Designed for,” or “Long-term vision.”
- **Navigation:** Sticky, inset, and visually light. The shared shell uses one restrained translucent material with a subtle edge and short shadow; it must remain legible over page content and become near-solid when blur is unsupported, transparency is reduced, or contrast is increased. Desktop links remain visible; mobile uses an accessible sheet with focus return and Escape support. No other component inherits the glass treatment.
- **Risk funnel:** Semantic ordered content is primary. SVG and moving tokens are decorative reinforcement only.
- **Hero request flow:** Labeled tokens use red for known or detected harmful activity, violet for approved requests, and neutral ink for inspection. Static HTML must state each fate; motion is illustrative and never a universal-detection claim.
- **Outcome chain:** Three semantic outcome articles share one visible connective path on desktop and stack into the same ordered path on mobile.
- **Service list:** Use an asymmetric ruled list with explicit summaries and boundaries; do not present services as equal numbered cards.

## Do's and Don'ts

Do make the execution path understandable in the first viewport, use source-defined threat names, qualify security outcomes, preserve useful static states, and keep touch targets at least 44px.

Do not claim universal protection, use blockchain as proof of model truth, expose confidential fundraising data, copy AIR branding or metrics, restore Hyper Wallet, add a “controlled request path” section, or rely on motion to explain the system.
