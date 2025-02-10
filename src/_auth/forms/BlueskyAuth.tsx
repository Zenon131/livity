import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { loginWithBluesky } from '@/lib/bluesky/api';
import { useUserContext } from '@/context/authContext';

const BlueskyAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { checkAuthUser } = useUserContext();

  const handleBlueskyAuth = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const identifier = formData.get('identifier') as string;
    const password = formData.get('password') as string;

    try {
      await loginWithBluesky(identifier, password);
      const isLoggedIn = await checkAuthUser();

      if (isLoggedIn) {
        toast({
          title: 'Success',
          description: 'Logged in with Bluesky successfully',
        });
        navigate('/');
      } else {
        toast({
          title: 'Error',
          description: 'Failed to log in with Bluesky',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Bluesky auth error:', error);
      toast({
        title: 'Error',
        description: 'Failed to authenticate with Bluesky',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleBlueskyAuth} className="flex flex-col gap-5">
      <Input
        type="text"
        name="identifier"
        placeholder="Bluesky handle or email"
        className="shad-input"
        required
      />
      <Input
        type="password"
        name="password"
        placeholder="Password"
        className="shad-input"
        required
      />
      <Button className="shad-button_primary" disabled={isLoading}>
        {isLoading ? 'Signing in...' : 'Sign in with Bluesky'}
      </Button>
    </form>
  );
};

export default BlueskyAuth;
