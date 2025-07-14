'use client';

import type { Topic } from '@/app/page';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from '@/lib/utils';
import { Upload, FileText } from 'lucide-react';

type InputPanelProps = {
  topics: Topic[];
  selectedTopic: Topic | null;
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onTopicSelect: (topic: Topic) => void;
  isGenerating: boolean;
};

export function InputPanel({ topics, selectedTopic, onFileChange, onTopicSelect, isGenerating }: InputPanelProps) {
  return (
    <Card className="sticky top-8">
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2"><Upload className="h-5 w-5"/> Input Panel</CardTitle>
        <CardDescription>Upload your CSV and select a topic to begin.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="csv-upload">1. Upload CSV File</Label>
          <Input id="csv-upload" type="file" accept=".csv" onChange={onFileChange} disabled={isGenerating} />
        </div>

        <div className="space-y-2">
          <Label>2. Select a Topic</Label>
          <ScrollArea className="h-96 rounded-md border">
            <div className="p-4 space-y-2">
              {topics.length === 0 && (
                <div className="text-center text-sm text-muted-foreground py-10">
                  <FileText className="mx-auto h-8 w-8 mb-2"/>
                  <p>Upload a CSV file to see topics here.</p>
                </div>
              )}
              {topics.map((topic, index) => (
                <button
                  key={index}
                  disabled={isGenerating}
                  onClick={() => onTopicSelect(topic)}
                  className={cn(
                    "w-full text-left p-3 rounded-md border transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
                    selectedTopic?.Title === topic.Title
                      ? "bg-primary/10 border-primary text-primary font-semibold"
                      : "hover:bg-accent/10"
                  )}
                >
                  {topic.Title}
                </button>
              ))}
            </div>
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  );
}
