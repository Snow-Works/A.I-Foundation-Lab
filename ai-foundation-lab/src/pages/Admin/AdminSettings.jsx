// src/pages/admin/AdminSettings.jsx
import { useState, useEffect } from "react";
import { Save, AlertTriangle, CheckCircle2, Loader2 } from "lucide-react";
import { getSettings, updateSettings } from "../../services/adminSettingsService.js";
import Card from "../../components/ui/Card.jsx";
import Button from "../../components/ui/Button.jsx";
import { Field, Input, Textarea, Checkbox } from "../../components/ui/Form.js";
import "./AdminSettings.css";

export default function AdminSettings() {
  const [settingsId, setSettingsId] = useState(null);
  const [formData, setFormData] = useState({
    telegram_group_url: "",
    telegram_enabled: false,
    require_roster_match: false,
    registration_open: false,
    exam_duration_minutes: 105,
    attempt_limit: 2,
    announcement: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const record = await getSettings();
        if (cancelled) return;

        if (record) {
          setSettingsId(record.id);
          setFormData({
            telegram_group_url: record.telegram_group_url || "",
            telegram_enabled: !!record.telegram_enabled,
            require_roster_match: !!record.require_roster_match,
            registration_open: !!record.registration_open,
            exam_duration_minutes: record.exam_duration_minutes || 105,
            attempt_limit: record.attempt_limit || 2,
            announcement: record.announcement || "",
          });
        } else {
          setError("No settings record found in the database. Please create one in PocketBase admin.");
        }
      } catch (err) {
        console.error("[admin-settings] load error:", err);
        if (!cancelled) setError("Failed to load settings.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setSuccess("");
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!settingsId) return;

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      await updateSettings(settingsId, {
        ...formData,
        exam_duration_minutes: Number(formData.exam_duration_minutes),
        attempt_limit: Number(formData.attempt_limit),
      });
      setSuccess("Settings saved successfully.");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("[admin-settings] save error:", err);
      setError(err?.response?.message || "Failed to save settings.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-settings__loading">
        <Loader2 size={24} className="admin-settings__spinner" />
        <span>Loading settings…</span>
      </div>
    );
  }

  return (
    <div className="admin-settings">
      <header className="admin-settings__header">
        <div>
          <h1 className="admin-settings__title">Settings</h1>
          <p className="admin-settings__subtitle">
            Configure the platform behavior. Changes take effect immediately.
          </p>
        </div>
      </header>

      {error && (
        <div className="admin-settings__alert admin-settings__alert--error">
          <AlertTriangle size={16} />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="admin-settings__alert admin-settings__alert--success">
          <CheckCircle2 size={16} />
          <span>{success}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="admin-settings__form">
        {/* 1. COMMUNITY */}
        <Card variant="glass" size="md" className="admin-settings__card">
          <h2 className="admin-settings__section-title">Community</h2>
          <div className="admin-settings__fields">
            <Field
              label="Telegram Group URL"
              hint="The link students see when their photo is verified."
            >
              <Input
                type="url"
                placeholder="https://t.me/+..."
                value={formData.telegram_group_url}
                onChange={(e) => handleChange("telegram_group_url", e.target.value)}
              />
            </Field>
            <div className="admin-settings__toggle-row">
              <Checkbox
                label="Enable Telegram community link"
                checked={formData.telegram_enabled}
                onChange={(e) => handleChange("telegram_enabled", e.target.checked)}
              />
              <p className="admin-settings__hint">
                When disabled, the community card on student profiles will show as "not ready".
              </p>
            </div>
          </div>
        </Card>

        {/* 2. REGISTRATION */}
        <Card variant="glass" size="md" className="admin-settings__card">
          <h2 className="admin-settings__section-title">Registration</h2>
          <div className="admin-settings__fields">
            <div className="admin-settings__toggle-row">
              <Checkbox
                label="Registration open"
                checked={formData.registration_open}
                onChange={(e) => handleChange("registration_open", e.target.checked)}
              />
              <p className="admin-settings__hint">
                Allow new students to sign up.
              </p>
            </div>
            <div className="admin-settings__toggle-row">
              <Checkbox
                label="Require roster match"
                checked={formData.require_roster_match}
                onChange={(e) => handleChange("require_roster_match", e.target.checked)}
              />
              <p className="admin-settings__hint">
                If enabled, students can only register if their first name and surname match an entry in the Roster.
              </p>
            </div>
          </div>
        </Card>

        {/* 3. EXAM CONFIGURATION */}
        <Card variant="glass" size="md" className="admin-settings__card">
          <h2 className="admin-settings__section-title">Exam Configuration</h2>
          <div className="admin-settings__fields admin-settings__fields--grid">
            <Field label="Duration (minutes)">
              <Input
                type="number"
                min={1}
                max={300}
                value={formData.exam_duration_minutes}
                onChange={(e) => handleChange("exam_duration_minutes", e.target.value)}
              />
            </Field>
            <Field label="Attempt limit">
              <Input
                type="number"
                min={1}
                max={10}
                value={formData.attempt_limit}
                onChange={(e) => handleChange("attempt_limit", e.target.value)}
              />
            </Field>
          </div>
        </Card>

        {/* 4. ANNOUNCEMENT */}
        <Card variant="glass" size="md" className="admin-settings__card">
          <h2 className="admin-settings__section-title">Announcement</h2>
          <div className="admin-settings__fields">
            <Field
              label="Global banner message"
              hint="Optional. Shown at the top of the student dashboard."
            >
              <Textarea
                value={formData.announcement}
                onChange={(e) => handleChange("announcement", e.target.value)}
                placeholder="e.g., Exam window opens this Friday at 10 AM WAT."
                maxLength={280}
                showCounter
              />
            </Field>
          </div>
        </Card>

        <div className="admin-settings__actions">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            leftIcon={<Save size={18} />}
            loading={saving}
            disabled={!settingsId}
          >
            {saving ? "Saving…" : "Save settings"}
          </Button>
        </div>
      </form>
    </div>
  );
}