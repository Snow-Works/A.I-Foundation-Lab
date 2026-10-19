// src/pages/admin/AdminRoster.jsx
import { useState, useEffect, useCallback, useRef } from "react";
import {
  Upload,
  Trash2,
  Search,
  Loader2,
  AlertTriangle,
  CheckCircle2,
  X,
  FileText,
  RefreshCw,
} from "lucide-react";
import { parseRosterCSV } from "../../lib/csvParser.js";
import {
  listRoster,
  uploadRoster,
  deleteRosterEntry,
  clearAllRoster,
} from "../../services/adminRosterService.js";
import Card from "../../components/ui/Card.jsx";
import Button from "../../components/ui/Button.jsx";
import AlertModal from "../../components/ui/AlertModal.jsx";
import "./AdminRoster.css";

const PREVIEW_LIMIT = 10;

export default function AdminRoster() {
  const fileInputRef = useRef(null);

  const [roster, setRoster] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [page, setPage] = useState(1);
  const [perPage] = useState(50);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Upload flow
  const [parsedEntries, setParsedEntries] = useState(null);
  const [parseErrors, setParseErrors] = useState([]);
  const [fileName, setFileName] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);

  // Delete
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [clearAllOpen, setClearAllOpen] = useState(false);
  const [actionPending, setActionPending] = useState(false);

  const fetchRoster = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const result = await listRoster({ page, perPage, search });
      setRoster(result.items);
      setTotalItems(result.totalItems);
      setTotalPages(result.totalPages);
    } catch (err) {
      console.error("[admin-roster] fetch error:", err);
      setError(err?.response?.message || "Could not load roster.");
    } finally {
      setLoading(false);
    }
  }, [page, perPage, search]);

  useEffect(() => {
    fetchRoster();
  }, [fetchRoster]);

  /* ---------- CSV parsing ---------- */
  const handleFileSelected = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadResult(null);
    setParseErrors([]);
    setParsedEntries(null);

    if (file.size > 5 * 1024 * 1024) {
      setParseErrors(["File is larger than 5 MB. Split it into smaller batches."]);
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = () => {
      const text = String(reader.result || "");
      const { entries, errors } = parseRosterCSV(text);
      setParsedEntries(entries);
      setParseErrors(errors);
    };
    reader.onerror = () => {
      setParseErrors(["Could not read the file."]);
    };
    reader.readAsText(file);

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleUpload = async () => {
    if (!parsedEntries || parsedEntries.length === 0) return;
    setUploading(true);
    setError("");
    try {
      const result = await uploadRoster(parsedEntries);
      setUploadResult(result);
      setParsedEntries(null);
      setFileName("");
      setPage(1);
      await fetchRoster();
    } catch (err) {
      console.error("[admin-roster] upload error:", err);
      setError(
        err?.response?.message || err?.message || "Upload failed."
      );
    } finally {
      setUploading(false);
    }
  };

  const cancelUpload = () => {
    setParsedEntries(null);
    setParseErrors([]);
    setFileName("");
  };

  /* ---------- Delete ---------- */
  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setActionPending(true);
    try {
      await deleteRosterEntry(deleteTarget.id);
      setDeleteTarget(null);
      await fetchRoster();
    } catch (err) {
      console.error("[admin-roster] delete error:", err);
      setError(err?.response?.message || "Could not delete entry.");
    } finally {
      setActionPending(false);
    }
  };

  const confirmClearAll = async () => {
    setActionPending(true);
    try {
      const deleted = await clearAllRoster();
      setClearAllOpen(false);
      setPage(1);
      await fetchRoster();
      console.log("[admin-roster] cleared", deleted, "entries");
    } catch (err) {
      console.error("[admin-roster] clear-all error:", err);
      setError(err?.response?.message || "Could not clear roster.");
    } finally {
      setActionPending(false);
    }
  };

  /* ---------- Search ---------- */
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    setSearch(searchInput);
  };

  const startIdx = totalItems === 0 ? 0 : (page - 1) * perPage + 1;
  const endIdx = Math.min(page * perPage, totalItems);

  return (
    <div className="admin-roster">
      <header className="admin-roster__header">
        <div>
          <h1 className="admin-roster__title">Roster</h1>
          <p className="admin-roster__subtitle">
            Pre-approved student names. When roster matching is enabled in
            Settings, only students on this list can register.
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          leftIcon={<RefreshCw size={14} />}
          onClick={fetchRoster}
          disabled={loading}
        >
          Refresh
        </Button>
      </header>

      {/* ---------- UPLOAD ---------- */}
      <Card variant="glass" size="md" className="admin-roster__upload-card">
        <div className="admin-roster__upload-head">
          <div className="admin-roster__upload-icon">
            <Upload size={20} />
          </div>
          <div>
            <h2 className="admin-roster__upload-title">Upload CSV</h2>
            <p className="admin-roster__upload-desc">
              Columns: <code>first_name</code>, <code>middle_name</code>{" "}
              (optional), <code>surname</code>, <code>batch</code>{" "}
              (optional), <code>notes</code> (optional).
            </p>
          </div>
        </div>

        <div className="admin-roster__upload-actions">
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,text/csv"
            onChange={handleFileSelected}
            style={{ display: "none" }}
          />
          <Button
            variant="secondary"
            size="md"
            leftIcon={<FileText size={16} />}
            onClick={() => fileInputRef.current?.click()}
          >
            Select CSV file
          </Button>
          {fileName && (
            <span className="admin-roster__filename">{fileName}</span>
          )}
        </div>

        {/* Parse errors */}
        {parseErrors.length > 0 && (
          <div className="admin-roster__parse-errors">
            <AlertTriangle size={16} />
            <div>
              <strong>Parsing issues</strong>
              <ul>
                {parseErrors.slice(0, 5).map((e, i) => (
                  <li key={i}>{e}</li>
                ))}
                {parseErrors.length > 5 && (
                  <li>…and {parseErrors.length - 5} more</li>
                )}
              </ul>
            </div>
          </div>
        )}

        {/* Preview */}
        {parsedEntries && parsedEntries.length > 0 && (
          <div className="admin-roster__preview">
            <div className="admin-roster__preview-head">
              <strong>
                {parsedEntries.length} entr
                {parsedEntries.length === 1 ? "y" : "ies"} ready to upload
              </strong>
              <button
                type="button"
                className="admin-roster__cancel"
                onClick={cancelUpload}
                aria-label="Cancel upload"
              >
                <X size={16} />
              </button>
            </div>

            <div className="admin-roster__preview-table-wrap">
              <table className="admin-roster__preview-table">
                <thead>
                  <tr>
                    <th>First name</th>
                    <th>Middle</th>
                    <th>Surname</th>
                    <th>Batch</th>
                    <th>Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {parsedEntries.slice(0, PREVIEW_LIMIT).map((entry, i) => (
                    <tr key={i}>
                      <td>{entry.first_name}</td>
                      <td>{entry.middle_name}</td>
                      <td>{entry.surname}</td>
                      <td>{entry.batch}</td>
                      <td>{entry.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {parsedEntries.length > PREVIEW_LIMIT && (
              <p className="admin-roster__preview-more">
                …and {parsedEntries.length - PREVIEW_LIMIT} more rows
              </p>
            )}

            <div className="admin-roster__preview-actions">
              <Button
                variant="primary"
                size="md"
                onClick={handleUpload}
                loading={uploading}
                leftIcon={<Upload size={16} />}
              >
                {uploading ? "Uploading…" : `Upload ${parsedEntries.length}`}
              </Button>
            </div>
          </div>
        )}

        {/* Upload result */}
        {uploadResult && (
          <div className="admin-roster__upload-result">
            <CheckCircle2 size={18} />
            <div>
              <strong>Upload complete</strong>
              <p>
                Created: {uploadResult.created} · Skipped:{" "}
                {uploadResult.skipped}
              </p>
            </div>
          </div>
        )}
      </Card>

      {/* ---------- EXISTING ROSTER ---------- */}
      <div className="admin-roster__list-section">
        <div className="admin-roster__list-head">
          <h2 className="admin-roster__list-title">
            Roster ({totalItems})
          </h2>
          <form className="admin-roster__search" onSubmit={handleSearchSubmit}>
            <Search size={14} className="admin-roster__search-icon" />
            <input
              type="text"
              className="admin-roster__search-input"
              placeholder="Search name or batch…"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </form>
          {totalItems > 0 && (
            <Button
              variant="ghost"
              size="sm"
              leftIcon={<Trash2 size={14} />}
              onClick={() => setClearAllOpen(true)}
              style={{ color: "#FF6B6B" }}
            >
              Clear all
            </Button>
          )}
        </div>

        {error && (
          <div className="admin-roster__error">
            <AlertTriangle size={14} />
            <span>{error}</span>
          </div>
        )}

        <Card variant="glass" size="md" className="admin-roster__list-card">
          {loading ? (
            <div className="admin-roster__loading">
              <Loader2 size={22} className="admin-roster__spinner" />
              <span>Loading…</span>
            </div>
          ) : roster.length === 0 ? (
            <div className="admin-roster__empty">
              <FileText size={28} />
              <p>No entries in the roster yet.</p>
            </div>
          ) : (
            <div className="admin-roster__table-wrap">
              <table className="admin-roster__table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Batch</th>
                    <th>Notes</th>
                    <th aria-label="Actions"></th>
                  </tr>
                </thead>
                <tbody>
                  {roster.map((r) => (
                    <tr key={r.id}>
                      <td>
                        <span className="admin-roster__name">
                          {[r.first_name, r.middle_name, r.surname]
                            .filter(Boolean)
                            .join(" ")}
                        </span>
                      </td>
                      <td>{r.batch || "—"}</td>
                      <td className="admin-roster__notes">
                        {r.notes || "—"}
                      </td>
                      <td>
                        <button
                          type="button"
                          className="admin-roster__delete-btn"
                          onClick={() => setDeleteTarget(r)}
                          aria-label="Delete entry"
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        {!loading && totalItems > 0 && (
          <div className="admin-roster__pagination">
            <span>
              Showing {startIdx}–{endIdx} of {totalItems}
            </span>
            <div className="admin-roster__pagination-buttons">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
              >
                ←
              </button>
              <span>
                {page} / {totalPages}
              </span>
              <button
                type="button"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
              >
                →
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ---------- CONFIRM DELETE ---------- */}
      <AlertModal
        open={!!deleteTarget}
        onClose={() => !actionPending && setDeleteTarget(null)}
        tone="danger"
        title="Delete this entry?"
        description={
          deleteTarget
            ? `${deleteTarget.first_name} ${deleteTarget.surname} will be removed from the roster.`
            : ""
        }
        confirmLabel={actionPending ? "Deleting…" : "Delete"}
        onConfirm={confirmDelete}
        showCancel
        closeOnBackdrop={!actionPending}
        closeOnEsc={!actionPending}
      />

      {/* ---------- CONFIRM CLEAR ALL ---------- */}
      <AlertModal
        open={clearAllOpen}
        onClose={() => !actionPending && setClearAllOpen(false)}
        tone="danger"
        title="Clear the entire roster?"
        description={`All ${totalItems} roster entries will be permanently deleted. This cannot be undone.`}
        confirmLabel={actionPending ? "Clearing…" : "Delete everything"}
        onConfirm={confirmClearAll}
        showCancel
        closeOnBackdrop={!actionPending}
        closeOnEsc={!actionPending}
      />
    </div>
  );
}