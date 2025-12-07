import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { TranslationProvider } from "@/contexts/TranslationContext";
import { LanguageSync } from "@/components/LanguageSync";
import { AutoTranslate } from "@/components/AutoTranslate";
import { ProtectedRoute } from "@/components/ProtectedRoute";

import WelcomePage from "./pages/WelcomePage";
import LanguagePage from "./pages/LanguagePage";
import RoleSelectPage from "./pages/RoleSelectPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
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
    <TranslationProvider>
      <AuthProvider>
        <LanguageSync />
        <AutoTranslate />
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<WelcomePage />} />
              <Route path="/language" element={<LanguagePage />} />
              <Route path="/role-select" element={<RoleSelectPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/forgot-number" element={<ForgotNumberPage />} />
              <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
              <Route path="/forum" element={<ProtectedRoute><ForumPage /></ProtectedRoute>} />
              <Route path="/forum/:id" element={<ProtectedRoute><ForumPage /></ProtectedRoute>} />
              <Route path="/ask-expert" element={<ProtectedRoute><AskExpertPage /></ProtectedRoute>} />
              <Route path="/expert-questions" element={<ProtectedRoute allowedRoles={['expert']}><AskExpertPage /></ProtectedRoute>} />
              <Route path="/chat" element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />
              <Route path="/knowledge" element={<ProtectedRoute><KnowledgePage /></ProtectedRoute>} />
              <Route path="/schemes" element={<ProtectedRoute><SchemesPage /></ProtectedRoute>} />
              <Route path="/manage-schemes" element={<ProtectedRoute allowedRoles={['government']}><SchemesPage /></ProtectedRoute>} />
              <Route path="/schemes/new" element={<ProtectedRoute allowedRoles={['government']}><CreateSchemePage /></ProtectedRoute>} />
              <Route path="/manage-advisories" element={<ProtectedRoute allowedRoles={['government']}><SchemesPage /></ProtectedRoute>} />
              <Route path="/weather" element={<ProtectedRoute><WeatherPage /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />

              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </TranslationProvider>
  </QueryClientProvider>
);

export default App;
