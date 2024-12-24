"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Textarea } from "../ui/textarea"
import { PostValidation } from "@/lib/validation"
import { Models } from "appwrite"
import { useUserContext } from "@/context/authContext"
import { useToast } from "../ui/use-toast"
import { useNavigate } from "react-router-dom"
import { useCreatePost } from "@/lib/react-query/queriesAndMutations"
import Loader from "../shared/Loader"
import { useMediaQuery } from "@/hooks/use-media-query"
import { useState } from "react"
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
import { locations } from "@/constants/locations"
import { topics } from "@/constants/topics" 

type PostFormProps = {
  post?: Models.Document
}



const PostForm = ({ post }: PostFormProps) => {
  const { mutateAsync: createPost, isPending: isLoadingCreate } = useCreatePost()
  const { user } = useUserContext()
  const { toast } = useToast()
  const navigate = useNavigate()
  const isDesktop = useMediaQuery("(min-width: 768px)")

  const [openLocation, setOpenLocation] = useState(false)
  const [openTopic, setOpenTopic] = useState(false)

  // 1. Define your form.
  const form = useForm<z.infer<typeof PostValidation>>({
    resolver: zodResolver(PostValidation),
    defaultValues: post ? {
      content: post.content,
      location: post.location,
      topic: post.topic,
    } : {
      content: "",
      location: "",
      topic: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof PostValidation>) {
    console.log("Form Values:", values);
    const newPost = await createPost({
      ...values,
      userId: user.id,
      parentId: '',
    })

    if (!newPost) {
      toast({
        title: "Error creating post",
        variant: "destructive",
      })
    } else {
      toast({
        title: "Post created successfully!",
        variant: "success",
      })
      navigate('/')
    }
  }

  function LocationList({ setOpen, field }: { setOpen: (open: boolean) => void, field: any }) {
    return (
      <Command className="bg-dark-2">
        <CommandInput placeholder="Search location..." className="bg-dark-2 text-light-1" />
        <CommandList className="bg-dark-2">
          <CommandEmpty className="text-light-2">No location found.</CommandEmpty>
          <CommandGroup className="bg-dark-2">
            {locations.map((location) => (
              <CommandItem
                key={location.value}
                value={location.value}
                className="text-light-1 hover:bg-dark-4"
                onSelect={(value) => {
                  field.onChange(value)
                  setOpen(false)
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

  function TopicList({ setOpen, field }: { setOpen: (open: boolean) => void, field: any }) {
    return (
      <Command className="bg-dark-2">
        <CommandInput placeholder="Search topic..." className="bg-dark-2 text-light-1" />
        <CommandList className="bg-dark-2">
          <CommandEmpty className="text-light-2">No topic found.</CommandEmpty>
          <CommandGroup className="bg-dark-2">
            {topics.map((topic) => (
              <CommandItem
                key={topic.value}
                value={topic.value}
                className="text-light-1 hover:bg-dark-4"
                onSelect={(value) => {
                  field.onChange(value)
                  setOpen(false)
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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-9 w-full max-w-5xl">
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Location</FormLabel>
              <FormControl>
                {isDesktop ? (
                  <Popover open={openLocation} onOpenChange={setOpenLocation}>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start shad-input">
                        {field.value ? 
                          locations.find(l => l.value === field.value)?.label 
                          : "Select location"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0 bg-dark-2" align="start">
                      <LocationList setOpen={setOpenLocation} field={field} />
                    </PopoverContent>
                  </Popover>
                ) : (
                  <Drawer open={openLocation} onOpenChange={setOpenLocation}>
                    <DrawerTrigger asChild>
                      <Button variant="outline" className="w-full justify-start shad-input">
                        {field.value ? 
                          locations.find(l => l.value === field.value)?.label 
                          : "Select location"}
                      </Button>
                    </DrawerTrigger>
                    <DrawerContent className="bg-dark-2">
                      <div className="mt-4 border-t">
                        <LocationList setOpen={setOpenLocation} field={field} />
                      </div>
                    </DrawerContent>
                  </Drawer>
                )}
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="topic"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Topic</FormLabel>
              <FormControl>
                {isDesktop ? (
                  <Popover open={openTopic} onOpenChange={setOpenTopic}>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start shad-input">
                        {field.value ? 
                          topics.find(t => t.value === field.value)?.label 
                          : "Select topic"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0 bg-dark-2" align="start">
                      <TopicList setOpen={setOpenTopic} field={field} />
                    </PopoverContent>
                  </Popover>
                ) : (
                  <Drawer open={openTopic} onOpenChange={setOpenTopic}>
                    <DrawerTrigger asChild>
                      <Button variant="outline" className="w-full justify-start shad-input">
                        {field.value ? 
                          topics.find(t => t.value === field.value)?.label 
                          : "Select topic"}
                      </Button>
                    </DrawerTrigger>
                    <DrawerContent className="bg-dark-2">
                      <div className="mt-4 border-t">
                        <TopicList setOpen={setOpenTopic} field={field} />
                      </div>
                    </DrawerContent>
                  </Drawer>
                )}
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Content</FormLabel>
              <FormControl>
                <Textarea className="shad-textarea custom-scrollbar" {...field} />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />

        <div className="flex gap-4">
          <Button type="button" className="shad-button_dark_4" onClick={() => navigate(-1)}>
          <img src='assets/icons/x.svg' className="invert-white" width={24} alt='cancel-post'/>
          </Button>
          <Button type="submit" className="shad-button_primary">
            {isLoadingCreate ? <Loader /> : 
            <img src='assets/icons/arrow.svg' className="invert-white" width={24} alt='upload-post'/>
            }
          </Button>
        </div>
      </form>
    </Form>
  )
}

export default PostForm