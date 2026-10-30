// src/components/landing/FaqItem.jsx
import { useId } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import "./FaqItem.css";

export default function FaqItem({ question, answer, isOpen, onToggle }) {
  const prefersReduced = useReducedMotion();
  const uid = useId().replace(/:/g, "");
  const panelId = `faq-panel-${uid}`;
  const triggerId = `faq-trigger-${uid}`;

  return (
    <div className={`faq-item ${isOpen ? "faq-item--open" : ""}`}>
      <h3 className="faq-item__heading">
        <button
          id={triggerId}
          type="button"
          className="faq-item__trigger"
          aria-expanded={isOpen}
          aria-controls={panelId}
          onClick={onToggle}
        >
          <span className="faq-item__question">{question}</span>
          <span className="faq-item__toggle" aria-hidden="true">
            {isOpen ? <Minus size={18} /> : <Plus size={18} />}
          </span>
        </button>
      </h3>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={panelId}
            role="region"
            aria-labelledby={triggerId}
            className="faq-item__panel"
            key="panel"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={
              prefersReduced
                ? { duration: 0 }
                : { duration: 0.28, ease: [0.22, 1, 0.36, 1] }
            }
          >
            <div className="faq-item__panel-inner">
              <p className="faq-item__answer">{answer}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}