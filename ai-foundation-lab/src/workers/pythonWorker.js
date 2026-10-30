/* global loadPyodide */
// src/workers/pythonWorker.js
importScripts("https://cdn.jsdelivr.net/pyodide/v0.26.2/full/pyodide.js");

let pyodideReadyPromise = null;

async function initPyodide() {
  if (pyodideReadyPromise) return pyodideReadyPromise;
  pyodideReadyPromise = (async () => {
    const pyodide = await loadPyodide({
      indexURL: "https://cdn.jsdelivr.net/pyodide/v0.26.2/full/",
    });
    return pyodide;
  })();
  return pyodideReadyPromise;
}

initPyodide()
  .then(() => {
    self.postMessage({ type: "ready" });
  })
  .catch((err) => {
    self.postMessage({ type: "init_error", message: err.message });
  });

self.onmessage = async (e) => {
  if (e.data.type !== "run") return;
  
  const { code } = e.data;
  
  try {
    const pyodide = await initPyodide();
    
    let output = "";
    pyodide.setStdout({ batched: (str) => { output += str + "\n"; } });
    pyodide.setStderr({ batched: (str) => { output += str + "\n"; } });

    await pyodide.runPythonAsync(code);
    
    self.postMessage({ 
      type: "result",
      success: true, 
      output: output.trim() || "Code executed successfully with no output." 
    });
  } catch (err) {
    self.postMessage({ 
      type: "result",
      success: false, 
      output: err.message 
    });
  }
};