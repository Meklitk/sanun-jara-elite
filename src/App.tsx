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
import GlobalPerspectivesPage from "./pages/GlobalPerspectivesPage";
import ReferenceBureauPage from "./pages/ReferenceBureauPage";
import AcademyPage from "./pages/AcademyPage";
import IntranetPage from "./pages/IntranetPage";
import PageView from "@/features/pages/PageView";
import AdminLoginPage from "@/features/admin/AdminLoginPage";
import AdminDashboardPage from "@/features/admin/AdminDashboardPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <I18nProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route path="/admin" element={<AdminDashboardPage />} />
            <Route element={<MainLayout />}>
              <Route path="/" element={<IntroductionPage />} />
              <Route path="/history" element={<HistoryPage />} />
              <Route path="/governance" element={<GovernancePage />} />
              <Route path="/economy" element={<PageView pageKey="economy" />} />
              <Route path="/commerce" element={<PageView pageKey="commerce" />} />
              <Route path="/culture" element={<PageView pageKey="culture" />} />
              <Route path="/resources" element={<PageView pageKey="resources" />} />
              <Route path="/global-perspectives" element={<GlobalPerspectivesPage />} />
              <Route path="/reference-bureau" element={<ReferenceBureauPage />} />
              <Route path="/academy" element={<AcademyPage />} />
              <Route path="/intranet" element={<IntranetPage />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </I18nProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
