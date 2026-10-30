// src/pages/admin/AdminGate.jsx
import { useState, useEffect, useCallback } from "react";
import { Key, Copy, CheckCircle2, XCircle, Loader2, RefreshCw, AlertTriangle } from "lucide-react";
import { listGateTokens, createGateToken, revokeGateToken } from "../../services/adminGateService.js";
import Card from "../../components/ui/Card.jsx";
import Button from "../../components/ui/Button.jsx";
import { Field, Input } from "../../components/ui/Form.js";
import AlertModal from "../../components/ui/AlertModal.jsx";
import "./AdminGate.css";

export default function AdminGate() {
  // --- State Management ---
  const [tokens, setTokens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Generator Form State
  const [expiryHours, setExpiryHours] = useState(24);
  const [maxUses, setMaxUses] = useState(1);
  const [generating, setGenerating] = useState(false);
  const [generatedLink, setGeneratedLink] = useState("");
  const [copied, setCopied] = useState(false);

  // Revoke Modal State
  const [revokeTarget, setRevokeTarget] = useState(null);
  const [revoking, setRevoking] = useState(false);

  // --- Fetch Tokens on Load ---
  const fetchTokens = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await listGateTokens();
      setTokens(data);
    } catch (err) {
      console.error("[admin-gate] error:", err);
      setError("Failed to load exam gate history.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTokens();
  }, [fetchTokens]);

  // --- Handle Token Generation ---
  const handleGenerate = async (e) => {
    e.preventDefault();
    setGenerating(true);
    setError("");
    setGeneratedLink("");
    setCopied(false);

    try {
      const record = await createGateToken(expiryHours, maxUses);
      // Build the URL using the PocketBase record ID
      const url = `${window.location.origin}/#/exam-gate?id=${record.id}`;
      setGeneratedLink(url);
      await fetchTokens(); // Refresh the history table
    } catch (err) {
      console.error("[admin-gate] generate error:", err);
      setError("Failed to generate a new token.");
    } finally {
      setGenerating(false);
    }
  };

  // --- Handle Clipboard Copy ---
  const handleCopy = () => {
    navigator.clipboard.writeText(generatedLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // --- Handle Revocation ---
  const confirmRevoke = async () => {
    if (!revokeTarget) return;
    setRevoking(true);
    try {
      await revokeGateToken(revokeTarget.id);
      setRevokeTarget(null);
      await fetchTokens(); // Refresh the table
    } catch (err) {
      console.error("[admin-gate] revoke error:", err);
      setError("Failed to revoke the token.");
    } finally {
      setRevoking(false);
    }
  };

  // --- Helper to format dates ---
  const formatDate = (iso) => {
    if (!iso) return "—";
    return new Date(iso).toLocaleString([], { dateStyle: "medium", timeStyle: "short" });
  };

  // --- Helper to determine token status ---
  const getTokenStatus = (token) => {
    if (token.revoked) return { label: "Revoked", cls: "badge--red" };
    if (new Date(token.expires_at) < new Date()) return { label: "Expired", cls: "badge--silver" };
    return { label: "Active", cls: "badge--cyan" };
  };

  return (
    <div className="admin-gate">
      <header className="admin-gate__header">
        <div>
          <h1 className="admin-gate__title">Exam Gate</h1>
          <p className="admin-gate__subtitle">
            Generate secure entry links for students to access the exam.
          </p>
        </div>
      </header>

      {error && (
        <div className="admin-gate__error">
          <AlertTriangle size={16} />
          <span>{error}</span>
        </div>
      )}

      {/* --- GENERATOR SECTION --- */}
      <Card variant="glass" size="lg" withTab glow="pink">
        <h2 className="admin-gate__section-title">Generate New Link</h2>
        <form className="admin-gate__form" onSubmit={handleGenerate}>
          <div className="admin-gate__form-row">
            <Field label="Expiry (Hours)">
              <Input
                type="number"
                min={1}
                max={168}
                value={expiryHours}
                onChange={(e) => setExpiryHours(e.target.value)}
                required
              />
            </Field>
            <Field label="Max Uses">
              <Input
                type="number"
                min={1}
                max={500}
                value={maxUses}
                onChange={(e) => setMaxUses(e.target.value)}
                required
              />
            </Field>
          </div>
          <Button
            type="submit"
            variant="primary"
            size="md"
            leftIcon={<Key size={16} />}
            loading={generating}
          >
            {generating ? "Generating..." : "Generate Link"}
          </Button>
        </form>

        {/* Display Generated Link */}
        {generatedLink && (
          <div className="admin-gate__result">
            <div className="admin-gate__result-label">Link Generated Successfully</div>
            <div className="admin-gate__result-url-box">
              <input
                type="text"
                readOnly
                value={generatedLink}
                className="admin-gate__result-input"
                onClick={(e) => e.target.select()} // Auto-select text on click
              />
              <Button
                variant={copied ? "secondary" : "primary"}
                size="sm"
                leftIcon={copied ? <CheckCircle2 size={14} /> : <Copy size={14} />}
                onClick={handleCopy}
              >
                {copied ? "Copied!" : "Copy"}
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* --- HISTORY TABLE --- */}
      <div className="admin-gate__history-section">
        <div className="admin-gate__history-header">
          <h2 className="admin-gate__section-title">Link History</h2>
          <Button variant="ghost" size="sm" leftIcon={<RefreshCw size={14} />} onClick={fetchTokens} disabled={loading}>
            Refresh
          </Button>
        </div>

        <Card variant="glass" size="md" className="admin-gate__table-card">
          {loading ? (
            <div className="admin-gate__loading">
              <Loader2 size={24} className="admin-gate__spinner" />
              <span>Loading history…</span>
            </div>
          ) : tokens.length === 0 ? (
            <div className="admin-gate__empty">
              <Key size={32} />
              <p>No tokens generated yet.</p>
            </div>
          ) : (
            <div className="admin-gate__table-wrap">
              <table className="admin-gate__table">
                <thead>
                  <tr>
                    <th>Token ID</th>
                    <th>Created</th>
                    <th>Expires</th>
                    <th>Status</th>
                    <th aria-label="Actions"></th>
                  </tr>
                </thead>
                <tbody>
                  {tokens.map((t) => {
                    const status = getTokenStatus(t);
                    return (
                      <tr key={t.id}>
                        <td>
                          <span className="admin-gate__token-id">{t.id}</span>
                        </td>
                        <td>{formatDate(t.created)}</td>
                        <td>{formatDate(t.expires_at)}</td>
                        <td>
                          <span className={`badge ${status.cls}`}>{status.label}</span>
                        </td>
                        <td>
                          {!t.revoked && new Date(t.expires_at) > new Date() && (
                            <button
                              type="button"
                              className="admin-gate__revoke-btn"
                              onClick={() => setRevokeTarget(t)}
                            >
                              <XCircle size={14} /> Revoke
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>

      {/* --- REVOKE CONFIRMATION MODAL --- */}
      <AlertModal
        open={!!revokeTarget}
        onClose={() => !revoking && setRevokeTarget(null)}
        tone="danger"
        title="Revoke this link?"
        description="Students will instantly lose access to this exam link. If they are already inside the exam, their session will not be terminated, but no new students can use this link."
        confirmLabel={revoking ? "Revoking..." : "Revoke Link"}
        onConfirm={confirmRevoke}
        showCancel
        closeOnBackdrop={!revoking}
        closeOnEsc={!revoking}
      />
    </div>
  );
}