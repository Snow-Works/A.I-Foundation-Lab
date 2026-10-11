// src/pages/style-guide/StyleGuideLayout.jsx
import { NavLink, Outlet } from "react-router-dom";
import { Compass, Palette, Layers, Sparkles } from "lucide-react";
import "./StyleGuideLayout.css";

const links = [
    { to: "/style-guide", end: true, label: "Overview", icon: Compass },
    { to: "/style-guide/foundations", label: "Foundations", icon: Palette },
    { to: "/style-guide/components", label: "Components", icon: Layers },
    { to: "/style-guide/patterns", label: "Patterns", icon: Sparkles },
];

export default function StyleGuideLayout() {
    return (
        <div className="container">
            <div className="sg-layout">
                <aside className="sg-sidebar">
                    <p className="sg-sidebar__title">Style guide</p>
                    {links.map(({ to, end, label, icon: Icon }) => (
                        <NavLink
                            key={to}
                            to={to}
                            end={end}
                            className={({ isActive }) =>
                                `sg-link ${isActive ? "sg-link--active" : ""}`
                            }
                        >
                            <Icon size={16} />
                            <span>{label}</span>
                        </NavLink>
                    ))}
                </aside>

                <div className="sg-content">
                    <Outlet />
                </div>
            </div>
        </div>
    );
}