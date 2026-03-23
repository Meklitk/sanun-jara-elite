import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { I18nProvider } from "@/lib/i18n";
import MainLayout from "@/components/MainLayout";
import IntroductionPage from "./pages/IntroductionPage";
import HistoryPage from "./pages/HistoryPage";
import GovernancePage from "./pages/GovernancePage";
import EconomyPage from "./pages/EconomyPage";
import CommercePage from "./pages/CommercePage";
import CulturePage from "./pages/CulturePage";
import ResourcesPage from "./pages/ResourcesPage";
import GlobalPerspectivesPage from "./pages/GlobalPerspectivesPage";
import ReferenceBureauPage from "./pages/ReferenceBureauPage";
import AcademyPage from "./pages/AcademyPage";
import IntranetPage from "./pages/IntranetPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <I18nProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <MainLayout>
            <Routes>
              <Route path="/" element={<IntroductionPage />} />
              <Route path="/history" element={<HistoryPage />} />
              <Route path="/governance" element={<GovernancePage />} />
              <Route path="/economy" element={<EconomyPage />} />
              <Route path="/commerce" element={<CommercePage />} />
              <Route path="/culture" element={<CulturePage />} />
              <Route path="/resources" element={<ResourcesPage />} />
              <Route path="/global-perspectives" element={<GlobalPerspectivesPage />} />
              <Route path="/reference-bureau" element={<ReferenceBureauPage />} />
              <Route path="/academy" element={<AcademyPage />} />
              <Route path="/intranet" element={<IntranetPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </MainLayout>
        </BrowserRouter>
      </I18nProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
