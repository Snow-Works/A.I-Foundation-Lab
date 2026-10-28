// src/pages/Admin/AdminSupport.jsx
import { useState, useEffect, useRef } from "react";
import { MessageSquare, Send, Loader2, User } from "lucide-react";
import { useAdminAuth } from "../../context/AdminAuthContext.jsx";
import {
  getAdminInbox,
  getAdminThread,
  sendAdminMessage,
  markThreadReadByAdmin,
} from "../../services/supportService.js";
import Card from "../../components/ui/Card.jsx";
import Button from "../../components/ui/Button.jsx";
import "./AdminSupport.css";

export default function AdminSupport() {
  const { admin } = useAdminAuth();
  const [inbox, setInbox] = useState([]);
  const [activeStudentId, setActiveStudentId] = useState(null);
  const [activeStudentName, setActiveStudentName] = useState("");
  const [thread, setThread] = useState([]);
  const [replyBody, setReplyBody] = useState("");
  
  const [loadingInbox, setLoadingInbox] = useState(true);
  const [loadingThread, setLoadingThread] = useState(false);
  const [sending, setSending] = useState(false);
  
  const chatEndRef = useRef(null);

  // Fetch inbox on mount
  const fetchInbox = async () => {
    try {
      const data = await getAdminInbox();
      setInbox(data);
    } catch (err) {
      console.error("[admin-support] inbox error:", err);
    } finally {
      setLoadingInbox(false);
    }
  };

  useEffect(() => {
    fetchInbox();
    // Poll inbox every 30s for new messages
    const interval = setInterval(fetchInbox, 30000);
    return () => clearInterval(interval);
  }, []);

  // Fetch thread when a student is selected
  useEffect(() => {
    if (!activeStudentId) return;

    let cancelled = false;

    const fetchThread = async (isInitial = false) => {
      if (isInitial) setLoadingThread(true);
      try {
        const msgs = await getAdminThread(activeStudentId);
        if (cancelled) return;
        setThread(msgs);
        
        // Mark as read when we open it
        if (isInitial) {
          await markThreadReadByAdmin(activeStudentId);
          fetchInbox(); // Refresh inbox to clear the unread badge
        }
      } catch (err) {
        console.error("[admin-support] thread error:", err);
      } finally {
        if (!cancelled && isInitial) setLoadingThread(false);
      }
    };

    fetchThread(true);
    
    // Poll active thread every 10s
    const interval = setInterval(() => fetchThread(false), 10000);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [activeStudentId]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [thread]);

  const handleSelectStudent = (studentId, studentName) => {
    setActiveStudentId(studentId);
    setActiveStudentName(studentName);
    setReplyBody("");
  };

  const handleSendReply = async (e) => {
    e.preventDefault();
    if (!replyBody.trim() || !activeStudentId || sending) return;

    setSending(true);
    const body = replyBody.trim();
    setReplyBody("");

    try {
      await sendAdminMessage(activeStudentId, admin.id, body);
      // Refresh thread immediately
      const msgs = await getAdminThread(activeStudentId);
      setThread(msgs);
    } catch (err) {
      console.error("[admin-support] send error:", err);
      setReplyBody(body); // Restore on fail
      alert("Failed to send reply. Please try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="admin-support">
      <header className="admin-support__header">
        <div>
          <h1 className="admin-support__title">Support Inbox</h1>
          <p className="admin-support__subtitle">
            Answer questions and resolve issues for students.
          </p>
        </div>
      </header>

      <div className="admin-support__layout">
        {/* ---------- LEFT: INBOX LIST ---------- */}
        <Card variant="glass" size="md" className="admin-support__sidebar">
          {loadingInbox ? (
            <div className="admin-support__loading">
              <Loader2 size={24} className="admin-support__spinner" />
            </div>
          ) : inbox.length === 0 ? (
            <div className="admin-support__empty-inbox">
              <MessageSquare size={32} />
              <p>No messages yet.</p>
            </div>
          ) : (
            <ul className="admin-support__list">
              {inbox.map((item) => (
                <li key={item.studentId}>
                  <button
                    type="button"
                    className={`admin-support__list-item ${
                      activeStudentId === item.studentId ? "admin-support__list-item--active" : ""
                    }`}
                    onClick={() => handleSelectStudent(item.studentId, item.studentName)}
                  >
                    <div className="admin-support__list-avatar">
                      <User size={16} />
                    </div>
                    <div className="admin-support__list-content">
                      <span className="admin-support__list-name">
                        {item.studentName}
                      </span>
                      <span className="admin-support__list-email">
                        {item.studentEmail}
                      </span>
                    </div>
                    {item.unreadCount > 0 && (
                      <span className="admin-support__unread-badge">
                        {item.unreadCount}
                      </span>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </Card>

        {/* ---------- RIGHT: CHAT THREAD ---------- */}
        <Card variant="glass" size="md" className="admin-support__chat-area">
          {!activeStudentId ? (
            <div className="admin-support__empty-chat">
              <MessageSquare size={48} className="admin-support__empty-icon" />
              <h3>No conversation selected</h3>
              <p>Select a student from the inbox to view their messages.</p>
            </div>
          ) : loadingThread ? (
            <div className="admin-support__loading">
              <Loader2 size={28} className="admin-support__spinner" />
            </div>
          ) : (
            <>
              <div className="admin-support__chat-header">
                <h2>{activeStudentName}</h2>
              </div>

              <div className="admin-support__chat-log">
                {thread.map((msg) => (
                  <div
                    key={msg.id}
                    className={`support-msg ${
                      msg.sender_type === "admin" ? "support-msg--user" : "support-msg--admin"
                    }`}
                  >
                    <div className="support-msg__bubble">{msg.body}</div>
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>

              <form className="admin-support__input-area" onSubmit={handleSendReply}>
                <input
                  type="text"
                  className="admin-support__input"
                  placeholder={`Reply to ${activeStudentName}...`}
                  value={replyBody}
                  onChange={(e) => setReplyBody(e.target.value)}
                  disabled={sending}
                />
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  rightIcon={<Send size={16} />}
                  loading={sending}
                  disabled={!replyBody.trim()}
                >
                  Send
                </Button>
              </form>
            </>
          )}
        </Card>
      </div>
    </div>
  );
}