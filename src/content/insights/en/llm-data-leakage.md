---
title: 'LLM Data Leakage: How Sensitive Information Reaches AI Systems'
description: 'Where LLM data leakage happens and how minimization, isolation, access control, output checks, and monitoring reduce exposure.'
cardImage: '@/images/buckleson/data-shield.avif'
cardImageAlt: 'Protected data moving through an AI system'
---

LLM data leakage can happen anywhere sensitive information enters, moves through, or leaves an AI workflow. The visible prompt is only one path. Retrieval stores, tool responses, traces, caches, evaluation datasets, exports, and multi-agent handoffs may all carry the same data.

## Find every place data can enter

Inventory user input, uploaded files, retrieved documents, databases, SaaS connectors, tool results, memory, and data forwarded by other agents. For each source, record its classification, owner, tenant boundary, purpose, and approved destinations.

Minimize before inference. Retrieve only authorized records, remove fields that are unnecessary for the task, mask identifiers where useful, and avoid copying full documents when a protected reference or narrow excerpt is enough.

## Enforce boundaries outside the model

Apply user and tenant authorization before retrieval. Separate identities for development, evaluation, and production. Keep credentials out of prompts, and do not depend on a model instruction to protect data the application could have withheld.

Treat prompts and retrieved content as untrusted channels. A document may attempt to make the agent reveal context or forward data to an unauthorized destination. Tool permissions and output policy should remain unchanged by that content.

## Check outputs and secondary stores

Validate output for its destination before it is displayed, persisted, or sent to another service. Logs, traces, and evaluation exports need their own access control, minimization, encryption, and retention rules; observability should not become a broad copy of private prompts.

Prepare for exposure with revocable credentials, clear owners, evidence sufficient to identify affected requests, and tested containment and notification procedures. Test cross-tenant retrieval, hidden-data requests, indirect injection, error messages, debug modes, and provider fallback paths.

These controls help reduce the likelihood and impact of leakage. They do not guarantee confidentiality, and they require ongoing review as models, connectors, policies, and data sources change.
