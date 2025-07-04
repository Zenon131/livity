export const QUERY_KEYS = {
    // AUTH KEYS
    CREATE_USER_ACCOUNT: "createUserAccount",
  
    // USER KEYS
    GET_CURRENT_USER: "getCurrentUser",
    GET_USERS: "getUsers",
    GET_USER_BY_ID: "getUserById",
  
    // POST KEYS
    GET_POSTS: "getPosts",
    GET_INFINITE_POSTS: "getInfinitePosts",
    GET_RECENT_POSTS: "getRecentPosts",
    GET_POST_BY_ID: "getPostById",
    GET_USER_POSTS: "getUserPosts",
    GET_FILE_PREVIEW: "getFilePreview",
    GET_POST_BY_PARENT: "getPostByParent",
    
  
    //  SEARCH KEYS
    SEARCH_POSTS: "getSearchPosts",
    TOP_NEWS: 'TOP_NEWS',
    SEARCH_NEWS: 'SEARCH_NEWS',
  
    // CHAT KEYS
    GET_CHAT_ROOMS: 'getChatRooms',
    GET_CHAT_MESSAGES: 'getChatMessages',
} as const;