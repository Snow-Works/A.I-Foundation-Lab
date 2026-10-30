// src/components/ui/Modal.jsx
import { forwardRef, useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { X } from "lucide-react";
import "./Modal.css";

/* ------------ Focus helpers ------------ */
const FOCUSABLE =
    'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

function getFocusable(root) {
    if (!root) return [];
    return Array.from(root.querySelectorAll(FOCUSABLE)).filter(
        (el) => el.offsetParent !== null || el === document.activeElement
    );
}

/* ------------ Body scroll lock ------------ */
let lockCount = 0;
function lockScroll() {
    if (lockCount === 0) {
        const scrollbarWidth =
            window.innerWidth - document.documentElement.clientWidth;
        document.body.style.overflow = "hidden";
        if (scrollbarWidth > 0) {
            document.body.style.paddingRight = `${scrollbarWidth}px`;
        }
    }
    lockCount += 1;
}
function unlockScroll() {
    lockCount = Math.max(0, lockCount - 1);
    if (lockCount === 0) {
        document.body.style.overflow = "";
        document.body.style.paddingRight = "";
    }
}

/* ------------ Component ------------ */
const Modal = forwardRef(function Modal(
    {
        open,
        onClose,
        title,
        subtitle,
        icon = null,
        tone = "neutral",       // "neutral" | "danger" | "warning" | "success"
        size = "md",            // "sm" | "md" | "lg"
        children,
        footer = null,
        stackFooter = false,
        closeOnBackdrop = true,
        closeOnEsc = true,
        showClose = true,
        initialFocusRef = null,
        className = "",
        labelledBy: labelledByProp,
        ...rest
    },
    ref
) {
    const prefersReducedMotion = useReducedMotion();
    const dialogRef = useRef(null);
    const generatedId = useId().replace(/:/g, "");
    const titleId = `modal-title-${generatedId}`;
    const descId = `modal-desc-${generatedId}`;
    const labelledBy = labelledByProp || (title ? titleId : undefined);
    const lastFocusedRef = useRef(null);

    /* ---- Handle open/close side-effects ---- */
    useEffect(() => {
        if (!open) return;

        lastFocusedRef.current = document.activeElement;
        lockScroll();

        // Focus initial target after mount
        const timer = setTimeout(() => {
            const target =
                (initialFocusRef && initialFocusRef.current) ||
                getFocusable(dialogRef.current)[0] ||
                dialogRef.current;
            target?.focus?.();
        }, 20);

        return () => {
            clearTimeout(timer);
            unlockScroll();
            const prev = lastFocusedRef.current;
            if (prev && typeof prev.focus === "function") {
                prev.focus();
            }
        };
    }, [open, initialFocusRef]);

    /* ---- ESC + focus trap ---- */
    useEffect(() => {
        if (!open) return;

        const handleKeyDown = (e) => {
            if (e.key === "Escape" && closeOnEsc) {
                e.stopPropagation();
                onClose?.();
                return;
            }
            if (e.key !== "Tab") return;

            const focusables = getFocusable(dialogRef.current);
            if (focusables.length === 0) {
                e.preventDefault();
                dialogRef.current?.focus();
                return;
            }
            const first = focusables[0];
            const last = focusables[focusables.length - 1];
            const active = document.activeElement;

            if (e.shiftKey && active === first) {
                e.preventDefault();
                last.focus();
            } else if (!e.shiftKey && active === last) {
                e.preventDefault();
                first.focus();
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [open, closeOnEsc, onClose]);

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget && closeOnBackdrop) {
            onClose?.();
        }
    };

    /* ---- Motion variants ---- */
    const backdropVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
    };

    const dialogVariants = prefersReducedMotion
        ? { hidden: { opacity: 0 }, visible: { opacity: 1 }, exit: { opacity: 0 } }
        : {
            hidden: { opacity: 0, y: 12, scale: 0.97 },
            visible: {
                opacity: 1,
                y: 0,
                scale: 1,
                transition: { duration: 0.22, ease: [0.22, 1, 0.36, 1] },
            },
            exit: {
                opacity: 0,
                y: 8,
                scale: 0.98,
                transition: { duration: 0.15, ease: [0.22, 1, 0.36, 1] },
            },
        };

    const modalClasses = [
        "modal",
        `modal--${size}`,
        tone !== "neutral" && `modal--tone-${tone}`,
        className,
    ]
        .filter(Boolean)
        .join(" ");

    if (typeof document === "undefined") return null;

    return createPortal(
        <AnimatePresence>
            {open && (
                <motion.div
                    key="backdrop"
                    className="modal-backdrop"
                    variants={backdropVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    transition={{ duration: prefersReducedMotion ? 0.01 : 0.18 }}
                    onMouseDown={handleBackdropClick}
                >
                    <motion.div
                        ref={(node) => {
                            dialogRef.current = node;
                            if (typeof ref === "function") ref(node);
                            else if (ref) ref.current = node;
                        }}
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby={labelledBy}
                        aria-describedby={children ? descId : undefined}
                        tabIndex={-1}
                        className={modalClasses}
                        variants={dialogVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        onMouseDown={(e) => e.stopPropagation()}
                        {...rest}
                    >
                        {(title || icon || showClose) && (
                            <div className="modal__header">
                                {icon && <span className="modal__icon">{icon}</span>}

                                <div className="modal__title-wrap">
                                    {title && (
                                        <h2 id={titleId} className="modal__title">
                                            {title}
                                        </h2>
                                    )}
                                    {subtitle && (
                                        <div className="modal__subtitle">{subtitle}</div>
                                    )}
                                </div>

                                {showClose && (
                                    <button
                                        type="button"
                                        className="modal__close"
                                        onClick={onClose}
                                        aria-label="Close dialog"
                                    >
                                        <X size={18} />
                                    </button>
                                )}
                            </div>
                        )}

                        {children && (
                            <div id={descId} className="modal__body">
                                {children}
                            </div>
                        )}

                        {footer && (
                            <div
                                className={[
                                    "modal__footer",
                                    stackFooter && "modal__footer--stack",
                                ]
                                    .filter(Boolean)
                                    .join(" ")}
                            >
                                {footer}
                            </div>
                        )}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>,
        document.body
    );
});

export default Modal;