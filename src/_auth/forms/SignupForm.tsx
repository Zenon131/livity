import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { useUserContext } from '@/context/authContext';
import { createUserAccount } from '@/lib/appwrite/api';

const SignupForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { checkAuthUser } = useUserContext();

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const username = formData.get('username') as string;

    try {
      await createUserAccount({
        email,
        password,
        username,
      });

      const isLoggedIn = await checkAuthUser();

      if (isLoggedIn) {
        toast({
          title: 'Success',
          description: 'Account created successfully',
        });
        navigate('/');
      } else {
        toast({
          title: 'Error',
          description: 'Failed to create account',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Signup error:', error);
      toast({
        title: 'Error',
        description: 'Failed to create account',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <form onSubmit={handleSignup} className="flex flex-col gap-5">
        <Input
          type="email"
          name="email"
          placeholder="Email"
          className="shad-input"
          required
        />
        <Input
          type="text"
          name="username"
          placeholder="Username"
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
          {isLoading ? 'Creating account...' : 'Sign Up'}
        </Button>
      </form>

      <p className="text-small-regular text-light-2 text-center">
        Already have an account?{' '}
        <Link to="/sign-in" className="text-primary-500 text-small-semibold">
          Log in
        </Link>
      </p>
    </div>
  );
};

export default SignupForm;
