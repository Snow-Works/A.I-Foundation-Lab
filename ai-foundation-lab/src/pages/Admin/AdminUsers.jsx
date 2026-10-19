// src/pages/admin/AdminUsers.jsx
import { useState, useEffect, useCallback } from "react";
import {
  Search,
  CheckCircle2,
  XCircle,
  ChevronLeft,
  ChevronRight,
  Loader2,
  RefreshCw,
  User as UserIcon,
  Mail,
  Phone,
  Calendar,
  AlertTriangle,
  ShieldCheck,
} from "lucide-react";
import { useAdminAuth } from "../../context/AdminAuthContext.jsx";
import {
  listUsers,
  approveUser,
  rejectUser,
  adminPhotoUrl,
} from "../../services/adminUserService.js";
import Card from "../../components/ui/Card.jsx";
import Button from "../../components/ui/Button.jsx";
import AlertModal from "../../components/ui/AlertModal.jsx";
import { Textarea } from "../../components/ui/Form.js";
import "./AdminUsers.css";

const STATUS_OPTIONS = [
  { value: "all", label: "All" },
  { value: "EMAIL_VERIFIED", label: "Pending approval" },
  { value: "APPROVED", label: "Approved" },
  { value: "PHOTO_VERIFIED", label: "Photo verified" },
  { value: "REJECTED", label: "Rejected" },
];

const STATUS_STYLES = {
  REGISTERED: { label: "Registered", cls: "badge--silver" },
  EMAIL_VERIFIED: { label: "Pending", cls: "badge--orange" },
  APPROVED: { label: "Approved", cls: "badge--cyan" },
  PHOTO_VERIFIED: { label: "Photo verified", cls: "badge--cyan" },
  COMMUNITY_UNLOCKED: { label: "In community", cls: "badge--cyan" },
  IDENTITY_CONFIRMED: { label: "Identity OK", cls: "badge--pink" },
  EXAM_IN_PROGRESS: { label: "Exam in progress", cls: "badge--orange" },
  SUBMITTED: { label: "Submitted", cls: "badge--purple" },
  MARKED: { label: "Marked", cls: "badge--cyan" },
  REJECTED: { label: "Rejected", cls: "badge--red" },
};

function formatDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString(undefined, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function AdminUsers() {
  const { admin } = useAdminAuth();

  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [perPage] = useState(30);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [statusFilter, setStatusFilter] = useState("EMAIL_VERIFIED");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Action modals
  const [approveTarget, setApproveTarget] = useState(null);
  const [rejectTarget, setRejectTarget] = useState(null);
  const [rejectReason, setRejectReason] = useState("");
  const [actionPending, setActionPending] = useState(false);
  const [actionError, setActionError] = useState("");

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const result = await listUsers({
        page,
        perPage,
        search,
        statusFilter,
      });
      setUsers(result.items);
      setTotalItems(result.totalItems);
      setTotalPages(result.totalPages);
    } catch (err) {
      console.error("[admin-users] fetch error:", err);
      setError(err?.response?.message || err?.message || "Failed to load users.");
    } finally {
      setLoading(false);
    }
  }, [page, perPage, search, statusFilter]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    setSearch(searchInput);
  };

  const handleStatusChange = (value) => {
    setStatusFilter(value);
    setPage(1);
  };

  const openApprove = (user) => {
    setActionError("");
    setApproveTarget(user);
  };

  const openReject = (user) => {
    setActionError("");
    setRejectReason("");
    setRejectTarget(user);
  };

  const confirmApprove = async () => {
    if (!approveTarget) return;
    setActionPending(true);
    setActionError("");
    try {
      await approveUser(approveTarget.id, admin.id);
      setApproveTarget(null);
      await fetchUsers();
    } catch (err) {
      console.error("[admin-users] approve error:", err);
      setActionError(err?.response?.message || "Could not approve this user.");
    } finally {
      setActionPending(false);
    }
  };

  const confirmReject = async () => {
    if (!rejectTarget) return;
    setActionPending(true);
    setActionError("");
    try {
      await rejectUser(rejectTarget.id, admin.id, rejectReason.trim());
      setRejectTarget(null);
      await fetchUsers();
    } catch (err) {
      console.error("[admin-users] reject error:", err);
      setActionError(err?.response?.message || "Could not reject this user.");
    } finally {
      setActionPending(false);
    }
  };

  const canApprove = (user) =>
    ["REGISTERED", "EMAIL_VERIFIED", "REJECTED"].includes(user.status);

  const canReject = (user) =>
    ["EMAIL_VERIFIED", "APPROVED"].includes(user.status);

  const startIdx = totalItems === 0 ? 0 : (page - 1) * perPage + 1;
  const endIdx = Math.min(page * perPage, totalItems);

  return (
    <div className="admin-users">
      <header className="admin-users__header">
        <div>
          <h1 className="admin-users__title">Users</h1>
          <p className="admin-users__subtitle">
            Review registrations and approve students into the guild.
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          leftIcon={<RefreshCw size={14} />}
          onClick={fetchUsers}
          disabled={loading}
        >
          Refresh
        </Button>
      </header>

      {/* Filters */}
      <div className="admin-users__filters">
        <form
          className="admin-users__search"
          onSubmit={handleSearchSubmit}
        >
          <Search size={16} className="admin-users__search-icon" />
          <input
            type="text"
            className="admin-users__search-input"
            placeholder="Search by name or email…"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          <button
            type="submit"
            className="admin-users__search-submit"
          >
            Search
          </button>
        </form>

        <div className="admin-users__chips">
          {STATUS_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              className={`admin-users__chip ${
                statusFilter === opt.value ? "admin-users__chip--active" : ""
              }`}
              onClick={() => handleStatusChange(opt.value)}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="admin-users__error">
          <AlertTriangle size={16} />
          <span>{error}</span>
        </div>
      )}

      {/* Table */}
      <Card variant="glass" size="md" className="admin-users__card">
        {loading ? (
          <div className="admin-users__loading">
            <Loader2 size={24} className="admin-users__spinner" />
            <span>Loading users…</span>
          </div>
        ) : users.length === 0 ? (
          <div className="admin-users__empty">
            <UserIcon size={32} />
            <p>No users match this filter.</p>
          </div>
        ) : (
          <div className="admin-users__table-wrap">
            <table className="admin-users__table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Contact</th>
                  <th>Status</th>
                  <th>Registered</th>
                  <th aria-label="Actions"></th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => {
                  const photo = adminPhotoUrl(user);
                  const initials =
                    (user.first_name?.[0]?.toUpperCase() || "?") +
                    (user.surname?.[0]?.toUpperCase() || "");
                  const fullName =
                    [user.first_name, user.surname]
                      .filter(Boolean)
                      .join(" ") || user.email;
                  const statusMeta =
                    STATUS_STYLES[user.status] || STATUS_STYLES.REGISTERED;

                  return (
                    <tr key={user.id}>
                      <td>
                        <div className="admin-user-cell">
                          {photo ? (
                            <img
                              src={photo}
                              alt=""
                              className="admin-user-avatar admin-user-avatar--img"
                            />
                          ) : (
                            <div className="admin-user-avatar">
                              {initials}
                            </div>
                          )}
                          <div className="admin-user-info">
                            <span className="admin-user-name">
                              {fullName}
                            </span>
                            <span className="admin-user-email">
                              {user.email}
                            </span>
                            {user.verified && (
                              <span className="admin-user-verified">
                                <ShieldCheck size={10} /> Email verified
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="admin-contact">
                          <span>
                            <Mail size={12} /> {user.email}
                          </span>
                          {user.whatsapp && (
                            <span>
                              <Phone size={12} /> {user.whatsapp}
                            </span>
                          )}
                        </div>
                      </td>
                      <td>
                        <span
                          className={`badge ${statusMeta.cls}`}
                        >
                          {statusMeta.label}
                        </span>
                      </td>
                      <td>
                        <span className="admin-date">
                          <Calendar size={12} /> {formatDate(user.created)}
                        </span>
                      </td>
                      <td>
                        <div className="admin-user-actions">
                          {canApprove(user) && (
                            <button
                              type="button"
                              className="admin-action-btn admin-action-btn--approve"
                              onClick={() => openApprove(user)}
                              title="Approve"
                            >
                              <CheckCircle2 size={14} />
                              Approve
                            </button>
                          )}
                          {canReject(user) && (
                            <button
                              type="button"
                              className="admin-action-btn admin-action-btn--reject"
                              onClick={() => openReject(user)}
                              title="Reject"
                            >
                              <XCircle size={14} />
                              Reject
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Pagination */}
      {!loading && totalItems > 0 && (
        <div className="admin-users__pagination">
          <span>
            Showing {startIdx}–{endIdx} of {totalItems}
          </span>
          <div className="admin-users__pagination-buttons">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
            >
              <ChevronLeft size={16} />
            </button>
            <span>
              {page} / {totalPages}
            </span>
            <button
              type="button"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Approve modal */}
      <AlertModal
        open={!!approveTarget}
        onClose={() => !actionPending && setApproveTarget(null)}
        tone="success"
        title="Approve this student?"
        description={
          approveTarget
            ? `${approveTarget.first_name || approveTarget.email} will be moved to APPROVED. They can then upload a photo and join the community.`
            : ""
        }
        confirmLabel={actionPending ? "Approving…" : "Approve"}
        onConfirm={confirmApprove}
        showCancel
        closeOnBackdrop={!actionPending}
        closeOnEsc={!actionPending}
      >
        {actionError && (
          <div className="admin-users__modal-error">{actionError}</div>
        )}
      </AlertModal>

      {/* Reject modal */}
      <AlertModal
        open={!!rejectTarget}
        onClose={() => !actionPending && setRejectTarget(null)}
        tone="danger"
        title="Reject this student?"
        description={
          rejectTarget
            ? `${rejectTarget.first_name || rejectTarget.email} will be marked as REJECTED. They won't be able to proceed until approved.`
            : ""
        }
        confirmLabel={actionPending ? "Rejecting…" : "Reject"}
        onConfirm={confirmReject}
        showCancel
        closeOnBackdrop={!actionPending}
        closeOnEsc={!actionPending}
      >
        <div style={{ marginBottom: "var(--space-3)" }}>
          <Textarea
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            placeholder="Reason (optional, visible to admin team only)"
            maxLength={280}
            showCounter
            minRows={3}
          />
        </div>
        {actionError && (
          <div className="admin-users__modal-error">{actionError}</div>
        )}
      </AlertModal>
    </div>
  );
}