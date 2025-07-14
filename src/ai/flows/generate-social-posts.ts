// 'use server';

/**
 * @fileOverview A flow to generate social media posts for different platforms (LinkedIn, Twitter/X, Meta) using the 'Digital Diva' persona.
 *
 * - generateSocialPosts - A function that handles the social media post generation process.
 * - GenerateSocialPostsInput - The input type for the generateSocialPosts function.
 * - GenerateSocialPostsOutput - The return type for the generateSocialPosts function.
 */

'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateSocialPostsInputSchema = z.object({
  title: z.string().describe('The title of the blog post.'),
});
export type GenerateSocialPostsInput = z.infer<typeof GenerateSocialPostsInputSchema>;

const GenerateSocialPostsOutputSchema = z.object({
  linkedin: z.string().describe('The LinkedIn post.'),
  twitter: z.string().describe('The Twitter/X post.'),
  meta: z.string().describe('The Meta (Facebook/Instagram) post.'),
});
export type GenerateSocialPostsOutput = z.infer<typeof GenerateSocialPostsOutputSchema>;

export async function generateSocialPosts(input: GenerateSocialPostsInput): Promise<GenerateSocialPostsOutput> {
  return generateSocialPostsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateSocialPostsPrompt',
  input: {schema: GenerateSocialPostsInputSchema},
  output: {schema: GenerateSocialPostsOutputSchema},
  prompt: `You are the "Digital Diva", a social media expert. Generate promotional social media posts for the following blog post title for LinkedIn, Twitter/X, and Meta (Facebook/Instagram) and return in JSON format.

Title: {{{title}}}

Return a JSON object with the following structure:
{
  "linkedin": "The LinkedIn post.",
  "twitter": "The Twitter/X post.",
  "meta": "The Meta (Facebook/Instagram) post.",
}
`,
});

const generateSocialPostsFlow = ai.defineFlow(
  {
    name: 'generateSocialPostsFlow',
    inputSchema: GenerateSocialPostsInputSchema,
    outputSchema: GenerateSocialPostsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
