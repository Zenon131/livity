import { 
    useQuery,
    useMutation,
    useQueryClient,
  } from '@tanstack/react-query'
import { createComment, createPost, createUserAccount, getChildPostCount, getPostById, getPostByParent, getUserById, loginAccount, logoutAccount, searchPosts, shareArticle, updateUser } from '../appwrite/api'
import { INewComment, INewPost, INewUser, IUpdateUser } from '@/types'
import { QUERY_KEYS } from './queryKeys'
import { appwriteConfig, databases } from '../appwrite/config'
import { Query } from 'appwrite';
import { newsService } from '../news/newsService'


export function useCreateUserAccMutation() {
    return useMutation({
        mutationFn: (user: INewUser) => createUserAccount(user)
    })
}

export function useLoginAccMutation() {
    return useMutation({
        mutationFn: (user: { email: string; password: string }) => loginAccount(user)
    })
}

export function useLogoutAccMutation() {
    return useMutation({
        mutationFn: logoutAccount
    })
}

export const useCreatePost = () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: (post: INewPost) => createPost(post),
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
        });
      },
    });
  };

export const useCreateComment = () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: (comment: INewComment) => createComment(comment),
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.GET_POST_BY_PARENT],
        });
      },
    });
}

export const useGetRecentPosts = (topic?: string, location?: string, onlyArticles?: boolean) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_RECENT_POSTS, topic, location, onlyArticles],
    queryFn: async () => {
      const queries: any[] = [];

      if (topic) {
        queries.push(Query.equal('topic', topic));
      }
      
      if (location) {
        queries.push(Query.equal('location', location));
      }

      if (onlyArticles) {
        queries.push(Query.notEqual('article', ''));
      }

      const response = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.postCollectionId,
        queries.length > 0 ? queries : []
      );

      return response;
    },
  });
};

export const useGetPostById = (postId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_POST_BY_ID, postId],
    queryFn: () => getPostById(postId),
    enabled: !!postId
  })
}

export const useGetPostsByParent = (postId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_POST_BY_PARENT, postId],
    queryFn: () => getPostByParent(postId),
    enabled: !!postId,
  });
};

export const useChildPostCount = (parentPostId: string) => {
  return useQuery({
      queryKey: ['childPostCount', parentPostId],
      queryFn: () => getChildPostCount(parentPostId),
      enabled: !!parentPostId,  // Only fetch if parentPostId is defined
  });
};

export const useSearchPosts = (searchVal: string) => {
  return useQuery({
    queryKey: ['searchPosts', searchVal],
    queryFn: () => searchPosts(searchVal),
    enabled: !!searchVal, // Only run the query if searchVal is not empty
  });
};

export const useGetUserById = (userId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_USER_BY_ID, userId],
    queryFn: () => getUserById(userId),
    enabled: !!userId,
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (user: IUpdateUser) => updateUser(user),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_USER_BY_ID, data?.$id],
      });
    },
  });
};

export const useShareArticle = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ 
      userId, 
      article 
    }: { 
      userId: string; 
      article: {
        title: string;
        description: string;
        url: string;
        urlToImage?: string;
        publishedAt: string;
        source?: {
          name: string;
        };
      }
    }) => shareArticle(userId, article),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_USER_BY_ID],
      });
    },
  });
};

export const useGetPopularTopics = () => {
  return useQuery({
    queryKey: ['popularTopics'],
    queryFn: async () => {
      // Get all posts including child posts (comments)
      const response = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.postCollectionId,
        [Query.limit(100)] // Increase limit to get more posts
      );

      // Create a case-insensitive map of topics with extended metrics
      const topicMap = new Map<string, {
        name: string;
        postCount: number;
        commentCount: number;
        totalEngagement: number;
      }>();
      
      response.documents.forEach(post => {
        if (post.topic) {
          const topicLower = post.topic.toLowerCase();
          const existing = topicMap.get(topicLower);
          
          // Calculate engagement score
          // Parent posts count as 1, comments count as 0.5
          const engagementScore = post.parent ? 0.5 : 1;
          
          if (!existing || post.topic.length > existing.name.length) {
            // Keep the longest version of the topic name (usually the properly capitalized one)
            topicMap.set(topicLower, {
              name: post.topic,
              postCount: post.parent ? existing?.postCount || 0 : (existing?.postCount || 0) + 1,
              commentCount: post.parent ? (existing?.commentCount || 0) + 1 : existing?.commentCount || 0,
              totalEngagement: (existing?.totalEngagement || 0) + engagementScore
            });
          } else {
            topicMap.set(topicLower, {
              name: existing.name,
              postCount: post.parent ? existing.postCount : existing.postCount + 1,
              commentCount: post.parent ? existing.commentCount + 1 : existing.commentCount,
              totalEngagement: existing.totalEngagement + engagementScore
            });
          }
        }
      });

      // Convert to array and sort by engagement score
      return Array.from(topicMap.values())
        .map(({ name, postCount, commentCount, totalEngagement }) => ({
          name,
          postCount,
          commentCount,
          totalEngagement,
          count: postCount + commentCount // Keep backward compatibility
        }))
        .sort((a, b) => {
          // Sort first by total engagement, then by post count if engagement is equal
          if (b.totalEngagement === a.totalEngagement) {
            return b.postCount - a.postCount;
          }
          return b.totalEngagement - a.totalEngagement;
        });
    },
  });
};

export function useGetTopNews(category?: string, country: string = 'us') {
    return useQuery({
        queryKey: [QUERY_KEYS.TOP_NEWS, category, country],
        queryFn: () => newsService.getTopNews(category, country)
    })
}

export function useSearchNews(query: string) {
    return useQuery({
        queryKey: [QUERY_KEYS.SEARCH_NEWS, query],
        queryFn: () => newsService.searchNews(query),
        enabled: !!query
    })
}
