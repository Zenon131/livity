import { Link, useParams } from 'react-router-dom';
import CommentForm from '@/components/forms/CommentForm';
import Loader from '@/components/shared/Loader';
import { useGetPostById, useGetPostsByParent } from '@/lib/react-query/queriesAndMutations';
import { multiFormatDateString } from '@/lib/utils/utils';
import CommentCard from '@/components/shared/CommentCard';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ExternalLink } from 'lucide-react';

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

const PostDetails = () => {
  const { id } = useParams();
  const { data: post, isPending: isPostLoading } = useGetPostById(id || '');
  const { data: comments, isPending: isCommentsLoading } = useGetPostsByParent(id || '');
  const { data: parentPost, isLoading: isParentPostLoading } = useGetPostById(post?.parentId || '');

  if (isPostLoading) {
    return <Loader />;
  }

  return (
    <div className="post_details-container">
      {post && (
        <div className="post-card">
          <div className="flex-between">
            <div className="flex items-center gap-3">
              <Link to={`/profile/${post.userId}`}>
                <img
                  src={post.creator?.imgurl || 'assets/icons/profile-placeholder.svg'}
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
              {post?.content}
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
                  <div className="flex-1 min-w-0"> {/* min-w-0 allows truncation to work */}
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

          {post.parentId && (
            <div className="mt-4">
              <Link to={`/post/${post.parentId}`}>
                <Button className="shad-button_primary">
                  Replied to {isParentPostLoading ? 'Loading...' : parentPost?.creator.username || 'Unknown User'}
                </Button>
              </Link>
            </div>
          )}
          <CommentForm postId={post.$id} />
        </div>
      )}

      {/* Comments Section */}
      {isCommentsLoading ? (
        <Loader />
      ) : (
        comments?.documents.map((comment) => (
          <CommentCard key={comment.$id} post={comment} />
        ))
      )}
    </div>
  );
};

export default PostDetails;
