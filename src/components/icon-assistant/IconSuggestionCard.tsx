import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { IconRecord } from "@/services/iconAiService";
import { Eye } from "lucide-react";

interface IconSuggestionCardProps {
  icon: IconRecord;
  onView: (icon: IconRecord) => void;
}

const IconSuggestionCard: React.FC<IconSuggestionCardProps> = ({ icon, onView }) => {
  return (
    <Card className="p-4 flex flex-col items-center justify-between gap-4 hover:shadow-md transition-shadow">
      <div className="w-full flex justify-between items-start">
        <div 
          className="w-4 h-4 rounded-full" 
          style={{ backgroundColor: `#${icon.hex}` }}
          title={`#${icon.hex}`}
        />
      </div>
      
      <div className="flex flex-col items-center gap-2">
        <svg 
          role="img" 
          viewBox="0 0 24 24" 
          xmlns="http://www.w3.org/2000/svg"
          className="w-12 h-12 transition-transform hover:scale-110"
          fill={`#${icon.hex}`}
        >
          <path d={icon.path}/>
        </svg>
        <div className="text-center">
          <h3 className="font-semibold text-sm truncate max-w-[140px]" title={icon.title}>
            {icon.title}
          </h3>
          <p className="text-xs text-muted-foreground truncate max-w-[140px]">
            {icon.slug}
          </p>
        </div>
      </div>

      <Button 
        variant="outline" 
        size="sm" 
        className="w-full mt-2"
        onClick={() => onView(icon)}
      >
        <Eye className="w-3 h-3 mr-2" />
        View SVG
      </Button>
    </Card>
  );
};

export default IconSuggestionCard;
