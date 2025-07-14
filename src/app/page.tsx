'use client';

import React, { useState } from 'react';
import { generateBlogPost } from '@/ai/flows/generate-blog-post';
import { generateDownloadable } from '@/ai/flows/generate-downloadable';
import { generateVisual } from '@/ai/flows/generate-visual';
import { generateSocialPosts } from '@/ai/flows/generate-social-posts';
import { useToast } from "@/hooks/use-toast";
import { InputPanel } from '@/components/app/input-panel';
import { WorkflowPanel } from '@/components/app/workflow-panel';
import { Wand2 } from 'lucide-react';

export type Topic = {
  Title: string;
  Content: string;
  Downloadable: string;
  Visual: string;
  [key: string]: string;
};

export type Visual = {
  imagePrompt: string;
  imageUrl: string;
};

export type SocialPosts = {
  linkedin: string;
  twitter: string;
  meta: string;
};

export default function Home() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  
  const [blogPost, setBlogPost] = useState<string | null>(null);
  const [downloadableContent, setDownloadableContent] = useState<string | null>(null);
  const [visual, setVisual] = useState<Visual | null>(null);
  const [socialPosts, setSocialPosts] = useState<SocialPosts | null>(null);

  const [isLoading, setIsLoading] = useState({
    blog: false,
    downloadable: false,
    visual: false,
    social: false,
  });

  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        const lines = text.split(/\r?\n/).filter(line => line.trim() !== '');
        if (lines.length < 2) {
            toast({ variant: 'destructive', title: "Invalid CSV", description: "CSV file must have a header and at least one data row." });
            return;
        }
        const header = lines[0].split(',').map(h => h.trim());
        const requiredHeaders = ['Title', 'Content', 'Downloadable', 'Visual'];
        if (!requiredHeaders.every(h => header.includes(h))) {
            toast({ variant: 'destructive', title: "Invalid CSV Header", description: `CSV must contain headers: ${requiredHeaders.join(', ')}` });
            return;
        }
        
        const data = lines.slice(1).map(line => {
          const values = line.split(',');
          const row: Topic = { Title: '', Content: '', Downloadable: '', Visual: '' };
          header.forEach((key, i) => {
            if (requiredHeaders.includes(key)) {
              row[key as keyof Topic] = values[i]?.trim().replace(/"/g, '') || '';
            }
          });
          return row;
        });
        
        setTopics(data);
        handleTopicSelect(null);
        toast({ title: "CSV Loaded", description: `${data.length} topics loaded successfully.` });
      };
      reader.onerror = () => {
        toast({ variant: 'destructive', title: "File Error", description: "There was an error reading the file." });
      };
      reader.readAsText(file);
    }
  };

  const handleTopicSelect = (topic: Topic | null) => {
    setSelectedTopic(topic);
    setBlogPost(null);
    setDownloadableContent(null);
    setVisual(null);
    setSocialPosts(null);
  };

  const handleGenerateBlogPost = async () => {
    if (!selectedTopic) return;
    setIsLoading(prev => ({ ...prev, blog: true }));
    try {
      const result = await generateBlogPost({
        title: selectedTopic.Title,
        content: selectedTopic.Content,
        downloadable: selectedTopic.Downloadable
      });
      setBlogPost(result.blogPost);
    } catch (error) {
      console.error(error);
      toast({ variant: 'destructive', title: "Blog Post Error", description: "Failed to generate blog post." });
    } finally {
      setIsLoading(prev => ({ ...prev, blog: false }));
    }
  };

  const handleGenerateDownloadable = async () => {
    if (!selectedTopic || !blogPost) return;
    setIsLoading(prev => ({ ...prev, downloadable: true }));
    try {
      const result = await generateDownloadable({
        title: selectedTopic.Title,
        blogPost: blogPost,
        downloadableType: selectedTopic.Downloadable
      });
      setDownloadableContent(result.downloadableContent);
    } catch (error) {
      console.error(error);
      toast({ variant: 'destructive', title: "Downloadable Error", description: "Failed to generate downloadable content." });
    } finally {
      setIsLoading(prev => ({ ...prev, downloadable: false }));
    }
  };

  const handleGenerateVisual = async () => {
    if (!selectedTopic || !blogPost) return;
    setIsLoading(prev => ({ ...prev, visual: true }));
    try {
      const result = await generateVisual({
        visualDescription: selectedTopic.Visual,
        blogPost: blogPost,
      });
      setVisual(result);
    } catch (error) {
      console.error(error);
      toast({ variant: 'destructive', title: "Visual Error", description: "Failed to generate visual." });
    } finally {
      setIsLoading(prev => ({ ...prev, visual: false }));
    }
  };

  const handleGenerateSocialPosts = async () => {
    if (!selectedTopic) return;
    setIsLoading(prev => ({ ...prev, social: true }));
    try {
      const result = await generateSocialPosts({ title: selectedTopic.Title });
      setSocialPosts(result);
    } catch (error) {
      console.error(error);
      toast({ variant: 'destructive', title: "Social Post Error", description: "Failed to generate social posts." });
    } finally {
      setIsLoading(prev => ({ ...prev, social: false }));
    }
  };

  const isGenerating = isLoading.blog || isLoading.visual || isLoading.social || isLoading.downloadable;

  return (
    <main className="min-h-screen bg-background">
      <header className="p-4 border-b border-border/50 bg-card shadow-sm">
        <div className="container mx-auto flex items-center gap-2">
            <Wand2 className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-headline font-bold text-foreground">
                Diva Content Automator
            </h1>
        </div>
      </header>
      <div className="container mx-auto p-4 md:p-8 grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        <div className="md:col-span-1">
          <InputPanel
            topics={topics}
            selectedTopic={selectedTopic}
            onFileChange={handleFileChange}
            onTopicSelect={handleTopicSelect}
            isGenerating={isGenerating}
          />
        </div>
        <div className="md:col-span-2">
          <WorkflowPanel
            selectedTopic={selectedTopic}
            blogPost={blogPost}
            downloadableContent={downloadableContent}
            visual={visual}
            socialPosts={socialPosts}
            isLoading={isLoading}
            onGenerateBlogPost={handleGenerateBlogPost}
            onGenerateDownloadable={handleGenerateDownloadable}
            onGenerateVisual={handleGenerateVisual}
            onGenerateSocialPosts={handleGenerateSocialPosts}
          />
        </div>
      </div>
    </main>
  );
}
