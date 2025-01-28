import axios from 'axios';

const NEWS_API_KEY = import.meta.env.VITE_NEWS_API_KEY;
const NEWS_API_BASE_URL = 'https://newsapi.org/v2';

export interface NewsArticle {
  source: {
    id: string | null;
    name: string;
  };
  author: string;
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  publishedAt: string;
  content: string;
}

export interface NewsResponse {
  status: string;
  totalResults: number;
  articles: NewsArticle[];
}

export const newsService = {
  async getTopNews(category?: string, country: string = 'us') {
    try {
      const response = await axios.get<NewsResponse>(`${NEWS_API_BASE_URL}/top-headlines`, {
        params: {
          apiKey: NEWS_API_KEY,
          country,
          category,
          pageSize: 20,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching news:', error);
      throw error;
    }
  },

  async searchNews(query: string) {
    try {
      const response = await axios.get<NewsResponse>(`${NEWS_API_BASE_URL}/everything`, {
        params: {
          apiKey: NEWS_API_KEY,
          q: query,
          sortBy: 'relevancy',
          pageSize: 50,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error searching news:', error);
      throw error;
    }
  },
};
