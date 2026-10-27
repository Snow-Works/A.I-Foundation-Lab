// src/components/ui/ErrorBoundary.jsx
import { Component } from "react";
import Card from "./Card.jsx";
import Button from "./Button.jsx";

/**
 * ErrorBoundary — catches render errors and shows a recovery UI
 * instead of a blank white screen.
 *
 * Usage:
 *   <ErrorBoundary>
 *     <App />
 *   </ErrorBoundary>
 *
 * Notes:
 *   - Class component is required by React's error boundary API.
 *   - Only catches errors during rendering, lifecycle, and constructors.
 *     It will NOT catch async errors, event handlers, or SSR.
 *   - In DEV, shows the error stack for debugging.
 *   - In PROD, shows a friendly message.
 */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("[ErrorBoundary] Caught error:", error, errorInfo);
    if (typeof this.props.onError === "function") {
      try {
        this.props.onError(error, errorInfo);
      } catch (_) {
        // Never throw from the error handler itself
      }
    }
  }

  handleReload = () => {
    window.location.reload();
  };

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      const isDev = import.meta.env.DEV;
      const errorDetails = isDev
        ? String(this.state.error?.stack || this.state.error || "")
        : "";

      return (
        <section className="section">
          <div className="container-narrow">
            <Card variant="glass" size="lg" style={{ textAlign: "center" }}>
              <h1
                className="type-h2"
                style={{ color: "var(--white)", marginBottom: "var(--space-4)" }}
              >
                Something went wrong
              </h1>
              <p
                className="type-body"
                style={{ marginBottom: "var(--space-6)" }}
              >
                An unexpected error occurred. Your saved work is not affected.
                Reload the page to continue.
              </p>

              {isDev && errorDetails && (
                <pre
                  style={{
                    textAlign: "left",
                    background: "rgba(0, 0, 0, 0.35)",
                    padding: "var(--space-3)",
                    borderRadius: "var(--radius-md)",
                    fontSize: "var(--fs-xs)",
                    fontFamily: "ui-monospace, monospace",
                    color: "var(--silver)",
                    overflow: "auto",
                    maxHeight: 260,
                    marginBottom: "var(--space-4)",
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                  }}
                >
                  {errorDetails}
                </pre>
              )}

              <div
                style={{
                  display: "flex",
                  gap: "var(--space-3)",
                  justifyContent: "center",
                  flexWrap: "wrap",
                }}
              >
                <Button
                  variant="secondary"
                  size="md"
                  onClick={this.handleReset}
                >
                  Try again
                </Button>
                <Button
                  variant="primary"
                  size="md"
                  onClick={this.handleReload}
                >
                  Reload page
                </Button>
              </div>
            </Card>
          </div>
        </section>
      );
    }

    return this.props.children;
  }
}