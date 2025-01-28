import { Link } from 'react-router-dom';
import { Button } from "../ui/button";

type TopicCardProps = {
  topic: string;
  count: number;
  onClick?: () => void;
};

const TopicCard = ({ topic, count, onClick }: TopicCardProps) => {
  return (
    <Link 
      to={`/?topic=${encodeURIComponent(topic.toLowerCase())}`} 
      className="user-card"
      onClick={(e) => {
        if (onClick) {
          e.preventDefault();
          onClick();
        }
      }}
    >
      <div className="flex-center flex-col gap-1">
        <p className="base-medium text-light-1 text-center line-clamp-1">
          {topic}
        </p>
        <div className="flex flex-col gap-0.5 items-center">
          <p className="small-regular text-light-3 text-center">
          </p>
          <p className="tiny-medium text-primary-500">
            {count} Total Interactions
          </p>
        </div>
      </div>

      <Button type="button" size="sm" className="shad-button_primary px-5">
        Explore
      </Button>
    </Link>
  );
};

export default TopicCard;
