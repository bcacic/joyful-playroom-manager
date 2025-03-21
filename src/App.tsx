
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Birthdays from "./pages/Birthdays";
import BirthdayDetail from "./pages/BirthdayDetail";
import BirthdayBoys from "./pages/BirthdayBoys";
import BirthdayBoyDetail from "./pages/BirthdayBoyDetail";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/birthdays" element={<Birthdays />} />
          <Route path="/birthdays/:id" element={<BirthdayDetail />} />
          <Route path="/birthday-boys" element={<BirthdayBoys />} />
          <Route path="/birthday-boys/:id" element={<BirthdayBoyDetail />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
