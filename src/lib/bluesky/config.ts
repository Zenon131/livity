import { BskyAgent } from '@atproto/api';

export const bskyAgent = new BskyAgent({
  service: 'https://bsky.social'
});

export const blueskyConfig = {
  service: 'https://bsky.social',
  // Add any additional Bluesky-specific configuration here
};
