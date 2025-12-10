import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { IconRecord } from "@/services/iconAiService";
import { Check, Copy } from "lucide-react";
import { toast } from "sonner";

interface IconDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  icon: IconRecord | null;
}

const IconDetailsDialog: React.FC<IconDetailsDialogProps> = ({ open, onOpenChange, icon }) => {
  const [copied, setCopied] = useState(false);

  if (!icon) return null;

  const svgCode = `<svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="#${icon.hex}"><title>${icon.title}</title><path d="${icon.path}"/></svg>`;

  const handleCopy = () => {
    navigator.clipboard.writeText(svgCode);
    setCopied(true);
    toast.success("SVG code copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span style={{ color: `#${icon.hex}` }} className="text-2xl">●</span>
            {icon.title}
          </DialogTitle>
          <DialogDescription>
            Slug: <code className="bg-muted px-1 rounded">{icon.slug}</code> • Hex: <code className="bg-muted px-1 rounded">#{icon.hex}</code>
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
          <div className="flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 border rounded-lg p-8 min-h-[200px]">
             {/* Dynamic SVG rendering */}
             <svg 
               role="img" 
               viewBox="0 0 24 24" 
               xmlns="http://www.w3.org/2000/svg"
               className="w-32 h-32"
               fill={`#${icon.hex}`}
             >
               <title>{icon.title}</title>
               <path d={icon.path}/>
             </svg>
             <p className="mt-4 text-sm text-muted-foreground">Preview</p>
          </div>

          <div className="flex flex-col space-y-2">
            <label className="text-sm font-medium">SVG Code</label>
            <div className="relative h-full">
              <textarea 
                readOnly 
                className="w-full h-[200px] p-3 font-mono text-xs bg-slate-950 text-slate-50 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                value={svgCode}
              />
              <Button 
                size="sm" 
                variant="secondary" 
                className="absolute top-2 right-2 h-8"
                onClick={handleCopy}
              >
                {copied ? <Check className="w-4 h-4 mr-1" /> : <Copy className="w-4 h-4 mr-1" />}
                {copied ? "Copied" : "Copy"}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default IconDetailsDialog;
