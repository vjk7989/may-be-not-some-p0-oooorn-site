---
title: 'Hyper Wallet'
description: 'Available-now credential wallet for AI agents'
main:
  id: 4
  content: |
    Hyper Wallet is an available-now agent credential wallet for identity, credentials, policy-bound permissions, and delegated approvals. It helps services issue and revoke narrowly scoped authority without placing reusable secrets in model-visible context.
  imgCard: '@/images/buckleson/agent-identity.avif'
  imgMain: '@/images/buckleson/agent-identity.avif'
  imgAlt: 'Abstract identity and credential boundary for an AI agent'
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
  title: 'Give agents bounded, revocable authority'
  subTitle: |
    Associate an agent with explicit identity, short-lived credentials, policy-bound permissions, and approvals delegated for a specific task. Hyper Wallet is not a digital-asset custody or payment product, and its use does not guarantee secure outcomes.
  btnTitle: 'Deploy Hyper Wallet'
  btnURL: '/contact'
descriptionList:
  - title: 'Agent identity'
    subTitle: 'Distinguish the agent, requesting user, tenant, and executing workload.'
  - title: 'Scoped credentials'
    subTitle: 'Issue narrowly bounded, short-lived authority instead of exposing reusable secrets.'
  - title: 'Delegated approvals'
    subTitle: 'Bind approved actions to their exact purpose, target, parameters, and expiration.'
specificationsLeft:
  - title: 'Status'
    subTitle: 'Available now.'
  - title: 'Boundary'
    subTitle: 'Agent identity, credentials, policy-bound permissions, and delegated approvals.'
  - title: 'Lifecycle'
    subTitle: 'Issue, scope, expire, rotate, and revoke authority independently of prompts.'
specificationsRight:
  - title: 'Integration'
    subTitle: 'Works with execution policy and evidence systems through explicit identities and grants.'
  - title: 'Not custody or payment'
    subTitle: 'Hyper Wallet does not store digital assets or execute payment transactions.'
  - title: 'Limit'
    subTitle: 'Credential controls reduce exposure but do not guarantee secure outcomes.'
blueprints:
  first: '@/images/buckleson/agent-identity.avif'
  second: '@/images/buckleson/execution-boundary.avif'
---
