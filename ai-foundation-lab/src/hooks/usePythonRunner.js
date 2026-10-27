// src/hooks/usePythonRunner.js
import { useEffect, useRef, useState, useCallback } from "react";

export function usePythonRunner() {
  const workerRef = useRef(null);
  const timeoutRef = useRef(null);
  
  const [status, setStatus] = useState("loading"); // loading | ready | running
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  const initWorker = useCallback(() => {
    if (workerRef.current) return;

    workerRef.current = new Worker(
      new URL("../workers/pythonWorker.js", import.meta.url)
    );

    workerRef.current.onmessage = (e) => {
      const { type } = e.data;

      if (type === "ready") {
        setStatus("ready");
        return;
      }

      if (type === "init_error") {
        setStatus("ready"); // Fallback so button isn't permanently stuck
        setError(`Failed to load Python engine: ${e.data.message}`);
        return;
      }

      if (type === "result") {
        clearTimeout(timeoutRef.current);
        const { success, output } = e.data;
        setStatus("ready");
        
        if (success) {
          setOutput(output);
          setError("");
        } else {
          setOutput("");
          setError(output);
        }
      }
    };

    // Catch hard crashes (e.g., if the CDN is blocked)
    workerRef.current.onerror = (err) => {
      console.error("[Python Worker] Error:", err);
      setStatus("ready");
      setError("Failed to load the Python engine. Check your internet connection.");
    };

    setStatus("loading");
  }, []);

  useEffect(() => {
    initWorker();
    return () => {
      if (workerRef.current) {
        workerRef.current.terminate();
        workerRef.current = null;
      }
      clearTimeout(timeoutRef.current);
    };
  }, [initWorker]);

  const runCode = useCallback((code) => {
    if (!workerRef.current) initWorker();
    
    setStatus("running");
    setOutput("");
    setError("");

    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      if (workerRef.current) {
        workerRef.current.terminate();
        workerRef.current = null;
      }
      setStatus("ready");
      setError("Time Limit Exceeded: Your code took longer than 5 seconds to run. Check for infinite loops.");
      initWorker();
    }, 5000);

    // Tell the worker we want to run code
    workerRef.current.postMessage({ type: "run", code });
  }, [initWorker]);

  const clearOutput = useCallback(() => {
    setOutput("");
    setError("");
  }, []);

  return { status, output, error, runCode, clearOutput };
}