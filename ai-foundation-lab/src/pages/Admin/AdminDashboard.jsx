// src/pages/admin/AdminDashboard.jsx
import Card from "../../components/ui/Card.jsx";
import PillTab from "../../components/ui/PillTab.jsx";

export default function AdminDashboard() {
  return (
    <div className="admin-dashboard">
      <h1 className="type-h2" style={{ color: "var(--white)", marginBottom: "var(--space-6)" }}>
        Overview
      </h1>
      
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "var(--space-4)" }}>
        <Card variant="glass" size="md" withTab>
          <PillTab floating position="left" variant="default">Users</PillTab>
          <p className="type-body">Total registered students will appear here.</p>
        </Card>
        <Card variant="glass" size="md" withTab>
          <PillTab floating position="left" variant="default">Pending</PillTab>
          <p className="type-body">Pending approvals will appear here.</p>
        </Card>
        <Card variant="glass" size="md" withTab>
          <PillTab floating position="left" variant="default">Exams</PillTab>
          <p className="type-body">Submissions requiring marking will appear here.</p>
        </Card>
      </div>
    </div>
  );
}