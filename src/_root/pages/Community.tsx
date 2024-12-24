import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ICommunity, IThread } from '@/types/index';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Textarea } from '@/components/ui/textarea';
import { useUserContext } from '@/context/authContext';


const Community = () => {
  const { id } = useParams();
  const { user } = useUserContext();
  const { toast } = useToast();
  const [community, setCommunity] = useState<ICommunity | null>(null);
  const [newThread, setNewThread] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCommunity = async () => {
      try {
        // TODO: Implement API call to fetch community data
        setLoading(false);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load community",
          variant: "destructive"
        });
        setLoading(false);
      }
    };

    if (id) fetchCommunity();
  }, [id]);

  const handleCreateThread = async () => {
    if (!newThread.trim()) return;

    try {
      // TODO: Implement API call to create new thread
      setNewThread('');
      toast({
        title: "Success",
        description: "Thread created successfully"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create thread",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-full">Loading...</div>;
  }

  if (!community) {
    return <div className="flex items-center justify-center h-full">Community not found</div>;
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex items-center gap-4 mb-6">
          {community.imageUrl && (
            <img 
              src={community.imageUrl} 
              alt={community.name}
              className="w-16 h-16 rounded-full object-cover"
            />
          )}
          <div>
            <h1 className="text-2xl font-bold">{community.name}</h1>
            <p className="text-gray-600">{community.description}</p>
          </div>
        </div>

        <div className="mb-8">
          <Textarea
            placeholder="Start a new thread..."
            value={newThread}
            onChange={(e) => setNewThread(e.target.value)}
            className="mb-4"
          />
          <Button onClick={handleCreateThread}>Create Thread</Button>
        </div>

        <div className="space-y-6">
          {community.threads.map((thread) => (
            <ThreadCard key={thread.id} thread={thread} />
          ))}
        </div>
      </div>
    </div>
  );
};

const ThreadCard = ({ thread }: { thread: IThread }) => {
  const [showReplies, setShowReplies] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const { toast } = useToast();

  const handleReply = async () => {
    if (!replyContent.trim()) return;

    try {
      // TODO: Implement API call to create reply
      setReplyContent('');
      toast({
        title: "Success",
        description: "Reply added successfully"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add reply",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="border rounded-lg p-4">
      <div className="flex items-start gap-3 mb-4">
        <img
          src={thread.author.imageUrl}
          alt={thread.author.username}
          className="w-10 h-10 rounded-full"
        />
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold">{thread.author.username}</span>
            <span className="text-gray-500 text-sm">
              {new Date(thread.createdAt).toLocaleDateString()}
            </span>
          </div>
          <p className="text-gray-800">{thread.content}</p>
        </div>
      </div>

      <div className="ml-12">
        <Button
          variant="ghost"
          className="text-sm"
          onClick={() => setShowReplies(!showReplies)}
        >
          {thread.replies?.length || 0} replies
        </Button>

        {showReplies && (
          <div className="mt-4 space-y-4">
            <div className="flex gap-2">
              <Textarea
                placeholder="Write a reply..."
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                className="flex-1"
              />
              <Button onClick={handleReply}>Reply</Button>
            </div>

            {thread.replies?.map((reply) => (
              <ThreadCard key={reply.id} thread={reply} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Community;