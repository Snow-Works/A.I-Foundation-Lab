// src/components/ui/icons/JourneyIcons.jsx

const base = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.75,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    xmlns: "http://www.w3.org/2000/svg",
};

/* --- 1. Register — person + plus --- */
export function RegisterIcon({ size = 24, className = "", ...rest }) {
    return (
        <svg {...base} width={size} height={size} className={className} {...rest}>
            <circle cx="9" cy="8" r="3.5" />
            <path d="M2.5 20c0-3.5 2.9-6 6.5-6s6.5 2.5 6.5 6" />
            <line x1="19" y1="7" x2="19" y2="13" />
            <line x1="16" y1="10" x2="22" y2="10" />
        </svg>
    );
}

/* --- 2. Verify — shield + check --- */
export function VerifyIcon({ size = 24, className = "", ...rest }) {
    return (
        <svg {...base} width={size} height={size} className={className} {...rest}>
            <path d="M12 22s8-3.8 8-10V5.5L12 3 4 5.5V12c0 6.2 8 10 8 10z" />
            <path d="m8.5 12 2.5 2.5L15.5 10" />
        </svg>
    );
}

/* --- 3. Photo — framed face --- */
export function PhotoIcon({ size = 24, className = "", ...rest }) {
    return (
        <svg {...base} width={size} height={size} className={className} {...rest}>
            <rect x="3" y="3" width="18" height="18" rx="3" />
            <circle cx="12" cy="10.5" r="2.5" />
            <path d="M7 19c.9-2.3 2.9-3.5 5-3.5s4.1 1.2 5 3.5" />
        </svg>
    );
}

/* --- 4. Community — overlapping people --- */
export function CommunityIcon({ size = 24, className = "", ...rest }) {
    return (
        <svg {...base} width={size} height={size} className={className} {...rest}>
            <circle cx="9" cy="8" r="3.25" />
            <path d="M2.75 20c0-3.3 2.7-5.5 6.25-5.5s6.25 2.2 6.25 5.5" />
            <circle cx="18" cy="9" r="2.25" />
            <path d="M16 19c0-1.8.9-3.2 2.6-3.6" />
            <path d="M22 18.5c-.5-1.3-1.7-2.3-3-2.5" />
        </svg>
    );
}

/* --- 5. Orientation — compass --- */
export function OrientationIcon({ size = 24, className = "", ...rest }) {
    return (
        <svg {...base} width={size} height={size} className={className} {...rest}>
            <circle cx="12" cy="12" r="9" />
            <path d="m15.5 8.5-2.2 5.3-5.3 2.2 2.2-5.3z" />
            <circle cx="12" cy="12" r="0.9" fill="currentColor" stroke="none" />
        </svg>
    );
}

/* --- 6. Identity — ID card --- */
export function IdentityIcon({ size = 24, className = "", ...rest }) {
    return (
        <svg {...base} width={size} height={size} className={className} {...rest}>
            <rect x="2.5" y="5" width="19" height="14" rx="2.5" />
            <circle cx="9" cy="11" r="2" />
            <path d="M5.5 16.5c.5-1.4 1.8-2.2 3.5-2.2s3 .8 3.5 2.2" />
            <line x1="15" y1="10.5" x2="19" y2="10.5" />
            <line x1="15" y1="13.5" x2="18" y2="13.5" />
        </svg>
    );
}

/* --- 7. Exam — code document --- */
export function ExamIcon({ size = 24, className = "", ...rest }) {
    return (
        <svg {...base} width={size} height={size} className={className} {...rest}>
            <path d="M14 3H6.5A2.5 2.5 0 0 0 4 5.5v13A2.5 2.5 0 0 0 6.5 21h11a2.5 2.5 0 0 0 2.5-2.5V9z" />
            <path d="M14 3v5.5a.5.5 0 0 0 .5.5H20" />
            <path d="m10 13.5-2 2 2 2" />
            <path d="m14 13.5 2 2-2 2" />
        </svg>
    );
}

/* --- 8. Result — trophy --- */
export function ResultIcon({ size = 24, className = "", ...rest }) {
    return (
        <svg {...base} width={size} height={size} className={className} {...rest}>
            <path d="M7 4h10v5a5 5 0 0 1-10 0z" />
            <path d="M7 6H4v1.5A3.5 3.5 0 0 0 7.5 11" />
            <path d="M17 6h3v1.5A3.5 3.5 0 0 1 16.5 11" />
            <line x1="12" y1="14" x2="12" y2="17" />
            <path d="M9 17h6v3.5H9z" />
            <line x1="8.5" y1="20.5" x2="15.5" y2="20.5" />
        </svg>
    );
}

/*  Named export map (handy for iterating in a showcase)  */
export const JourneyIcons = {
    Register: RegisterIcon,
    Verify: VerifyIcon,
    ShieldCheck: ShieldCheckIcon,
    Photo: PhotoIcon,
    Community: CommunityIcon,
    Orientation: OrientationIcon,
    Identity: IdentityIcon,
    Exam: ExamIcon,
    Result: ResultIcon,
};




/* Extra: Shield check (admin approved)  */
export function ShieldCheckIcon({ size = 24, className = "", ...rest }) {
    return (
        <svg {...base} width={size} height={size} className={className} {...rest}>
            <path d="M12 22s8-3.8 8-10V5.5L12 3 4 5.5V12c0 6.2 8 10 8 10z" />
            <path d="M9.5 12.5h5" />
            <path d="M12 10v5" />
        </svg>
    );
}