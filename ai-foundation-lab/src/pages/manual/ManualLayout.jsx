// src/pages/manual/ManualLayout.jsx
import { NavLink, Outlet } from "react-router-dom";
import { BookOpen, Rocket, MonitorPlay, ShieldAlert, LifeBuoy } from "lucide-react";
import "./ManualLayout.css";

const links = [
  { to: "/manual", end: true, label: "Welcome to the Lab", icon: BookOpen },
  { to: "/manual/student-journey", label: "The Student Journey", icon: Rocket },
  { to: "/manual/exam-environment", label: "The Exam Environment", icon: MonitorPlay },
  { to: "/manual/rules-proctoring", label: "Rules & Proctoring", icon: ShieldAlert },
  { to: "/manual/emergency", label: "Emergency Protocol", icon: LifeBuoy },
];

export default function ManualLayout() {
  return (
    <div className="container">
      <div className="manual-layout">
        <aside className="manual-sidebar">
          <p className="manual-sidebar__title">Lab Manual</p>
          {links.map(({ to, end, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `manual-link ${isActive ? "manual-link--active" : ""}`
              }
            >
              <Icon size={16} />
              <span>{label}</span>
            </NavLink>
          ))}
        </aside>

        <div className="manual-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}