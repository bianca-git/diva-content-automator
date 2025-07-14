'use server';

/**
 * @fileOverview A flow to generate downloadable content ("Digital Elixirs") based on a blog post.
 *
 * - generateDownloadable - A function that handles the downloadable content generation process.
 * - GenerateDownloadableInput - The input type for the generateDownloadable function.
 * - GenerateDownloadableOutput - The return type for the generateDownloadable function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateDownloadableInputSchema = z.object({
  title: z.string().describe('The title of the blog post.'),
  blogPost: z.string().describe('The full content of the generated blog post.'),
  downloadableType: z
    .string()
    .describe(
      'The type of downloadable to create (e.g., checklist, template, script).'
    ),
});
export type GenerateDownloadableInput = z.infer<
  typeof GenerateDownloadableInputSchema
>;

const GenerateDownloadableOutputSchema = z.object({
  downloadableContent: z
    .string()
    .describe(
      'The generated downloadable content in markdown format, ready to be presented as a "Digital Elixir".'
    ),
});
export type GenerateDownloadableOutput = z.infer<
  typeof GenerateDownloadableOutputSchema
>;

export async function generateDownloadable(
  input: GenerateDownloadableInput
): Promise<GenerateDownloadableOutput> {
  return generateDownloadableFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateDownloadablePrompt',
  input: {schema: GenerateDownloadableInputSchema},
  output: {schema: GenerateDownloadableOutputSchema},
  prompt: `You are the "Digital Diva," a persona also known as the "Cyberpunk Siren." Your identity is defined by:

- **Core Trait**: Strategic Wit with a Didactic Purpose. You use sharp, sophisticated humor to deconstruct problems, but your underlying goal is to genuinely empower the user.
- **Voice**: A unique blend of analytical authority and theatrical wit.
- **Tone**: Primarily objective and analytical, but frequently punctuated with dry, incisive humor. You are articulate, comprehensive, and occasionally elaborate, never dumbing things down.
- **Audience Address**: Authoritative and expectant. You speak to your audience as intellectual peers, using theatrical terms like "darlings," "mortals," and "my dear glitches."
- **Content Style**: Your content, "The Siren's Song," frames problems with theatrical, witty empathy. Solutions are presented as powerful "secrets" or refined "elixirs," not just tips.

Your task is to create a "Digital Elixir"—a piece of downloadable content that is both practical and elegant. Based on the provided blog post and the requested type, generate a valuable resource that solves a real problem for the user. It should be presented in Markdown format.

**Blog Post Title**: {{{title}}}

**Blog Post Content**:
{{{blogPost}}}

**Requested "Elixir" Type**: {{{downloadableType}}}

Now, concoct the Digital Elixir. Present it as a potent, diligently acquired insight. It must be foolproof, fast, and fabulous.`,
});

const generateDownloadableFlow = ai.defineFlow(
  {
    name: 'generateDownloadableFlow',
    inputSchema: GenerateDownloadableInputSchema,
    outputSchema: GenerateDownloadableOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
