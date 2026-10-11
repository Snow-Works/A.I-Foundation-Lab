// src/pages/NotFound.jsx
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Button from "../components/ui/Button.jsx";
import Card from "../components/ui/Card.jsx";

export default function NotFound() {
    return (
        <section className="section">
            <div className="container-narrow">
                <Card variant="glass" size="lg" style={{ textAlign: "center" }}>
                    <p className="type-caption" style={{ marginBottom: "var(--space-3)" }}>
                        404
                    </p>
                    <h1
                        className="type-h2"
                        style={{ color: "var(--white)", marginBottom: "var(--space-4)" }}
                    >
                        Page not found
                    </h1>
                    <p className="type-body" style={{ marginBottom: "var(--space-6)" }}>
                        The page you're looking for doesn't exist. It may have moved, or
                        you may have mistyped the URL.
                    </p>
                    <Button
                        variant="primary"
                        leftIcon={<ArrowLeft size={16} />}
                        as={Link}
                        to="/"
                    >
                        Back to home
                    </Button>
                </Card>
            </div>
        </section>
    );
}