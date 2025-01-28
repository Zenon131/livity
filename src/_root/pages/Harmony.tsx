// import { useState } from 'react';
import NewsFeed from '@/components/shared/NewsFeed';
// import { Button } from '@/components/ui/button';

const Harmony = () => {
  // const [activeTab, setActiveTab] = useState<'news'>('news');

  return (
    <div className="flex flex-1">
      <div className="common-container">
        <div className="max-w-5xl flex-start gap-3 justify-start w-full">
          <img src="/assets/icons/HarmonyCust.svg" width={36} height={36} alt="harmony" />
          <h2 className="h3-bold md:h2-bold w-full">Harmony</h2>
        </div>
        <p className="text-light-2 base-regular mb-8">
          Harmony keeps you updated with relevant news. Please note that it can make mistakes. More features coming soon!
        </p>
        <div className="max-w-5xl">
          <NewsFeed />
        </div>
      </div>
    </div>
  );
};

export default Harmony;
