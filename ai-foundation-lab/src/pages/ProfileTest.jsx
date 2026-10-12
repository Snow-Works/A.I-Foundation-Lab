// src/pages/ProfileTest.jsx
import { useAuth } from "../context/AuthContext.jsx";

export default function ProfileTest() {
  const { user } = useAuth();
  return (
    <section className="section">
      <div className="container">
        <h1 className="type-h2" style={{ color: "var(--white)" }}>
          Protected page<br></br><br></br>
           you made it !
        </h1>
        <p className="type-body" style={{ marginTop: "var(--space-4)" }}>
          Signed in as <strong style={{ color: "var(--cyan-400)" }}>{user?.email}</strong>
        </p>
      </div>
    </section>
  );
}