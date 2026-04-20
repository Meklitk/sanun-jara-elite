import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { I18nProvider } from "@/lib/i18n";
import MainLayout from "@/components/MainLayout";
import IntroductionPage from "./pages/IntroductionPage";
import HistoryPage from "./pages/HistoryPage";
import HistoryTimelineEventPage from "./pages/HistoryTimelineEventPage";
import GovernancePage from "./pages/GovernancePage";
import GovernanceBiographyPage from "./pages/GovernanceBiographyPage";
import GlobalPerspectivesPage from "./pages/GlobalPerspectivesPage";
import ReferenceBureauPage from "./pages/ReferenceBureauPage";
import NianiPage from "./pages/NianiPage";
import NianiInstitutionsPage from "./pages/NianiInstitutionsPage";
import NianiArchitecturalProjectsPage from "./pages/NianiArchitecturalProjectsPage";
import AcademyPage from "./pages/AcademyPage";
import IntranetPage from "./pages/IntranetPage";
import EconomyPage from "./pages/EconomyPage";
import CulturePage from "./pages/CulturePage";
import ResourcesPage from "./pages/ResourcesPage";
import ContentPage from "./pages/ContentPage";
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
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <Routes>
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route path="/admin" element={<AdminDashboardPage />} />
            <Route element={<MainLayout />}>
              <Route path="/" element={<IntroductionPage />} />
              <Route path="/history" element={<HistoryPage />} />
              <Route path="/history/timeline/:slug" element={<HistoryTimelineEventPage />} />
              <Route path="/governance" element={<GovernancePage />} />
              <Route path="/governance/biographies/:slug" element={<GovernanceBiographyPage />} />
              <Route path="/economy" element={<EconomyPage />} />
              <Route path="/commerce" element={<PageView pageKey="commerce" />} />
              <Route path="/culture" element={<CulturePage />} />
              <Route path="/resources" element={<ResourcesPage />} />
              <Route path="/global-perspectives" element={<GlobalPerspectivesPage />} />
              <Route path="/global-perspectives/country" element={<GlobalPerspectivesPage section="country" />} />
              <Route path="/global-perspectives/organization" element={<GlobalPerspectivesPage section="organization" />} />
              <Route path="/reference-bureau" element={<ReferenceBureauPage />} />
              <Route path="/reference-bureau/join" element={<ReferenceBureauPage section="join" />} />
              <Route path="/reference-bureau/questions" element={<ReferenceBureauPage section="questions" />} />
              <Route path="/reference-bureau/entrepreneur" element={<ReferenceBureauPage section="entrepreneur" />} />
              <Route path="/niani" element={<NianiPage />} />
              <Route path="/niani/institutions" element={<NianiInstitutionsPage />} />
              <Route path="/niani/architectural-projects" element={<NianiArchitecturalProjectsPage />} />
              <Route path="/niani/niani-tv" element={<NianiPage section="niani-tv" />} />
              <Route path="/academy" element={<AcademyPage />} />
              <Route path="/academy/nko" element={<AcademyPage section="nko" />} />
              <Route path="/academy/history-courses" element={<AcademyPage section="history-courses" />} />
              <Route path="/academy/others" element={<AcademyPage section="others" />} />
              <Route path="/intranet" element={<IntranetPage />} />
              <Route path="/content/:slug" element={<ContentPage />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </I18nProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
