import { Client, Account, Databases, Storage, Avatars } from 'appwrite';

// Ensure all environment variables are correctly loaded
export const appwriteConfig = {
    projectId: import.meta.env.VITE_APPWRITE_PRJID, // Appwrite project ID
    url: window.location.hostname === 'localhost' 
        ? 'http://localhost:5173/api/appwrite'
        : 'https://www.livity.app/api/appwrite', // Appwrite API endpoint
    databaseId: import.meta.env.VITE_APPWRITE_DBID, // Appwrite database ID
    storageId: import.meta.env.VITE_APPWRITE_STRGID, // Appwrite storage ID
    userCollectionId: import.meta.env.VITE_APPWRITE_USERS_COLL_ID, // Users collection ID
    postCollectionId: import.meta.env.VITE_APPWRITE_POSTS_COLL_ID, // Posts collection ID
    communitiesCollectionId: import.meta.env.VITE_APPWRITE_COMMUNITIES_COLL_ID, // Communities collection ID
    commentCollectionId: import.meta.env.VITE_APPWRITE_COMMENTS_COLL_ID, // Comments collection ID
    chatRoomsCollectionId: import.meta.env.VITE_APPWRITE_CHAT_ROOMS_COLL_ID, // Chat rooms collection ID
    messagesCollectionId: import.meta.env.VITE_APPWRITE_MESSAGES_COLL_ID, // Messages collection ID
}

// Create and export the client
export const appwriteClient = new Client()
    .setEndpoint(appwriteConfig.url)
    .setProject(appwriteConfig.projectId);

// Configure CORS settings
appwriteClient.headers['X-Appwrite-Response-Format'] = '1.0.0';
appwriteClient.headers['Access-Control-Allow-Origin'] = 'https://www.livity.app';

// Create and export service instances
export const account = new Account(appwriteClient);
export const databases = new Databases(appwriteClient);
export const storage = new Storage(appwriteClient);
export const avatars = new Avatars(appwriteClient);
