'use server';

import {ai} from '@/ai/genkit';
import {sanityClient} from '@/lib/sanity';
import {z} from 'genkit';

const PostToSanityInputSchema = z.object({
  title: z.string().describe('The title of the blog post.'),
  body: z.string().describe('The content of the blog post in markdown format.'),
  author: z.string().describe('The author of the blog post.'),
});
export type PostToSanityInput = z.infer<typeof PostToSanityInputSchema>;

const PostToSanityOutputSchema = z.object({
  postId: z.string().describe('The Sanity document ID of the created post.'),
});
export type PostToSanityOutput = z.infer<typeof PostToSanityOutputSchema>;

export async function postToSanity(input: PostToSanityInput): Promise<PostToSanityOutput> {
  return postToSanityFlow(input);
}

const postToSanityFlow = ai.defineFlow(
  {
    name: 'postToSanityFlow',
    inputSchema: PostToSanityInputSchema,
    outputSchema: PostToSanityOutputSchema,
  },
  async ({title, body, author}) => {
    const post = {
      _type: 'post',
      title,
      author: {
        _ref: 'f946824a-f571-4475-ab1a-469279581b37',
        _type: 'reference',
      },
      body: [
        {
          _type: 'block',
          children: [
            {
              _type: 'span',
              text: body,
            },
          ],
        },
      ],
    };

    const result = await sanityClient.create(post);

    return {
      postId: result._id,
    };
  }
);
