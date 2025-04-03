import { multiFormatDateString } from '@/lib/utils/utils';
import { Models } from 'appwrite';
import { Link } from 'react-router-dom';

type CommentCardProps = {
  post: Models.Document;
};

const CommentCard = ({ post }: CommentCardProps) => {
  return (
    <div className="post-card">
      <div className="flex-between">
        <div className="flex items-center gap-3">
          <Link to={`/profile/${post.userId}`}>
            <img
              src={post?.creator?.imgurl || 'assets/icons/profile-placeholder.svg'}
              alt="commentor"
              className="w-8 h-8 rounded-full object-cover"
            />
          </Link>
          <div className="flex flex-col">
            <p className="base-medium lg:body-bold text-light-1">
              {post?.creator?.username || 'Unknown User'}
            </p>
            <div className="flex-center gap-2 text-light-3">
              <p className="subtle-semibold lg:small-regular">
                {multiFormatDateString(post.$createdAt)}
              </p>
            </div>
          </div>
        </div>
      </div>
      <Link to={`/post/${post?.$id}`}>
        <p className="small-medium lg:base-medium py-5">
          {post?.content}
        </p>
      </Link>
    </div>
  );
};

export default CommentCard;
