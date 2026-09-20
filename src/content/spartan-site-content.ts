export interface MediaAsset {
  id: string;
  alt: string;
  width: number;
  height: number;
  decorative?: boolean;
  derivatives: ReadonlyArray<{
    src: string;
    width: number;
    height: number;
    format: "avif" | "webp";
  }>;
}

export interface NavigationItem {
  label: string;
  href: string;
}

export interface ProjectContent {
  slug: string;
  title: string;
  category: string;
  summary: string;
  challenge: string;
  approach: string;
  outcome: string;
  mediaId: string;
  capabilities: readonly string[];
}

export interface ArticleContent {
  slug: string;
  category: string;
  title: string;
  description: string;
  publishedAt: string;
  readingTime: string;
  mediaId: string;
  sections: ReadonlyArray<{ title: string; body: string }>;
}

export interface SpartanSiteContent {
  company: {
    name: string;
    description: string;
    calendarUrl: string;
  };
  navigation: readonly NavigationItem[];
  product: {
    name: string;
    eyebrow: string;
    title: string;
    summary: string;
    mediaId: string;
    capabilities: ReadonlyArray<{ title: string; description: string }>;
  };
  projects: readonly ProjectContent[];
  articles: readonly ArticleContent[];
  capabilities: ReadonlyArray<{ index: string; title: string; description: string }>;
  process: ReadonlyArray<{ index: string; title: string; description: string }>;
  disciplines: ReadonlyArray<{ title: string; description: string }>;
  engagements: ReadonlyArray<{ name: string; description: string; includes: readonly string[] }>;
  faqs: ReadonlyArray<{ question: string; answer: string }>;
  media: readonly MediaAsset[];
}

const media = [
  {
    id: "signal-horizon",
    alt: "A rain-worn retro monitor glowing on a mossy mountain ridge",
    width: 1672,
    height: 936,
    derivatives: [
      { src: "/media/spartan-signal-horizon-960.avif", width: 960, height: 538, format: "avif" },
      { src: "/media/spartan-signal-horizon-1672.avif", width: 1672, height: 936, format: "avif" },
      { src: "/media/spartan-signal-horizon-960.webp", width: 960, height: 538, format: "webp" },
      { src: "/media/spartan-signal-horizon-1672.webp", width: 1672, height: 936, format: "webp" },
    ],
  },
  {
    id: "frontier",
    alt: "A monumental black gateway standing in a bright mountain landscape",
    width: 1586,
    height: 952,
    derivatives: [
      { src: "/media/spartan-frontier-960.avif", width: 960, height: 576, format: "avif" },
      { src: "/media/spartan-frontier-1586.avif", width: 1586, height: 952, format: "avif" },
      { src: "/media/spartan-frontier-960.webp", width: 960, height: 576, format: "webp" },
      { src: "/media/spartan-frontier-1586.webp", width: 1586, height: 952, format: "webp" },
    ],
  },
  {
    id: "gateway",
    alt: "A dark monolithic gateway routing violet streams across a marble plain",
    width: 1536,
    height: 922,
    derivatives: [
      { src: "/media/spartan-gateway-768.avif", width: 768, height: 461, format: "avif" },
      { src: "/media/spartan-gateway-1536.avif", width: 1536, height: 922, format: "avif" },
      { src: "/media/spartan-gateway-768.webp", width: 768, height: 461, format: "webp" },
      { src: "/media/spartan-gateway-1536.webp", width: 1536, height: 922, format: "webp" },
    ],
  },
  {
    id: "neural-core",
    alt: "A transparent neural engine translating dense violet signals into ordered output",
    width: 1536,
    height: 922,
    derivatives: [
      { src: "/media/spartan-neural-core-768.avif", width: 768, height: 461, format: "avif" },
      { src: "/media/spartan-neural-core-1536.avif", width: 1536, height: 922, format: "avif" },
      { src: "/media/spartan-neural-core-768.webp", width: 768, height: 461, format: "webp" },
      { src: "/media/spartan-neural-core-1536.webp", width: 1536, height: 922, format: "webp" },
    ],
  },
  {
    id: "evidence-grid",
    alt: "A sequence of black glass pillars joined by a violet signal across a mountain basin",
    width: 1536,
    height: 922,
    derivatives: [
      { src: "/media/spartan-evidence-grid-768.avif", width: 768, height: 461, format: "avif" },
      { src: "/media/spartan-evidence-grid-1536.avif", width: 1536, height: 922, format: "avif" },
      { src: "/media/spartan-evidence-grid-768.webp", width: 768, height: 461, format: "webp" },
      { src: "/media/spartan-evidence-grid-1536.webp", width: 1536, height: 922, format: "webp" },
    ],
  },
] as const satisfies readonly MediaAsset[];

export const spartanSiteContent: SpartanSiteContent = {
  company: {
    name: "Spartan",
    description: "Independent AI systems studio for useful, observable, and resilient automation.",
    calendarUrl: "https://cal.com/buckleson-group/30min",
  },
  navigation: [
    { label: "Home", href: "/" },
    { label: "Digital Brain", href: "/digital-brain/" },
    { label: "Projects", href: "/project/" },
    { label: "About", href: "/about/" },
    { label: "Articles", href: "/articles/" },
    { label: "Contact", href: "/contact/" },
  ],
  product: {
    name: "Digital Brain",
    eyebrow: "Model 04 / Private neural operations",
    title: "One operational layer for your private intelligence.",
    summary:
      "A configurable workspace that connects approved knowledge, human review, and automated routines without pretending every decision should be autonomous.",
    mediaId: "neural-core",
    capabilities: [
      { title: "Context retrieval", description: "Organize approved sources into a searchable working memory with visible provenance." },
      { title: "Workflow orchestration", description: "Coordinate bounded tasks across tools while keeping review points explicit." },
      { title: "Operational observability", description: "Inspect inputs, outputs, handoffs, and exceptions from one shared view." },
      { title: "Deployment flexibility", description: "Shape the operating model around the environment and controls already in place." },
    ],
  },
  projects: [
    {
      slug: "cigna-smart-health-systems",
      title: "Adaptive Care Systems",
      category: "Health operations concept",
      summary: "A calm operating surface for reviewing high-volume service signals without hiding uncertainty.",
      challenge: "Critical teams often work across fragmented queues, documents, and specialist handoffs.",
      approach: "The concept connects approved information, triage logic, and accountable human review in one legible flow.",
      outcome: "A reusable design direction for reducing navigation overhead while keeping decisions explainable.",
      mediaId: "frontier",
      capabilities: ["Traceable intake", "Human review", "Role-aware views", "Exception routing"],
    },
    {
      slug: "aetna-health-data-ecosystem",
      title: "Distributed Knowledge Layer",
      category: "Data systems concept",
      summary: "A retrieval architecture that gives teams useful context without flattening source boundaries.",
      challenge: "Institutional knowledge is valuable precisely because it comes from different owners and contexts.",
      approach: "The system preserves source identity, access rules, and citation paths through every retrieval step.",
      outcome: "A blueprint for answerable search, reviewable synthesis, and deliberate access control.",
      mediaId: "gateway",
      capabilities: ["Source mapping", "Permission boundaries", "Semantic retrieval", "Review queues"],
    },
    {
      slug: "anthem-neural-care-network",
      title: "Collaborative Decision Network",
      category: "Service design concept",
      summary: "A shared environment for specialists and AI assistants to resolve complex cases together.",
      challenge: "Fast automation can create more confusion when ownership and escalation remain unclear.",
      approach: "The interface makes responsibility, confidence, and the next review point visible at every stage.",
      outcome: "A practical model for augmenting professional judgment instead of replacing it.",
      mediaId: "neural-core",
      capabilities: ["Confidence cues", "Escalation logic", "Collaborative notes", "Decision history"],
    },
    {
      slug: "cvs-smart-supply-chain-hub",
      title: "Responsive Supply Network",
      category: "Logistics concept",
      summary: "An exception-first command surface for coordinating inventory, demand, and operational response.",
      challenge: "Teams lose time when important exceptions are buried inside ordinary status data.",
      approach: "The concept prioritizes deviation, context, ownership, and the shortest safe route to action.",
      outcome: "A focused foundation for faster coordination without fabricating predictive certainty.",
      mediaId: "evidence-grid",
      capabilities: ["Exception detection", "Scenario comparison", "Owner assignment", "Action history"],
    },
    {
      slug: "united-ai-security-protocol",
      title: "AI Operations Boundary",
      category: "Security systems concept",
      summary: "A policy-led gateway for controlling what automated systems can access and do.",
      challenge: "Connected assistants become difficult to govern when tools, identities, and approvals are implicit.",
      approach: "The architecture separates requests, context, permissions, execution, and evidence into reviewable layers.",
      outcome: "A clearer operating boundary for teams introducing automation into sensitive workflows.",
      mediaId: "gateway",
      capabilities: ["Policy checks", "Tool boundaries", "Approval paths", "Evidence records"],
    },
  ],
  articles: [
    {
      slug: "the-sovereign-cloud-why-on-premise-ai-is-the-future-of-data-privacy",
      category: "Infrastructure",
      title: "Private AI Infrastructure Without the Hype",
      description: "A practical framework for deciding what should stay local, what can be shared, and what must remain reviewable.",
      publishedAt: "2026-09-20",
      readingTime: "6 min read",
      mediaId: "frontier",
      sections: [
        { title: "Start with the boundary", body: "Infrastructure choices should follow the sensitivity of the workflow, the people accountable for it, and the evidence they need later. A private deployment is useful when it reduces unnecessary exposure, not when it becomes a substitute for clear governance." },
        { title: "Design for inspection", body: "Teams need to know which sources were available, which controls applied, and where a person can intervene. Observability turns architecture into an operating practice rather than a diagram that ages quietly." },
        { title: "Keep the choice reversible", body: "Portable data contracts, explicit interfaces, and replaceable model boundaries make change less disruptive. The goal is not isolation for its own sake; it is deliberate control over where work happens." },
      ],
    },
    {
      slug: "the-architecture-of-autonomy-scaling-ai-within-legacy-frameworks",
      category: "Architecture",
      title: "Designing Autonomous Systems for Existing Stacks",
      description: "How to introduce bounded automation without rebuilding every dependable system around it.",
      publishedAt: "2026-09-20",
      readingTime: "7 min read",
      mediaId: "gateway",
      sections: [
        { title: "Map before automating", body: "Begin with the decisions, handoffs, data owners, and failure paths already present. This reveals where automation can remove friction and where it would only hide responsibility." },
        { title: "Use narrow interfaces", body: "Give each automated routine the smallest useful set of inputs and actions. Narrow interfaces are easier to test, observe, and revoke when requirements change." },
        { title: "Scale evidence with execution", body: "As task volume increases, records of approvals, actions, and exceptions must remain understandable. Operational confidence comes from being able to reconstruct what happened." },
      ],
    },
    {
      slug: "human-centric-automation-designing-ai-that-empowers-your-workforce",
      category: "Experience",
      title: "Human-Centered Automation as an Operating Model",
      description: "A design approach that treats people as active operators rather than edge cases in an automated flow.",
      publishedAt: "2026-09-20",
      readingTime: "5 min read",
      mediaId: "neural-core",
      sections: [
        { title: "Make agency visible", body: "People should understand what the system is doing, which choices remain theirs, and how to interrupt the flow. Useful automation lowers cognitive load without removing meaningful control." },
        { title: "Design the exception first", body: "The ordinary path is rarely the hardest part. Recovery, disagreement, and incomplete information deserve first-class interfaces because they determine whether a system remains usable under pressure." },
        { title: "Measure the work, not the spectacle", body: "Evaluate whether teams reach sound decisions with less friction, clearer ownership, and better evidence. Novelty is not a durable measure of operational value." },
      ],
    },
  ],
  capabilities: [
    { index: "001", title: "Agent architecture", description: "Define bounded roles, tools, review points, and recovery paths for useful automated work." },
    { index: "002", title: "Operational workflows", description: "Turn fragmented handoffs into observable flows that still leave room for judgment." },
    { index: "003", title: "Knowledge systems", description: "Build retrieval and context layers that preserve ownership, provenance, and access boundaries." },
  ],
  process: [
    { index: "01", title: "Strategic audit", description: "Map the workflow, data, decisions, constraints, and accountable owners." },
    { index: "02", title: "Architecture", description: "Define a narrow system boundary and the evidence needed to operate it." },
    { index: "03", title: "Prototype", description: "Test the riskiest interaction with representative data and real review points." },
    { index: "04", title: "Deployment", description: "Ship in measured stages with visible feedback, recovery, and ownership." },
  ],
  disciplines: [
    { title: "Systems architecture", description: "Interfaces, permissions, data movement, observability, and recovery." },
    { title: "Model engineering", description: "Evaluation, retrieval, orchestration, and deployment boundaries." },
    { title: "Experience design", description: "Clear decisions, useful states, and interfaces that respect attention." },
    { title: "Reliability practice", description: "Testing, monitoring, exception handling, and operational handoff." },
  ],
  engagements: [
    { name: "Foundation", description: "Clarify the problem and operating boundary.", includes: ["Workflow audit", "Risk map", "Architecture brief"] },
    { name: "Prototype", description: "Test one valuable workflow end to end.", includes: ["Interactive prototype", "Evaluation plan", "Review session"] },
    { name: "Platform", description: "Build a production-ready operating surface.", includes: ["System implementation", "Operational controls", "Team handoff"] },
    { name: "Scale", description: "Extend a proven pattern across teams.", includes: ["Reusable components", "Rollout support", "Reliability review"] },
  ],
  faqs: [
    { question: "Where should an AI project begin?", answer: "Begin with one consequential workflow, its owners, inputs, decisions, and failure modes. Technology choices come after that boundary is clear." },
    { question: "Can Spartan work with an existing stack?", answer: "Yes. The preferred approach is to introduce narrow interfaces around dependable systems rather than replace them without evidence." },
    { question: "Do you build private deployments?", answer: "Private and hybrid deployment patterns can be evaluated when the workflow and operating constraints justify them." },
    { question: "How do you handle human review?", answer: "Review points are designed into the workflow, including ownership, context, escalation, and recovery." },
    { question: "What happens after a prototype?", answer: "A prototype ends with documented findings, unresolved risks, and a clear decision about whether and how to continue." },
  ],
  media,
};

export const getProjectBySlug = (slug: string) =>
  spartanSiteContent.projects.find((project) => project.slug === slug);

export const getArticleBySlug = (slug: string) =>
  spartanSiteContent.articles.find((article) => article.slug === slug);

export const getMediaById = (id: string) =>
  spartanSiteContent.media.find((asset) => asset.id === id);
