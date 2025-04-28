import axios from 'axios';
import { fallbackNews } from './fallback';

// API key should be added to your .env file as VITE_GNEWS_API_KEY
const GNEWS_API_KEY = import.meta.env.VITE_GNEWS_API_KEY;
const GNEWS_API_BASE_URL = 'https://gnews.io/api/v4';

// Interface for Gnews response which is slightly different from NewsAPI
export interface GNewsArticle {
  title: string;
  description: string;
  content: string;
  url: string;
  image: string; // Different from NewsAPI's urlToImage
  publishedAt: string;
  source: {
    name: string;
    url: string;
  };
}

export interface GNewsResponse {
  totalArticles: number;
  articles: GNewsArticle[];
}

// Function to convert Gnews format to our app's format
const convertToAppFormat = (data: GNewsResponse): any => {
  return {
    status: "ok",
    totalResults: data.totalArticles,
    articles: data.articles.map(article => ({
      source: {
        id: null,
        name: article.source.name
      },
      author: article.source.name, // Gnews doesn't provide author directly
      title: article.title,
      description: article.description,
      url: article.url,
      urlToImage: article.image,
      publishedAt: article.publishedAt,
      content: article.content
    }))
  };
};

export const gnewsService = {
  async getTopNews(category?: string, country: string = 'us') {
    try {
      const response = await axios.get<GNewsResponse>(`${GNEWS_API_BASE_URL}/top-headlines`, {
        params: {
          token: GNEWS_API_KEY,
          lang: country, // Gnews uses 'lang' instead of 'country'
          topic: category, // Gnews uses 'topic' instead of 'category'
          max: 20 // Gnews uses 'max' instead of 'pageSize'
        }
      });
      return convertToAppFormat(response.data);
    } catch (error) {
      console.error('Error fetching news from Gnews:', error);
      // Return fallback data on error
      return fallbackNews;
    }
  },

  async searchNews(query: string) {
    try {
      const response = await axios.get<GNewsResponse>(`${GNEWS_API_BASE_URL}/search`, {
        params: {
          token: GNEWS_API_KEY,
          q: query,
          max: 20
        }
      });
      return convertToAppFormat(response.data);
    } catch (error) {
      console.error('Error searching news from Gnews:', error);
      // Return fallback data on error
      return fallbackNews;
    }
  }
};