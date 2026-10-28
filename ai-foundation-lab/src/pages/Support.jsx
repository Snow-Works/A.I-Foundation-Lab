// src/pages/Support.jsx
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Send, Loader2, Paperclip, X } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import {
  getStudentMessages,
  sendStudentMessage,
  markMessagesReadByStudent,
} from "../services/supportService.js";
import { renderTextWithLinks, renderAttachment } from "../utils/chatUtils.jsx";
import Card from "../components/ui/Card.jsx";
import Button from "../components/ui/Button.jsx";
import LogoMark from "../components/ui/LogoMark.jsx";
import "./Support.css";

export default function Support() {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  
  const chatEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const fetchMessages = async (isInitial = false) => {
    if (!user) return;
    try {
      const msgs = await getStudentMessages(user.id);
      setMessages(msgs);
      if (isInitial && msgs.length > 0) {
        await markMessagesReadByStudent(user.id);
      }
    } catch (err) {
      console.error("[support] fetch error:", err);
    } finally {
      if (isInitial) setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) return;
    fetchMessages(true);
    const interval = setInterval(() => fetchMessages(false), 10000);
    return () => clearInterval(interval);
  }, [user]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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

  const handleSend = async (e) => {
    e.preventDefault();
    if ((!newMessage.trim() && !selectedFile) || !user || sending) return;

    setSending(true);
    const body = newMessage.trim();
    const fileToUpload = selectedFile;
    
    setNewMessage("");
    cancelFile(); // clear preview immediately

    try {
      const msg = await sendStudentMessage(user.id, body, fileToUpload);
      setMessages((prev) => [...prev, msg]);
    } catch (err) {
      console.error("[support] send error:", err);
      setNewMessage(body); // Restore on failure
      alert("Failed to send message. Please try again.");
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="support-loading">
        <Loader2 size={28} className="support-spinner" />
        <span>Opening support channel…</span>
      </div>
    );
  }

  return (
    <section className="support section">
      <div className="container support__container">
        <Link to="/profile" className="support__back">
          <ArrowLeft size={16} /> Back to profile
        </Link>

        <Card variant="glass" size="lg" withTab className="support__chat-card">
          <div className="support__header">
            <h1 className="type-h3">Support Chat</h1>
            <p className="type-body-sm">
              Have a question or issue? Send us a message and an admin will reply shortly.
            </p>
          </div>

          <div className="support__chat-log">
            {messages.length === 0 ? (
              <div className="support__empty">
                <p>No messages yet. Type a message below to start.</p>
              </div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`support-msg ${
                    msg.sender_type === "student" ? "support-msg--user" : "support-msg--admin"
                  }`}
                >
                  {msg.sender_type === "admin" && (
                    <div className="support-msg__avatar">
                      <LogoMark size={20} style={{ color: "white" }} />
                    </div>
                  )}
                  <div className="support-msg__bubble">
                    {renderAttachment(msg, false)}
                    {msg.body && <div>{renderTextWithLinks(msg.body)}</div>}
                  </div>
                </div>
              ))
            )}
            <div ref={chatEndRef} />
          </div>

          {/* File Preview */}
          {previewUrl && (
            <div className="support__file-preview">
              {selectedFile?.type.startsWith("image/") ? (
                <img src={previewUrl} alt="Preview" />
              ) : (
                <video src={previewUrl} />
              )}
              <button type="button" className="support__file-cancel" onClick={cancelFile}>
                <X size={14} />
              </button>
            </div>
          )}

          <form className="support__input-area" onSubmit={handleSend}>
            <input
              type="file"
              accept="image/*,video/*"
              ref={fileInputRef}
              onChange={handleFileSelect}
              style={{ display: "none" }}
            />
            <button
              type="button"
              className="support__attach-btn"
              onClick={() => fileInputRef.current?.click()}
              disabled={sending}
              title="Attach image or video"
            >
              <Paperclip size={20} />
            </button>
            <input
              type="text"
              className="support__input"
              placeholder="Type your message here..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              disabled={sending}
            />
            <Button
              type="submit"
              variant="primary"
              size="md"
              rightIcon={<Send size={16} />}
              loading={sending}
              disabled={!newMessage.trim() && !selectedFile}
            >
              Send
            </Button>
          </form>
        </Card>
      </div>
    </section>
  );
}