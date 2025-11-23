import OwnerSidebar from "@/components/owner/Sidebar";
import { Outlet, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const OwnerDashboard = () => {
  return (
    <div className="flex min-h-screen">
      <OwnerSidebar />
      <main className="flex-1 p-8">
        <Button asChild className="mb-4">
          <Link to="/">Kembali</Link>
        </Button>
        <Outlet />
      </main>
    </div>
  );
};

export default OwnerDashboard;
