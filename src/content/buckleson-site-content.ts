export type CapabilityStatus =
  | "Current capability"
  | "Pilot stage"
  | "Designed for"
  | "Long-term vision";

export interface NavigationItem {
  label: string;
  href: string;
  items?: ReadonlyArray<{ label: string; description: string; href: string }>;
}

export interface PageDefinition {
  route: string;
  title: string;
  description: string;
  purpose: string;
  sections: readonly string[];
  mediaId?: string;
}

export interface MediaAsset {
  id: string;
  source: string;
  alt: string;
  width: number;
  height: number;
  derivatives: ReadonlyArray<{
    src: string;
    width: number;
    height: number;
    format: "avif" | "webp";
  }>;
  decorative?: boolean;
}

export interface HomepageSection {
  id: string;
  label: string;
  title: string;
  mediaId?: string;
}

export interface EngagementPath {
  title: string;
  summary: string;
  href: string;
}

export interface ProductContent {
  name: string;
  slug: "hyper-tern" | "hyper-abs" | "hyper-0x";
  status: CapabilityStatus;
  role: string;
  summary: string;
  problem: string;
  capabilities: readonly string[];
  workflow: ReadonlyArray<{ title: string; description: string }>;
  architecture: ReadonlyArray<{ title: string; description: string }>;
  riskControls: ReadonlyArray<{
    risk: string;
    response: string;
    boundary: string;
  }>;
  designedFor?: readonly string[];
  mediaId?: string;
}

export interface ServiceContent {
  name: string;
  slug: "ai-security" | "secure-inference" | "custom-ai";
  summary: string;
  deliverables: readonly string[];
  relatedProducts: readonly string[];
  boundary: string;
}

export interface RiskContent {
  name: string;
  category: "LLM" | "Agentic" | "Operational";
  explanation: string;
  relatedProducts: readonly ProductContent["slug"][];
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface CompanyContent {
  name: string;
  positioning: string;
  supportingTitle: string;
  hero: string;
  description: string;
  mission: string;
  vision: string;
  audiences: readonly string[];
  calendarUrl: string;
  stages: ReadonlyArray<{
    status: CapabilityStatus;
    title: string;
    description: string;
  }>;
  principles: ReadonlyArray<{ title: string; description: string }>;
  responsibility: readonly string[];
}

export interface SiteContent {
  company: CompanyContent;
  navigation: readonly NavigationItem[];
  pages: readonly PageDefinition[];
  products: readonly ProductContent[];
  services: readonly ServiceContent[];
  risks: readonly RiskContent[];
  industries: readonly string[];
  process: ReadonlyArray<{ title: string; description: string }>;
  faqs: readonly FaqItem[];
  footer: { statement: string; capabilityNote: string };
  prohibitedClaims: readonly string[];
  presentation: {
    media: readonly MediaAsset[];
    homepageSections: readonly HomepageSection[];
    engagementPaths: readonly EngagementPath[];
  };
}

export const bucklesonSiteContent: SiteContent = {
  company: {
    name: "Buckleson",
    positioning: "We secure how AI runs — not what AI thinks.",
    supportingTitle: "A Trust & Execution Layer for AI Infrastructure.",
    hero: "We help you use AI safely.",
    description:
      "Buckleson helps companies, organizations, and individual users connect AI to sensitive data, tools, applications, and devices within clearer protection, policy, and evidence boundaries.",
    mission:
      "Help companies, organizations, and individual users use AI safely by placing practical protection, policy, and evidence around execution.",
    vision:
      "Make trusted AI execution a dependable infrastructure layer across organizations and industries.",
    audiences: ["Companies", "Organizations", "Individual users"],
    calendarUrl: "https://cal.com/buckleson-group/30min",
    stages: [
      {
        status: "Current capability",
        title: "MVP",
        description:
          "Core platform capabilities are available for demonstrations and technical evaluation.",
      },
      {
        status: "Pilot stage",
        title: "Enterprise pilot",
        description:
          "Controlled pilot work tests capabilities against real workflows and requirements.",
      },
      {
        status: "Designed for",
        title: "Expanded architecture",
        description:
          "Roadmap features remain explicitly separate from verified current capability.",
      },
      {
        status: "Long-term vision",
        title: "Trusted execution infrastructure",
        description:
          "Buckleson aims to make accountable AI execution dependable across organizations and industries.",
      },
    ],
    principles: [
      {
        title: "Minimize exposure",
        description:
          "Only the information needed for an approved task should enter the inference path.",
      },
      {
        title: "Constrain authority",
        description:
          "Identity, permissions, tools, resources, and actions should remain inside explicit policy boundaries.",
      },
      {
        title: "Preserve evidence",
        description:
          "Important execution events should remain attributable and harder to rewrite after the fact.",
      },
      {
        title: "Keep people responsible",
        description:
          "Technology supports decisions and evidence; organizations remain responsible for appropriate use and oversight.",
      },
    ],
    responsibility: [
      "Organizations remain responsible for appropriate use cases, data classification, permissions, model evaluation, incident response, and legal obligations.",
      "Buckleson helps reduce risk and clarify boundaries. It does not eliminate every AI, security, privacy, or operational risk.",
    ],
  },
  navigation: [
    { label: "Home", href: "/" },
    {
      label: "About",
      href: "/about/",
      items: [
        { label: "About Buckleson", description: "Mission, status, and operating principles.", href: "/about/" },
        { label: "How we protect", description: "Protection, control, and evidence layers.", href: "/about/#how-we-protect" },
        { label: "Vision", description: "The long-term direction for accountable AI infrastructure.", href: "/about/#vision" },
      ],
    },
    {
      label: "Products",
      href: "/products/",
      items: [
        { label: "Product overview", description: "Three responsibilities in one execution boundary.", href: "/products/" },
        { label: "Hyper Tern", description: "Identity, policy, tools, and action control.", href: "/products/hyper-tern/" },
        { label: "Hyper-ABS", description: "Pre-inference data minimization and transformation.", href: "/products/hyper-abs/" },
        { label: "Hyper-0x", description: "Tamper-evident evidence, audit, and settlement.", href: "/products/hyper-0x/" },
      ],
    },
    {
      label: "Services",
      href: "/services/",
      items: [
        { label: "AI Security", description: "Assess and define execution boundaries.", href: "/services/#ai-security" },
        { label: "Secure Inference", description: "Protect and control information around inference.", href: "/services/#secure-inference" },
        { label: "Custom AI", description: "Models and fine-tuning for defined requirements.", href: "/services/#custom-ai" },
      ],
    },
    {
      label: "Blog",
      href: "/blog/",
      items: [
        { label: "All guides", description: "Practical notes on safer AI execution.", href: "/blog/" },
        { label: "AI agent security", description: "Data, tools, permissions, and actions.", href: "/blog/ai-agent-security/" },
        { label: "Prompt injection", description: "Layered controls for untrusted instructions.", href: "/blog/prompt-injection-prevention/" },
        { label: "Secure inference", description: "Protection around model execution.", href: "/blog/secure-ai-inference/" },
      ],
    },
    {
      label: "Contact Us",
      href: "https://cal.com/buckleson-group/30min",
    },
  ],
  pages: [
    { route: "/", title: "Trust and Execution Infrastructure for AI", description: "Buckleson helps companies, organizations, and individual users use AI safely with protection, policy, and tamper-evident execution evidence.", purpose: "Explain the complete Buckleson story and lead visitors to products, services, and an assessment.", sections: ["Hero", "Responsibilities", "Products", "Services", "Vision", "Hyper-0x", "Risk scenarios", "Process", "Principles", "FAQ", "Insights", "Assessment"], mediaId: "hero-boundary" },
    { route: "/about/", title: "About Buckleson", description: "Learn Buckleson’s mission, current status, protection model, operating principles, and long-term vision.", purpose: "Explain what Buckleson is, what is current, and which responsibilities remain with people and organizations.", sections: ["Mission", "How we protect", "Company status", "Principles", "Vision", "Human responsibility"], mediaId: "hyper-0x-evidence" },
    { route: "/products/", title: "Buckleson Products", description: "Explore Hyper Tern, Hyper-ABS, and Hyper-0x across AI execution control, data protection, and tamper-evident evidence.", purpose: "Compare the three products and route visitors to detailed architecture pages.", sections: ["Overview", "Product bento", "Shared execution path", "Responsibility boundaries", "Assessment"], mediaId: "hyper-tern-boundary" },
    { route: "/products/hyper-tern/", title: "Hyper Tern", description: "Explore Hyper Tern identity, policy, routing, tool, resource, and AI action boundaries.", purpose: "Explain how Hyper Tern constrains AI execution and the risks its controls help reduce.", sections: ["Product hero", "What it controls", "Workflow", "Architecture", "Risk controls", "Responsibility boundary"] },
    { route: "/products/hyper-abs/", title: "Hyper-ABS", description: "Explore Hyper-ABS masking, redaction, tokenization, abstraction, and pre-inference protection.", purpose: "Explain how Hyper-ABS reduces unnecessary sensitive-data exposure.", sections: ["Product hero", "Data transformations", "Workflow", "Architecture", "Risk controls", "Responsibility boundary"] },
    { route: "/products/hyper-0x/", title: "Hyper-0x", description: "Explore Buckleson’s in-house blockchain for tamper-evident execution evidence, verification, audit, and settlement.", purpose: "Explain current Hyper-0x responsibilities separately from designed-for architecture.", sections: ["Product hero", "Evidence lifecycle", "Architecture", "Risk controls", "Designed-for features", "Responsibility boundary"] },
    { route: "/services/", title: "Buckleson Services", description: "AI Security, Secure Inference, and Custom AI services tied to clear requirements and responsibility boundaries.", purpose: "Explain service outcomes, deliverables, related products, and boundaries.", sections: ["Overview", "AI Security", "Secure Inference", "Custom AI", "Engagement process", "Assessment"], mediaId: "hyper-abs-chamber" },
    { route: "/blog/", title: "Buckleson Guides", description: "Practical guides to AI agent security, prompt injection, secure inference, data leakage, least privilege, and audit trails.", purpose: "Provide original educational content and connect readers to relevant products and services.", sections: ["Article index", "Topics", "Assessment"], mediaId: "hero-boundary" },
  ],
  products: [
    {
      name: "Hyper Tern",
      slug: "hyper-tern",
      status: "Current capability",
      role: "Control AI execution",
      summary: "Mediates AI requests so identities, permissions, tools, resources, and downstream actions can be checked against policy before execution.",
      problem: "AI agents can receive more authority, tools, and reach than a task requires.",
      capabilities: ["Approved model and request routing", "Identity, permission, and policy checks", "Tool and resource access boundaries", "Explicit limits for downstream actions"],
      workflow: [
        { title: "Identify", description: "Attribute the request to an approved identity and workload." },
        { title: "Evaluate", description: "Compare context, permissions, tools, and requested actions with policy." },
        { title: "Constrain", description: "Allow, limit, transform, or block the action at the execution boundary." },
        { title: "Record", description: "Pass attributable events to the evidence layer." },
      ],
      architecture: [
        { title: "Routing", description: "Direct approved requests to allowed models and services." },
        { title: "Identity", description: "Associate people, agents, and workloads with explicit authority." },
        { title: "Policy", description: "Evaluate permissions and action boundaries before execution." },
        { title: "Tool boundary", description: "Limit which resources and downstream operations an agent may reach." },
      ],
      riskControls: [
        { risk: "Excessive Agency", response: "Applies least-privilege permissions and explicit action limits.", boundary: "Helps reduce excess authority; it does not make every autonomous decision safe." },
        { risk: "Tool Misuse (Agentic T2)", response: "Checks tool and resource access against policy before execution.", boundary: "A permitted tool can still be used poorly; monitoring and human oversight remain necessary." },
        { risk: "Intent Breaking & Goal Manipulation (Agentic T6)", response: "Keeps requested actions inside an approved task and policy boundary.", boundary: "Controls can constrain impact without guaranteeing that every manipulation is detected." },
        { risk: "Prompt Injection", response: "Can prevent an unsafe instruction from reaching unauthorized tools or actions when policy identifies the request as disallowed.", boundary: "This is impact reduction and policy enforcement, not universal prompt-injection detection." },
      ],
      mediaId: "hyper-tern-boundary",
    },
    {
      name: "Hyper-ABS",
      slug: "hyper-abs",
      status: "Current capability",
      role: "Protect information before inference",
      summary: "Reduces unnecessary sensitive-data exposure while retaining the context needed for an approved AI task.",
      problem: "Raw enterprise context can expose identifiers, secrets, and regulated information that a model does not need.",
      capabilities: ["Masking and redaction", "Tokenization and abstraction", "Policy-aligned pre-inference transformation", "Controlled reconstruction at approved boundaries"],
      workflow: [
        { title: "Classify", description: "Identify fields and context that require protection." },
        { title: "Transform", description: "Mask, redact, tokenize, or abstract unnecessary sensitive values." },
        { title: "Infer", description: "Provide the approved model only the context needed for the task." },
        { title: "Reconstruct", description: "Restore approved values only at an authorized boundary when required." },
      ],
      architecture: [
        { title: "Classification boundary", description: "Apply policy to structured and unstructured context." },
        { title: "Transformation layer", description: "Replace sensitive values with controlled representations." },
        { title: "Approved context", description: "Deliver minimized information to the inference path." },
        { title: "Controlled mapping", description: "Keep reconstruction separate from the model-facing context." },
      ],
      riskControls: [
        { risk: "Sensitive Information Disclosure", response: "Minimizes, masks, and transforms sensitive values to reduce unnecessary data exposure in prompts and responses before model access.", boundary: "Helps reduce exposure; it does not guarantee that all sensitive information is identified. Model, application, and organizational controls remain necessary around the complete data lifecycle." },
        { risk: "Memory Poisoning (Agentic T1)", response: "Can restrict which protected fields enter long-lived context and memory stores.", boundary: "Content trust and memory validation remain separate responsibilities." },
      ],
      mediaId: "hyper-abs-chamber",
    },
    {
      name: "Hyper-0x",
      slug: "hyper-0x",
      status: "Current capability",
      role: "Verify execution evidence",
      summary: "Buckleson’s in-house blockchain for attributable, tamper-evident execution records, verification, audit, and settlement.",
      problem: "Conventional logs can be fragmented, unattributed, or easier to change after an AI action occurs.",
      capabilities: ["Attributable execution evidence", "Tamper-evident event records", "Audit and settlement support", "Clear separation from model-output truth"],
      workflow: [
        { title: "Attribute", description: "Associate an approved execution event with its identity and context." },
        { title: "Record", description: "Commit evidence from the execution path to a tamper-evident record." },
        { title: "Verify", description: "Detect changes to recorded evidence and its sequence." },
        { title: "Audit or settle", description: "Use the attributable evidence for review or accountable machine outcomes." },
      ],
      architecture: [
        { title: "Event intake", description: "Receives attributable evidence from approved execution paths." },
        { title: "Evidence chain", description: "Links records so later changes are detectable." },
        { title: "Verification", description: "Checks recorded evidence and sequence integrity." },
        { title: "Audit and settlement", description: "Exposes useful evidence for review and accountable outcomes." },
      ],
      riskControls: [
        { risk: "Evidence tampering", response: "Preserves attributable events across the execution path and makes changes to committed evidence detectable for audit and reconstruction.", boundary: "The record is only as useful as the events and identities supplied to it. Tamper evidence does not prove that the original event was correct, and attribution still depends on sound identity and key management." },
      ],
      designedFor: ["Quantum-resistant architecture and four-layer encryption", "EVM, Solana, and Sui interoperability", "Account abstraction and task side-chains", "High-velocity finality"],
      mediaId: "hyper-0x-evidence",
    },
  ],
  services: [
    { name: "AI Security", slug: "ai-security", summary: "Assess the data, permissions, tools, actions, and evidence around an AI workflow, then define practical control boundaries.", deliverables: ["Workflow and trust-boundary map", "Risk and permission review", "Control recommendations", "Pilot and evaluation plan"], relatedProducts: ["Hyper Tern", "Hyper-ABS", "Hyper-0x"], boundary: "Security controls help reduce risk; they do not guarantee that every attack or unsafe outcome is prevented." },
    { name: "Secure Inference", slug: "secure-inference", summary: "Protect and control information around the inference path through minimization, transformation, routing, and policy enforcement.", deliverables: ["Data-flow analysis", "Pre-inference protection design", "Routing and access policy", "Evaluation criteria"], relatedProducts: ["Hyper-ABS", "Hyper Tern"], boundary: "This is protection around inference, not a claim of confidential computing or proof of model correctness." },
    { name: "Custom AI", slug: "custom-ai", summary: "Develop or fine-tune models for defined business requirements while keeping data permissions, evaluation criteria, and deployment controls explicit.", deliverables: ["Requirements and data review", "Model development or fine-tuning", "Evaluation evidence", "Controlled deployment guidance"], relatedProducts: ["Buckleson platform controls"], boundary: "Model work remains scoped to approved data, measurable requirements, evaluation evidence, and organizational responsibility." },
  ],
  risks: [
    { name: "Prompt Injection", category: "LLM", explanation: "Untrusted instructions attempt to redirect a model or agent away from the approved task.", relatedProducts: ["hyper-tern"] },
    { name: "Sensitive Information Disclosure", category: "LLM", explanation: "Protected or unnecessary information reaches a model, response, tool, or destination.", relatedProducts: ["hyper-abs"] },
    { name: "Excessive Agency", category: "LLM", explanation: "An agent receives more permissions, autonomy, or functionality than the task requires.", relatedProducts: ["hyper-tern"] },
    { name: "Intent Breaking & Goal Manipulation (Agentic T6)", category: "Agentic", explanation: "The agent’s assigned purpose is altered or displaced during a workflow.", relatedProducts: ["hyper-tern"] },
    { name: "Tool Misuse (Agentic T2)", category: "Agentic", explanation: "An agent invokes an available tool outside the intended policy or operating boundary.", relatedProducts: ["hyper-tern"] },
    { name: "Memory Poisoning (Agentic T1)", category: "Agentic", explanation: "Untrusted information changes persistent context that can influence later decisions.", relatedProducts: ["hyper-abs", "hyper-tern"] },
    { name: "Evidence tampering", category: "Operational", explanation: "Execution records are changed or fragmented after an AI action occurs.", relatedProducts: ["hyper-0x"] },
  ],
  industries: ["Financial services", "Healthcare", "Government", "Enterprise software", "Manufacturing", "Professional services"],
  process: [
    { title: "Assess", description: "Map the workflow, information, identities, tools, actions, and intended outcome." },
    { title: "Protect", description: "Minimize sensitive exposure and define what context may enter inference." },
    { title: "Control", description: "Apply identity, permission, tool, resource, and action boundaries." },
    { title: "Verify", description: "Preserve attributable evidence that supports review, audit, and settlement." },
  ],
  faqs: [
    { question: "What does Buckleson secure?", answer: "Buckleson focuses on how AI executes: the information entering a workflow, the identities and tools involved, the actions that may occur, and the evidence that remains afterward." },
    { question: "Does Buckleson guarantee that AI is safe?", answer: "No. Buckleson helps reduce risk, enforce clearer boundaries, and support auditability. Organizations still need appropriate use-case decisions, evaluation, monitoring, incident response, and human oversight." },
    { question: "What does secure inference mean here?", answer: "It means protection and control around inference through data minimization, transformation, routing, permissions, and policy. It is not a claim of confidential computing." },
    { question: "Why does Buckleson use blockchain?", answer: "Hyper-0x uses Buckleson’s in-house blockchain to preserve attributable, tamper-evident execution evidence for verification, audit, and settlement. It does not make private data confidential or prove model truth." },
    { question: "Can Buckleson stop prompt injection?", answer: "Buckleson can constrain the tools, data, and actions available to unsafe requests and can block requests identified as disallowed by policy. It does not claim universal prompt-injection detection or prevention." },
    { question: "Can Buckleson work with custom AI models?", answer: "Yes. Buckleson offers custom model development and fine-tuning for defined requirements, with explicit data permissions, evaluation criteria, and deployment responsibilities." },
  ],
  presentation: {
    media: [
      {
        id: "hero-boundary",
        source: "/media/source/buckleson-execution-boundary.png",
        alt: "A sculptural AI execution boundary in a pale mineral landscape",
        width: 1586,
        height: 992,
        derivatives: [
          { src: "/media/buckleson-execution-boundary-960.avif", width: 960, height: 600, format: "avif" },
          { src: "/media/buckleson-execution-boundary-960.webp", width: 960, height: 600, format: "webp" },
          { src: "/media/buckleson-execution-boundary-1586.avif", width: 1586, height: 992, format: "avif" },
          { src: "/media/buckleson-execution-boundary-1586.webp", width: 1586, height: 992, format: "webp" },
        ],
      },
      {
        id: "hyper-tern-boundary",
        source: "/media/source/hyper-tern-boundary.png",
        alt: "A black execution gateway routing violet request paths into approved destinations",
        width: 1536,
        height: 1024,
        derivatives: [
          { src: "/media/hyper-tern-boundary-768.avif", width: 768, height: 512, format: "avif" },
          { src: "/media/hyper-tern-boundary-768.webp", width: 768, height: 512, format: "webp" },
          { src: "/media/hyper-tern-boundary-1536.avif", width: 1536, height: 1024, format: "avif" },
          { src: "/media/hyper-tern-boundary-1536.webp", width: 1536, height: 1024, format: "webp" },
        ],
      },
      {
        id: "hyper-abs-chamber",
        source: "/media/source/hyper-abs-chamber.png",
        alt: "A glass transformation chamber reducing exposed data into approved context tokens",
        width: 1536,
        height: 1024,
        derivatives: [
          { src: "/media/hyper-abs-chamber-768.avif", width: 768, height: 512, format: "avif" },
          { src: "/media/hyper-abs-chamber-768.webp", width: 768, height: 512, format: "webp" },
          { src: "/media/hyper-abs-chamber-1536.avif", width: 1536, height: 1024, format: "avif" },
          { src: "/media/hyper-abs-chamber-1536.webp", width: 1536, height: 1024, format: "webp" },
        ],
      },
      {
        id: "hyper-0x-evidence",
        source: "/media/source/hyper-0x-evidence.png",
        alt: "A sequence of linked stone and glass evidence markers ending at a verified state",
        width: 1536,
        height: 1024,
        derivatives: [
          { src: "/media/hyper-0x-evidence-768.avif", width: 768, height: 512, format: "avif" },
          { src: "/media/hyper-0x-evidence-768.webp", width: 768, height: 512, format: "webp" },
          { src: "/media/hyper-0x-evidence-1536.avif", width: 1536, height: 1024, format: "avif" },
          { src: "/media/hyper-0x-evidence-1536.webp", width: 1536, height: 1024, format: "webp" },
        ],
      },
    ],
    homepageSections: [
      { id: "hero", label: "Trust and execution", title: "We help you use AI safely.", mediaId: "hero-boundary" },
      { id: "responsibilities", label: "Platform responsibilities", title: "Protect information. Control execution. Preserve evidence." },
      { id: "product-work", label: "Products", title: "Built around the moment AI acts.", mediaId: "hyper-tern-boundary" },
      { id: "capabilities", label: "Capabilities", title: "Start with the boundary that matters most.", mediaId: "hyper-abs-chamber" },
      { id: "vision", label: "Mission and vision", title: "Accountability belongs in the infrastructure.", mediaId: "hyper-0x-evidence" },
      { id: "hyper-0x", label: "Evidence infrastructure", title: "Records that are harder to rewrite after the fact.", mediaId: "hyper-0x-evidence" },
      { id: "risks", label: "AI risk scenarios", title: "Unsafe requests do not need unlimited impact." },
      { id: "protection-narrative", label: "How Buckleson protects execution", title: "A request moves through three explicit responsibilities.", mediaId: "hyper-tern-boundary" },
      { id: "process", label: "Engagement process", title: "From workflow map to accountable execution." },
      { id: "principles", label: "Company principles", title: "Clear boundaries beat invented certainty." },
      { id: "engagement-paths", label: "Start with the need", title: "Three practical ways to begin." },
      { id: "faq", label: "Security FAQ", title: "Direct answers about scope and responsibility." },
      { id: "insights", label: "Field notes", title: "Understand the risks before choosing the controls." },
      { id: "assessment", label: "Security assessment", title: "Map the boundary before AI reaches production." },
    ],
    engagementPaths: [
      { title: "Assess an AI workflow", summary: "Map information, identities, tools, permissions, actions, and evidence before selecting controls.", href: "/services/#ai-security" },
      { title: "Protect inference", summary: "Reduce unnecessary exposure and define the approved context around model execution.", href: "/services/#secure-inference" },
      { title: "Build controlled AI", summary: "Develop or fine-tune AI against explicit data, evaluation, and deployment requirements.", href: "/services/#custom-ai" },
    ],
  },
  footer: {
    statement: "Trust and execution infrastructure for safer AI.",
    capabilityNote: "Capabilities and responsibility boundaries are stated throughout.",
  },
  prohibitedClaims: [
    "100% secure",
    "privacy guaranteed",
    "guaranteed safety",
    "guaranteed correctness",
    "detects every attack",
    "prevents every attack",
    "solves every OWASP risk",
    "confidential computing",
    "proves model truth",
  ],
};

export const getProductBySlug = (slug: ProductContent["slug"]) =>
  bucklesonSiteContent.products.find((product) => product.slug === slug);
