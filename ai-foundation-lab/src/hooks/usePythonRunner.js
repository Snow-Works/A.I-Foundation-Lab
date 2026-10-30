// src/hooks/usePythonRunner.js
import { useEffect, useRef, useState, useCallback } from "react";

const RUN_TIMEOUT_MS = 5000;

export function usePythonRunner() {
  const workerRef = useRef(null);
  const timeoutRef = useRef(null);

  const [status, setStatus] = useState("loading"); // loading | ready | running
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  const clearRunTimeout = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const initWorker = useCallback(() => {
    if (workerRef.current) return;

    const worker = new Worker(
      new URL("../workers/pythonWorker.js", import.meta.url)
    );

    worker.onmessage = (e) => {
      const { type } = e.data;

      if (type === "ready") {
        setStatus("ready");
        return;
      }

      if (type === "init_error") {
        // Fallback so the button isn't permanently stuck
        setStatus("ready");
        setError(`Failed to load Python engine: ${e.data.message}`);
        return;
      }

      if (type === "result") {
        clearRunTimeout();
        const { success, output: out } = e.data;
        setStatus("ready");

        if (success) {
          setOutput(out);
          setError("");
        } else {
          setOutput("");
          setError(out);
        }
      }
    };

    worker.onerror = (err) => {
      console.error("[Python Worker] Error:", err);
      clearRunTimeout();
      try {
        worker.terminate();
      } catch (_) {}
      if (workerRef.current === worker) {
        workerRef.current = null;
      }
      setStatus("ready");
      setError(
        "Failed to load the Python engine. Check your internet connection, then try again."
      );
    };

    workerRef.current = worker;
    setStatus("loading");
  }, [clearRunTimeout]);

  useEffect(() => {
    initWorker();
    return () => {
      clearRunTimeout();
      if (workerRef.current) {
        try {
          workerRef.current.terminate();
        } catch (_) {}
        workerRef.current = null;
      }
    };
  }, [initWorker, clearRunTimeout]);

  const runCode = useCallback(
    (code) => {
      // Lazy init: if a previous TLE killed the worker, rebuild now.
      // This defers the 5–10s Pyodide download to the moment the
      // student actually re-runs code (not immediately after TLE).
      if (!workerRef.current) initWorker();

      setStatus("running");
      setOutput("");
      setError("");

      clearRunTimeout();
      timeoutRef.current = setTimeout(() => {
        // Kill the stuck worker. Do NOT auto-reinit — the next
        // runCode() call will lazily rebuild it.
        if (workerRef.current) {
          try {
            workerRef.current.terminate();
          } catch (_) {}
          workerRef.current = null;
        }
        setStatus("ready");
        setError(
          "Time Limit Exceeded: Your code took longer than 5 seconds to run. " +
            "Check for infinite loops. The Python engine will reload on your next run."
        );
      }, RUN_TIMEOUT_MS);

      try {
        workerRef.current.postMessage({ type: "run", code });
      } catch (err) {
        console.error("[Python Runner] postMessage failed:", err);
        clearRunTimeout();
        try {
          if (workerRef.current) {
            workerRef.current.terminate();
          }
        } catch (_) {}
        workerRef.current = null;
        setStatus("ready");
        setError("Could not send code to the Python engine. Please try again.");
      }
    },
    [initWorker, clearRunTimeout]
  );

  const clearOutput = useCallback(() => {
    setOutput("");
    setError("");
  }, []);

  return { status, output, error, runCode, clearOutput };
}