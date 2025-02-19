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
    // Add more fallback articles as needed
  ]
};
