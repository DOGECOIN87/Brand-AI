import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Sparkles, Search, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { getIconSuggestions, IconRecord, AiExplanation } from "@/services/iconAiService";
import IconSuggestionCard from "@/components/icon-assistant/IconSuggestionCard";
import IconDetailsDialog from "@/components/icon-assistant/IconDetailsDialog";
import { Badge } from "@/components/ui/badge";

const IconAssistant = () => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<IconRecord[]>([]);
  const [explanation, setExplanation] = useState<AiExplanation | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState<IconRecord | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;

    const result = getIconSuggestions(query);
    setSuggestions(result.suggestions);
    setExplanation(result.explanation);
    setHasSearched(true);
  };

  const handleViewIcon = (icon: IconRecord) => {
    setSelectedIcon(icon);
    setIsDialogOpen(true);
  };

  const exampleQueries = [
    "Blue social media icons",
    "Payment and finance logos",
    "Dev tools for backend",
    "Design software brands"
  ];

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-gray-900/50 p-6 md:p-12">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="space-y-4">
          <Link to="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors mb-2">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary/10 rounded-lg">
              <Sparkles className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Icon AI Assistant</h1>
              <p className="text-muted-foreground">
                Describe what you need, and I'll find the perfect icons from our database.
              </p>
            </div>
          </div>
        </div>

        {/* Search Section */}
        <Card className="border-primary/20 shadow-lg">
          <CardHeader>
            <CardTitle>What are you looking for?</CardTitle>
            <CardDescription>Try queries like "red food brands" or "cloud infrastructure".</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="e.g., I need icons for a crypto dashboard..." 
                  className="pl-10 h-12 text-lg"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
              <Button type="submit" size="lg" className="h-12 px-8">
                <Sparkles className="w-4 h-4 mr-2" />
                Generate Suggestions
              </Button>
            </form>

            {!hasSearched && (
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="text-sm text-muted-foreground mr-2 self-center">Try:</span>
                {exampleQueries.map((q) => (
                  <Badge 
                    key={q} 
                    variant="secondary" 
                    className="cursor-pointer hover:bg-secondary/80"
                    onClick={() => {
                      setQuery(q);
                      // slight timeout to allow state update before search (or just call logic directly)
                      setTimeout(() => {
                         const result = getIconSuggestions(q);
                         setSuggestions(result.suggestions);
                         setExplanation(result.explanation);
                         setHasSearched(true);
                      }, 0);
                    }}
                  >
                    {q}
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Results Section */}
        {hasSearched && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            
            {/* AI Explanation */}
            {explanation && (
              <div className="bg-white dark:bg-gray-800 border rounded-lg p-6 shadow-sm">
                <h3 className="font-semibold flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-purple-500" />
                  AI Analysis
                </h3>
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                  {explanation.summary}
                </p>
                {explanation.matchReasons.length > 0 && (
                  <ul className="list-disc list-inside text-xs text-muted-foreground space-y-1">
                    {explanation.matchReasons.map((reason, idx) => (
                      <li key={idx}>{reason}</li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            {/* Grid */}
            <div className="grid grid-cols-1 min-[400px]:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
              {suggestions.map((icon) => (
                <IconSuggestionCard 
                  key={icon.slug} 
                  icon={icon} 
                  onView={handleViewIcon} 
                />
              ))}
            </div>

            {suggestions.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <p>No icons found matching your specific criteria.</p>
                <Button variant="link" onClick={() => setQuery('')}>Clear search</Button>
              </div>
            )}
          </div>
        )}

        <IconDetailsDialog 
          open={isDialogOpen} 
          onOpenChange={setIsDialogOpen} 
          icon={selectedIcon} 
        />
      </div>
    </div>
  );
};

export default IconAssistant;