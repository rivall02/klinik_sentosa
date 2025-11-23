import DoctorSidebar from "@/components/doctor/Sidebar";
import { Outlet, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const DoctorDashboard = () => {
  return (
    <div className="flex min-h-screen">
      <DoctorSidebar />
      <main className="flex-1 p-8">
        <Button asChild>
          <Link to="/">Kembali</Link>
        </Button>
        <Outlet />
      </main>
    </div>
  );
};

export default DoctorDashboard;
