import {createClient} from '@sanity/client';

export const sanityClient = createClient({
projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
token: process.env.SANITY_API_TOKEN!,
  useCdn: false,
  apiVersion: '2024-06-11',
});
