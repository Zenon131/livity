export const fallbackNews = {
  status: "ok",
  totalResults: 5,
  articles: [
    {
      source: { id: "fallback", name: "Livity News" },
      author: "Livity Team",
      title: "Welcome to Livity - Your Community Platform",
      description: "Discover what makes Livity special and how you can get involved in your community.",
      url: "https://www.livity.app",
      urlToImage: "/assets/icons/livity.svg",
      publishedAt: new Date().toISOString(),
      content: "Welcome to Livity, where community meets technology..."
    },
    {
      source: { id: "fallback", name: "Tech Daily" },
      author: "Tech Reporter",
      title: "The Future of AI in Community Building",
      description: "How artificial intelligence is helping connect people and strengthen communities around the world.",
      url: "https://www.livity.app",
      urlToImage: "/assets/icons/technology.svg", 
      publishedAt: new Date(Date.now() - 86400000).toISOString(), // Yesterday
      content: "Artificial intelligence is transforming how we build and maintain communities..."
    },
    {
      source: { id: "fallback", name: "Community Chronicles" },
      author: "Community Expert",
      title: "Five Ways to Strengthen Your Local Community",
      description: "Simple but effective strategies to help build stronger, more resilient communities.",
      url: "https://www.livity.app",
      urlToImage: "/assets/icons/people.svg",
      publishedAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
      content: "Building strong communities doesn't have to be complicated. Here are five approaches that work..."
    },
    {
      source: { id: "fallback", name: "Digital Trends" },
      author: "Tech Analyst",
      title: "Social Media Platforms: Connecting or Dividing Communities?",
      description: "A deep dive into how modern social platforms affect community building and maintenance.",
      url: "https://www.livity.app",
      urlToImage: "/assets/icons/share.svg",
      publishedAt: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
      content: "As social media continues to evolve, its effects on communities has become a topic of intense debate..."
    },
    {
      source: { id: "fallback", name: "Health & Wellness Today" },
      author: "Health Reporter",
      title: "The Health Benefits of Community Involvement",
      description: "Research shows that being active in your community can improve both mental and physical health.",
      url: "https://www.livity.app",
      urlToImage: "/assets/icons/health.svg",
      publishedAt: new Date(Date.now() - 345600000).toISOString(), // 4 days ago
      content: "Recent studies have shown that people who actively participate in community activities experience numerous health benefits..."
    }
  ]
};
