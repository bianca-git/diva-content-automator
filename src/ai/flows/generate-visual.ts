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
import {retryWithBackoff} from '@/lib/utils';

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
  prompt: `You are a creative director for the "Digital Diva" brand. Your task is to create a detailed image generation prompt based on the brand's "Iridescent Spectrum" visual identity.

**Visual Identity: Iridescent Spectrum**
- **Core Concept**: A world of fluid, shimmering light. Not harsh neon, but soft, flowing rainbow gradients and ethereal glows against a dark, atmospheric backdrop.
- **Color Palette**: Dominated by deep charcoals and indigos ("Midnight Matrix"), serving as a canvas for vibrant, flowing gradients of pink, purple, cyan, and lime.
- **Imagery Style**: A "digital painting" or "concept art" style featuring stylized figures, holographic interfaces, and moody, luminous cityscapes. The visuals are cinematic and immersive.

Based on the blog post content and the user's visual description below, create a detailed prompt for an image generator that perfectly captures the "Iridescent Spectrum" aesthetic.

**Blog Post Content**: {{{blogPost}}}
**User's Visual Description**: {{{visualDescription}}}

**Detailed Image Generation Prompt:**`,
});

const generateVisualFlow = ai.defineFlow(
  {
    name: 'generateVisualFlow',
    inputSchema: GenerateVisualInputSchema,
    outputSchema: GenerateVisualOutputSchema,
  },
  async input => {
    return retryWithBackoff(async () => {
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
    });
  }
);
