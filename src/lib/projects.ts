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
    slug: "transformer-attention-viz",
    title: "Attention Pattern Visualizer",
    description:
      "Interactive tool for inspecting multi-head attention activations across transformer layers. Built for interpretability research.",
    tags: ["research", "transformers", "visualization", "python"],
    year: 2025,
    github: "https://github.com/yourname/attention-viz",
    demo: "https://example.com/attention",
  },
  {
    slug: "noir-notes",
    title: "Noir Notes",
    description:
      "A minimal, file-based note system with bidirectional links and full-text search. Local-first, no servers.",
    tags: ["typescript", "tooling", "ui"],
    year: 2025,
    github: "https://github.com/yourname/noir-notes",
  },
  {
    slug: "rlhf-playground",
    title: "RLHF Playground",
    description:
      "Reproducible experiments comparing PPO, DPO and KTO on small language models with detailed eval harness.",
    tags: ["research", "rlhf", "python"],
    year: 2024,
    github: "https://github.com/yourname/rlhf-playground",
  },
  {
    slug: "graph-retrieval",
    title: "Graph-Augmented Retrieval",
    description:
      "Hybrid retriever combining dense embeddings with citation graph traversal for scientific QA.",
    tags: ["research", "retrieval", "python"],
    year: 2024,
    github: "https://github.com/yourname/graph-retrieval",
  },
  {
    slug: "type-safe-rpc",
    title: "type-safe-rpc",
    description:
      "Tiny zero-dependency RPC layer with end-to-end TypeScript inference. Used across personal projects.",
    tags: ["typescript", "library"],
    year: 2023,
    github: "https://github.com/yourname/type-safe-rpc",
  },
  {
    slug: "shader-studies",
    title: "Shader Studies",
    description:
      "A growing collection of small GLSL studies exploring noise, signed distance fields and ray marching.",
    tags: ["graphics", "glsl"],
    year: 2023,
    github: "https://github.com/yourname/shader-studies",
  },
];
