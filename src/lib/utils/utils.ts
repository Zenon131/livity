
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import OpenAI from "openai"
import { extractContentFromPosts, fetchPostsByTopic } from "../appwrite/api";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const convertFileToUrl = (file: File) => URL.createObjectURL(file);

export function formatDateString(dateString: string) {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };

  const date = new Date(dateString);
  const formattedDate = date.toLocaleDateString("en-US", options);

  const time = date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });

  return `${formattedDate} at ${time}`;
}

// 
export const multiFormatDateString = (timestamp: string = ""): string => {
  const timestampNum = Math.round(new Date(timestamp).getTime() / 1000);
  const date: Date = new Date(timestampNum * 1000);
  const now: Date = new Date();

  const diff: number = now.getTime() - date.getTime();
  const diffInSeconds: number = diff / 1000;
  const diffInMinutes: number = diffInSeconds / 60;
  const diffInHours: number = diffInMinutes / 60;
  const diffInDays: number = diffInHours / 24;

  switch (true) {
    case Math.floor(diffInDays) >= 30:
      return formatDateString(timestamp);
    case Math.floor(diffInDays) === 1:
      return `${Math.floor(diffInDays)} day ago`;
    case Math.floor(diffInDays) > 1 && diffInDays < 30:
      return `${Math.floor(diffInDays)} days ago`;
    case Math.floor(diffInHours) >= 1:
      return `${Math.floor(diffInHours)} hours ago`;
    case Math.floor(diffInMinutes) >= 1:
      return `${Math.floor(diffInMinutes)} minutes ago`;
    default:
      return "Just now";
  }
};



// export const organizeComments = (comments: INewComment[]): INewComment[] => {
//   const commentMap: { [key: string]: INewComment & { replies: INewComment[] } } = {};

//   // Create a map of comments by their IDs
//   comments.forEach((comment: INewComment) => {
//     commentMap[comment.$id] = { ...comment, replies: [] };
//   });

//   const rootComments: (INewComment & { replies: INewComment[] })[] = [];

//   // Organize comments into threads
//   comments.forEach((comment: INewComment) => {
//     if (comment.parentCommentId) {
//       commentMap[comment.parentCommentId].replies.push(commentMap[comment.$id]);
//     } else {
//       rootComments.push(commentMap[comment.commentId]);
//     }
//   });

//   return rootComments;
// };

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

export const summarizeContent = async (content: string) => {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: `Based on the following user-generated content, summarize the key points and opinions expressed by users about this topic: "${content}". Focus on what the majority of users are saying.`,
        },
      ],
      temperature: 0.7,
      max_tokens: 150, // Increased token limit for more detailed summaries
      top_p: 1,
    });

    const summary = response.choices[0].message.content?.trim();
    return summary;
  } catch (error) {
    console.error("Error generating summary from OpenAI:", error);
    return "No summary available.";
  }
};


export const getSummaryForTopic = async (topic: string) => {
  const posts = await fetchPostsByTopic(topic);

  if (posts.length === 0) {
    return "No posts found for this topic.";
  }

  const content = extractContentFromPosts(posts);
  const summary = await summarizeContent(content);

  return summary;
}

export const formatNumbers = (num: any) => {
  switch(true) {
    case num >= 1000000000:
      return `${(num / 1000000000).toFixed(1)}B`;
    case num >= 1000000:
      return `${(num / 1000000).toFixed(1)}M`;
    case num >= 1000:
      return `${(num / 1000).toFixed(1)}K`;
    default:
      return num.toString();
  }

}