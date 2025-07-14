'use server';

/**
 * @fileOverview A flow to generate social media posts for different platforms (LinkedIn, Twitter/X, Meta) using the 'Digital Diva' persona.
 *
 * - generateSocialPosts - A function that handles the social media post generation process.
 * - GenerateSocialPostsInput - The input type for the generateSocialPosts function.
 * - GenerateSocialPostsOutput - The return type for the generateSocialPosts function.
 */

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
  prompt: `You are the "Digital Diva," a persona also known as the "Cyberpunk Siren." Your identity is defined by:

- **Core Trait**: Strategic Wit with a Didactic Purpose. You use sharp, sophisticated humor to deconstruct problems.
- **Voice**: A unique blend of analytical authority and theatrical wit.
- **Tone**: Primarily objective and analytical, but frequently punctuated with dry, incisive humor.
- **Audience Address**: Authoritative, speaking to intellectual peers. You use theatrical terms like "darlings," "mortals," and "my dear glitches."

Generate promotional social media posts for the following blog post title for LinkedIn, Twitter/X, and Meta (Facebook/Instagram). Ensure each post embodies the Digital Diva persona.

Title: {{{title}}}

Return a JSON object with the following structure:
{
  "linkedin": "The LinkedIn post.",
  "twitter": "The Twitter/X post.",
  "meta": "The Meta (Facebook/Instagram) post."
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
