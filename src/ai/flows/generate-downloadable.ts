'use server';

/**
 * @fileOverview A flow to generate downloadable content ("Digital Elixirs") as a stylized PDF.
 *
 * - generateDownloadable - A function that handles the downloadable content generation process.
 * - GenerateDownloadableInput - The input type for the generateDownloadable function.
 * - GenerateDownloadableOutput - The return type for the generateDownloadable function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {retryWithBackoff} from '@/lib/utils';
import {PDFDocument, rgb, StandardFonts} from 'pdf-lib';

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
  pdfBase64: z
    .string()
    .describe(
      'The generated downloadable content as a Base64-encoded PDF string.'
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

const markdownPrompt = ai.definePrompt({
  name: 'generateDownloadableMarkdownPrompt',
  input: {schema: GenerateDownloadableInputSchema},
  output: {schema: z.object({
    downloadableContent: z.string().describe('The downloadable content in markdown format.')
  })},
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

async function createStyledPdf(title: string, markdownContent: string): Promise<string> {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage();
  const { width, height } = page.getSize();
  
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  // Midnight Matrix background
  page.drawRectangle({
    x: 0,
    y: 0,
    width,
    height,
    color: rgb(15/255, 23/255, 42/255), // Indigo/Charcoal
  });
  
  const textColor = rgb(224, 231, 255); // Light foreground
  const accentColor = rgb(219, 39, 119); // Pink/Accent

  let y = height - 50;
  
  // Title
  page.drawText(title, {
    x: 50,
    y,
    font: boldFont,
    size: 24,
    color: accentColor,
  });
  y -= 40;

  // Body text from markdown
  const lines = markdownContent.split('\n');
  for (const line of lines) {
    if (y < 50) {
      // Add a new page if content overflows
      const newPage = pdfDoc.addPage();
      newPage.drawRectangle({ x: 0, y: 0, width, height, color: rgb(15/255, 23/255, 42/255) });
      y = height - 50;
    }
    
    let currentFont = font;
    let size = 12;
    let x = 50;

    if (line.startsWith('# ')) {
        currentFont = boldFont;
        size = 18;
        page.drawText(line.substring(2), { x, y, font: currentFont, size, color: textColor });
    } else if (line.startsWith('## ')) {
        currentFont = boldFont;
        size = 16;
        page.drawText(line.substring(3), { x, y, font: currentFont, size, color: textColor });
    } else if (line.startsWith('* ')) {
        page.drawText(`• ${line.substring(2)}`, { x: x + 10, y, font, size, color: textColor });
    } else if (line.trim() !== '') {
        page.drawText(line, { x, y, font, size, color: textColor });
    }
    y -= (size * 1.5);
  }

  const pdfBytes = await pdfDoc.save();
  return Buffer.from(pdfBytes).toString('base64');
}


const generateDownloadableFlow = ai.defineFlow(
  {
    name: 'generateDownloadableFlow',
    inputSchema: GenerateDownloadableInputSchema,
    outputSchema: GenerateDownloadableOutputSchema,
  },
  async input => {
    return retryWithBackoff(async () => {
      const {output} = await markdownPrompt(input);
      if (!output) {
        throw new Error("No markdown output from prompt.");
      }
      
      const pdfBase64 = await createStyledPdf(input.title, output.downloadableContent);

      return { pdfBase64 };
    });
  }
);
