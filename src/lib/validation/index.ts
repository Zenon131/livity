import { z } from 'zod'

export const RegValidation = z.object({
  username: z.string().min(1, "Username is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
  confirmPassword: z.string().min(8, "Confirm Password must be at least 8 characters long"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const LoginValidation = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
})

export const PostValidation = z.object({
  content: z.string().min(1, "Content is required").max(150, "Too many characters"),
  article: z.string().url("Must be a valid URL").optional().or(z.literal('')),
})

export const CommentValidation = z.object({
  content: z.string().min(1, "Content is required").max(100, "Too many characters"),
})



export const ProfileValidation = z.object({
  username: z.string().min(1, "Username is required"),
  file: z.custom<File[]>(),
  currentPassword: z.string().optional(),
  newPassword: z.string().optional(),
  confirmNewPassword: z.string().optional()
}).refine((data) => {
  // Only validate passwords if user is trying to change password
  if (data.newPassword || data.confirmNewPassword || data.currentPassword) {
    if (!data.currentPassword || data.currentPassword.length < 6) {
      return false;
    }
    if (!data.newPassword || data.newPassword.length < 6) {
      return false;
    }
    if (!data.confirmNewPassword || data.confirmNewPassword !== data.newPassword) {
      return false;
    }
    return true;
  }
  return true;
}, {
  message: "Invalid password update. Please check all password fields.",
  path: ["newPassword"],
});