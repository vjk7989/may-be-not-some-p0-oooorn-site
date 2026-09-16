# Risk Landscape visual reference

Status: approved direction to remember; not yet implemented.

## Purpose

When the Risk Landscape section is edited, use the supplied AIR diagram only
as a reference for its directional composition and sense of continuous
movement. The Buckleson result must use its own visual language, labels, and
assets.

## Required story

The diagram and its animation must preserve this ordered path:

1. **AI agents** enter from the left. Show several distinct enterprise agent
   sources rather than one generic model.
2. **Attacks and agent activity** occupy the middle. Agent or activity tokens
   should move through the field alongside the approved source-defined risks:
   Prompt Injection; Sensitive Information Disclosure; Excessive Agency;
   Intent Breaking & Goal Manipulation (Agentic T6); Tool Misuse (Agentic T2);
   and Memory Poisoning (Agentic T1).
3. The paths visually narrow and converge toward **Buckleson**, which acts as
   the policy, protection, and evidence boundary.
4. The controlled flow then opens toward the protected destinations:
   **individual users, servers, applications, and devices**.

## Motion direction

- Use small agent/activity tokens, traces, or pulses that travel left to right.
- Let the active paths narrow through successive visual gates before reaching
  Buckleson, then branch outward toward the destination group.
- Filtering or blocking may be shown through motion and state changes, but it
  must not imply universal prevention or measured efficacy without evidence.
- Motion should make the system easier to understand, not become a decorative
  loop that competes with the labels.
- The static first frame must communicate the complete ordered flow. If motion
  fails or is disabled, no meaning may be lost.

## Reference boundaries

- Do not copy AIR branding, wording, icons, colors, proprietary illustrations,
  or exact composition.
- Do not copy percentages or make filtering-performance claims without
  validated Buckleson data.
- Do not claim that Buckleson blocks every attack, makes AI fully secure, or
  proves that an AI response is true.
- Preserve the qualified claims and capability boundaries in `PRODUCT.md` and
  `docs/architecture/DECISIONS.md`.

## Responsive and accessible behavior

- Desktop: a horizontal left-to-right funnel with readable stage labels.
- Mobile: the same semantic order becomes a vertical top-to-bottom flow; do
  not compress the complete diagram into a horizontally scrolling miniature.
- Support `prefers-reduced-motion` with a stable diagram or simple crossfade.
- Keep labels available independently of animation and do not convey meaning
  through color alone.
- Moving tokens are decorative and must not enter the keyboard focus order.

## Scope boundary

This note records a future section-level direction only. It does not authorize
changes to the current homepage, hero, other sections, or production stack.
The Risk Landscape will be edited and reviewed as its own bounded task when the
user asks to begin section-by-section work.
