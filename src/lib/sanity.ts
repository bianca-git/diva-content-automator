import {createClient} from '@sanity/client';

export const sanityClient = createClient({
  projectId: process.env.SANITY_PROJECT_ID || (() => { throw new Error('SANITY_PROJECT_ID is not defined'); })(),
  dataset: 'production',
  token: process.env.SANITY_TOKEN,
  useCdn: false,
  apiVersion: '2024-06-11',
});
