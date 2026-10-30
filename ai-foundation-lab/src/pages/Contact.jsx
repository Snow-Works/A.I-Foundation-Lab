// src/pages/Contact.jsx
import { Mail, Send } from "lucide-react";
import Card from "../components/ui/Card.jsx";
import Button from "../components/ui/Button.jsx";
import "./InfoPages.css";

export default function Contact() {
  return (
    <section className="info-page section">
      <div className="container info-page__container">
        <header className="info-page__header">
          <h1 className="type-h1 info-page__title">Contact Us</h1>
          <p className="type-body-lg info-page__subtitle">
            Have a question? We are here to help.
          </p>
        </header>

        <Card variant="glass" size="lg" glow="cyan" style={{ textAlign: "center", padding: "var(--space-8)" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "var(--space-5)" }}>
            <div style={{ width: 64, height: 64, borderRadius: "50%", background: "rgba(46, 200, 255, 0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--cyan-400)" }}>
              <Mail size={32} />
            </div>
            
            <div>
              <h2 className="type-h3" style={{ color: "var(--white)", marginBottom: "var(--space-2)" }}>Email Support</h2>
              <p className="type-body" style={{ margin: 0 }}>
                For technical issues, billing, or admissions inquiries:
              </p>
              <a href="mailto:hello@aifoundationlab.com" className="type-h4" style={{ color: "var(--cyan-400)", textDecoration: "none", display: "block", marginTop: "var(--space-2)" }}>
                hello@aifoundationlab.com
              </a>
            </div>

            <div style={{ width: "100%", height: 1, background: "var(--glass-border)", margin: "var(--space-2) 0" }} />

            <div>
              <h2 className="type-h4" style={{ color: "var(--white)", marginBottom: "var(--space-2)" }}>Join the Community</h2>
              <p className="type-body" style={{ marginBottom: "var(--space-4)" }}>
                The fastest way to get a response is through our Telegram group.
              </p>
              <Button variant="primary" size="lg" leftIcon={<Send size={16} />} as="a" href="#" target="_blank">
                Open Telegram
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}