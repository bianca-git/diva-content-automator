'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Wand2, Lock, CheckCircle2 } from "lucide-react";
import { Separator } from "../ui/separator";

type WorkflowStepProps = {
  stepNumber: number;
  title: string;
  subtitle?: string;
  isUnlocked: boolean;
  isGenerating: boolean;
  hasContent: boolean;
  onGenerate: () => void;
  children: React.ReactNode;
};

export function WorkflowStep({ stepNumber, title, subtitle, isUnlocked, isGenerating, hasContent, onGenerate, children }: WorkflowStepProps) {
  return (
    <Card className={!isUnlocked ? "bg-secondary/50" : ""}>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-4">
            <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary text-primary-foreground font-bold text-lg">
                {stepNumber}
            </div>
            <div>
                <CardTitle className="font-headline">{title}</CardTitle>
                <CardDescription>{subtitle || `Step ${stepNumber} of the content workflow`}</CardDescription>
            </div>
        </div>
        {isUnlocked && !hasContent && (
            <Button onClick={onGenerate} disabled={isGenerating}>
            {isGenerating ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
                <Wand2 className="mr-2 h-4 w-4" />
            )}
            Generate
            </Button>
        )}
        {!isUnlocked && <Lock className="h-5 w-5 text-muted-foreground" />}
        {hasContent && <CheckCircle2 className="h-6 w-6 text-green-500" />}
      </CardHeader>
      {isUnlocked && (
        <>
            <Separator />
            <CardContent className="p-6">
            {children}
            {!children && !isGenerating && (
                <div className="text-center text-muted-foreground py-10">
                    Click "Generate" to create content.
                </div>
            )}
            {isGenerating && (
                <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
                    <Loader2 className="h-8 w-8 animate-spin mb-4" />
                    <p className="font-semibold">Generating... this may take a moment.</p>
                </div>
            )}
            </CardContent>
        </>
      )}
    </Card>
  );
}
