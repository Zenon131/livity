import { 
    useQuery,
    useMutation,
    useQueryClient,
  } from '@tanstack/react-query'
import { createComment, createPost, createUserAccount, getChildPostCount, getPostById, getPostByParent, getUserById, loginAccount, logoutAccount, searchPosts, updateUser } from '../appwrite/api'
import { INewComment, INewPost, INewUser, IUpdateUser } from '@/types'
import { QUERY_KEYS } from './queryKeys'
import { appwriteConfig, databases } from '../appwrite/config'
import { Query } from 'appwrite';

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

export const useGetRecentPosts = (topic?: string, location?: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_RECENT_POSTS, topic, location],
    queryFn: async () => {
      const queries: any[] = [];

      if (topic) {
        queries.push(Query.equal('topic', topic));
      }
      
      if (location) {
        queries.push(Query.equal('location', location));
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

export const useGetPopularTopics = () => {
  return useQuery({
    queryKey: ['popularTopics'],
    queryFn: async () => {
      const response = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.postCollectionId,
        []
      );

      // Create a case-insensitive map of topics
      const topicMap = new Map<string, { name: string; count: number }>();
      
      response.documents.forEach(post => {
        if (post.topic) {
          const topicLower = post.topic.toLowerCase();
          const existing = topicMap.get(topicLower);
          
          if (!existing || post.topic.length > existing.name.length) {
            // Keep the longest version of the topic name (usually the properly capitalized one)
            topicMap.set(topicLower, {
              name: post.topic,
              count: (existing?.count || 0) + 1
            });
          } else {
            topicMap.set(topicLower, {
              name: existing.name,
              count: existing.count + 1
            });
          }
        }
      });

      return Array.from(topicMap.values())
        .map(({ name, count }) => ({ name, postCount: count }))
        .sort((a, b) => b.postCount - a.postCount);
    },
  });
};
