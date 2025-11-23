import { NavLink } from "react-router-dom";
import { LayoutDashboard, Calendar, Stethoscope } from "lucide-react";

const DoctorSidebar = () => {
  const navLinks = [
    { to: "/doctor", icon: LayoutDashboard, label: "Dashboard" },
    { to: "/doctor/schedule", icon: Calendar, label: "Manajemen Jadwal" },
    { to: "/doctor/queue", icon: Stethoscope, label: "Konsultasi" },
  ];

  return (
    <aside className="w-64 bg-card border-r border-border p-4">
      <h2 className="text-xl font-bold mb-8">Dokter Menu</h2>
      <nav className="flex flex-col gap-2">
        {navLinks.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === "/doctor"}
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

export default DoctorSidebar;
