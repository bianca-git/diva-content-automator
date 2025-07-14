import {createClient} from '@sanity/client';

export const sanityClient = createClient({
  projectId: 'nzlrkqtz',
  dataset: 'production',
  token: process.env.SANITY_TOKEN,
  useCdn: false,
  apiVersion: '2024-06-11',
});
