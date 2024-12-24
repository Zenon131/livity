"use client"

import FAB from '@/components/shared/FAB'
import Loader from '@/components/shared/Loader'
import PostCard from '@/components/shared/PostCard'
import TopicCard from '@/components/shared/TopicCard'
import { useGetRecentPosts, useGetPopularTopics } from '@/lib/react-query/queriesAndMutations'
import { Models } from 'appwrite'
import { useState, useEffect } from 'react'
import { useMediaQuery } from '@/hooks/use-media-query'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
} from "@/components/ui/drawer"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { locations } from '@/constants/locations'
import { topics } from '@/constants/topics'
import { useLocation } from 'react-router-dom';


const Home = () => {
  const [selectedTopic, setSelectedTopic] = useState('')
  const [selectedLocation, setSelectedLocation] = useState('')
  const [openLocation, setOpenLocation] = useState(false)
  const [openTopic, setOpenTopic] = useState(false)
  const isDesktop = useMediaQuery("(min-width: 768px)")

  // Get topic from URL parameter
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const topicParam = searchParams.get('topic');

  const { data: posts, isLoading: isPostLoading } = useGetRecentPosts(
    selectedTopic || topicParam || '',
    selectedLocation
  );
  const { data: popularTopics, isLoading: isTopicsLoading } = useGetPopularTopics();

  useEffect(() => {
    if (topicParam) {
      setSelectedTopic(topicParam);
    }
  }, [topicParam]);

  function LocationList() {
    return (
      <Command className="bg-dark-2">
        <CommandInput placeholder="Search location..." className="bg-dark-2 text-light-1" />
        <CommandList className="bg-dark-2">
          <CommandEmpty className="text-light-2">No location found.</CommandEmpty>
          <CommandGroup className="bg-dark-2">
            <CommandItem
              value=""
              className="text-light-1 hover:bg-dark-4"
              onSelect={() => {
                setSelectedLocation('')
                setOpenLocation(false)
              }}
            >
              All Locations
            </CommandItem>
            {locations.map((location) => (
              <CommandItem
                key={location.value}
                value={location.value}
                className="text-light-1 hover:bg-dark-4"
                onSelect={(value) => {
                  setSelectedLocation(value)
                  setOpenLocation(false)
                }}
              >
                {location.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </Command>
    )
  }

  function TopicList() {
    return (
      <Command className="bg-dark-2">
        <CommandInput placeholder="Search topic..." className="bg-dark-2 text-light-1" />
        <CommandList className="bg-dark-2">
          <CommandEmpty className="text-light-2">No topic found.</CommandEmpty>
          <CommandGroup className="bg-dark-2">
            <CommandItem
              value=""
              className="text-light-1 hover:bg-dark-4"
              onSelect={() => {
                setSelectedTopic('')
                setOpenTopic(false)
              }}
            >
              All Topics
            </CommandItem>
            {topics.map((topic) => (
              <CommandItem
                key={topic.value}
                value={topic.value}
                className="text-light-1 hover:bg-dark-4"
                onSelect={(value) => {
                  setSelectedTopic(value)
                  setOpenTopic(false)
                }}
              >
                {topic.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </Command>
    )
  }

  return (
    <div className='flex flex-1'>
      <div className='home-container'>
        <div className='home-posts'>
          <div className="flex flex-col gap-4 w-full mb-8">
            <h2 className='h3-bold md:h2-bold text-left w-full'>Home</h2>
            
            {/* Filters */}
            <div className="flex flex-wrap gap-4">
              <div className="flex flex-col gap-2 min-w-[200px]">
                {/* <label className="text-light-2">Change Topic</label> */}
                {isDesktop ? (
                  <Popover open={openTopic} onOpenChange={setOpenTopic}>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start shad-input">
                        {selectedTopic ? 
                          topics.find(t => t.value === selectedTopic)?.label 
                          : "All Topics"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0 bg-dark-2" align="start">
                      <TopicList />
                    </PopoverContent>
                  </Popover>
                ) : (
                  <Drawer open={openTopic} onOpenChange={setOpenTopic}>
                    <DrawerTrigger asChild>
                      <Button variant="outline" className="w-full justify-start shad-input">
                        {selectedTopic ? 
                          topics.find(t => t.value === selectedTopic)?.label 
                          : "All Topics"}
                      </Button>
                    </DrawerTrigger>
                    <DrawerContent className="bg-dark-2">
                      <div className="mt-4 border-t">
                        <TopicList />
                      </div>
                    </DrawerContent>
                  </Drawer>
                )}
              </div>

              <div className="flex flex-col gap-2 min-w-[200px]">
                {/* <label className="text-light-2">Change Location</label> */}
                {isDesktop ? (
                  <Popover open={openLocation} onOpenChange={setOpenLocation}>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start shad-input">
                        {selectedLocation ? 
                          locations.find(t => t.value === selectedLocation)?.label 
                          : "All Locations"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0 bg-dark-2" align="start">
                      <LocationList />
                    </PopoverContent>
                  </Popover>
                ) : (
                  <Drawer open={openLocation} onOpenChange={setOpenLocation}>
                    <DrawerTrigger asChild>
                      <Button variant="outline" className="w-full justify-start shad-input">
                        {selectedLocation ? 
                          locations.find(t => t.value === selectedLocation)?.label 
                          : "All Locations"}
                      </Button>
                    </DrawerTrigger>
                    <DrawerContent className="bg-dark-2">
                      <div className="mt-4 border-t">
                        <LocationList />
                      </div>
                    </DrawerContent>
                  </Drawer>
                )}
              </div>
            </div>
          </div>

          {isPostLoading && !posts ? (
            <Loader />
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
        <div className='flex gap-2'>
          <h3 className="h3-bold text-light-1">Hot Topics</h3>
          <img src='/assets/icons/!.svg' alt='popular' height={36} width={36}/>
        </div>
        {isTopicsLoading && !popularTopics ? (
          <Loader />
        ) : (
          <ul className="grid 2xl:grid-cols-2 gap-6">
            {popularTopics?.map((topic) => (
              <li key={topic.name}>
                <TopicCard topic={topic} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export default Home
