// src/components/exam/CodeEditor.jsx
import CodeMirror from "@uiw/react-codemirror";
import { python } from "@codemirror/lang-python";

/**
 * CodeEditor — thin wrapper around CodeMirror configured for Python.
 * Controlled component: `value` and `onChange` are required.
 */
export default function CodeEditor({
  value = "",
  onChange,
  disabled = false,
  placeholder = "Write your Python solution here…",
}) {
  return (
    <div className="code-editor">
      <CodeMirror
        value={value}
        onChange={onChange}
        editable={!disabled}
        placeholder={placeholder}
        extensions={[python()]}
        theme="dark"
        basicSetup={{
          lineNumbers: true,
          highlightActiveLine: true,
          highlightActiveLineGutter: true,
          foldGutter: false,
          dropCursor: false,
          allowMultipleSelections: false,
          indentOnInput: true,
          bracketMatching: true,
          closeBrackets: true,
          autocompletion: false,
          rectangularSelection: false,
          crosshairCursor: false,
          highlightSelectionMatches: false,
          searchKeymap: false,
          tabSize: 4,
        }}
      />
    </div>
  );
}