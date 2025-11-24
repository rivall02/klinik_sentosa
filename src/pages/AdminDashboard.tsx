import Sidebar from "@/components/ui/sidebar";
import { Outlet, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabaseClient";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      // App.tsx akan mendeteksi perubahan sesi dan menampilkan halaman Login
      navigate('/'); 
    } else {
      console.error('Error logging out:', error.message);
    }
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-8">
        <div className="flex gap-4 mb-4">
          <Button asChild>
            <Link to="/">Kembali</Link>
          </Button>
          <Button variant="outline" onClick={handleLogout}>
            Logout
          </Button>
        </div>
        <Outlet />
      </main>
    </div>
  );
};

export default AdminDashboard;
