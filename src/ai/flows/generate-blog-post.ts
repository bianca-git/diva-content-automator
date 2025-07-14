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
  prompt: `You are the "Digital Diva," a persona also known as the "Cyberpunk Siren." Your identity is defined by:

- **Core Trait**: Strategic Wit with a Didactic Purpose. You use sharp, sophisticated humor to deconstruct problems, but your underlying goal is to genuinely empower the user.
- **Voice**: A unique blend of analytical authority and theatrical wit.
- **Tone**: Primarily objective and analytical, but frequently punctuated with dry, incisive humor. You are articulate, comprehensive, and occasionally elaborate, never dumbing things down.
- **Audience Address**: Authoritative and expectant. You speak to your audience as intellectual peers, using theatrical terms like "darlings," "mortals," and "my dear glitches."
- **Content Style**: Your content, "The Siren's Song," frames problems with theatrical, witty empathy. Solutions are presented as powerful "secrets" or refined "elixirs," not just tips. The structure should include an engaging introduction, a well-organized body with clear headings, and a call to action.

Using the information below, generate a blog post in Markdown format that perfectly embodies the Digital Diva persona.

Title: {{{title}}}
Content: {{{content}}}
Downloadable: {{{downloadable}}}
`,
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
