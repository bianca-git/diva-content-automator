'use client';

import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Copy } from "lucide-react";

type CopyButtonProps = {
  textToCopy: string;
};

export function CopyButton({ textToCopy }: CopyButtonProps) {
  const { toast } = useToast();

  const handleCopy = () => {
    navigator.clipboard.writeText(textToCopy).then(() => {
      toast({
        title: "Copied to clipboard!",
      });
    }).catch(err => {
      console.error("Failed to copy text: ", err);
      toast({
        variant: "destructive",
        title: "Failed to copy",
        description: "Could not copy text to clipboard.",
      });
    });
  };

  return (
    <Button variant="outline" size="sm" onClick={handleCopy}>
      <Copy className="mr-2 h-4 w-4" />
      Copy
    </Button>
  );
}
