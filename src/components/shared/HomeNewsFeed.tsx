import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetTopNews, useSearchNews } from '@/lib/react-query/queriesAndMutations';
import { NewsArticle } from '@/lib/news/newsService';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../ui/card';
import { useToast } from '../ui/use-toast';
import { useUserContext } from '@/context/authContext';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Share2, Twitter, Facebook } from 'lucide-react';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const categories = [
  'general',
  'business',
  'technology',
  'entertainment',
  'health',
  'science',
  'sports',
];

const HomeNewsFeed = () => {
  const [selectedCategory, setSelectedCategory] = useState('general');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
  const [articleSummary, setArticleSummary] = useState<string>('');
  const [selectedText, setSelectedText] = useState('');
  // const [shareCount, setShareCount] = useState<Record<string, number>>({});
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

  const handleShareArticleCard = async (article: NewsArticle) => {
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

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setSearchQuery('');
  };

  const handleShareArticle = async (article: NewsArticle, platform?: string) => {
    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to share articles",
        variant: "destructive",
      });
      return;
    }

    const shareText = selectedText 
      ? `"${selectedText}" - Check out this interesting highlight from:`
      : 'Check out this interesting article:';
    
    const articleUrl = `${window.location.origin}/article/${encodeURIComponent(article.url)}`;
    const fullShareText = `${shareText} ${article.title}\n\n${articleUrl}`;

    if (platform) {
      let platformShareUrl: string;
      switch (platform) {
        case 'twitter':
          platformShareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(fullShareText)}`;
          break;
        case 'facebook':
          platformShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(articleUrl)}`;
          break;
        case 'bluesky':
          platformShareUrl = `https://bsky.app/intent/compose?text=${encodeURIComponent(fullShareText)}`;
          break;
        default:
          return; // Exit if platform is not supported
      }
      if (platformShareUrl) {
        window.open(platformShareUrl, '_blank');
      }
    } else {
      // Copy to clipboard for direct link sharing
      await navigator.clipboard.writeText(fullShareText);
      toast({
        title: "Link copied!",
        description: "Share link has been copied to your clipboard",
      });
    }

    // Update share count
    // setShareCount(prev => ({
    //   ...prev,
    //   [article.url]: (prev[article.url] || 0) + 1
    // }));

    // Track share analytics
    // TODO: Implement analytics tracking
  };

  const handleTextSelection = () => {
    const selection = window.getSelection();
    if (selection && selection.toString().length > 0) {
      setSelectedText(selection.toString());
    }
  };

  const handleCopyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: "Quote copied!",
        description: "The selected text has been copied to your clipboard.",
      });
    }).catch(err => {
      toast({
        title: "Copy failed",
        description: `Failed to copy text to clipboard. ${err}`,
        variant: "destructive",
      });
    });
  };

  // Set the first article as selected if none is selected
  React.useEffect(() => {
    if (displayedNews?.length && !selectedArticle) {
      handleArticleClick(displayedNews[0]);
    }
  }, [displayedNews]);

  return (
    <div className="flex flex-col gap-6">
      {/* Search and Filters */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <Input
            type="text"
            placeholder="Search news..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-dark-4"
          />
          
          {/* Mobile: Dropdown Menu */}
          <div className="md:hidden flex-1">
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

      {/* Focused Story Section */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <h3 className="text-xl font-bold text-light-1">Focused Story</h3>
          <img src="/assets/icons/HarmonyCust.svg" width={36} height={36} alt="harmony" />
        </div>
        {selectedArticle ? (
          <Card className="bg-dark-2">
            <CardHeader>
              <CardTitle className="text-light-1">{selectedArticle.title}</CardTitle>
              <CardDescription className="text-light-2">
                {selectedArticle.source.name} • {new Date(selectedArticle.publishedAt).toLocaleDateString()}
              </CardDescription>
            </CardHeader>
            <CardContent 
              className="text-light-2"
              onMouseUp={handleTextSelection}
            >
              <p className="whitespace-pre-line">{articleSummary}</p>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <div className="flex w-full gap-2">
                <Button 
                  variant="default"
                  onClick={() => window.open(selectedArticle.url, '_blank')}
                  className="flex-1 hover:bg-primary-500 text-white"
                >
                  Read Full Article
                </Button>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleShareArticleCard(selectedArticle)}

                      >
                        <img src="/assets/icons/share.svg" width={24} height={24} alt="share" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Share article</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              
              <div className="flex w-full justify-between items-center">
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleShareArticle(selectedArticle, 'twitter')}
                    className="hover:bg-primary-500"
                  >
                    <Twitter className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleShareArticle(selectedArticle, 'facebook')}
                    className="hover:bg-primary-500"
                  >
                    <Facebook className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleShareArticle(selectedArticle, 'bluesky')}
                    className="hover:bg-primary-500"
                  >
                    <img src="assets/icons/Bluesky-Line--Streamline-Remix.svg" className="h-4 w-4 invert-white" />
                  </Button>
                </div>
              </div>
              {selectedText && (
                <div className="w-full p-2 bg-dark-3 rounded-lg">
                  <p className="text-sm text-light-2 mb-2">Share this highlight:</p>
                  <p className="text-light-1 italic">"{selectedText}"</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCopyToClipboard(selectedText)}
                    className="mt-2 hover:bg-primary-500"
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    Copy Quote
                  </Button>
                </div>
              )}
            </CardFooter>
          </Card>
        ) : (
          <Card className="bg-dark-2 border border-dashed border-light-2">
            <CardContent className="flex items-center justify-center min-h-[200px]">
              <p className="text-light-2 text-center">
                Select a story from the list below to see its details here
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Latest Stories List */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <h3 className="text-xl font-bold text-light-1">Latest Stories</h3>
        </div>
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
                      handleShareArticleCard(article);
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
  );
};

export default HomeNewsFeed;
