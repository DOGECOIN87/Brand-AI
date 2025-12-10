import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, Search, Code, Palette } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="text-center space-y-6 max-w-3xl">
        <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary text-primary-foreground hover:bg-primary/80">
          v1.0 Released
        </div>
        
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-6xl text-gray-900 dark:text-gray-100">
          Custom Icon Generator
        </h1>
        
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          The ultimate toolkit for developers and designers. Discover simple icons, customize them, and generate ready-to-use SVG code in seconds.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8">
          <Link to="/icon-assistant">
            <Button size="lg" className="h-14 px-8 text-lg group shadow-lg shadow-primary/20">
              <Sparkles className="mr-2 h-5 w-5 animate-pulse" />
              Open Icon AI Assistant
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 text-left">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mb-4">
              <Search className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Smart Search</h3>
            <p className="text-muted-foreground">
              Find brand logos and icons using natural language. "Blue social media apps" just works.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mb-4">
              <Code className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Instant SVG</h3>
            <p className="text-muted-foreground">
              Get clean, optimized SVG code ready to paste into your React, Vue, or HTML projects.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mb-4">
              <Palette className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Color Matching</h3>
            <p className="text-muted-foreground">
              Filter icons by their official brand colors or customize them to match your design system.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
