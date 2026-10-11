// src/App.jsx
import { useState } from "react";
import { Mail, User, Search, AlertCircle, Check as CheckIcon } from "lucide-react";
import Button from "./components/ui/Button.jsx";
import Card from "./components/ui/Card.jsx";
import PillTab from "./components/ui/PillTab.jsx";
import {
  Field,
  Input,
  PasswordInput,
  PhoneInput,
  Textarea,
  Checkbox,
} from "./components/ui/Form.js";
import { GradientDefs } from "./components/ui/icons";

export default function App() {
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [bio, setBio] = useState("");
  const [agree, setAgree] = useState(false);

  return (
    <>
      <GradientDefs />
      <div
        style={{
          background: "var(--bg-base)",
          minHeight: "100dvh",
          color: "var(--white)",
        }}
      >
        {/* --- Registration form preview --- */}
        <section className="section">
          <div className="container-narrow">
            <p className="type-caption" style={{ marginBottom: "var(--space-3)" }}>
              Step 1.11 — form kit
            </p>
            <h2
              className="type-h3"
              style={{ color: "var(--white)", marginBottom: "var(--space-7)" }}
            >
              Registration preview
            </h2>

            <Card variant="glass" size="lg" withTab>
              <PillTab floating position="center" variant="primary">
                Register
              </PillTab>

              <div style={{ display: "grid", gap: "var(--space-5)" }}>
                <Field label="First name" required>
                  <Input
                    type="text"
                    placeholder="Williams"
                    leftIcon={<User size={16} />}
                    autoComplete="given-name"
                  />
                </Field>

                <Field label="Middle name">
                  <Input
                    type="text"
                    placeholder="Optional"
                    autoComplete="additional-name"
                  />
                </Field>

                <Field label="Surname" required>
                  <Input
                    type="text"
                    placeholder="Adaji-Agbane"
                    autoComplete="family-name"
                  />
                </Field>

                <Field
                  label="Email"
                  required
                  hint="Use the email you check most often — we'll verify it."
                >
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    leftIcon={<Mail size={16} />}
                    autoComplete="email"
                  />
                </Field>

                <Field label="WhatsApp number" required hint="Format: +234 801 234 5678">
                  <PhoneInput
                    country="NG"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </Field>

                <Field label="Password" required>
                  <PasswordInput
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 8 characters"
                    showStrength
                    autoComplete="new-password"
                  />
                </Field>

                <Field label="Confirm password" required>
                  <PasswordInput
                    placeholder="Re-enter your password"
                    autoComplete="new-password"
                  />
                </Field>

                <Checkbox
                  label="I confirm I used the same full name I used for my school registration."
                  checked={agree}
                  onChange={(e) => setAgree(e.target.checked)}
                />

                <Button variant="primary" size="lg" fullWidth disabled={!agree}>
                  Create account
                </Button>
              </div>
            </Card>
          </div>
        </section>

        {/* --- State variants --- */}
        <section className="section" style={{ paddingTop: 0 }}>
          <div className="container-narrow">
            <h2
              className="type-h3"
              style={{ color: "var(--white)", marginBottom: "var(--space-5)" }}
            >
              States
            </h2>

            <div style={{ display: "grid", gap: "var(--space-5)" }}>
              <Field label="Default">
                <Input placeholder="Hello" />
              </Field>

              <Field label="With hint" hint="This is a helpful hint.">
                <Input placeholder="Try me" />
              </Field>

              <Field label="Error state" error="This field is required.">
                <Input
                  placeholder="I have an error"
                  error
                  defaultValue=""
                />
              </Field>

              <Field label="Success state">
                <Input
                  placeholder="Verified"
                  success
                  defaultValue="williams@aifoundationlab.dev"
                  leftIcon={<CheckIcon size={16} />}
                />
              </Field>

              <Field label="Disabled">
                <Input placeholder="Can't touch this" disabled />
              </Field>

              <Field label="Small">
                <Input size="sm" placeholder="Compact input" leftIcon={<Search size={14} />} />
              </Field>

              <Field label="Large">
                <Input size="lg" placeholder="Big input" />
              </Field>

              <Field
                label="Bio"
                hint="Short bio — a sentence or two is fine."
              >
                <Textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="I'm a computer science student at…"
                  maxLength={280}
                  autoGrow
                />
              </Field>
            </div>
          </div>
        </section>

        <div style={{ height: "var(--space-8)" }} />
      </div>
    </>
  );
}