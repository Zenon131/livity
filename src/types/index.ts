export type IContextType = {
  user: IUser;
  isLoading: boolean;
  isAuthenticated: boolean;
  setUser: React.Dispatch<React.SetStateAction<IUser>>;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  checkAuthUser: () => Promise<boolean>;
};

export type INavLink = {
    imgURL: string;
    route: string;
    label: string;
  };
  
  export type IUpdateUser = {
    userId: string;
    username: string;
    imgid: string;
    imgurl: URL | string;
    file: File[];
    currentPassword?: string;
    newPassword?: string;
    // location: string;
  };
  
  export type INewPost = {
    userId: string;
    content: string;
    location?: string;
    topic?: string;
    parentId?: string;
    article?: string;
    articleTitle?: string;
  };
  
  export type IUpdatePost = {
    postId: string;
    caption: string;
    imageId: string;
    imageUrl: URL;
    file: File[];
    location?: string;
    tags?: string;
  };

export interface ITopic {
  $id: string;
  name: string;
  description: string;
  postCount: number;
  followerCount: number;
  createdAt: string;
}

export interface INewTopic {
  name: string;
  description: string;
}

export interface IUserTopic {
  userId: string;
  topicId: string;
  followedAt: string;
}
  
  export type IUser = {
    id: string;
    username: string;
    email: string;
    imgurl?: string;
    bio?: string;
  followedTopics?: string[]; // Array of topic IDs
    // location: string;
  };
  
  export type INewUser = {
    email: string;
    username: string;
    password: string;
    // location: string;
  };

  export type INewComment = {
    content: string;
    userId: string;
    postId: string;
    parentCommentId: string;
    replies?: INewComment[];
    commentId: string;
  }

  export interface ICreator {
    $id: string;
    username: string;
    email: string;
    imgurl?: string;
    bio?: string;
  }
  
  export interface IPost {
    $id: string;
    $collectionId: string;
    $databaseId: string;
    $createdAt: string;
    $updatedAt: string;
    $permissions: string[];
    content: string;
    location: string;
    topic: string;
    userId: string;
    parentId?: string;
    creator?: ICreator;
  }

  export interface IThread {
    id: string;
    content: string;
    author: {
        id: string;
        username: string;
        imageUrl: string;
    };
    parentId?: string;
    communityId: string;
    createdAt: string;
    updatedAt: string;
    likes: string[];
    replies?: IThread[];
  }

  export interface ICommunity {
      id: string;
      name: string;
      description: string;
      imageUrl?: string;
      creatorId: string;
      members: string[];
      threads: IThread[];
      createdAt: string;
      updatedAt: string;
      isPrivate: boolean;
  }

  export interface IMessage {
    id: string;
    content: string;
    sender: IUser;
    createdAt: string;
    attachments?: {
      type: 'image' | 'file';
      url: string;
      name: string;
    }[];
  }

  export interface IChatRoom {
    id: string;
    name: string;
    participants: IUser[];
    lastMessage?: IMessage;
    unreadCount?: number;
    createdAt: string;
    updatedAt: string;
  }
