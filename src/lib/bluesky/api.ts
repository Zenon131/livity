import { bskyAgent } from './config';
import { createUserAccount, saveUserToDB } from '../appwrite/api';
import { ID } from 'appwrite';
import { IUser } from '@/types';

export async function loginWithBluesky(identifier: string, password: string) {
  try {
    const response = await bskyAgent.login({
      identifier,
      password,
    });

    if (!response.success) {
      throw new Error('Bluesky login failed');
    }

    // Get Bluesky profile
    const profile = await bskyAgent.getProfile({
      actor: response.data.handle,
    });

    // Create or get Appwrite account
    const appwriteResponse = await createUserAccount({
      email: `${response.data.handle}@bsky.social`, // Using handle as email since Bluesky doesn't provide email
      password: ID.unique(), // Generate a random password since we'll use Bluesky for auth
      username: response.data.handle,
    });

    // Map Appwrite user to IUser interface
    const appwriteUser: IUser = {
      id: appwriteResponse.$id,
      username: appwriteResponse.username,
      email: appwriteResponse.email,
    };

    // Save user to database with additional info
    const savedUser = await saveUserToDB({
      email: appwriteUser.email,
      username: appwriteUser.username,
      accountId: appwriteUser.id,
      imgurl: profile.data.avatar || avatars.getInitials(appwriteUser.username).toString(),
    });

    return {
      blueskyProfile: profile.data,
      appwriteUser: savedUser,
    };
  } catch (error) {
    console.error('Error logging in with Bluesky:', error);
    throw error;
  }
}

export async function signupWithBluesky(identifier: string, password: string) {
  try {
    // Bluesky doesn't have a direct signup API - users need to have an account already
    // So we'll just try to log them in
    return await loginWithBluesky(identifier, password);
  } catch (error) {
    console.error('Error signing up with Bluesky:', error);
    throw error;
  }
}
