// src/components/exam/ExamWatermark.jsx
import { useEffect, useState } from "react";
import "./ExamWatermark.css";

export default function ExamWatermark({ email }) {
  const [position, setPosition] = useState({ top: 20, left: 20 });

  useEffect(() => {
    const move = () => {
      const top = 10 + Math.random() * 70;
      const left = 10 + Math.random() * 70;
      setPosition({ top, left });
    };
    move();
    const id = setInterval(move, 12000);
    return () => clearInterval(id);
  }, []);

  const stamp = new Date().toLocaleString();

  return (
    <div
      className="exam-watermark"
      style={{ top: `${position.top}%`, left: `${position.left}%` }}
      aria-hidden="true"
    >
      {email} · {stamp}
    </div>
  );
}