
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
import { LoginValidation } from '@/lib/validation'
import Loader from '@/components/shared/Loader'
import { Link, useNavigate } from 'react-router-dom'
// import { loginAccount } from '@/lib/appwrite/api'
import { useToast } from '@/components/ui/use-toast'
import { useLoginAccMutation } from '@/lib/react-query/queriesAndMutations'
import { useUserContext } from '@/context/authContext'






function LoginForm() {
  const { toast } = useToast()
  const { checkAuthUser, isLoading: isUserLoading } = useUserContext()
  const navigate = useNavigate()
  // const isLoading = false

  // const { mutateAsync: createUserAccount, isLoading: isCreatingAcc } = useCreateUserAccMutation()

  const { mutateAsync: loginAccount } = useLoginAccMutation()

  // const cities = [
  //   { value: 'New York', label: 'New York' },
  //   { value: 'Los Angeles', label: 'Los Angeles' },
  //   { value: 'Philadelphia', label: 'Philadelphia' }
  // ]

  // 1. Define your form.
  const form = useForm<z.infer<typeof LoginValidation>>({
    resolver: zodResolver(LoginValidation),
    defaultValues: {
        email: "",
        password: "",
    },
});


  
 
  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof LoginValidation>) {
    try {
  
      const session = await loginAccount({
        email: values.email,
        password: values.password,
      });
  
      if (!session) {
        throw new Error('Error logging in');
      }
  
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
        {/* <img alt='bashmnt-login' src='/assets/images/bashmnt.svg'/> */}
        <h2 className='h3-bold md:h2-bold pt-2 sm:pt-6'>Login</h2>
        <p className='text-light-3 small-medium md:base-regular mt-2'>Who are you, again?</p>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5 w-full mt-4">
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
          <Button type="submit" className='shad-button_primary'>
            {isUserLoading ? (
              <div className="flex-center gap-2">
                <Loader />
              </div>
            ) : "Login"}
          </Button>
        </form>
        <p className='text-small-regular text-center mt-2 text-gray-500'>Don't have an account? <Link className='text-primary-500 text-small font-bold ml-1' to='/register'>Register</Link></p>
      </div>
    </Form>
  )
}

export default LoginForm