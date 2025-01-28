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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
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
            <img src='/assets/icons/logout.svg' alt='logout' width={48} height={48}/>
            <p className='small-medium lg:base-medium'>Logout</p>
          </Button>
        </div>
        
        <Accordion type="single" collapsible className="w-full max-w-5xl">
          <AccordionItem value="edit-profile">
            <AccordionTrigger className="text-left text-light-1">Edit Profile</AccordionTrigger>
            <AccordionContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(handleUpdate)}
                  className="flex flex-col gap-7 w-full mt-4">
                  <div className="flex gap-4 items-center">
                    <ProfileUploader 
                      fieldChange={(files: File[]) => form.setValue("file", files)}
                      mediaUrl={currentUser.imgurl}
                    />
                  </div>

                  <div className="flex flex-col gap-7">
                    <div className="flex flex-col gap-4">
                      <h3 className="h4-bold">Change Username</h3>
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
                    </div>

                    <div className="flex flex-col gap-4">
                      <h3 className="h4-bold">Change Password</h3>
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
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="about">
            <AccordionTrigger className="text-left text-light-1">About</AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-col gap-4 text-light-2">
                <h3 className="h4-bold">About Fortress</h3>
                <p>Fortress is a social media platform/initiative designed for facilitating the sharing information among users. Our mission is to provide a space for users to engage with each other, share their thoughts, and learn from others.</p>
                <div className="mt-4">
                  <h4 className="base-semibold mb-2">Version</h4>
                  <p>0.8.0</p>
                </div>

                <div className="mt-2">
                  <h4 className="base-semibold mb-2">Contact</h4>
                  <p>support@fortress.com</p>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="terms">
            <AccordionTrigger className="text-left text-light-1">Terms of Service</AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-col gap-4 text-light-2">
                <div className="bg-dark-4 p-4 rounded-lg mb-4">
                  <p className="text-light-3 text-sm">Please take a moment to go over our Terms of Service</p>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="h3-bold text-light-1 mb-2">Fortress – Terms of Service</h3>
                    <p className="text-light-3 text-sm">Last Updated: January 27, 2025</p>
                  </div>

                  <div className="space-y-4">
                    <p>Welcome to Fortress. By accessing or using our services, you agree to comply with these Terms of Service ("Terms"). If you do not agree, you may not use Fortress.</p>

                    <div className="space-y-4">
                      <div>
                        <h4 className="h4-bold mb-2">1. Acceptance of Terms</h4>
                        <ul className="list-disc pl-6 space-y-2">
                          <li>These Terms form a binding legal agreement between you ("User") and Fortress.</li>
                          <li>You acknowledge that use of Fortress signifies your acceptance of these Terms and any related policies referenced herein.</li>
                        </ul>
                      </div>

                      <div>
                        <h4 className="h4-bold mb-2">2. Eligibility</h4>
                        <ul className="list-disc pl-6 space-y-2">
                          <li>You must be at least the age of majority in your jurisdiction to use Fortress.</li>
                          <li>By using Fortress, you represent and warrant that all information you provide during registration is accurate and up-to-date.</li>
                        </ul>
                      </div>

                      <div>
                        <h4 className="h4-bold mb-2">3. User Conduct</h4>
                        <div className="space-y-4">
                          <div>
                            <h5 className="base-semibold mb-2">3.1 Integrity of Information</h5>
                            <ul className="list-disc pl-6 space-y-2">
                              <li>You agree not to knowingly post or distribute false, misleading, or deceptive content, including misinformation or disinformation.</li>
                              <li>Content must be factually supported, cited when relevant, and compliant with applicable laws.</li>
                              <li>Fortress reserves the right to remove content and/or suspend accounts that repeatedly share unverified claims intended to mislead.</li>
                            </ul>
                          </div>

                          <div>
                            <h5 className="base-semibold mb-2">3.2 Protection of Protected Classes</h5>
                            <ul className="list-disc pl-6 space-y-2">
                              <li>You must not engage in hate speech, harassment, or targeted attacks based on race, ethnicity, religion, gender, gender identity, sexual orientation, disability, or any other legally protected characteristic.</li>
                              <li>Slurs, threats, or encouragement of violence toward protected classes is strictly forbidden.</li>
                            </ul>
                          </div>

                          <div>
                            <h5 className="base-semibold mb-2">3.3 Prohibited Activities</h5>
                            <ul className="list-disc pl-6 space-y-2">
                              <li>Violating any laws or regulations.</li>
                              <li>Posting content that is obscene, defamatory, or otherwise unlawful.</li>
                              <li>Impersonating any person or entity or misrepresenting your identity.</li>
                              <li>Engaging in activities that compromise Fortress's security (e.g., hacking, malware distribution).</li>
                            </ul>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="h4-bold mb-2">4. Content Ownership and License</h4>
                        <div className="space-y-4">
                          <div>
                            <h5 className="base-semibold mb-2">4.1 User Content</h5>
                            <ul className="list-disc pl-6 space-y-2">
                              <li>You retain ownership of any content you post on Fortress. However, by posting, you grant Fortress a non-exclusive, worldwide, royalty-free license to use, distribute, modify, and display your content solely to operate and improve the platform.</li>
                              <li>You must ensure you have the necessary rights to all content you post.</li>
                            </ul>
                          </div>

                          <div>
                            <h5 className="base-semibold mb-2">4.2 Platform Content</h5>
                            <ul className="list-disc pl-6 space-y-2">
                              <li>All Fortress branding, design, and original materials are owned by Fortress or licensed to us, and may not be copied or reproduced without prior written permission.</li>
                            </ul>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h4 className="h4-bold mb-2">5. Moderation and Enforcement</h4>
                        <div>
                          <h5 className="base-semibold mb-2">5.1 Content Review</h5>
                          <ul className="list-disc pl-6 space-y-2">
                            <li>Fortress staff or automated systems may review posted content. We reserve the right to remove any content deemed violating these Terms or applicable law.</li>
                          </ul>
                        </div>

                        <div>
                          <h5 className="base-semibold mb-2">5.2 Account Suspension or Termination</h5>
                          <ul className="list-disc pl-6 space-y-2">
                            <li>Fortress may, at our sole discretion, suspend or terminate your account for violations of these Terms, especially if content undermines the integrity of information or threatens protected groups.</li>
                            <li>Terminated users are prohibited from creating new accounts without express permission.</li>
                          </ul>
                        </div>
                      </div>

                      <div>
                        <h4 className="h4-bold mb-2">6. Privacy</h4>
                        <ul className="list-disc pl-6 space-y-2">
                          <li>Your use of Fortress is subject to our Privacy Policy, which outlines how we collect, store, and handle personal data.</li>
                          <li>By using Fortress, you agree to the practices described in the Privacy Policy.</li>
                        </ul>
                      </div>

                      <div className="space-y-4">
                        <h4 className="h4-bold mb-2">7. Disclaimer and Liability</h4>
                        <div>
                          <h5 className="base-semibold mb-2">7.1 No Warranties</h5>
                          <ul className="list-disc pl-6 space-y-2">
                            <li>Fortress is provided "as is" without warranties of any kind. We do not guarantee the accuracy or reliability of user-generated content.</li>
                          </ul>
                        </div>

                        <div>
                          <h5 className="base-semibold mb-2">7.2 Limitation of Liability</h5>
                          <ul className="list-disc pl-6 space-y-2">
                            <li>To the fullest extent permitted by law, Fortress is not liable for any direct, indirect, incidental, or consequential damages arising from your use of the platform.</li>
                          </ul>
                        </div>

                        <div>
                          <h5 className="base-semibold mb-2">7.3 Third-Party Links and Content</h5>
                          <ul className="list-disc pl-6 space-y-2">
                            <li>Fortress may contain links to third-party sites or content. We do not endorse or assume responsibility for these sites or resources.</li>
                          </ul>
                        </div>
                      </div>

                      <div>
                        <h4 className="h4-bold mb-2">8. Indemnification</h4>
                        <p className="mb-4">You agree to indemnify and hold harmless Fortress and its affiliates, officers, directors, employees, and agents from any claims or damages resulting from your breach of these Terms, improper use of the platform, or violation of any law.</p>
                      </div>

                      <div>
                        <h4 className="h4-bold mb-2">9. Changes to the Terms</h4>
                        <ul className="list-disc pl-6 space-y-2">
                          <li>Fortress may update these Terms at any time. Material changes will be posted with notice.</li>
                          <li>Continued use after changes become effective constitutes acceptance of the revised Terms.</li>
                        </ul>
                      </div>

                      <div>
                        <h4 className="h4-bold mb-2">10. Governing Law and Dispute Resolution</h4>
                        <ul className="list-disc pl-6 space-y-2">
                          <li>These Terms are governed by the laws of [Jurisdiction].</li>
                          <li>Any dispute arising out of or relating to these Terms shall be resolved in the courts of [Jurisdiction].</li>
                        </ul>
                      </div>

                      <div>
                        <h4 className="h4-bold mb-2">11. Contact Information</h4>
                        <p>If you have questions or concerns about these Terms, please contact us at:</p>
                        <p className="mt-2">Fortress Support: support@fortress.com</p>
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-dark-4">
                      <p className="text-light-3">By using Fortress, you acknowledge that you have read, understood, and agree to these Terms of Service.</p>
                    </div>
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="Fortress Initiatives">
            <AccordionTrigger className="text-left text-light-1">Fortress Initiatives</AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-col gap-6 text-light-2">
                <div>
                  <h3 className="h4-bold mb-4">Fortress Initiatives</h3>
                  <div className="bg-dark-4 rounded-lg p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex-1">
                        <h4 className="base-semibold mb-2">Futures Lab</h4>
                        <p className="text-light-3 mb-4">
                          A research lab/initiative aimed at using information and data to make forecasts in economics, climate, population, and health to help governments and organizations make policy decisions.
                        </p>
                        <a 
                          href="https://futureslab.com" 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-primary-500 transition-colors flex items-center gap-2"
                        >
                          Visit Futures Lab
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="privacy">
            <AccordionTrigger className="text-left text-light-1">Privacy and Security</AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-col gap-4 text-light-2">

                <h3 className="h4-bold">Privacy Statement</h3>
                
                <div className="flex flex-col gap-3">

                  <div className="flex items-center justify-between">

                    <div>
                      <p className="base-semibold">We are committed to protecting your privacy and security in a world where many platforms are not. As new technologies are developed that put the security of your data first, we will update our policies and features to reflect these evolutions.</p>
                    </div>

                  </div>

                </div>
                
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="changelog">
            <AccordionTrigger className="text-left text-light-1">Changelog</AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-col gap-4 text-light-2">
                <h3 className="h4-bold">Recent Updates</h3>
                
                <div className="flex flex-col gap-6">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="base-semibold">Version 0.8.0</h4>
                      <span className="small-regular text-light-3">- January 27, 2025</span>
                    </div>
                    <ul className="list-disc ml-4 mt-2 text-light-3">
                      <li>Initial release of Fortress</li>
                      <li>Introduced core social features</li>
                      <li>Added news features</li>
                    </ul>
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="base-semibold">Version 0.7.0</h4>
                      <span className="small-regular text-light-3">- January 15, 2025</span>
                    </div>
                    <ul className="list-disc ml-4 mt-2 text-light-3">
                      <li>Beta testing phase</li>
                      <li>Performance improvements</li>
                      <li>Bug fixes and UI enhancements</li>
                    </ul>
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
};

export default UpdateProfile;
