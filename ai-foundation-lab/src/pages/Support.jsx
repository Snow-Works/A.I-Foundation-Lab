// src/pages/Support.jsx
import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Send, Loader2, Paperclip, X, Mic, Smile, Video, SwitchCamera } from "lucide-react";
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

const EMOJIS = ["😀","😂","😍","😎","😭","😡","👍","👎","👏","🙏","🔥","💯","✅","❌","❤️","💔","🎉","🚀","💡","⚠️"];

export default function Support() {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  
  // Audio Recording State
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  // Video Recording State
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [isVideoRecording, setIsVideoRecording] = useState(false);
  const [facingMode, setFacingMode] = useState("user");
  const videoPreviewRef = useRef(null);
  const videoMediaRecorderRef = useRef(null);
  const videoChunksRef = useRef([]);
  const videoStreamRef = useRef(null);

  // UI State
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const chatEndRef = useRef(null);
  const fileInputRef = useRef(null);

  // FIXED: Wrapped in useCallback
  const fetchMessages = useCallback(async (isInitial = false) => {
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
  }, [user]);

  useEffect(() => {
    if (!user) return;
    fetchMessages(true);
    const interval = setInterval(() => fetchMessages(false), 10000);
    return () => clearInterval(interval);
  }, [user, fetchMessages]); // Added fetchMessages to deps

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
      alert("Only images and videos are allowed here.");
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

  /* ---------------- AUDIO RECORDING ---------------- */
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const file = new File([audioBlob], "voice-note.webm", { type: 'audio/webm' });
        setSelectedFile(file);
        setPreviewUrl(URL.createObjectURL(file));
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Mic access denied:", err);
      alert("Microphone access is required.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  /* ---------------- VIDEO RECORDING ---------------- */
  const openVideoModal = async () => {
    setIsVideoModalOpen(true);
    await startVideoStream(facingMode);
  };

  const startVideoStream = async (mode) => {
    try {
      if (videoStreamRef.current) {
        videoStreamRef.current.getTracks().forEach(t => t.stop());
      }
      
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: mode }, 
        audio: true 
      });
      
      videoStreamRef.current = stream;
      if (videoPreviewRef.current) {
        videoPreviewRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Camera access denied:", err);
      alert("Camera and microphone access is required for video notes.");
      closeVideoModal();
    }
  };

  const toggleCamera = async () => {
    const newMode = facingMode === "user" ? "environment" : "user";
    setFacingMode(newMode);
    if (!isVideoRecording) {
      await startVideoStream(newMode);
    }
  };

  const startVideoRecording = () => {
    if (!videoStreamRef.current) return;
    
    const mediaRecorder = new MediaRecorder(videoStreamRef.current);
    videoMediaRecorderRef.current = mediaRecorder;
    videoChunksRef.current = [];

    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) videoChunksRef.current.push(e.data);
    };

    mediaRecorder.onstop = () => {
      const videoBlob = new Blob(videoChunksRef.current, { type: 'video/webm' });
      const file = new File([videoBlob], "video-note.webm", { type: 'video/webm' });
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      closeVideoModal();
    };

    mediaRecorder.start();
    setIsVideoRecording(true);
  };

  const stopVideoRecording = () => {
    if (videoMediaRecorderRef.current && isVideoRecording) {
      videoMediaRecorderRef.current.stop();
      setIsVideoRecording(false);
    }
  };

  const closeVideoModal = () => {
    if (videoStreamRef.current) {
      videoStreamRef.current.getTracks().forEach(t => t.stop());
      videoStreamRef.current = null;
    }
    setIsVideoRecording(false);
    setIsVideoModalOpen(false);
  };

  /* ---------------- SEND MESSAGE ---------------- */
  const handleSend = async (e) => {
    e.preventDefault();
    if ((!newMessage.trim() && !selectedFile) || !user || sending) return;

    setSending(true);
    const body = newMessage.trim();
    const fileToUpload = selectedFile;
    
    setNewMessage("");
    cancelFile();
    setShowEmojiPicker(false);

    try {
      const msg = await sendStudentMessage(user.id, body, fileToUpload);
      setMessages((prev) => [...prev, msg]);
    } catch (err) {
      console.error("[support] error:", err);
      setNewMessage(body);
      alert("Failed to send message.");
    } finally {
      setSending(false);
    }
  };

  const addEmoji = (emoji) => {
    setNewMessage((prev) => prev + emoji);
    setShowEmojiPicker(false);
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

          {previewUrl && (
            <div className="support__file-preview">
              {selectedFile?.type.startsWith("image/") ? (
                <img src={previewUrl} alt="Preview" />
              ) : selectedFile?.type.startsWith("video/") ? (
                <video src={previewUrl} controls />
              ) : (
                <audio src={previewUrl} controls style={{ height: 40 }} />
              )}
              <button type="button" className="support__file-cancel" onClick={cancelFile}>
                <X size={14} />
              </button>
            </div>
          )}

          {showEmojiPicker && (
            <div className="support__emoji-picker">
              {EMOJIS.map((emoji) => (
                <button key={emoji} type="button" onClick={() => addEmoji(emoji)}>
                  {emoji}
                </button>
              ))}
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
            
            <button type="button" className="support__attach-btn" onClick={() => setShowEmojiPicker(!showEmojiPicker)} disabled={sending || isRecording}>
              <Smile size={20} />
            </button>

            <button type="button" className="support__attach-btn" onClick={() => fileInputRef.current?.click()} disabled={sending || isRecording}>
              <Paperclip size={20} />
            </button>

            <button type="button" className="support__attach-btn" onClick={openVideoModal} disabled={sending || isRecording} title="Record video note">
              <Video size={20} />
            </button>

            {isRecording ? (
              <div className="support__recording-state">
                <span className="support__recording-dot"></span>
                Recording audio...
                <button type="button" className="support__stop-btn" onClick={stopRecording}>Stop</button>
              </div>
            ) : (
              <input
                type="text"
                className="support__input"
                placeholder="Type your message here..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                disabled={sending}
              />
            )}

            {!isRecording && !newMessage.trim() && !selectedFile ? (
              <button type="button" className="support__attach-btn" onClick={startRecording} disabled={sending}>
                <Mic size={20} />
              </button>
            ) : !isRecording ? (
              <Button type="submit" variant="primary" size="md" rightIcon={<Send size={16} />} loading={sending}>
                Send
              </Button>
            ) : null}
          </form>
        </Card>
      </div>

      {/* VIDEO MODAL */}
      {isVideoModalOpen && (
        <div className="video-modal-backdrop">
          <div className="video-modal">
            <div className="video-modal__header">
              <h3>Video Note</h3>
              <button type="button" onClick={closeVideoModal} className="video-modal__close">
                <X size={20} />
              </button>
            </div>
            
            <div className="video-modal__preview">
              <video 
                ref={videoPreviewRef} 
                autoPlay 
                muted 
                playsInline 
                style={{ transform: facingMode === "user" ? "scaleX(-1)" : "none" }}
              />
              {isVideoRecording && <span className="video-modal__rec-dot"></span>}
            </div>

            <div className="video-modal__controls">
              <button type="button" className="video-modal__switch" onClick={toggleCamera} disabled={isVideoRecording}>
                <SwitchCamera size={24} />
              </button>

              {isVideoRecording ? (
                <button type="button" className="video-modal__record-btn video-modal__record-btn--recording" onClick={stopVideoRecording}>
                  <div className="video-modal__stop-square" />
                </button>
              ) : (
                <button type="button" className="video-modal__record-btn" onClick={startVideoRecording}>
                  <div className="video-modal__record-circle" />
                </button>
              )}

              <div style={{ width: 24 }}></div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}