import { multiFormatDateString } from '@/lib/utils';
import { Models } from 'appwrite';
import { Link } from 'react-router-dom';
// import { Button } from '@/components/ui/button';
import { useChildPostCount, useGetPostById } from '@/lib/react-query/queriesAndMutations';
import { Card } from '../ui/card';
import { ExternalLink } from 'lucide-react';

type PostCardProps = {
  post: Models.Document;
  isChild?: boolean;
};

const formatUrl = (url: string) => {
  try {
    const urlObj = new URL(url);
    return {
      domain: urlObj.hostname.replace('www.', ''),
      path: urlObj.pathname.length > 30 ? urlObj.pathname.slice(0, 30) + '...' : urlObj.pathname
    };
  } catch {
    return { domain: url.slice(0, 30), path: '' };
  }
};

const PostCard = ({ post }: PostCardProps) => {
  console.log(post)
  const { data: childPostCount, isLoading } = useChildPostCount(post.$id);
  const { data: parentPost, isLoading: isParentPostLoading } = useGetPostById(post.parentId || '');

  return (
    <div className="post-card mb-6">
      {/* Breadcrumb Navigation */}
      {post.parentId && (
        <div className="breadcrumb mb-2 text-sm text-light-3">
          <Link to={`/post/${post.parentId}`} className="text-primary">
            <span>Replied to {isParentPostLoading ? "Loading..." : parentPost?.creator?.username || 'Unknown User'}</span>
          </Link>
        </div>
      )}

      <div className="flex-between">
        <div className="flex items-center gap-3">
          <Link to={`/profile/${post.userId}`}>
            <img
              src={
                post.creator?.imgurl || 'assets/icons/profile-placeholder.svg'
              }
              alt="creator"
              className="w-10 h-10 rounded-full object-cover"
            />
          </Link>
          <div className="flex flex-col">
            <p className="base-medium lg:body-bold text-light-1">
              {post.creator?.username || 'Unknown User'}
            </p>
            <div className="flex-center gap-2 text-light-3">
              <p className="subtle-semibold lg:small-regular">
                {multiFormatDateString(post.$createdAt)}
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <Link to={`/post/${post.$id}`}>
        <p className="small-medium lg:base-medium py-5">
          {post.content}
        </p>
      </Link>

      {/* Article Link Card */}
      {post.article && (
        <a 
          href={post.article} 
          target="_blank" 
          rel="noopener noreferrer"
          className="block mt-4 hover:no-underline"
        >
          <Card className="bg-dark-3 hover:bg-dark-4 transition-colors duration-200 cursor-pointer">
            <div className="flex items-center gap-3 p-4">
              <div className="flex-shrink-0">
                <ExternalLink className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-light-2 text-sm truncate font-medium">
                  {formatUrl(post.article).domain}
                </div>
                <div className="text-light-3 text-xs truncate">
                  {formatUrl(post.article).path}
                </div>
                <p className="text-primary text-xs mt-1">Click to read article</p>
              </div>
            </div>
          </Card>
        </a>
      )}

      {!post.parentId && (
        <div className="mt-2 text-light-3">
          {!isLoading && (
            <p>{childPostCount} replies</p>
          )}
        </div>
      )}
    </div>
  );
};

export default PostCard;
