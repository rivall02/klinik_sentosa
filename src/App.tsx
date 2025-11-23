import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Queue from "./pages/Queue";
import StaffDashboard from "./pages/StaffDashboard";
import DoctorQueue from "./pages/DoctorQueue";
import PharmacistDashboard from "./pages/PharmacistDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import PatientVerification from "./pages/admin/PatientVerification";
import QueueManagement from "./pages/admin/QueueManagement";
import Reports from "./pages/admin/Reports";
import DoctorDashboard from "./pages/DoctorDashboard";
import DoctorDashboardHome from "./pages/doctor/Dashboard";
import Schedule from "./pages/doctor/Schedule";
import Consultation from "./pages/doctor/Consultation";
import OwnerDashboard from "./pages/OwnerDashboard";
import OwnerMainDashboard from "./pages/owner/OwnerMainDashboard";
import StaffManagement from "./pages/owner/StaffManagement";
import FinancialReports from "./pages/owner/FinancialReports";
import Analytics from "./pages/owner/Analytics";
import Settings from "./pages/owner/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/queue" element={<Queue />} />
          <Route path="/staff" element={<StaffDashboard />} />
          <Route path="/staff/doctor-queue" element={<DoctorQueue />} />
          <Route path="/pharmacist" element={<PharmacistDashboard />} />
          
          <Route path="/admin" element={<AdminDashboard />}>
            <Route index element={<PatientVerification />} />
            <Route path="patient-verification" element={<PatientVerification />} />
            <Route path="queue-management" element={<QueueManagement />} />
            <Route path="reports" element={<Reports />} />
          </Route>

          <Route path="/doctor" element={<DoctorDashboard />}>
            <Route index element={<DoctorDashboardHome />} />
            <Route path="schedule" element={<Schedule />} />
            <Route path="queue" element={<DoctorQueue />} />
            <Route path="consultation/:patientId" element={<Consultation />} />
          </Route>

          <Route path="/owner" element={<OwnerDashboard />}>
            <Route index element={<OwnerMainDashboard />} />
            <Route path="staff-management" element={<StaffManagement />} />
            <Route path="financial-reports" element={<FinancialReports />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="settings" element={<Settings />} />
          </Route>

          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
