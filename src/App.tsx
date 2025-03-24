
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { ConsultationProvider } from "@/context/ConsultationContext";
import Layout from "@/components/layout/Layout";
import ProtectedRoute from "@/components/ProtectedRoute";
import { UserRole } from "@/types";

// Pages
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProfilePage from "./pages/ProfilePage";
import NotFound from "./pages/NotFound";

// Patient Pages
import ConsultationsPage from "./pages/patient/ConsultationsPage";
import ConsultationDetailPage from "./pages/patient/ConsultationDetailPage";
import NewConsultationPage from "./pages/patient/NewConsultationPage";

// Doctor Pages
import DoctorConsultationsPage from "./pages/doctor/ConsultationsPage";
import DoctorConsultationDetailPage from "./pages/doctor/ConsultationDetailPage";

// Admin Pages
import AdminDoctorsPage from "./pages/admin/DoctorsPage";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminConsultationDetailPage from "./pages/admin/ConsultationDetailPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <ConsultationProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Layout>
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                {/* Protected routes for all authenticated users */}
                <Route 
                  path="/profile" 
                  element={
                    <ProtectedRoute>
                      <ProfilePage />
                    </ProtectedRoute>
                  } 
                />

                {/* Patient routes */}
                <Route 
                  path="/consultations" 
                  element={
                    <ProtectedRoute allowedRoles={[UserRole.PATIENT]}>
                      <ConsultationsPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/consultations/:id" 
                  element={
                    <ProtectedRoute allowedRoles={[UserRole.PATIENT]}>
                      <ConsultationDetailPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/new-consultation" 
                  element={
                    <ProtectedRoute allowedRoles={[UserRole.PATIENT]}>
                      <NewConsultationPage />
                    </ProtectedRoute>
                  } 
                />

                {/* Doctor routes */}
                <Route 
                  path="/doctor/consultations" 
                  element={
                    <ProtectedRoute allowedRoles={[UserRole.DOCTOR]}>
                      <DoctorConsultationsPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/doctor/consultations/:id" 
                  element={
                    <ProtectedRoute allowedRoles={[UserRole.DOCTOR]}>
                      <DoctorConsultationDetailPage />
                    </ProtectedRoute>
                  } 
                />

                {/* Admin routes */}
                <Route 
                  path="/admin/doctors" 
                  element={
                    <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
                      <AdminDoctorsPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin/dashboard" 
                  element={
                    <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
                      <AdminDashboard />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin/consultations/:id" 
                  element={
                    <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
                      <AdminConsultationDetailPage />
                    </ProtectedRoute>
                  } 
                />

                {/* Catch-all route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Layout>
          </BrowserRouter>
        </ConsultationProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
