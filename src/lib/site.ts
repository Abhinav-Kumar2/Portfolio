export const site = {
  name: "Adrian Vale",
  role: "Research Engineer · ML Interpretability",
  bio: "I build tools and write notes on machine learning, type systems, and the quiet edges of software craft. Currently focused on mechanistic interpretability and well-instrumented training pipelines.",
  email: "hello@example.com",
  social: {
    github: "https://github.com/yourname",
    linkedin: "https://www.linkedin.com/in/yourname",
    twitter: "https://x.com/yourname",
  },
  skills: [
    "PyTorch", "JAX", "TypeScript", "Rust", "Mechanistic Interpretability",
    "Transformers", "Distributed Training", "Information Retrieval",
    "Linear Algebra", "Vite", "React",
  ],
  // Giscus configuration — replace these with values from https://giscus.app
  giscus: {
    repo: "yourname/your-repo" as `${string}/${string}`,
    repoId: "REPLACE_WITH_REPO_ID",
    category: "Announcements",
    categoryId: "REPLACE_WITH_CATEGORY_ID",
    mapping: "pathname" as const,
  },
};
