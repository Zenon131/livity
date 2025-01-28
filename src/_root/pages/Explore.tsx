import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { useSearchPosts } from '@/lib/react-query/queriesAndMutations';
import PostCard from '@/components/shared/PostCard';
import Loader from '@/components/shared/Loader';

const Explore = () => {
  const [searchVal, setSearchVal] = useState('');
  const { data: searchResults, isLoading } = useSearchPosts(searchVal);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => 
    setSearchVal(e.target.value);

  return (
    <div className='explore-container'>
      <div className='explore-inner_container'>
        <h2 className='h3-bold md:h2-bold w-full'>Search</h2>
        <div className='flex gap-1 px-4 w-full rounded-lg bg-dark-4'>
          <img src='/assets/icons/SearchCust.svg' alt='search' height={24} width={24} />
          <Input 
            type='text' 
            placeholder='Search...'
            className='explore-search' 
            value={searchVal} 
            onChange={onChange}
          />
        </div>
      </div>
      <div className='flex-between w-full max-w-5xl mt-16 mb-7'>
        <h2 className='h3-bold md:h2-body-bold md:h3-bold'>Results</h2>
      </div>
      {isLoading ? (
        <Loader />
      ) : (
        searchResults?.documents?.length ? (
          searchResults.documents.map((post) => (
            post && <PostCard key={post.$id} post={post} />
          ))
        ) : (
          <p>No posts found.</p>
        )
      )}
    </div>
  );
};

export default Explore;
