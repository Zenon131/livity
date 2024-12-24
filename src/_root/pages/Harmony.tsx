import { useEffect, useState } from 'react';
import { useGetPopularTopics } from '@/lib/react-query/queriesAndMutations';
import { getSummaryForTopic } from '@/lib/utils';

const Harmony = () => {
  const { data: topics, isPending: isTopicLoading, isError: isErrorTopics } = useGetPopularTopics();
  const [summaries, setSummaries] = useState<{ [key: string]: string }>({});
  const [loadingSummaries, setLoadingSummaries] = useState<boolean>(true);

  useEffect(() => {
    if (topics && topics.length > 0) {
      const fetchSummaries = async () => {
        setLoadingSummaries(true);
        const summariesMap: { [key: string]: string } = {};
        for (const topic of topics) {
          try {
            // Fetch detailed content for the topic and summarize it
            const postsContent = await getSummaryForTopic(topic.name);
            summariesMap[topic.name] = postsContent || "No summary available.";
          } catch (error) {
            summariesMap[topic.name] = "Error fetching summary.";
          }
        }
        setSummaries(summariesMap);
        setLoadingSummaries(false);
      };
      fetchSummaries();
    }
  }, [topics]);

  return (
    <div className="flex flex-1">
      <div className="common-container">
        <div className="max-w-5xl flex-start gap-3 justify-start w-full">
          <img src="/assets/icons/HarmonyCust.svg" width={36} height={36} alt="harmony" />
          <h2 className="h3-bold md:h2-bold w-full">Harmony</h2>
        </div>
        <p className="text-light-2 base-regular">Harmony provides summaries of what users are discussing on Bashmnt by topic. Please note that it can make mistakes. More features coming soon!</p>
        <div className="topic-summaries mt-8">
          {isTopicLoading ? (
            <p>Loading topic...</p>
          ) : isErrorTopics ? (
            <p>Error loading topic</p>
          ) : (
            topics.map((topic) => (
              <div 
                key={topic.name} 
                className="flex flex-col mb-6 bg-dark-2 rounded-xl p-6 hover:bg-dark-4 transition-all duration-200"
              >
                <div className='flex items-center gap-2 mb-3'>
                    <h3 className="h3-bold text-light-1">{topic.name}</h3>
                    <img 
                      src='/assets/icons/!.svg' 
                      alt='popular' 
                      height={24} 
                      width={24}
                      className="opacity-80"
                    />
                </div>
                <p className="text-light-2 base-regular">
                  {loadingSummaries ? "Loading summary..." : summaries[topic.name]}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Harmony;
