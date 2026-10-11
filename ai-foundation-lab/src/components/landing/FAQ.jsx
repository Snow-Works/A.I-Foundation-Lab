// src/components/landing/FAQ.jsx
import { useState } from "react";
import LandingSection from "./LandingSection.jsx";
import PillTab from "../ui/PillTab.jsx";
import { Stagger, StaggerItem } from "../ui/motion.js";
import FaqItem from "./FaqItem.jsx";
import "./FAQ.css";

const QUESTIONS = [
  {
    q: "Who is this Lab for?",
    a: "Students who already know how to program — in any language, from any discipline. If you can write code but haven't yet pointed that skill at a real problem in your field, this is for you. It is not a beginner course, and it is not a coding bootcamp.",
  },
  {
    q: "Does it cost anything to join?",
    a: "The Lab is free to join. You'll need access to a laptop or desktop for the exam and for building projects, and a stable internet connection for our Telegram group and for the exam window.",
  },
  {
    q: "How much time does it take?",
    a: "The onboarding sequence (registration, verification, admin approval, photo check) takes under a day. Orientation happens in the Telegram group. The coding exam is 60 minutes. Beyond that, the time you invest is entirely up to you — the Lab gives you structure, peers, and a rubric, not a fixed schedule.",
  },
  {
    q: "What happens after I submit my exam?",
    a: "Your answers are stored securely and reviewed manually by an admin against a rubric. Once marking is complete, your result is released to your profile. You'll be told when it's ready — no chasing required.",
  },
  {
    q: "What technology stack is used?",
    a: "The exam is Python. The Lab itself runs in your browser. You'll need a modern browser (Chrome, Firefox, Safari, or Edge — recent versions) for the proctored exam, which requires a desktop or laptop and fullscreen mode.",
  },
  {
    q: "Is my data safe?",
    a: "Your registration details are stored on our own database with row-level security. Your profile photo is processed in your browser before upload, and verified by a human admin. We do not sell, share, or hand off your data to third parties.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0); // first item open by default

  const handleToggle = (i) => {
    setOpenIndex((current) => (current === i ? -1 : i));
  };

  return (
    <LandingSection
      id="faq"
      containerWidth="md"
      paddingTop="xl"
      paddingBottom="lg"
      reveal={false}
    >
      <header className="faq__header">
        <PillTab variant="default" size="sm">
          FAQ
        </PillTab>

        <h2 className="type-h2 faq__title">
          Questions,{" "}
          <span className="type-gradient">answered</span>.
        </h2>

        <p className="type-body-lg faq__subtitle">
          If you're still wondering about something, reach out in the community
          once you've joined — or check back here as we add more.
        </p>
      </header>

      <Stagger staggerDelay={0.08} className="faq__list">
        {QUESTIONS.map((item, i) => (
          <StaggerItem key={item.q}>
            <FaqItem
              question={item.q}
              answer={item.a}
              isOpen={openIndex === i}
              onToggle={() => handleToggle(i)}
            />
          </StaggerItem>
        ))}
      </Stagger>
    </LandingSection>
  );
}