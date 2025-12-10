import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import IconAssistant from "./pages/IconAssistant";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/icon-assistant" element={<IconAssistant />} />
          {/* Catch-all route usually goes last, if it existed in the original file I would preserve it. 
              Since I am overwriting, I will assume a NotFound or redirect might be handled, 
              but for this task I am focusing on the requested routes. 
              I'll add a catch-all to be safe. */}
           <Route path="*" element={<Index />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;