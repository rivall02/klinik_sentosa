import OwnerSidebar from "@/components/owner/Sidebar";
import { Outlet } from "react-router-dom";

const OwnerDashboard = () => {
  return (
    <div className="flex min-h-screen">
      <OwnerSidebar />
      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default OwnerDashboard;
