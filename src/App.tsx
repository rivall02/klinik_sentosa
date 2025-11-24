import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { supabase } from "./lib/supabaseClient";
import { Session } from "@supabase/supabase-js";

import ProtectedRoute from "./components/auth/ProtectedRoute";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Queue from "./pages/Queue";
import DoctorQueue from "./pages/DoctorQueue";
import PharmacistDashboard from "./pages/PharmacistDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import PatientVerification from "./pages/admin/PatientVerification";
import PatientData from "./pages/admin/PatientData"; // Import the new component
import QueueManagement from "./pages/admin/QueueManagement";
import AdminReports from "./pages/admin/Reports";
import DoctorDashboard from "./pages/DoctorDashboard";
import DoctorDashboardHome from "./pages/doctor/Dashboard";
import Schedule from "./pages/doctor/Schedule";
import Consultation from "./pages/doctor/Consultation";
import OwnerDashboard from "./pages/OwnerDashboard";
import OwnerMainDashboard from "./pages/owner/OwnerMainDashboard";
import StaffManagement from "./pages/owner/StaffManagement";
import FinancialReports from "./pages/owner/FinancialReports";
import Analytics from "./pages/owner/Analytics";
import OwnerReports from "./pages/owner/Reports";
import Settings from "./pages/owner/Settings";
import MedicationManagement from "./pages/owner/MedicationManagement";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setLoading(false);
    };

    fetchSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Atau tampilkan spinner
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Rute Publik */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/queue" element={<Queue />} />

            {/* Rute Terlindungi */}
            <Route element={<ProtectedRoute session={session} />}>
              <Route path="/staff/doctor-queue" element={<DoctorQueue />} />
              <Route path="/pharmacist" element={<PharmacistDashboard />} />
              
              <Route path="/admin" element={<AdminDashboard />}>
                <Route index element={<PatientVerification />} />
                <Route path="patient-verification" element={<PatientVerification />} />
                <Route path="patient-data" element={<PatientData />} />
                <Route path="queue-management" element={<QueueManagement />} />
                <Route path="reports" element={<AdminReports />} />
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
                <Route path="reports" element={<OwnerReports />} />
                <Route path="medication-management" element={<MedicationManagement />} />
                <Route path="settings" element={<Settings />} />
              </Route>
            </Route>

            {/* Rute Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
