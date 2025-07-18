'use client';

import Image from 'next/image';
import type { Topic, Visual, SocialPosts } from '@/app/page';
import { WorkflowStep } from './workflow-step';
import { CopyButton } from './copy-button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Download } from 'lucide-react';

type WorkflowPanelProps = {
  selectedTopic: Topic | null;
  downloadableContent: string | null; // This is now a base64 PDF string
  visual: Visual | null;
  socialPosts: SocialPosts | null;
  sanityPostId: string | null;
  isLoading: { blog: boolean; downloadable: boolean; visual: boolean; social: boolean; sanity: boolean; };
  onGenerateBlogPost: () => void;
  onGenerateDownloadable: () => void;
  onGenerateVisual: () => void;
  onGenerateSocialPosts: () => void;
  onPostToSanity: () => void;
};

export function WorkflowPanel({
  selectedTopic,
  downloadableContent,
  visual,
  socialPosts,
  sanityPostId,
  isLoading,
  onGenerateBlogPost,
  onGenerateDownloadable,
  onGenerateVisual,
  onGenerateSocialPosts,
  onPostToSanity,
}: WorkflowPanelProps) {
  if (!selectedTopic) {
    return (
      <Card className="flex items-center justify-center h-96">
        <CardContent className="text-center text-muted-foreground p-6">
          <p className="font-semibold">Select a topic from the left panel to get started.</p>
        </CardContent>
      </Card>
    );
  }

  // TODO - Refactor this to use workflow state from the page component
  return (
    <div className="space-y-8">
      <WorkflowStep
        stepNumber={1}
        title="Generate Blog Post"
        isUnlocked={!!selectedTopic}
        isGenerating={isLoading.blog}
        onGenerate={onGenerateBlogPost}
        hasContent={!!blogPost}
      >
        {blogPost && (
          <div className="space-y-4">
            <div className="prose prose-sm max-w-none h-96 overflow-y-auto p-4 border rounded-md bg-secondary/30">
                <pre className="whitespace-pre-wrap font-body text-sm">{blogPost}</pre>
            </div>
            <CopyButton textToCopy={blogPost} />
          </div>
        )}
      </WorkflowStep>

      <WorkflowStep
        stepNumber={3}
        title="Generate Visual"
        isUnlocked={!!blogPost}
        isGenerating={isLoading.visual}
        onGenerate={onGenerateVisual}
        hasContent={!!visual}
      >
        {visual && (
          <div className="space-y-4">
            <Image
              src={visual.imageUrl}
              alt={visual.imagePrompt}
              width={512}
              height={512}
              className="rounded-lg border shadow-md mx-auto"
              data-ai-hint="abstract art"
            />
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-headline">Image Prompt</CardTitle>
                <CardDescription>The prompt used to generate this image.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground p-3 bg-secondary/30 rounded-md border">{visual.imagePrompt}</p>
                <CopyButton textToCopy={visual.imagePrompt} />
              </CardContent>
            </Card>
          </div>
        )}
      </WorkflowStep>

      <WorkflowStep
        stepNumber={4}
        title="Generate Social Posts"
        isUnlocked={!!selectedTopic}
        isGenerating={isLoading.social}
        onGenerate={onGenerateSocialPosts}
        hasContent={!!socialPosts}
      >
        {socialPosts && (
          <div className="space-y-4">
            {Object.entries(socialPosts).map(([platform, post]) => (
              <Card key={platform}>
                <CardHeader>
                  <CardTitle className="text-lg capitalize font-headline">{platform}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">{post}</p>
                  <CopyButton textToCopy={post} />
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </WorkflowStep>

      <WorkflowStep
        stepNumber={5}
        title="Post to Sanity"
        isUnlocked={!!blogPost}
        isGenerating={isLoading.sanity}
        onGenerate={onPostToSanity}
        hasContent={!!sanityPostId}
      >
        {sanityPostId && (
          <div className="space-y-4 text-center">
            <p className="text-muted-foreground">Successfully posted to Sanity!</p>
            <p className="text-sm text-muted-foreground">Post ID: {sanityPostId}</p>
          </div>
        )}
      </WorkflowStep>
    </div>
  );
}
