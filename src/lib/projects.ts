export interface Project {
  slug: string;
  title: string;
  description: string;
  tags: string[];
  year: number;
  image?: string;
  github?: string;
  demo?: string;
}

export const projects: Project[] = [
  {
    slug: "inter-iit-fraud-detection",
    title: "Fraud Detection System (Gold at Inter IIT Tech Meet 14.0)",
    description:
      "Production-grade fraud detection pipeline designed for severe class imbalance and streaming inference workloads. Benchmarked 20+ classical ML and deep learning systems with a strong focus on latency optimisation, robustness, and deployment-oriented evaluation.",
    tags: [
      "machine-learning",
      "streaming-ml",
      "fraud-detection",
      "production-systems",
      "model-benchmarking",
    ],
    year: 2025,
    github: "https://github.com/Abhinav-Kumar2/FraudDetection-Inter-IIT-",
  },

  {
  slug: "histopathologic-cancer-detection",
  title: "Histopathologic Cancer Detection",
  description:
    "Comprehensive cancer detection pipeline built for the Kaggle Histopathologic Cancer Detection dataste, combining exploratory data analysis, classical machine learning, deep learning workflows, Optuna-based hyperparameter optimisation, and model interpretability tooling.",
  tags: [
    "computer-vision",
    "medical-ai",
    "deep-learning",
    "optuna",
    "model-interpretability",
    "kaggle",
  ],
  year: 2026,
  github: "https://github.com/Abhinav-Kumar2/Histopathologic-Cancer-Detection",
},

  {
    slug: "filenest",
    title: "FileNest",
    description:
      "Distributed multimodal semantic retrieval system enabling peer-to-peer search across decentralised nodes. Implements shared embedding pipelines, model sharding, and scalable distributed inference for retrieval consistency.",
    tags: [
      "distributed-systems",
      "multimodal-ai",
      "semantic-search",
      "distributed-inference",
      "retrieval-systems",
    ],
    year: 2025,
    github: "https://github.com/AISocietyIITJ/FileNest",
  },

  {
    slug: "questlog",
    title: "QuestLog",
    description:
      "Gamified productivity platform combining AI-generated task planning, focus-session tracking, browser extension monitoring, and social progression systems using FastAPI, React, Firebase, and Gemini integration.",
    tags: [
      "full-stack",
      "fastapi",
      "react",
      "firebase",
      "browser-extension",
      "ai-agents",
    ],
    year: 2026,
    github: "https://github.com/Abhinav-Kumar2/QuestLog",
  },

  {
    slug: "options-pricing",
    title: "Options Pricing Model",
    description:
      "Implemented Black–Scholes, Binomial, Trinomial, and Monte Carlo methods for options pricing, alongside backtesting and PnL tracking pipelines for quantitative evaluation.",
    tags: [
      "quantitative-finance",
      "monte-carlo",
      "numerical-methods",
      "options-pricing",
      "backtesting",
    ],
    year: 2025,
    github: "https://github.com/Abhinav-Kumar2/options_pricing_model",
  },

  {
    slug: "weight-of-love",
    title: "The Weight Of Love - Text Based Murder Mystery Game",
    description:
      "Narrative-driven text adventure and murder mystery game implemented in C/C++. Features branching investigations, puzzle systems, turn-based combat, procedural maze gameplay, and multiple interactive minigames.",
    tags: [
      "c",
      "c-plus-plus",
      "game-development",
      "systems-programming",
      "interactive-fiction",
    ],
    year: 2024,
    github: "https://github.com/Abhinav-Kumar2/ic_project",
  },

  {
    slug: "aiml-paper-implementations",
    title: "AI/ML Paper Implementations",
    description:
      "Collection of deep learning and machine learning implementations spanning CNNs, GANs, ResNets, AlexNet, and foundational research architectures across computer vision and generative modelling.",
    tags: [
      "deep-learning",
      "computer-vision",
      "gans",
      "research-implementations",
      "pytorch",
    ],
    year: 2025,
    github: "https://github.com/Abhinav-Kumar2/AIML",
  },
];