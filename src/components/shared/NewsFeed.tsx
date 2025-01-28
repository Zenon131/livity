import { useState } from 'react';
import { useGetTopNews, useSearchNews } from '@/lib/react-query/queriesAndMutations';
import { NewsArticle } from '@/lib/news/newsService';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../ui/card';
import { useToast } from '../ui/use-toast';
import { useUserContext } from '@/context/authContext';
import { useNavigate } from 'react-router-dom';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const categories = [
  'general',
  'business',
  'technology',
  'entertainment',
  'health',
  'science',
  'sports',
];

const NewsFeed = () => {
  const [selectedCategory, setSelectedCategory] = useState('general');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
  const [articleSummary, setArticleSummary] = useState<string>('');
  const { toast } = useToast();
  const { user } = useUserContext();
  const navigate = useNavigate();

  const { data: topNews, isLoading: isLoadingTop } = useGetTopNews(selectedCategory);
  const { data: searchResults, isLoading: isLoadingSearch } = useSearchNews(searchQuery);

  const displayedNews = searchQuery ? searchResults?.articles : topNews?.articles;
  const isLoading = searchQuery ? isLoadingSearch : isLoadingTop;

  const handleArticleClick = async (article: NewsArticle) => {
    setSelectedArticle(article);
    const summary = `${article.title}\n\nKey Points:\n- ${article.description}\n- Published by ${article.source.name}\n- ${new Date(article.publishedAt).toLocaleDateString()}`;
    setArticleSummary(summary);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setSearchQuery('');
  };

  const handleShareArticle = async (article: NewsArticle) => {
    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to share articles",
        variant: "destructive",
      });
      return;
    }

    // Navigate to post form with article URL
    navigate(`/create-post?article=${encodeURIComponent(article.url)}&topic=${selectedCategory}&location=${encodeURIComponent(article.source.name)}&articleTitle=${encodeURIComponent(article.title)}`);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4">
        <h3 className="h3-bold mb-4">Latest News</h3>
        <Input
          type="text"
          placeholder="Search news..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="bg-dark-4"
        />
        
        {/* Mobile: Dropdown Menu */}
        <div className="md:hidden">
          <Select value={selectedCategory} onValueChange={handleCategoryChange}>
            <SelectTrigger className="w-full bg-dark-2">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent className="bg-dark-2">
              {categories.map((category) => (
                <SelectItem 
                  key={category} 
                  value={category}
                  className="capitalize"
                >
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Desktop: Button Group */}
        <div className="hidden md:flex md:flex-wrap gap-2">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "secondary"}
              onClick={() => handleCategoryChange(category)}
              className={`${
                selectedCategory === category ? 'bg-primary-500 text-primary-foreground' : ''
              }`}
              size="sm"
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Featured Story / Summary Section */}
        <div className="flex flex-col gap-4">
          <h3 className="text-xl font-bold text-light-1">Focussed Story</h3>
          {selectedArticle ? (
            <Card className="bg-dark-2">
              <CardHeader>
                <CardTitle className="text-light-1">{selectedArticle.title}</CardTitle>
                <CardDescription className="text-light-2">
                  {selectedArticle.source.name} • {new Date(selectedArticle.publishedAt).toLocaleDateString()}
                </CardDescription>
              </CardHeader>
              <CardContent className="text-light-2">
                <p className="whitespace-pre-line">{articleSummary}</p>
              </CardContent>
              <CardFooter className="flex gap-2">
                <Button 
                  variant="default"
                  onClick={() => window.open(selectedArticle.url, '_blank')}
                  className="flex-1 hover:bg-primary-500 text-white"
                >
                  Read Full Article
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => handleShareArticle(selectedArticle)}
                  className="flex gap-2"
                >
                  <img
                    src="/assets/icons/share.svg"
                    alt="share"
                    width={20}
                    height={20}
                  />
                  Share
                </Button>
              </CardFooter>
            </Card>
          ) : (
            <Card className="bg-dark-2 border border-dashed border-light-2">
              <CardContent className="flex items-center justify-center min-h-[200px]">
                <p className="text-light-2 text-center">
                  Select a story from the list to see its summary here
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Stories List Section */}
        <div className="flex flex-col gap-4">
          <h3 className="text-xl font-bold text-light-1">Latest Stories</h3>
          <div className="space-y-4">
            {isLoading ? (
              <Card className="p-4 bg-dark-2">
                <CardContent>Loading stories...</CardContent>
              </Card>
            ) : !displayedNews?.length ? (
              <Card className="p-4 bg-dark-2">
                <CardContent>No stories found.</CardContent>
              </Card>
            ) : (
              displayedNews.map((article: NewsArticle) => (
                <Card
                  key={article.url}
                  className={`bg-dark-2 hover:bg-dark-4 transition-all duration-200 cursor-pointer ${
                    selectedArticle?.url === article.url 
                      ? 'border-[3px] border-primary-500 shadow-lg shadow-primary-500/20' 
                      : 'border-border'
                  }`}
                >
                  <CardHeader onClick={() => handleArticleClick(article)}>
                    <CardTitle className="text-light-1 text-lg">{article.title}</CardTitle>
                    <CardDescription className="text-light-2">
                      {article.source.name} • {new Date(article.publishedAt).toLocaleDateString()}
                    </CardDescription>
                  </CardHeader>
                  {article.description && (
                    <CardContent onClick={() => handleArticleClick(article)}>
                      <p className="text-light-2 line-clamp-2">{article.description}</p>
                    </CardContent>
                  )}
                  <CardFooter className="flex justify-end pt-2">
                    <Button
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleShareArticle(article);
                      }}
                      className="hover:bg-dark-3"
                      size="sm"
                    >
                      <img
                        src="/assets/icons/share.svg"
                        alt="share"
                        width={16}
                        height={16}
                        className="mr-2"
                      />
                      Share
                    </Button>
                  </CardFooter>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsFeed;