import { Button } from '@/components/ui/button'
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { RegValidation } from '@/lib/validation'
import Loader from '@/components/shared/Loader'
import { Link, useNavigate } from 'react-router-dom'
import { useToast } from '@/components/ui/use-toast'
import { useCreateUserAccMutation, useLoginAccMutation } from '@/lib/react-query/queriesAndMutations'
import { useUserContext } from '@/context/authContext'

function RegForm() {
  const { toast } = useToast()
  const { checkAuthUser } = useUserContext() // Removed `isUserLoading`
  const navigate = useNavigate()

  const { mutateAsync: createUserAccount, isPending: isCreatingAcc } = useCreateUserAccMutation();
  const { mutateAsync: loginAccount } = useLoginAccMutation(); // Removed `isLoggingIn`

  const form = useForm<z.infer<typeof RegValidation>>({
    resolver: zodResolver(RegValidation),
    defaultValues: {
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    },
});

  async function onSubmit(values: z.infer<typeof RegValidation>) {
    try {
      const newUser = await createUserAccount(values);
      if (!newUser) throw new Error('Error creating account');

      const session = await loginAccount({
        email: values.email,
        password: values.password,
      });
      if (!session) throw new Error('Error logging in');

      const isLoggedIn = await checkAuthUser();
      if (isLoggedIn) {
        form.reset();
        navigate('/');
      } else {
        throw new Error('Error signing up');
      }
    } catch {
      toast({
        title: 'Something went wrong',
        variant: 'destructive',
        className: 'toast-error',
      });
    }
  }

  return (
    <Form {...form}>
      <div className='sm:w-420 flex-center flex-col'>
        {/* <img alt='fortress-login' src='/assets/icons/Fortress.svg'/> */}
        <h2 className='h3-bold md:h2-bold pt-2 sm:pt-6'>Register</h2>
        <p className='text-light-3 small-medium md:base-regular mt-2'>Who are you?</p>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5 w-full mt-4">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input type='text' placeholder='Username' className='shad-input' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input type='email' placeholder='Email' className='shad-input' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input type='password' placeholder='Password' className='shad-input' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input type='password' placeholder='Confirm Password' className='shad-input' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className='shad-button_primary'>
            {isCreatingAcc ? (
              <div className="flex-center gap-2">
                <Loader />
              </div>
            ) : "Register"}
          </Button>
        </form>
        <p className='text-small-regular text-center mt-2 text-gray-500'>Already have an account? <Link className='text-primary-500 text-small font-bold ml-1' to='/login'>Login</Link></p>
      </div>
    </Form>
  )
}

export default RegForm;
