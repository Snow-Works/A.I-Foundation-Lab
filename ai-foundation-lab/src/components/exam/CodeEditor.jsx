// src/components/exam/CodeEditor.jsx
import CodeMirror from "@uiw/react-codemirror";
import { python } from "@codemirror/lang-python";

export default function CodeEditor({
  value = "",
  onChange,
  disabled = false,
  placeholder = "Write your Python solution here…",
}) {
  // These prevent default copy/paste/cut/drop inside the editor.
  // The proctoring hook also listens at the document level for
  // logging — this just blocks the actual data transfer.
  const stop = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div
      className="code-editor"
      onCopy={stop}
      onCut={stop}
      onPaste={stop}
      onDrop={stop}
      onDragStart={stop}
      onContextMenu={stop}
    >
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