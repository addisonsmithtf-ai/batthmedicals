import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from './hooks/useAuth';
import Auth from './pages/Auth';
import StaffDashboard from './pages/StaffDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppRoutes = () => {
  const { user, userRole, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={
        user ? (
          <Navigate to={userRole === 'admin' ? '/admin' : '/staff'} replace />
        ) : (
          <Index />
        )
      } />
      <Route path="/auth" element={
        user ? (
          <Navigate to={userRole === 'admin' ? '/admin' : '/staff'} replace />
        ) : (
          <Auth />
        )
      } />
      <Route path="/staff" element={
        user && userRole === 'staff' ? (
          <StaffDashboard />
        ) : (
          <Navigate to="/auth" replace />
        )
      } />
      <Route path="/admin" element={
        user && userRole === 'admin' ? (
          <AdminDashboard />  
        ) : (
          <Navigate to="/auth" replace />
        )
      } />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
