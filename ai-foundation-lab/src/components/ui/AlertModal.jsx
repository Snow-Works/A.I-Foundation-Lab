// src/components/ui/AlertModal.jsx
import { AlertTriangle, ShieldAlert, CheckCircle2, Info } from "lucide-react";
import Modal from "./Modal.jsx";
import Button from "./Button.jsx";

const TONE_ICONS = {
    danger: AlertTriangle,
    warning: ShieldAlert,
    success: CheckCircle2,
    neutral: Info,
};

const TONE_ICON_SIZE = 22;

export default function AlertModal({
    open,
    onClose,
    title,
    description,
    tone = "warning",
    icon,
    confirmLabel = "Continue",
    cancelLabel = "Cancel",
    onConfirm,
    showCancel = true,
    showClose = true,
    closeOnBackdrop = true,
    closeOnEsc = true,
    size = "sm",
    children,
    loading = false,
}) {
    const IconComponent = icon || TONE_ICONS[tone] || TONE_ICONS.warning;

    const footer = (
        <>
            {showCancel && (
                <Button variant="ghost" size="md" onClick={onClose} disabled={loading}>
                    {cancelLabel}
                </Button>
            )}
            <Button
                variant={tone === "danger" ? "danger" : "primary"}
                size="md"
                onClick={onConfirm || onClose}
                loading={loading}
            >
                {confirmLabel}
            </Button>
        </>
    );

    return (
        <Modal
            open={open}
            onClose={onClose}
            title={title}
            tone={tone}
            size={size}
            icon={<IconComponent size={TONE_ICON_SIZE} />}
            footer={footer}
            showClose={showClose}
            closeOnBackdrop={closeOnBackdrop}
            closeOnEsc={closeOnEsc}
        >
            {description && <p>{description}</p>}
            {children}
        </Modal>
    );
}