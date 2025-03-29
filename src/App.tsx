
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Unauthorized from "./pages/Unauthorized";
import { ThemeProvider } from "./hooks/use-theme";
import { AuthProvider } from "./hooks/use-auth";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminLayout from "./components/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import TeachersManagement from "./pages/admin/TeachersManagement";
import StudentsManagement from "./pages/admin/StudentsManagement";
import CoursesManagement from "./pages/admin/CoursesManagement";
import Settings from "./pages/admin/Settings";

const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider defaultTheme="system">
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/unauthorized" element={<Unauthorized />} />
              
              {/* Admin Routes - Protected */}
              <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                <Route element={<AdminLayout />}>
                  <Route path="/admin" element={<AdminDashboard />} />
                  <Route path="/admin/teachers" element={<TeachersManagement />} />
                  <Route path="/admin/students" element={<StudentsManagement />} />
                  <Route path="/admin/courses" element={<CoursesManagement />} />
                  <Route path="/admin/settings" element={<Settings />} />
                </Route>
              </Route>
              
              {/* Catch all */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
