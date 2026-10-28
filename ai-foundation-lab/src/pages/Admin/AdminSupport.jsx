// src/pages/Admin/AdminSupport.jsx
import { useState, useEffect, useRef } from "react";
import { MessageSquare, Send, Loader2, User, Paperclip, X } from "lucide-react";
import { useAdminAuth } from "../../context/AdminAuthContext.jsx";
import {
  getAdminInbox,
  getAdminThread,
  sendAdminMessage,
  markThreadReadByAdmin,
} from "../../services/supportService.js";
import { renderTextWithLinks, renderAttachment } from "../../utils/chatUtils.jsx";
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
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  
  const [loadingInbox, setLoadingInbox] = useState(true);
  const [loadingThread, setLoadingThread] = useState(false);
  const [sending, setSending] = useState(false);
  
  const chatEndRef = useRef(null);
  const fileInputRef = useRef(null);

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
    const interval = setInterval(fetchInbox, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!activeStudentId) return;
    let cancelled = false;

    const fetchThread = async (isInitial = false) => {
      if (isInitial) setLoadingThread(true);
      try {
        const msgs = await getAdminThread(activeStudentId);
        if (cancelled) return;
        setThread(msgs);
        if (isInitial) {
          await markThreadReadByAdmin(activeStudentId);
          fetchInbox();
        }
      } catch (err) {
        console.error("[admin-support] thread error:", err);
      } finally {
        if (!cancelled && isInitial) setLoadingThread(false);
      }
    };

    fetchThread(true);
    const interval = setInterval(() => fetchThread(false), 10000);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [activeStudentId]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [thread]);

  const handleSelectStudent = (studentId, studentName) => {
    setActiveStudentId(studentId);
    setActiveStudentName(studentName);
    setReplyBody("");
    cancelFile();
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      alert("File is too large. Max size is 10MB.");
      return;
    }

    if (!file.type.startsWith("image/") && !file.type.startsWith("video/")) {
      alert("Only images and videos are allowed.");
      return;
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const cancelFile = () => {
    setSelectedFile(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
  };

  const handleSendReply = async (e) => {
    e.preventDefault();
    if ((!replyBody.trim() && !selectedFile) || !activeStudentId || sending) return;

    setSending(true);
    const body = replyBody.trim();
    const fileToUpload = selectedFile;
    
    setReplyBody("");
    cancelFile();

    try {
      await sendAdminMessage(activeStudentId, admin.id, body, fileToUpload);
      const msgs = await getAdminThread(activeStudentId);
      setThread(msgs);
    } catch (err) {
      console.error("[admin-support] send error:", err);
      setReplyBody(body);
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
                    <div className="support-msg__bubble">
                      {renderAttachment(msg, true)}
                      {msg.body && <div>{renderTextWithLinks(msg.body)}</div>}
                    </div>
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>

              {previewUrl && (
                <div className="admin-support__file-preview">
                  {selectedFile?.type.startsWith("image/") ? (
                    <img src={previewUrl} alt="Preview" />
                  ) : (
                    <video src={previewUrl} />
                  )}
                  <button type="button" className="admin-support__file-cancel" onClick={cancelFile}>
                    <X size={14} />
                  </button>
                </div>
              )}

              <form className="admin-support__input-area" onSubmit={handleSendReply}>
                <input
                  type="file"
                  accept="image/*,video/*"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  style={{ display: "none" }}
                />
                <button
                  type="button"
                  className="admin-support__attach-btn"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={sending}
                  title="Attach image or video"
                >
                  <Paperclip size={20} />
                </button>
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
                  disabled={!replyBody.trim() && !selectedFile}
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