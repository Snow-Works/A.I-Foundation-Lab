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
    };

    setStatus("loading");
  }, []);

  // Preload Pyodide as soon as the component mounts
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

    // 5-second safeguard against infinite loops
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

    workerRef.current.postMessage({ code });
  }, [initWorker]);

  const clearOutput = useCallback(() => {
    setOutput("");
    setError("");
  }, []);

  return { status, output, error, runCode, clearOutput };
}