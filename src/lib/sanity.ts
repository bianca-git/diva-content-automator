import {createClient} from '@sanity/client';

export const sanityClient = createClient({
  projectId: 'nzlrkqtz',
  dataset: 'production',
  token: 'skRFQ4WF919oW0D949Q7nCnThyC9gqIX5hS8KzVjHSjwh3x0cGk9Z5zZhIpHhUqzyuXY6NTRx9zoRyLOCnT6oiMaHL2VxSFSxxzSbKKGibDhMefaRzYib5FizDoCrkhBUYKn0kCdRZs41O53FJS70aIamwXrO9mrj78rTKoQb8bS8TmZBCZW',
  useCdn: false,
  apiVersion: '2024-06-11',
});
