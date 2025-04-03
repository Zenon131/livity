import {
  // Route,
  // Routes,
  Link,
  // Outlet,
  useParams,
  // useLocation,
} from "react-router-dom";

import { useUserContext } from "@/context/authContext";
import Loader from "@/components/shared/Loader";
import PostCard from "@/components/shared/PostCard";
import { useGetUserById } from "@/lib/react-query/queriesAndMutations";
import { multiFormatDateString } from "@/lib/utils/utils";
// import { useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Models } from "appwrite";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface StatBlockProps {
  value: string | number;
  label: string;
}

const StatBlock = ({ value, label }: StatBlockProps) => (
  <div className="flex-center gap-2">
    <p className="small-semibold lg:body-bold text-primary-500">{value}</p>
    <p className="small-medium lg:base-medium text-light-2">{label}</p>
  </div>
);

const Profile = () => {
  const { id } = useParams();
  const { user } = useUserContext();
  // const { pathname } = useLocation();

  const { data: currentUser, isLoading } = useGetUserById(id || "");

  if (isLoading || !currentUser)
    return (
      <div className="flex-center w-full h-full">
        <Loader />
      </div>
    );

  // Check if currentUser and currentUser.posts exist before sorting
  const sortedPosts = currentUser.posts
    ? [...currentUser.posts].sort((a, b) => {
        return new Date(b.$createdAt).getTime() - new Date(a.$createdAt).getTime();
      })
    : [];

  // Filter posts to only include those with article URLs
  const articlePosts = currentUser.posts
    ? [...currentUser.posts]
        .filter(post => post.article && post.article.trim() !== '')
        .sort((a, b) => {
          return new Date(b.$createdAt).getTime() - new Date(a.$createdAt).getTime();
        })
    : [];

  const isCurrentUserProfile = user?.id === currentUser.$id;

  return (
    <div className="profile-container">
      <div className="profile-inner_container">
        <div className="flex xl:flex-row flex-col max-xl:items-center flex-1 gap-7">
          <img
            src={
              currentUser?.imgurl || "/assets/icons/profile-placeholder.svg"
            }
            alt="profile"
            className="w-28 h-28 lg:h-36 lg:w-36 rounded-full"
          />
          <div className="flex flex-col flex-1 justify-between md:mt-2">
            <div className="flex flex-col w-full">
              <h1 className="text-center xl:text-left h3-bold md:h1-semibold w-full">
                {currentUser.username}
              </h1>
              <p className="small-regular md:body-medium text-light-3 text-center xl:text-left">
                @{currentUser.username}
              </p>
            </div>

            <div className="flex gap-8 mt-10 items-center justify-center xl:justify-start flex-wrap z-20">
              <Badge variant='outline'>
                <StatBlock value={currentUser.posts.length} label="Posts" />
              </Badge>
              <Badge variant='outline'>
                <p className="small-regular md:body-medium text-light-3">
                  Joined {multiFormatDateString(currentUser.$createdAt)}
                </p>
              </Badge>
              {isCurrentUserProfile ? (
                <Badge variant='outline'>
                <p className="small-regular md:body-medium text-primary-500">
                  You
                </p>
              </Badge>
              ): null}
            </div>

            <p className="small-medium md:base-medium text-center xl:text-left mt-7 max-w-screen-sm">
              {currentUser.bio}
            </p>
          </div>

          <div className="flex justify-center gap-4">
            {isCurrentUserProfile ? (
              <Link
                to={`/update-profile/${currentUser.$id}`}
                className="h-12 bg-dark-4 px-5 text-light-1 flex-center gap-2 rounded-lg"
              >
                <img
                  src="/assets/icons/Edit Profile.svg"
                  alt="edit"
                  width={24}
                  height={24}
                />
              </Link>
            ) : null}
          </div>
        </div>
      </div>

      <Tabs defaultValue="posts" className="w-full max-w-5xl mt-10">
        <TabsList className="flex w-full bg-dark-2 min-h-[42px] p-1">
          <TabsTrigger 
            value="posts" 
            className="flex-1 data-[state=active]:bg-dark-4"
          >
            <div className="flex-center gap-2">
              Posts
            </div>
          </TabsTrigger>
          <TabsTrigger 
            value="replies"
            className="flex-1 data-[state=active]:bg-dark-4"
          >
            <div className="flex-center gap-2">
              Replies
            </div>
          </TabsTrigger>
          <TabsTrigger 
            value="shared"
            className="flex-1 data-[state=active]:bg-dark-4"
          >
            <div className="flex-center gap-2">
              Articles
            </div>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="posts" className="mt-5">
          <div className="flex flex-col gap-9">
            {sortedPosts.filter(post => !post.parentId).length > 0 ? (
              sortedPosts
                .filter(post => !post.parentId)
                .map((post: Models.Document) => (
                  <PostCard
                    key={post.$id}
                    post={{
                      ...post,
                      creator: {
                        username: currentUser.username,
                        imgurl: currentUser.imgurl,
                      },
                    }}
                  />
                ))
            ) : (
              <p className="text-light-3">No posts yet.</p>
            )}
          </div>
        </TabsContent>

        <TabsContent value="replies" className="mt-5">
          <div className="flex flex-col gap-9">
            {sortedPosts.filter(post => post.parentId).length > 0 ? (
              sortedPosts
                .filter(post => post.parentId)
                .map((post: Models.Document) => (
                  <PostCard
                    key={post.$id}
                    post={{
                      ...post,
                      creator: {
                        username: currentUser.username,
                        imgurl: currentUser.imgurl,
                      },
                    }}
                  />
                ))
            ) : (
              <p className="text-light-3">No replies yet.</p>
            )}
          </div>
        </TabsContent>

        <TabsContent value="shared" className="mt-5">
          <div className="flex flex-col gap-9">
            {articlePosts.length > 0 ? (
              articlePosts
                .map((post: Models.Document) => (
                  <PostCard
                    key={post.$id}
                    post={{
                      ...post,
                      creator: {
                        username: currentUser.username,
                        imgurl: currentUser.imgurl,
                      },
                    }}
                  />
              ))
            ) : (
              <p className="text-light-3">No shared articles yet.</p>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Profile;
