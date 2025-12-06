import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";

import WelcomePage from "./pages/WelcomePage";
import LanguagePage from "./pages/LanguagePage";
import RoleSelectPage from "./pages/RoleSelectPage";
import LoginPage from "./pages/LoginPage";
import ForgotNumberPage from "./pages/ForgotNumberPage";
import DashboardPage from "./pages/DashboardPage";
import ForumPage from "./pages/ForumPage";
import AskExpertPage from "./pages/AskExpertPage";
import ChatPage from "./pages/ChatPage";
import KnowledgePage from "./pages/KnowledgePage";
import SchemesPage from "./pages/SchemesPage";
import CreateSchemePage from "./pages/admin/CreateSchemePage";
import WeatherPage from "./pages/WeatherPage";
import ProfilePage from "./pages/ProfilePage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<WelcomePage />} />
            <Route path="/language" element={<LanguagePage />} />
            <Route path="/role-select" element={<RoleSelectPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/forgot-number" element={<ForgotNumberPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/forum" element={<ForumPage />} />
            <Route path="/forum/:id" element={<ForumPage />} />
            <Route path="/ask-expert" element={<AskExpertPage />} />
            <Route path="/expert-questions" element={<AskExpertPage />} />
            <Route path="/chat" element={<ChatPage />} />
            <Route path="/knowledge" element={<KnowledgePage />} />
            <Route path="/schemes" element={<SchemesPage />} />
            <Route path="/manage-schemes" element={<SchemesPage />} />
            <Route path="/schemes/new" element={<CreateSchemePage />} />
            <Route path="/manage-advisories" element={<SchemesPage />} />
            <Route path="/weather" element={<WeatherPage />} />
            <Route path="/profile" element={<ProfilePage />} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
