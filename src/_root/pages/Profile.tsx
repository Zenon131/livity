import {
  Route,
  Routes,
  Link,
  Outlet,
  useParams,
  useLocation,
} from "react-router-dom";

import { useUserContext } from "@/context/authContext";
import Loader from "@/components/shared/Loader";
import PostCard from "@/components/shared/PostCard";
import { useGetUserById } from "@/lib/react-query/queriesAndMutations";
import { multiFormatDateString } from "@/lib/utils";
import { useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Models } from "appwrite";

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

// Define the types for the props
type Post = {
  topic?: string;
};

type FrequentTopicsProps = {
  posts: Post[];
};

const FrequentTopics: React.FC<FrequentTopicsProps> = ({ posts }) => {
  const topicCounts = useMemo(() => {
    const counts: Record<string, number> = Object.create(null);
    
    posts.forEach((post) => {
      if (post.topic) {
        counts[post.topic] = (counts[post.topic] || 0) + 1;
      }
    });
    
    // Sort topics by their frequency in descending order
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [posts]);

  return (
    <div className="frequent-topics">
      {topicCounts.length > 0 ? (
        <ul>
          {topicCounts.map(([topic, count]) => (
            <li key={topic}>
              {topic} - {count} {count > 1 ? "posts" : "post"}
            </li>
          ))}
        </ul>
      ) : (
        <p>No topics found.</p>
      )}
    </div>
  );
};

const Profile = () => {
  const { id } = useParams();
  const { user } = useUserContext();
  const { pathname } = useLocation();

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
                {/* <p className="flex whitespace-nowrap small-medium">
                  Edit Profile
                </p> */}
              </Link>
            ) : null}
          </div>
        </div>
      </div>

      <div className="flex flex-center max-w-5xl w-full mt-10">
        <Link
          to={`/profile/${id}`}
          className={`profile-tab rounded-l-lg ${
            pathname === `/profile/${id}` && "!bg-dark-3"
          }`}
        >
          <img
            src="/assets/icons/Create PostCust.svg"
            alt="posts"
            width={20}
            height={20}
          />
          Posts
        </Link>
        <Link
          to={`/profile/${id}/topics`}
          className={`profile-tab rounded-r-lg ${
            pathname === `/profile/${id}/topics` && "!bg-dark-3"
          }`}
        >
          <img
            src="/assets/icons/!.svg"
            alt="topics"
            width={20}
            height={20}
          />
          Frequent Topics
        </Link>
      </div>

      <Routes>
        <Route
          index
          element={
            sortedPosts.length > 0 ? (
              sortedPosts.map((post: Models.Document) => (
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
              <p>No posts yet.</p>
            )
          }
        />
        <Route
          path="topics"
          element={<FrequentTopics posts={sortedPosts} />}
        />
      </Routes>
      <Outlet />
    </div>
  );
};

export default Profile;
