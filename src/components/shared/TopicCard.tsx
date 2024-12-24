import { Link } from 'react-router-dom';
import { Button } from "../ui/button";

type TopicCardProps = {
  topic: { name: string; postCount: number };
};

const TopicCard = ({ topic }: TopicCardProps) => {
  return (
    <Link to={`/?topic=${encodeURIComponent(topic.name.toLowerCase())}`} className="user-card">
      <div className="flex-center flex-col gap-1">
        <p className="base-medium text-light-1 text-center line-clamp-1">
          {topic.name}
        </p>
        <p className="small-regular text-light-3 text-center">
          {topic.postCount} Posts
        </p>
      </div>

      <Button type="button" size="sm" className="shad-button_primary px-5">
        Explore
      </Button>
    </Link>
  );
};

export default TopicCard;
