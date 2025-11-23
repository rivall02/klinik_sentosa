import Sidebar from "@/components/ui/sidebar";
import { Outlet, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const AdminDashboard = () => {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-8">
        <Button asChild>
          <Link to="/">Kembali</Link>
        </Button>
        <Outlet />
      </main>
    </div>
  );
};

export default AdminDashboard;
