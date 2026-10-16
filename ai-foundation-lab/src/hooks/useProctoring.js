// src/hooks/useProctoring.js
import { useEffect, useRef, useCallback } from "react";
import pb from "../lib/pocketbase";

const DEBOUNCE_MS = 1200;

export function useProctoring({
  attemptId,
  enabled = true,
  onWarning,
  onTerminate,
  onViolation,
}) {
  const lastEventRef = useRef({ type: null, at: 0 });
  const countRef = useRef(0);
  const terminatingRef = useRef(false);

  const report = useCallback(
    async (type, details = {}) => {
      if (!enabled || !attemptId) return;
      if (terminatingRef.current) return;

      const now = Date.now();
      const last = lastEventRef.current;
      if (last.type === type && now - last.at < DEBOUNCE_MS) return;
      lastEventRef.current = { type, at: now };

      let serverCount = countRef.current + 1;
      let shouldTerminate = false;

      try {
        const res = await pb.send("/api/exam/violation", {
          method: "POST",
          body: {
            attempt: attemptId,
            type,
            details,
            occurred_at: new Date().toISOString(),
          },
        });
        if (res?.violation_count !== undefined) {
          serverCount = res.violation_count;
        }
        if (res?.terminated) shouldTerminate = true;
      } catch (err) {
        console.error("[proctoring] failed to log violation:", err);
      }

      countRef.current = serverCount;

      const violation = {
        type,
        count: serverCount,
        occurredAt: new Date().toISOString(),
        details,
      };

      onViolation?.(violation);

      if (shouldTerminate || type === "fullscreen_exit") {
        terminatingRef.current = true;
        onTerminate?.(violation);
        return;
      }

      onWarning?.(violation);
    },
    [attemptId, enabled, onWarning, onTerminate, onViolation]
  );

  useEffect(() => {
    if (!enabled || !attemptId) return;

    const onVisibility = () => {
      if (document.hidden) report("tab_hidden");
    };
    const onBlur = () => report("window_blur");
    const onFsChange = () => {
      if (!document.fullscreenElement) report("fullscreen_exit");
    };
    const onCopy = (e) => {
      e.preventDefault();
      report("copy");
    };
    const onPaste = (e) => {
      e.preventDefault();
      report("paste");
    };
    const onCut = (e) => {
      e.preventDefault();
      report("cut");
    };
    const onContext = (e) => {
      e.preventDefault();
      report("context_menu");
    };
    const onKeyDown = (e) => {
      if (e.key === "PrintScreen") {
        e.preventDefault();
        report("print_screen");
        return;
      }
      if (
        (e.metaKey || e.ctrlKey) &&
        e.shiftKey &&
        (e.key === "s" || e.key === "S")
      ) {
        e.preventDefault();
        report("screenshot_shortcut");
        return;
      }
      if (e.metaKey && e.shiftKey && ["3", "4", "5"].includes(e.key)) {
        e.preventDefault();
        report("screenshot_shortcut");
        return;
      }
    };

    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("blur", onBlur);
    document.addEventListener("fullscreenchange", onFsChange);
    document.addEventListener("copy", onCopy);
    document.addEventListener("paste", onPaste);
    document.addEventListener("cut", onCut);
    document.addEventListener("contextmenu", onContext);
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("blur", onBlur);
      document.removeEventListener("fullscreenchange", onFsChange);
      document.removeEventListener("copy", onCopy);
      document.removeEventListener("paste", onPaste);
      document.removeEventListener("cut", onCut);
      document.removeEventListener("contextmenu", onContext);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [attemptId, enabled, report]);

  return { report };
}