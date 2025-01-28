
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { CommentValidation } from "@/lib/validation";
import { useCreatePost } from "@/lib/react-query/queriesAndMutations";
import { useUserContext } from "@/context/authContext";
import { useToast } from "../ui/use-toast";
import { useNavigate } from "react-router-dom";
import { useGetPostById } from "@/lib/react-query/queriesAndMutations"; // To fetch the parent post
import { Loader } from "lucide-react";

type CommentFormProps = {
  postId: string; // ID of the post being replied to
};

const CommentForm = ({ postId }: CommentFormProps) => {
  const { mutateAsync: createPost, isPending: isLoadingCreate } = useCreatePost();
  const { user } = useUserContext();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Fetch the parent post details
  const { data: parentPost } = useGetPostById(postId);

  const form = useForm<z.infer<typeof CommentValidation>>({
    resolver: zodResolver(CommentValidation),
    defaultValues: {
      content: "",
    },
  });

  async function onSubmit(values: z.infer<typeof CommentValidation>) {
    if (!parentPost) {
      toast({
        title: "Error fetching parent post details",
        variant: "destructive",
        className: 'toast-error',
      });
      return;
    }

    // Create a child post with the same topic and location, and with parent_post set
    const newPost = await createPost({
      ...values,
      userId: user.id,
      topic: parentPost.topic,  // Inherit topic from the parent post
      location: parentPost.location,  // Inherit location from the parent post
      parentId: postId,  // Set the parent_post to the ID of the post being replied to
    });

    if (!newPost) {
      toast({
        title: "Error creating post",
        variant: "destructive",
        className: 'toast-error',
      });
    } else {
      toast({
        title: "Comment posted successfully!",
        className: 'toast-primary',
      });
      navigate(0);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4 w-full max-w-5xl py-5"
      >
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center gap-4">
                <FormControl>
                  <Input
                    placeholder="Post your reply"
                    className="shad-input custom-scrollbar flex-grow"
                    {...field}
                  />
                </FormControl>
                <Button type="submit" className="shad-button_primary" disabled={isLoadingCreate}>
                  {isLoadingCreate ? <Loader /> : 
                    <img src='/assets/icons/arrow.svg' className="invert-white" width={24} alt='upload-post'/>
                  }
                </Button>
              </div>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};

export default CommentForm;
