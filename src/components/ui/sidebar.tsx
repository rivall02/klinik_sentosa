import { NavLink } from "react-router-dom";
import { Users, ClipboardList, BarChart2, UserPlus } from "lucide-react";

const Sidebar = () => {
  const navLinks = [
    { to: "/register", icon: UserPlus, label: "Tambah Pasien" },
    { to: "/admin/patient-verification", icon: Users, label: "Verifikasi Pasien" },
    { to: "/admin/queue-management", icon: ClipboardList, label: "Manajemen Antrian" },
    { to: "/admin/reports", icon: BarChart2, label: "Laporan" },
  ];

  return (
    <aside className="w-64 bg-card border-r border-border p-4">
      <h2 className="text-xl font-bold mb-8">Admin Menu</h2>
      <nav className="flex flex-col gap-2">
        {navLinks.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-md transition-colors ${
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted"
              }`
            }
          >
            <link.icon className="w-5 h-5" />
            <span>{link.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;