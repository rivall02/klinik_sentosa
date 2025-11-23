import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  DollarSign,
  BarChart,
  Settings,
  Pill,
} from "lucide-react";

const OwnerSidebar = () => {
  const navLinks = [
    { to: "/owner", icon: LayoutDashboard, label: "Dashboard Utama" },
    { to: "/owner/staff-management", icon: Users, label: "Manajemen Staff" },
    { to: "/owner/financial-reports", icon: DollarSign, label: "Laporan Keuangan" },
    { to: "/owner/analytics", icon: BarChart, label: "Analitik & Performa" },
    { to: "/owner/reports", icon: BarChart, label: "Laporan" },
    { to: "/owner/medication-management", icon: Pill, label: "Kelola Obat" },
    { to: "/owner/settings", icon: Settings, label: "Pengaturan Klinik" },
  ];

  return (
    <aside className="w-64 bg-card border-r border-border p-4">
      <h2 className="text-xl font-bold mb-8">Owner Menu</h2>
      <nav className="flex flex-col gap-2">
        {navLinks.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === "/owner"}
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

export default OwnerSidebar;
