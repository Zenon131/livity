import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import Loader from '@/components/shared/Loader';

const topics = [
  { value: "politics", label: "Politics", description: "Discuss current political events and policies" },
  { value: "technology", label: "Technology", description: "Share and learn about the latest tech innovations" },
  { value: "sports", label: "Sports", description: "Stay updated with sports news and discussions" },
  { value: "entertainment", label: "Entertainment", description: "Everything about movies, TV shows, and pop culture" },
  { value: "food", label: "Food", description: "Share recipes and food experiences" },
  { value: "travel", label: "Travel", description: "Exchange travel tips and experiences" },
  { value: "music", label: "Music", description: "Discuss your favorite music and artists" },
  { value: "art", label: "Art", description: "Share and appreciate various forms of art" },
  { value: "science", label: "Science", description: "Explore scientific discoveries and discussions" },
  { value: "health", label: "Health", description: "Share health tips and wellness discussions" },
  { value: "education", label: "Education", description: "Educational resources and academic discussions" },
  { value: "business", label: "Business", description: "Business news and entrepreneurship discussions" },
  { value: "environment-club", label: "Environment Club", description: "Discuss environmental issues and sustainability" },
];

const Topics = () => {
  const navigate = useNavigate();

  const handleTopicClick = (topicValue: string) => {
    navigate(`/?topic=${topicValue}`);
  };

  return (
    <div className="flex flex-col gap-8 py-8 px-4 md:px-8 w-full max-w-6xl mx-auto">
      <div className="flex justify-between items-center">
      <img src="/assets/icons/!.svg" width={36} height={36} alt="topics" />
        <h1 className="h3-bold md:h2-bold text-left w-full">Topics</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {topics.map((topic) => (
          <div 
            key={topic.value} 
            className="bg-dark-2 rounded-xl p-4 flex flex-col gap-2 hover:bg-dark-4 transition-all cursor-pointer"
            onClick={() => handleTopicClick(topic.value)}
          >
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center">
                  <span className="text-light-1 text-sm font-bold">{topic.label[0]}</span>
                </div>
                <h3 className="base-semibold text-light-1">{topic.label}</h3>
              </div>
              <p className="text-light-3 text-sm line-clamp-2">{topic.description}</p>
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
