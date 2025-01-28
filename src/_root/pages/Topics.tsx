import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useGetPopularTopics } from '@/lib/react-query/queriesAndMutations';
import Loader from '@/components/shared/Loader';

const Topics = () => {
  const navigate = useNavigate();
  const { data: topics, isLoading: isTopicsLoading } = useGetPopularTopics();

  const handleTopicClick = (topicValue: string) => {
    navigate(`/?topic=${topicValue}`);
  };

  if (isTopicsLoading) {
    return <Loader />;
  }

  return (
    <div className="flex flex-col gap-8 py-8 px-4 md:px-8 w-full max-w-6xl mx-auto">
      <div className="flex justify-between items-center">
        <img src="/assets/icons/!.svg" width={36} height={36} alt="topics" />
        <h1 className="h3-bold md:h2-bold text-left w-full">Topics</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {topics?.map((topic) => (
          <div 
            key={topic.name} 
            className="bg-dark-2 rounded-xl p-4 flex flex-col gap-2 hover:bg-dark-4 transition-all cursor-pointer"
            onClick={() => handleTopicClick(topic.name)}
          >
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center">
                  <span className="text-light-1 text-sm font-bold">{topic.name[0]}</span>
                </div>
                <h3 className="base-semibold text-light-1">{topic.name}</h3>
              </div>
              <p className="text-light-3 text-sm line-clamp-2">Interactions: {topic.count}</p>
              <div className="flex justify-between items-center mt-2">
                <Button variant="ghost" className="text-primary-500 hover:text-primary-500 p-0">
                  View
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Topics;
