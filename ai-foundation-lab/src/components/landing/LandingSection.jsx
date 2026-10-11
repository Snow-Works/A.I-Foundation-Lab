// src/components/landing/LandingSection.jsx
import { Reveal } from "../ui/motion.js";

/**
 * LandingSection — consistent wrapper for every landing page section.
 * Handles vertical rhythm, container width, and an optional reveal wrapper.
 */
export default function LandingSection({
  id,
  children,
  containerWidth = "lg",
  paddingTop = "lg",
  paddingBottom = "lg",
  background = "transparent",
  reveal = true,
  className = "",
  style = {},
  ...rest
}) {
  const containerClass =
    containerWidth === "full"
      ? ""
      : containerWidth === "wide"
      ? "container-wide"
      : containerWidth === "md"
      ? "container-narrow"
      : containerWidth === "sm"
      ? "container-narrow"
      : "container";

  const padTop =
    paddingTop === "xl" ? "var(--space-10)" :
    paddingTop === "lg" ? "var(--space-9)" :
    paddingTop === "md" ? "var(--space-7)" :
    paddingTop === "sm" ? "var(--space-5)" :
    "var(--space-7)";

  const padBottom =
    paddingBottom === "xl" ? "var(--space-10)" :
    paddingBottom === "lg" ? "var(--space-9)" :
    paddingBottom === "md" ? "var(--space-7)" :
    paddingBottom === "sm" ? "var(--space-5)" :
    "var(--space-7)";

  const bgClass =
    background === "gradient" ? "landing-section--bg-gradient" :
    background === "glass" ? "landing-section--bg-glass" :
    "";

  const sectionClasses = [
    "landing-section",
    bgClass,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const content = containerClass ? (
    <div className={containerClass}>{children}</div>
  ) : (
    children
  );

  return (
    <section
      id={id}
      className={sectionClasses}
      style={{
        paddingTop: padTop,
        paddingBottom: padBottom,
        ...style,
      }}
      {...rest}
    >
      {reveal ? <Reveal variant="fadeUp">{content}</Reveal> : content}
    </section>
  );
}