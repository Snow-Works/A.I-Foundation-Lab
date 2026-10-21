// src/components/admin/QuestionFormModal.jsx
import { useState, useEffect } from "react";
import Modal from "../ui/Modal.jsx";
import Button from "../ui/Button.jsx";
import { Field, Input, Textarea } from "../ui/Form.js";
import { AlertTriangle } from "lucide-react";
import "./QuestionFormModal.css";

export default function QuestionFormModal({
  open,
  onClose,
  onSave,
  question,
  saving = false,
  error = "",
}) {
  const isEditing = !!question;

  const [formData, setFormData] = useState({
    title: "",
    prompt: "",
    difficulty: "medium",
    topic: "",
    rubric: "",
    sample_solution: "",
    active: true,
  });

  // Reset form when modal opens or question changes
  useEffect(() => {
    if (open) {
      if (question) {
        setFormData({
          title: question.title || "",
          prompt: question.prompt || "",
          difficulty: question.difficulty || "medium",
          topic: question.topic || "",
          rubric: question.rubric || "",
          sample_solution: question.sample_solution || "",
          active: question.active !== false,
        });
      } else {
        setFormData({
          title: "",
          prompt: "",
          difficulty: "medium",
          topic: "",
          rubric: "",
          sample_solution: "",
          active: true,
        });
      }
    }
  }, [open, question]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const footer = (
    <>
      <Button variant="ghost" onClick={onClose} disabled={saving}>
        Cancel
      </Button>
      <Button variant="primary" onClick={handleSubmit} loading={saving}>
        {saving ? "Saving…" : isEditing ? "Save changes" : "Create question"}
      </Button>
    </>
  );

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEditing ? "Edit question" : "New question"}
      size="lg"
      footer={footer}
      closeOnBackdrop={!saving}
      closeOnEsc={!saving}
    >
      <form className="q-form" onSubmit={handleSubmit}>
        {error && (
          <div className="q-form__error">
            <AlertTriangle size={16} />
            <span>{error}</span>
          </div>
        )}

        <div className="q-form__row">
          <Field label="Title" required hint="Short name shown in the exam sidebar.">
            <Input
              value={formData.title}
              onChange={(e) => handleChange("title", e.target.value)}
              placeholder="e.g., Filter List Comprehension"
              required
            />
          </Field>

          <Field label="Topic" hint="e.g., Core Language, Async, OOP">
            <Input
              value={formData.topic}
              onChange={(e) => handleChange("topic", e.target.value)}
              placeholder="Optional"
            />
          </Field>

          <Field label="Difficulty" required>
            <select
              className="q-form__select"
              value={formData.difficulty}
              onChange={(e) => handleChange("difficulty", e.target.value)}
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </Field>
        </div>

        <Field
          label="Prompt"
          required
          hint="Supports basic HTML: <p>, <pre>, <code>."
        >
          <Textarea
            value={formData.prompt}
            onChange={(e) => handleChange("prompt", e.target.value)}
            placeholder="<p>Extract all even numbers...</p><pre>evens = [x for x in numbers if ___]</pre>"
            minRows={6}
            required
          />
        </Field>

        <Field
          label="Rubric"
          hint="Instructions for the marker on how to grade this."
        >
          <Textarea
            value={formData.rubric}
            onChange={(e) => handleChange("rubric", e.target.value)}
            placeholder="Full marks if the student uses..."
            minRows={3}
          />
        </Field>

        <Field
          label="Sample Solution"
          hint="Reference code for the marker."
        >
          <Textarea
            value={formData.sample_solution}
            onChange={(e) => handleChange("sample_solution", e.target.value)}
            placeholder="evens = [x for x in numbers if x % 2 == 0]"
            minRows={3}
            className="q-form__code-input"
          />
        </Field>

        <div className="q-form__checkbox">
          <label>
            <input
              type="checkbox"
              checked={formData.active}
              onChange={(e) => handleChange("active", e.target.checked)}
            />
            <span>Active (available for exams)</span>
          </label>
        </div>
      </form>
    </Modal>
  );
}