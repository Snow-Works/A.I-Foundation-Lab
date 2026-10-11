// src/pages/style-guide/sections/Components.jsx
import { useState } from "react";
import {
    ArrowRight,
    Play,
    Plus,
    X,
    Download,
    LogIn,
    Mail,
    User,
    Search,
    AlertTriangle,
    CheckCircle2,
    ShieldAlert,
    Trash2,
    Camera,
    Sparkles,
} from "lucide-react";
import Button from "../../../components/ui/Button.jsx";
import Card from "../../../components/ui/Card.jsx";
import PillTab from "../../../components/ui/PillTab.jsx";
import Modal from "../../../components/ui/Modal.jsx";
import AlertModal from "../../../components/ui/AlertModal.jsx";
import {
    Field,
    Input,
    PasswordInput,
    PhoneInput,
    Textarea,
    Checkbox,
} from "../../../components/ui/Form.js";
import { GradientDefs } from "../../../components/ui/icons";

export default function Components() {
    const [loading, setLoading] = useState(false);
    const [password, setPassword] = useState("");
    const [phone, setPhone] = useState("");
    const [bio, setBio] = useState("");
    const [agree, setAgree] = useState(false);

    const [violationOpen, setViolationOpen] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [successOpen, setSuccessOpen] = useState(false);
    const [photoOpen, setPhotoOpen] = useState(false);

    const simulate = () => {
        setLoading(true);
        setTimeout(() => setLoading(false), 1600);
    };

    return (
        <>
            <GradientDefs />

            {/* --- BUTTONS --- */}
            <section className="sg-section">
                <header className="sg-section__header">
                    <h2 className="sg-section__title">Buttons</h2>
                    <p className="sg-section__desc">
                        Five variants, three sizes, loading and disabled states.
                    </p>
                </header>

                <div style={{ display: "flex", gap: "var(--space-3)", flexWrap: "wrap", marginBottom: "var(--space-5)" }}>
                    <Button variant="primary">Primary</Button>
                    <Button variant="secondary">Secondary</Button>
                    <Button variant="ghost">Ghost</Button>
                    <Button variant="danger">Danger</Button>
                    <Button variant="icon" aria-label="Add"><Plus size={18} /></Button>
                </div>

                <div style={{ display: "flex", gap: "var(--space-3)", flexWrap: "wrap", marginBottom: "var(--space-5)" }}>
                    <Button size="sm">Small</Button>
                    <Button size="md">Medium</Button>
                    <Button size="lg">Large</Button>
                </div>

                <div style={{ display: "flex", gap: "var(--space-3)", flexWrap: "wrap" }}>
                    <Button variant="primary" rightIcon={<ArrowRight size={16} />}>Register</Button>
                    <Button variant="secondary" leftIcon={<Play size={16} />}>Watch intro</Button>
                    <Button variant="ghost" leftIcon={<LogIn size={16} />}>Log in</Button>
                    <Button variant="primary" loading={loading} onClick={simulate} leftIcon={<Download size={16} />}>
                        {loading ? "Submitting…" : "Simulate loading"}
                    </Button>
                    <Button variant="primary" disabled>Disabled</Button>
                </div>
            </section>

            {/* --- CARDS --- */}
            <section className="sg-section">
                <header className="sg-section__header">
                    <h2 className="sg-section__title">Cards</h2>
                    <p className="sg-section__desc">
                        Glass, strong, outline, and gradient surfaces.
                    </p>
                </header>

                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(min(240px, 100%), 1fr))",
                        gap: "var(--space-4)",
                    }}
                >
                    <Card variant="glass" size="md">
                        <span className="type-label" style={{ color: "var(--pink-400)" }}>Glass</span>
                        <p className="type-body" style={{ marginTop: "var(--space-2)" }}>
                            Translucent indigo with backdrop blur.
                        </p>
                    </Card>
                    <Card variant="strong" size="md">
                        <span className="type-label" style={{ color: "var(--cyan-400)" }}>Strong</span>
                        <p className="type-body" style={{ marginTop: "var(--space-2)" }}>
                            Higher contrast for exam and modal surfaces.
                        </p>
                    </Card>
                    <Card variant="outline" size="md">
                        <span className="type-label" style={{ color: "var(--text-secondary)" }}>Outline</span>
                        <p className="type-body" style={{ marginTop: "var(--space-2)" }}>
                            Border only, no fill.
                        </p>
                    </Card>
                    <Card variant="gradient" size="md">
                        <span className="type-label" style={{ color: "var(--white)" }}>Gradient</span>
                        <p className="type-body" style={{ marginTop: "var(--space-2)", color: "var(--white)" }}>
                            Signature gradient surface.
                        </p>
                    </Card>
                </div>
            </section>

            {/* --- PILL TABS --- */}
            <section className="sg-section">
                <header className="sg-section__header">
                    <h2 className="sg-section__title">Pill tabs</h2>
                    <p className="sg-section__desc">
                        Overlapping labels — the poster's MISSION / VISION pattern.
                    </p>
                </header>

                <div style={{ display: "grid", gap: "var(--space-7)" }}>
                    <Card variant="glass" size="md" withTab glow="pink">
                        <PillTab floating position="center" variant="default">Mission</PillTab>
                        <p className="type-body">
                            Pill floating over the top edge, centered. The default treatment.
                        </p>
                    </Card>

                    <Card variant="glass" size="md" withTab glow="cyan">
                        <PillTab floating position="left" variant="primary">Left</PillTab>
                        <p className="type-body">Anchored to the left edge.</p>
                    </Card>

                    <Card variant="glass" size="md" withTab glow="orange">
                        <PillTab floating position="right" variant="cyan">Right</PillTab>
                        <p className="type-body">Anchored to the right edge.</p>
                    </Card>
                </div>

                <div style={{ display: "flex", gap: "var(--space-3)", flexWrap: "wrap", marginTop: "var(--space-5)" }}>
                    <PillTab variant="default">Default</PillTab>
                    <PillTab variant="primary">Primary</PillTab>
                    <PillTab variant="cyan">Cyan</PillTab>
                    <PillTab variant="silver">Silver</PillTab>
                </div>
            </section>

            {/* --- FORM KIT --- */}
            <section className="sg-section">
                <header className="sg-section__header">
                    <h2 className="sg-section__title">Form kit</h2>
                    <p className="sg-section__desc">
                        Field, Input, PasswordInput, PhoneInput, Textarea, Checkbox.
                    </p>
                </header>

                <div style={{ maxWidth: 560, display: "grid", gap: "var(--space-5)" }}>
                    <Field label="First name" required>
                        <Input type="text" placeholder="Williams" leftIcon={<User size={16} />} />
                    </Field>

                    <Field label="Email" required hint="We'll verify this.">
                        <Input type="email" placeholder="you@example.com" leftIcon={<Mail size={16} />} />
                    </Field>

                    <Field label="WhatsApp number" required hint="Format: +234 801 234 5678">
                        <PhoneInput country="NG" value={phone} onChange={(e) => setPhone(e.target.value)} />
                    </Field>

                    <Field label="Password" required>
                        <PasswordInput value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 8 characters" showStrength />
                    </Field>

                    <Field label="Error state" error="This field is required.">
                        <Input placeholder="I have an error" error />
                    </Field>

                    <Field label="Search">
                        <Input size="sm" placeholder="Compact input" leftIcon={<Search size={14} />} />
                    </Field>

                    <Field label="Bio" hint="Short bio — a sentence or two is fine.">
                        <Textarea value={bio} onChange={(e) => setBio(e.target.value)} placeholder="I'm a computer science student at…" maxLength={280} autoGrow />
                    </Field>

                    <Checkbox label="I confirm I used the same name I used for my school registration." checked={agree} onChange={(e) => setAgree(e.target.checked)} />
                </div>
            </section>

            {/* --- MODALS --- */}
            <section className="sg-section">
                <header className="sg-section__header">
                    <h2 className="sg-section__title">Modals</h2>
                    <p className="sg-section__desc">
                        Base dialog plus a composed alert variant. Focus-trapped,
                        ESC-closable, portal-rendered.
                    </p>
                </header>

                <div style={{ display: "flex", gap: "var(--space-3)", flexWrap: "wrap" }}>
                    <Button variant="primary" rightIcon={<ShieldAlert size={16} />} onClick={() => setViolationOpen(true)}>
                        Warning modal
                    </Button>
                    <Button variant="danger" leftIcon={<Trash2 size={16} />} onClick={() => setConfirmOpen(true)}>
                        Destructive
                    </Button>
                    <Button variant="secondary" leftIcon={<CheckCircle2 size={16} />} onClick={() => setSuccessOpen(true)}>
                        Success
                    </Button>
                    <Button variant="ghost" leftIcon={<Camera size={16} />} onClick={() => setPhotoOpen(true)}>
                        Large
                    </Button>
                </div>
            </section>

            {/* --- MODAL INSTANCES --- */}
            <AlertModal
                open={violationOpen}
                onClose={() => setViolationOpen(false)}
                tone="warning"
                title="Exam ended — a violation was detected"
                description="Switching tabs or exiting fullscreen during the exam is not allowed. This attempt has been recorded."
                confirmLabel="I understand"
                cancelLabel="Retake now"
                showCancel
                closeOnBackdrop={false}
                closeOnEsc={false}
            />

            <Modal
                open={confirmOpen}
                onClose={() => setConfirmOpen(false)}
                title="Delete this question?"
                subtitle="This action cannot be undone."
                tone="danger"
                size="sm"
                icon={<AlertTriangle size={22} />}
                footer={
                    <>
                        <Button variant="ghost" onClick={() => setConfirmOpen(false)}>Cancel</Button>
                        <Button variant="danger" onClick={() => setConfirmOpen(false)}>Delete permanently</Button>
                    </>
                }
            >
                <p>Deleting this question will remove it from the bank permanently.</p>
            </Modal>

            <Modal
                open={successOpen}
                onClose={() => setSuccessOpen(false)}
                tone="success"
                size="sm"
                icon={<CheckCircle2 size={22} />}
                title="Answers submitted"
                footer={<Button variant="primary" onClick={() => setSuccessOpen(false)}>Back to profile</Button>}
            >
                <p>Your answers have been stored securely and are now under review.</p>
            </Modal>

            <Modal
                open={photoOpen}
                onClose={() => setPhotoOpen(false)}
                title="Photo verification"
                subtitle="Make sure your face is clearly visible."
                icon={<Camera size={22} />}
                size="lg"
                footer={
                    <>
                        <Button variant="ghost" onClick={() => setPhotoOpen(false)}>Retake</Button>
                        <Button variant="primary" onClick={() => setPhotoOpen(false)}>Use this photo</Button>
                    </>
                }
            >
                <div
                    style={{
                        aspectRatio: "1 / 1",
                        maxWidth: 320,
                        margin: "0 auto",
                        borderRadius: "var(--radius-lg)",
                        background: "var(--gradient-signature)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <Sparkles size={40} className="icon-gradient" />
                </div>
            </Modal>
        </>
    );
}