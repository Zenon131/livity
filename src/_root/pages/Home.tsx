"use client"

import FAB from '@/components/shared/FAB'
import Loader from '@/components/shared/Loader'
import PostCard from '@/components/shared/PostCard'
import HomeNewsFeed from '@/components/shared/HomeNewsFeed'
import { useGetRecentPosts } from '@/lib/react-query/queriesAndMutations'
import { Models } from 'appwrite'
import { useState } from 'react'
import { Button } from '@/components/ui/button'

const Home = () => {
  const [selectedFeed, setSelectedFeed] = useState<'discover' | 'news'>('discover')

  const { data: posts, isLoading: isPostLoading } = useGetRecentPosts(
    '',
    undefined,
    selectedFeed === 'news'
  );

  return (
    <div className='flex flex-1'>
      <div className='home-container'>
        <div className='home-posts'>
          <div className="flex flex-col gap-4 w-full mb-8">
            <h2 className='h3-bold md:h2-bold text-left w-full'>Home</h2>
            
            {/* Feed Selection */}
            <div className="flex gap-2">
              <Button
                onClick={() => setSelectedFeed('discover')}
                className={`flex gap-2 ${
                  selectedFeed === 'discover' 
                    ? 'bg-primary-500 text-light-1 hover:bg-primary-500' 
                    : 'bg-dark-2 hover:bg-dark-3'
                }`}
                variant="ghost"
              >
                <img
                  src="/assets/icons/HomeCust.svg"
                  alt="discover"
                  width={20}
                  height={20}
                  className={selectedFeed === 'discover' ? 'invert' : ''}
                />
                Discover
              </Button>
              <Button
                onClick={() => setSelectedFeed('news')}
                className={`flex gap-2 ${
                  selectedFeed === 'news' 
                    ? 'bg-primary-500 text-light-1 hover:bg-primary-500' 
                    : 'bg-dark-2 hover:bg-dark-3'
                }`}
                variant="ghost"
              >
                <img
                  src="/assets/icons/!.svg"
                  alt="news"
                  width={20}
                  height={20}
                  className={selectedFeed === 'news' ? 'invert' : ''}
                />
                News Posts
              </Button>
            </div>
          </div>

          {isPostLoading ? (
            <Loader />
          ) : !posts?.documents.length ? (
            <div className="text-light-4 text-center w-full py-10">
              {selectedFeed === 'news' 
                ? "No posts with articles found" 
                : "No posts found"}
            </div>
          ) : (
            <ul className='flex flex-col flex-1 gap-9 w-full'>
              {posts?.documents.map((post: Models.Document) => (
                <PostCard post={post} key={post.content}/>
              ))}
            </ul>
          )}
        </div>
      </div>
      <FAB destination={'/create-post'} />
      <div className="home-creators">
        <div className='flex gap-2 mb-6'>
          <h3 className="h3-bold text-light-1">Latest News</h3>
          <img src='/assets/icons/!.svg' alt='news' height={36} width={36}/>
        </div>
        <HomeNewsFeed />
      </div>
    </div>
  )
}

export default Home
