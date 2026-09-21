---
title: 'Excessive Agency: Applying Least Privilege to AI Agents'
description: 'Reduce excessive agency by narrowing AI permissions, tools, data scope, approvals, and action limits.'
cardImage: '@/images/buckleson/execution-boundary.avif'
cardImageAlt: 'Policy boundary limiting the authority of an AI agent'
---

Excessive agency exists when an AI system has more functionality, permissions, or autonomy than its task requires. Broad authority increases the impact of mistakes, prompt injection, and compromised dependencies even when the model usually behaves well.

## Break authority into four dimensions

Review functionality, resources, magnitude, and autonomy. An agent may be allowed to draft a refund while a person must approve the real transaction. It may read records for one account without searching every customer.

Prefer narrow typed operations over broad shell, database, browser, or HTTP tools. Keep read and write capabilities separate, validate every field, and reject unknown parameters.

## Use identity and bounded credentials

Propagate the requesting user and tenant where possible. Give workload identities small scopes, short lifetimes, restricted destinations, and revocation independent of application deployment. Reusable secrets should never appear in prompts or model-visible context.

Set limits on records, messages, transaction values, frequency, and session duration. Use idempotency controls to avoid duplicated actions after retries, and require a new decision when a request exceeds its approved scope.

## Make approval specific

Show a reviewer the proposed operation, real target, affected data, destination, and expected effect. Bind approval to those exact parameters and expire it when they change. Recheck policy immediately before execution because identity, resource state, and limits may have changed since planning.

Monitor sequences such as repeated denials, rapid tool switching, approval reuse, unusual destinations, or access volumes. Test authority the way an attacker would: through direct requests, injected documents, manipulated tool results, stale credentials, retries, and cross-tenant attempts.

Expand autonomy only when operational evidence shows that policy, recovery, and review work as designed. Least privilege reduces possible harm; it does not guarantee correct agent decisions.
