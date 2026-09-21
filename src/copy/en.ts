import faqs from '@data/faqs.json';
import features from '@data/features.json';
import pricing from '@data/pricing.json';

/** English-only customer-facing copy for the Buckleson marketing site. */
export const en = {
  site: {
    description:
      'Buckleson helps organizations protect information, control AI execution, manage agent authority, and preserve attributable evidence around AI workflows.',
    descriptionShort:
      'Trust and execution infrastructure for safer, more accountable AI workflows.',
    ogTitle: 'Buckleson | Trust and Execution Infrastructure for AI',
    ogDescription:
      'Explore Buckleson products and services for pre-inference protection, policy-bound AI execution, agent credentials, and tamper-evident evidence.',
  },
  layout: {
    skipToContent: 'Skip to content',
    changeLanguage: 'Change language',
    toggleNavigation: 'Toggle navigation',
    darkTheme: 'Dark Theme Toggle',
    lightTheme: 'Light Theme Toggle',
    toggleTheme: 'Toggle theme',
  },
  nav: {
    labels: {
      home: 'Home',
      products: 'Products',
      services: 'Services',
      blog: 'Blog',
      contact: 'Contact',
    },
    footer: {
      sectionTitles: { ecosystem: 'Explore', company: 'Buckleson' },
      links: {
        documentation: 'Documentation',
        tools: 'Products',
        services: 'Services',
        about: 'About Buckleson',
        blog: 'Blog',
        careers: 'Security assessment',
        customers: 'Contact',
      },
      hiringBadge: '30 minutes',
      stayUpToDate: 'Stay informed',
      stayUpToDateContent:
        'Follow practical guidance on AI security, execution controls, and auditability.',
      craftedBy: 'Built by',
      newsletterDemoMessage:
        'This demonstration form is not connected to a subscription service.',
    },
    megaMenu: {
      services: {
        guides: {
          title: 'Read the operating guides',
          description:
            'Understand Buckleson products, boundaries, and deployment patterns.',
        },
        integrations: {
          title: 'Map the execution path',
          description:
            'Identify the data, models, tools, resources, and actions in an AI workflow.',
        },
        experts: {
          title: 'AI Security',
          description:
            'Assess risks and define practical control boundaries around AI execution.',
        },
        tools: {
          title: 'Buckleson products',
          description:
            'Protect information, constrain authority, manage credentials, and preserve evidence.',
        },
        plans: {
          title: 'Secure Inference',
          description:
            'Minimize and control information around the inference path.',
        },
        community: {
          title: 'Custom AI',
          description:
            'Develop or fine-tune AI against explicit data and evaluation requirements.',
        },
      },
      successStories: 'Responsibility boundaries',
      successStory: {
        description:
          'Buckleson helps reduce risk and clarify execution boundaries; it does not guarantee that every unsafe outcome is prevented.',
        imageAlt:
          'Abstract representation of a controlled AI execution boundary',
      },
      learnMore: 'Learn more',
    },
  },
  forms: {
    email: 'Email',
    emailAddress: 'Email address',
    emailPlaceholder: 'Enter your email',
    emailInvalid: 'Please enter a valid email address',
    subscribe: 'Subscribe',
    phone: 'Phone Number',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    forgotPassword: 'Forgot password?',
    passwordHint: '8+ characters required',
    passwordMismatch: 'Password does not match the password',
    rememberMe: 'Remember me',
    acceptTerms: 'I accept the ',
    termsAndConditions: 'Terms and Conditions',
    or: 'Or',
    demoFallbackMessage:
      'This demonstration form is not connected to a backend.',
  },
  auth: {
    logIn: 'Log in',
    signIn: 'Sign in',
    signUp: 'Sign up',
    signInWithGoogle: 'Sign in with Google',
    signUpWithGoogle: 'Sign up with Google',
    noAccountYet: "Don't have an account yet?",
    signUpHere: 'Sign up here',
    alreadyHaveAccount: 'Already have an account?',
    signInHere: 'Sign in here',
    forgotPasswordTitle: 'Forgot password?',
    rememberYourPassword: 'Remember your password?',
    resetPassword: 'Reset password',
    credentialsDemoNotice: 'This demonstration does not collect credentials.',
    recoveryDemoNotice: 'Password recovery is not connected to a backend.',
    signInDemoMessage: 'Sign-in is not connected to a backend.',
    registerDemoMessage: 'Registration is not connected to a backend.',
    recoverDemoMessage: 'Password recovery is not connected to a backend.',
  },
  share: {
    share: 'Share',
    shareOn: (platform: string) => `Share on ${platform}`,
    copied: 'Copied',
    copyLink: 'Copy link',
  },
  banner: { dismiss: 'Dismiss', region: 'Informational banner' },
  blog: {
    readMore: 'Read More',
    minRead: (minutes: number) => `${minutes} min read`,
    relatedArticles: 'Related articles',
    wasHelpful: 'Was this post helpful?',
    yes: 'Yes',
    no: 'No',
    ogSection: 'AI Security Guides',
  },
  insights: {
    readMore: 'Read more',
    tableOfContents: 'Table of Contents:',
    ogSection: 'AI Security Insights',
  },
  products: { ogSection: 'AI Trust and Execution Products', tabs: 'Tabs' },
  notFound: {
    title: 'Page Not Found',
    subTitle: 'This execution path does not exist.',
    content:
      'Return to Buckleson products, services, and practical AI security guidance.',
    goHome: 'Go Home',
    goBack: 'Go Back',
  },
  home: {
    banner: 'Book a 30-minute security assessment',
    hero: {
      title:
        'We help you use <span class="text-yellow-800 dark:text-yellow-400">AI safely.</span>',
      subTitle:
        'Buckleson is a trust and execution layer that protects information, controls AI actions, manages agent credentials, and preserves evidence.',
      primaryBtn: 'Explore Products',
      secondaryBtn: 'Book an Assessment',
      rating: '<span class="font-bold">4</span> execution boundaries',
      reviews: 'Protection, control, credentials, and evidence',
      imageAlt:
        'A sculptural AI execution boundary in a pale mineral landscape',
    },
    clients: {
      title: 'Built for accountable AI workflows',
      subTitle:
        'For companies, organizations, and individual users connecting AI to sensitive systems.',
    },
    featuresGeneral: {
      title: 'Protect information. Control execution. Preserve evidence.',
      subTitle:
        'Buckleson places explicit data, identity, permission, tool, action, credential, and evidence boundaries around AI workflows.',
      imageAlt:
        'A controlled AI execution path moving through explicit security boundaries',
    },
    featuresNavs: {
      title:
        'Start with the <span class="text-yellow-800 dark:text-yellow-400">boundary</span> that matters most.',
      tabs: {
        tools: {
          heading: 'Hyper Tern — execution control',
          content:
            'Check identity, permissions, tools, resources, routing, and downstream actions against policy before execution.',
          alt: 'A black execution gateway routing requests into approved destinations',
        },
        dashboard: {
          heading: 'Hyper-ABS — pre-inference protection',
          content:
            'Mask, redact, tokenize, or abstract unnecessary sensitive values before approved context reaches a model.',
          alt: 'A transformation chamber reducing exposed data into approved context',
        },
        features: {
          heading: 'Hyper-0x — execution evidence',
          content:
            'Preserve attributable, tamper-evident records for verification, audit, and settlement without claiming that a model output is true.',
          alt: 'Linked evidence markers ending at a verified execution state',
        },
      },
    },
    testimonials: {
      title: 'Clear responsibilities at every boundary',
      subTitle:
        'Buckleson helps reduce risk and support auditability. Organizations remain responsible for use cases, data, evaluation, monitoring, and oversight.',
      quotes: [] as { content: string; author: string; role: string }[],
      statistics: [
        {
          count: 'Protect',
          description: 'minimize unnecessary information before inference',
        },
        {
          count: 'Control',
          description:
            'constrain identity, permissions, tools, resources, and actions',
        },
        {
          count: 'Authorize',
          description:
            'bind agent credentials and delegated approvals to policy',
        },
        {
          count: 'Verify',
          description: 'preserve attributable execution evidence for review',
        },
      ],
    },
    faqTitle: 'Frequently<br />asked questions',
    heroAlt: {
      title: 'Map the boundary before AI reaches production.',
      subTitle:
        'Book a focused assessment of information, identities, tools, actions, credentials, and evidence.',
      btn: 'Book an Assessment',
    },
  },
  services: {
    title: 'Services',
    metaDescription:
      'Explore Buckleson AI Security, Secure Inference, and Custom AI services with explicit deliverables and responsibility boundaries.',
    ogTitle: 'AI Security and Secure Inference Services | Buckleson',
    intro: {
      title: 'Move from workflow map to accountable execution',
      subTitle:
        'Buckleson helps teams assess AI workflows, protect information around inference, and build controlled AI against explicit requirements.',
      cta: 'Schedule a Consultation',
    },
    articles: {
      guidance: {
        title: 'AI Security',
        subTitle:
          'Map data, identities, permissions, tools, actions, and evidence; review risk; define control recommendations; and plan a bounded pilot. Controls help reduce risk but cannot guarantee every unsafe outcome is prevented.',
        imageAlts: [
          'AI workflow and trust-boundary map',
          'Team reviewing AI permissions and execution policy',
        ],
      },
      craftsmanship: {
        title: 'Secure Inference',
        subTitle:
          'Analyze data flows, design pre-inference protection, and define routing and access policy. This means controls around inference, not confidential computing or proof of model correctness.',
        imageAlts: ['Sensitive information transformed before model inference'],
        cta: 'Explore Hyper-ABS',
      },
      oversight: {
        title: 'Custom AI',
        subTitle:
          'Develop or fine-tune models for defined business requirements with explicit data permissions, evaluation evidence, and deployment controls.',
        imageAlts: [
          'Controlled custom AI development workflow',
          'AI evaluation evidence and deployment review',
        ],
      },
      maintenance: {
        title: 'Operating boundaries',
        subTitle:
          'Keep ownership visible after deployment through evaluation, monitoring, incident response, access review, and human oversight.',
        imageAlts: ['Operator reviewing an AI execution boundary'],
      },
      bespoke: {
        title: 'Begin with a scoped assessment',
        subTitle:
          'Identify the workflow, information, authority, desired outcome, and evidence requirements before selecting products or implementation work.',
        imageAlts: [
          'AI workflow assessment in progress',
          'Explicit policy and responsibility boundaries',
        ],
        cta: 'Book an Assessment',
      },
    },
    stats: {
      title: 'Four responsibilities, one execution path',
      subTitle:
        'Protection, execution control, credential authority, and evidence work together while keeping organizational responsibility explicit.',
      mainStatTitle: '4',
      mainStatSubTitle: 'product boundaries for accountable AI execution',
      stats: [
        { stat: '3', description: 'focused services' },
        { stat: '1', description: 'mapped execution path' },
        { stat: '0', description: 'unqualified security guarantees' },
      ],
    },
  },
  contact: {
    title: 'Contact',
    metaDescription:
      'Contact Buckleson to map an AI workflow and its security, data, credential, action, and evidence boundaries.',
    ogTitle: 'Contact Buckleson',
    heading: 'Contact Buckleson',
    subTitle:
      'Tell us which AI workflow, data, tools, and outcomes you need to evaluate.',
    formTitle: 'Start the conversation',
    formSubTitle: 'This site form is a demonstration and does not submit data.',
    firstName: 'First Name',
    lastName: 'Last Name',
    details: 'Workflow details',
    send: 'Send Message',
    demoMessage: 'This demonstration form is not connected to an endpoint.',
    knowledgeHeading: 'Documentation',
    knowledgeContent:
      'Review product responsibilities, security boundaries, and operating guidance.',
    knowledgeLink: 'Visit documentation',
    faqHeading: 'Security FAQ',
    faqContent:
      'Read direct answers about capability scope and organizational responsibility.',
    faqLink: 'Visit FAQ',
    officeHeading: 'Book an assessment',
    officeContent: '30-minute Buckleson security assessment',
    emailHeading: 'Contact Buckleson',
    emailContent: 'Use the assessment calendar to start a scoped conversation:',
  },
  blogIndex: {
    title: 'Blog',
    metaDescription:
      'Practical Buckleson guidance on AI agent security, prompt injection, secure inference, least privilege, data leakage, and audit trails.',
    ogTitle: 'AI Security Guides and Insights | Buckleson',
    heading: 'Practical guidance for safer AI execution',
    subTitle:
      'Understand the risks, responsibility boundaries, and controls around enterprise AI workflows.',
    insightsHeading: 'Insights',
    insightsSubTitle:
      'Explore least privilege, sensitive-data exposure, and attributable audit evidence.',
    noPosts: 'No blog posts yet. Check back soon.',
    noInsights: 'No insights yet. Check back soon.',
  },
  productsIndex: {
    title: 'Products',
    metaDescription:
      'Explore Hyper Tern, Hyper-ABS, Hyper-0x, and Hyper Wallet for controlled, accountable AI execution.',
    ogTitle: 'AI Trust and Execution Products | Buckleson',
    heading: 'Products',
    subTitle:
      'Four explicit responsibilities around the moment AI accesses information and acts.',
    customerStories: 'Responsibility boundaries',
    testimonials: {
      title: 'What each product is responsible for',
      quotes: [] as {
        content: string;
        author: string;
        role: string;
        avatarAlt: string;
      }[],
    },
    stats: {
      title: 'Built around the moment AI acts',
      subTitle:
        'Use only the boundaries a workflow requires, while keeping use-case and operational responsibility with the organization.',
      benefits: [
        'Hyper Tern controls identities, permissions, tools, resources, routing, and actions.',
        'Hyper-ABS reduces unnecessary sensitive-data exposure before inference.',
        'Hyper-0x preserves attributable evidence for verification, audit, and settlement.',
        'Hyper Wallet manages agent identity, credentials, policy-bound permissions, and delegated approvals.',
      ],
    },
  },
  data: { faqs, features, pricing },
};
