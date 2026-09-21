---
title: 'Hyper Tern'
description: 'Policy-bound execution control for AI agents'
main:
  id: 1
  content: |
    Hyper Tern sits between an AI agent's proposed action and the systems that can carry it out. It evaluates structured requests against policy, applies limits, and routes consequential actions for approval.
  imgCard: '@/images/buckleson/execution-boundary.avif'
  imgMain: '@/images/buckleson/execution-boundary.avif'
  imgAlt: 'Abstract controlled execution boundary for AI systems'
tabs:
  - id: 'tabs-with-card-item-1'
    dataTab: '#tabs-with-card-1'
    title: 'Description'
  - id: 'tabs-with-card-item-2'
    dataTab: '#tabs-with-card-2'
    title: 'Specifications'
  - id: 'tabs-with-card-item-3'
    dataTab: '#tabs-with-card-3'
    title: 'Architecture'
longDescription:
  title: 'Control the step between intent and execution'
  subTitle: |
    Translate a proposed tool call into a structured request, evaluate it outside the model, and allow, deny, or escalate it according to the organization's policy. Hyper Tern helps reduce the impact of mistakes and manipulation; it does not guarantee correct or secure outcomes.
  btnTitle: 'Discuss your execution boundary'
  btnURL: '/contact'
descriptionList:
  - title: 'Explicit policy'
    subTitle: 'Evaluate actor, purpose, operation, target, data scope, and limits before execution.'
  - title: 'Approval gates'
    subTitle: 'Bind human approval to the exact parameters of higher-impact actions.'
  - title: 'Controlled recovery'
    subTitle: 'Support clear denials, observable failures, and safer handling of retries.'
specificationsLeft:
  - title: 'Boundary'
    subTitle: 'Runs between agent intent and downstream tool execution.'
  - title: 'Decisions'
    subTitle: 'Allow, deny, or require approval using organization-defined policy.'
  - title: 'Inputs'
    subTitle: 'Structured identity, action, target, purpose, and data-scope fields.'
specificationsRight:
  - title: 'Least privilege'
    subTitle: 'Restricts functions, resources, magnitude, and autonomy to the task.'
  - title: 'Observability'
    subTitle: 'Emits decision and correlation data for monitoring and audit.'
  - title: 'Limit'
    subTitle: 'Does not determine whether a model response is true or eliminate deployment risk.'
blueprints:
  first: '@/images/buckleson/execution-boundary.avif'
  second: '@/images/buckleson/evidence-ledger.avif'
---
