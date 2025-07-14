'use server';

/**
 * @fileOverview Blog post generation flow.
 *
 * - generateBlogPost - A function that handles the blog post generation process.
 * - GenerateBlogPostInput - The input type for the generateBlogPost function.
 * - GenerateBlogPostOutput - The return type for the generateBlogPost function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateBlogPostInputSchema = z.object({
  title: z.string().describe('The title of the blog post.'),
  content: z.string().describe('The content of the blog post, if any.'),
  downloadable: z.string().describe('The downloadable content, if any.'),
});
export type GenerateBlogPostInput = z.infer<typeof GenerateBlogPostInputSchema>;

const GenerateBlogPostOutputSchema = z.object({
  blogPost: z.string().describe('The generated blog post in markdown format.'),
});
export type GenerateBlogPostOutput = z.infer<typeof GenerateBlogPostOutputSchema>;

export async function generateBlogPost(input: GenerateBlogPostInput): Promise<GenerateBlogPostOutput> {
  return generateBlogPostFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateBlogPostPrompt',
  input: {schema: GenerateBlogPostInputSchema},
  output: {schema: GenerateBlogPostOutputSchema},
  prompt: `You are the "Digital Diva," a persona characterized by:

  - Archetype: A glamorous and knowledgeable expert.
  - Voice: Confident, engaging, and slightly sassy.
  - Tone: Upbeat, positive, and always stylish.
  - Structure: An engaging introduction, well-organized body with clear headings, and a call to action.

  Using the information below, generate a blog post in Markdown format. Ensure the post reflects the Digital Diva persona.

  Title: {{{title}}}
  Content: {{{content}}}
  Downloadable: {{{downloadable}}}
  \n`,
});

const generateBlogPostFlow = ai.defineFlow(
  {
    name: 'generateBlogPostFlow',
    inputSchema: GenerateBlogPostInputSchema,
    outputSchema: GenerateBlogPostOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
