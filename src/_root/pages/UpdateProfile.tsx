import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useParams } from "react-router-dom";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";

import { ProfileValidation } from "@/lib/validation";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useUserContext } from "@/context/authContext";
import { useGetUserById, useUpdateUser, useLogoutAccMutation } from "@/lib/react-query/queriesAndMutations";
import Loader from "@/components/shared/Loader";
import ProfileUploader from "@/components/shared/ProfileUploader";

const UpdateProfile = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { id } = useParams();
  const { user, setUser } = useUserContext();
  const { mutate: logout } = useLogoutAccMutation();

  const handleLogout = () => {
    logout(undefined, {
      onSuccess: () => {
        navigate('/login');
      }
    });
  };

  // Update the default values to only include username and file (profile picture)
  const form = useForm<z.infer<typeof ProfileValidation>>({
    resolver: zodResolver(ProfileValidation),
    defaultValues: {
      file: [],
      username: user.username,
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: ""
    },
  });

  // Queries
  const { data: currentUser } = useGetUserById(id || "");
  const { mutateAsync: updateUser, isPending: isLoadingUpdate } =
    useUpdateUser();

  if (!currentUser)
    return (
      <div className="flex-center w-full h-full">
        <Loader />
      </div>
    );

  // Handler
  const handleUpdate = async (value: z.infer<typeof ProfileValidation>) => {
    const updatedUser = await updateUser({
      userId: currentUser.$id,
      username: value.username,
      file: value.file,
      imgurl: currentUser.imgurl,
      imgid: currentUser.imgid,
      currentPassword: value.currentPassword,
      newPassword: value.newPassword
    });

    if (!updatedUser) {
      toast({
        title: `Update user failed. Please try again.`,
        variant: "destructive",
        className: 'toast-error'
      });
    }

    setUser({
      ...user,
      username: updatedUser?.username,
      imgurl: updatedUser?.imgurl,
    });
    return navigate(`/profile/${id}`);
  };

  return (
    <div className="flex flex-1">
      <div className="common-container">
        <div className="flex-start gap-3 justify-start w-full max-w-5xl">
          <img
            src="/assets/icons/Edit Profile.svg"
            width={36}
            height={36}
            alt="edit"
          />
          <h2 className="h3-bold md:h2-bold text-left w-full">Settings</h2>
          <Button variant='ghost' className='shad-button_ghost' onClick={handleLogout}>
            <img src='/assets/icons/Logout.svg' alt='logout' width={48} height={48}/>
            <p className='small-medium lg:base-medium'>Logout</p>
          </Button>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleUpdate)}
            className="flex flex-col gap-7 w-full mt-4 max-w-5xl">
            <div className="flex gap-4 items-center">
              <ProfileUploader 
                fieldChange={(files: File[]) => form.setValue("file", files)}
                mediaUrl={currentUser.imgurl}
              />
            </div>
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="shad-form_label">Username</FormLabel>
                  <FormControl>
                    <Input type="text" className="shad-input" {...field} />
                  </FormControl>
                  <FormMessage className="shad-form_message" />
                </FormItem>
              )}
            />

            

            <div className="border-t border-gray-200 pt-4">
              <h3 className="h4-bold mb-4">Change Password</h3>
              
              <FormField
                control={form.control}
                name="currentPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="shad-form_label">Current Password</FormLabel>
                    <FormControl>
                      <Input type="password" className="shad-input" {...field} />
                    </FormControl>
                    <FormMessage className="shad-form_message" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="shad-form_label">New Password</FormLabel>
                    <FormControl>
                      <Input type="password" className="shad-input" {...field} />
                    </FormControl>
                    <FormMessage className="shad-form_message" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmNewPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="shad-form_label">Confirm New Password</FormLabel>
                    <FormControl>
                      <Input type="password" className="shad-input" {...field} />
                    </FormControl>
                    <FormMessage className="shad-form_message" />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex gap-4 items-center justify-end">
              <Button
                type="button"
                className="shad-button_dark_4"
                onClick={() => navigate(-1)}>
                Cancel
              </Button>
              <Button
                type="submit"
                className="shad-button_primary whitespace-nowrap"
                disabled={isLoadingUpdate}>
                {isLoadingUpdate && <Loader />}
                Update Profile
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default UpdateProfile;
