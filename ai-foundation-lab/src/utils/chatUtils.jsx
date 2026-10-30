// src/utils/chatUtils.jsx
import React from "react";
import pb from "../lib/pocketbase";
import pbAdmin from "../lib/pocketbaseAdmin";

// Safely parse URLs in text and render as links
export function renderTextWithLinks(text) {
  if (!text) return null;
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  
  return text.split(urlRegex).map((part, i) => {
    if (part.match(urlRegex)) {
      return (
        <a
          key={i}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "var(--cyan-400)", textDecoration: "underline" }}
        >
          {part}
        </a>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

// Render attachment based on message type
export function renderAttachment(msg, isAdminView = false) {
  if (!msg.attachment) return null;
  
  const client = isAdminView ? pbAdmin : pb;
  const url = client.files.getUrl(msg, msg.attachment);

  if (msg.message_type === "image") {
    return (
      <img
        src={url}
        alt="attachment"
        style={{
          maxWidth: "100%",
          maxHeight: "300px",
          borderRadius: "var(--radius-sm)",
          marginTop: msg.body ? "var(--space-2)" : "0",
          cursor: "pointer",
          display: "block",
        }}
        onClick={() => window.open(url, "_blank")}
      />
    );
  }

  if (msg.message_type === "video") {
    return (
      <video
        src={url}
        controls
        style={{
          maxWidth: "100%",
          maxHeight: "300px",
          borderRadius: "var(--radius-sm)",
          marginTop: msg.body ? "var(--space-2)" : "0",
          display: "block",
        }}
      />
    );
  }

  if (msg.message_type === "audio") {
    return (
      <audio
        src={url}
        controls
        style={{
          width: "100%",
          minWidth: "250px",
          marginTop: msg.body ? "var(--space-2)" : "0",
          display: "block",
        }}
      />
    );
  }

  return null;
}