// src/pages/About.jsx
import Card from "../components/ui/Card.jsx";
import PillTab from "../components/ui/PillTab.jsx";
import { Target, Eye, GraduationCap } from "lucide-react";
import "./InfoPages.css";

export default function About() {
  return (
    <section className="info-page section">
      <div className="container info-page__container">
        <header className="info-page__header">
          <h1 className="type-h1 info-page__title">The Lab</h1>
          <p className="type-body-lg info-page__subtitle">
            A guild for students who already code. We build, we apply, we solve real problems.
          </p>
        </header>

        <div className="info-page__content">
          <h3 id="mission">Our Mission</h3>
          <p>
            To give students who are already proficient in programming a guild through which to build and apply artificial intelligence to their academic fields of study, and to use it as a practical tool for solving real problems within those fields.
          </p>

          <h3 id="vision">Our Vision</h3>
          <p>
            To build a community of students who can build and apply artificial intelligence to their respective academic fields.
          </p>

          <h3 id="who-for">Who is the Lab for?</h3>
          <p>
            The AI Foundation Lab is <strong>not</strong> an entry point for beginners. It is a guild for students who already have working programming ability and are looking for a structured opportunity to direct that skill towards building and applying AI within their own academic discipline — or towards solving problems native to their field of study.
          </p>

          <h3 id="how-it-works">How it works</h3>
          <p>
            We do not teach you to code. We help you build something with the code you already write. Every student must pass a rigorous, proctored Python exam to earn their certification. Once certified, you are recognized as a builder in the guild.
          </p>
        </div>
      </div>
    </section>
  );
}