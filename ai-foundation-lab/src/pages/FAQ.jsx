// src/pages/FAQ.jsx
import { useState, useRef, useEffect } from "react";
import { User, HelpCircle } from "lucide-react";
import LogoMark from "../components/ui/LogoMark.jsx";
import "./InfoPages.css";
import "./FAQ.css";

const FAQ_DATA = [
  {
    q: "Is this for beginners?",
    a: "No. The AI Foundation Lab is a guild for students who already have working programming ability. We do not teach the basics of coding; we teach you how to apply it to real problems in your academic field."
  },
  {
    q: "How much does it cost?",
    a: "The Lab is completely free to join. You only need a laptop, an internet connection, and the drive to build."
  },
  {
    q: "Do I need to install Python?",
    a: "No. We run the Python engine entirely in your browser using WebAssembly. You can test your code directly in the exam editor without installing anything on your computer."
  },
  {
    q: "Can I use ChatGPT or Google during the exam?",
    a: "No. The exam is strictly proctored. The environment locks you into fullscreen, disables copy/paste, and tracks tab switches. Any attempt to use external tools will log a violation and can terminate your exam."
  },
  {
    q: "What happens if my internet disconnects?",
    a: "Don't panic. Your code is saved locally every 15 seconds. If you disconnect, your work is stored in your browser. Once you reconnect, the system will automatically push your code back to our servers."
  },
  {
    q: "What happens if I fail?",
    a: "You have 3 resets available. You can abandon an active exam and start fresh. If you fail all 3, you will need to contact an admin for special permission."
  }
];

export default function FAQ() {
  const [chatLog, setChatLog] = useState([
    {
      role: "bot",
      text: "Welcome to the AI Foundation Lab. I'm here to answer any questions you might have. What's on your mind?"
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [askedQuestions, setAskedQuestions] = useState([]);
  const chatEndRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatLog, isTyping]);

  const handleAsk = (qa) => {
    if (askedQuestions.includes(qa.q)) return;

    // 1. Add user message
    setChatLog((prev) => [...prev, { role: "user", text: qa.q }]);
    setAskedQuestions((prev) => [...prev, qa.q]);
    
    // 2. Show typing indicator
    setIsTyping(true);

    // 3. Simulate "typing" delay, then add bot response
    setTimeout(() => {
      setIsTyping(false);
      setChatLog((prev) => [...prev, { role: "bot", text: qa.a }]);
    }, 1200); // 1.2 second delay
  };

  return (
    <section className="info-page section">
      <div className="container info-page__container">
        <header className="info-page__header">
          <h1 className="type-h1 info-page__title">Frequently Asked Questions</h1>
          <p className="type-body-lg info-page__subtitle">
            Ask us anything about the Lab. Click a question below to start the conversation.
          </p>
        </header>

        <div className="faq-chat-container">
          {/* Chat Log */}
          <div className="faq-chat-log">
            {chatLog.map((msg, idx) => (
              <div
                key={idx}
                className={`chat-msg chat-msg--${msg.role}`}
              >
                <div className={`chat-avatar chat-avatar--${msg.role}`}>
                  {msg.role === "user" ? <User size={18} /> : <LogoMark size={20} style={{ color: "white" }} />}
                </div>
                <div className="chat-bubble">
                  {msg.text}
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="chat-msg chat-msg--bot">
                <div className="chat-avatar chat-avatar--bot">
                  <LogoMark size={20} style={{ color: "white" }} />
                </div>
                <div className="chat-typing">
                  <span></span><span></span><span></span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Quick Questions (Input) */}
          <div className="faq-quick-questions">
            {FAQ_DATA.map((qa) => (
              <button
                key={qa.q}
                className="faq-quick-btn"
                onClick={() => handleAsk(qa)}
                disabled={askedQuestions.includes(qa.q) || isTyping}
              >
                {qa.q}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}