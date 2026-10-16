// src/hooks/useExamTimer.js
import { useEffect, useRef, useState } from "react";

/**
 * Derives the countdown from an ISO deadline string.
 * Recalculates every tick, so refreshing or resuming always
 * shows the correct remaining time — no local drift.
 *
 * Calls `onExpire` exactly once when the timer crosses zero.
 */
export function useExamTimer({ deadlineAt, onExpire, enabled = true }) {
  const [secondsRemaining, setSecondsRemaining] = useState(() =>
    computeRemaining(deadlineAt)
  );
  const expiredRef = useRef(false);

  useEffect(() => {
    if (!enabled || !deadlineAt) return;

    expiredRef.current = false;

    const tick = () => {
      const remaining = computeRemaining(deadlineAt);
      setSecondsRemaining(remaining);

      if (remaining <= 0 && !expiredRef.current) {
        expiredRef.current = true;
        onExpire?.();
      }
    };

    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deadlineAt, enabled]);

  return {
    secondsRemaining,
    formatted: formatSeconds(secondsRemaining),
    isUrgent: secondsRemaining > 0 && secondsRemaining <= 300, // ≤5 min
    isCritical: secondsRemaining > 0 && secondsRemaining <= 60, // ≤1 min
    expired: secondsRemaining <= 0,
  };
}

function computeRemaining(deadlineAt) {
  if (!deadlineAt) return 0;
  const deadlineMs = Date.parse(deadlineAt);
  if (Number.isNaN(deadlineMs)) return 0;
  const diff = Math.floor((deadlineMs - Date.now()) / 1000);
  return Math.max(0, diff);
}

function formatSeconds(seconds) {
  if (seconds <= 0) return "00:00";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) {
    return `${h}:${pad(m)}:${pad(s)}`;
  }
  return `${pad(m)}:${pad(s)}`;
}

function pad(n) {
  return String(n).padStart(2, "0");
}