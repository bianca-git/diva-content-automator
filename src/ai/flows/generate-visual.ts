'use server';
/**
 * @fileOverview This file contains the Genkit flow for generating a visual for a blog post.
 *
 * - generateVisual - A function that handles the visual generation process.
 * - GenerateVisualInput - The input type for the generateVisual function.
 * - GenerateVisualOutput - The return type for the generateVisual function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateVisualInputSchema = z.object({
  visualDescription: z
    .string()
    .describe('The visual description from the CSV file.'),
  blogPost: z.string().describe('The generated blog post content.'),
});
export type GenerateVisualInput = z.infer<typeof GenerateVisualInputSchema>;

const GenerateVisualOutputSchema = z.object({
  imagePrompt: z.string().describe('The detailed text prompt used to generate the image.'),
  imageUrl: z.string().describe('The URL of the generated image.'),
});
export type GenerateVisualOutput = z.infer<typeof GenerateVisualOutputSchema>;

export async function generateVisual(input: GenerateVisualInput): Promise<GenerateVisualOutput> {
  return generateVisualFlow(input);
}

const imageConceptPrompt = ai.definePrompt({
  name: 'imageConceptPrompt',
  input: {schema: GenerateVisualInputSchema},
  output: {schema: z.object({prompt: z.string()})},
  prompt: `You are a creative director with expertise in visual design. Based on the following blog post and visual description, create a detailed prompt for an image generator, keeping in mind the \"Iridescent Spectrum\" visual identity (color palette, style, lighting).

Blog Post: {{{blogPost}}}
Visual Description: {{{visualDescription}}}

Detailed Image Generation Prompt:`,
});

const generateVisualFlow = ai.defineFlow(
  {
    name: 'generateVisualFlow',
    inputSchema: GenerateVisualInputSchema,
    outputSchema: GenerateVisualOutputSchema,
  },
  async input => {
    const {output: imagePromptOutput} = await imageConceptPrompt(input);
    const imagePrompt = imagePromptOutput?.prompt;

    if (!imagePrompt) {
      throw new Error('Failed to generate image prompt.');
    }

    const {media} = await ai.generate({
      // IMPORTANT: ONLY the googleai/gemini-2.0-flash-preview-image-generation model is able to generate images. You MUST use exactly this model to generate images.
      model: 'googleai/gemini-2.0-flash-preview-image-generation',

      // simple prompt
      prompt: imagePrompt,

      config: {
        responseModalities: ['TEXT', 'IMAGE'], // MUST provide both TEXT and IMAGE, IMAGE only won't work
      },
    });

    if (!media) {
      throw new Error('Failed to generate image.');
    }

    return {
      imagePrompt: imagePrompt,
      imageUrl: media.url,
    };
  }
);
