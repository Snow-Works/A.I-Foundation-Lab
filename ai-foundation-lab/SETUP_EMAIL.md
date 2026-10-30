# Email Setup — Password Reset, Verification & Notifications

AI Foundation Lab sends five types of emails from PocketBase:

1. **Email verification** — sent on registration (built-in)
2. **Password reset** — sent via `/forgot-password` (built-in)
3. **Account approved** — sent automatically when admin approves (custom hook)
4. **Account rejected** — sent automatically when admin rejects (custom hook)
5. **Results released** — sent automatically when admin releases marks (custom hook)

---

## Development (no SMTP — emails go to terminal)

PocketBase prints emails to its console when no SMTP is configured. Perfect for local testing.

### One-time setup in PocketBase admin UI

1. Open `http://127.0.0.1:8090/_/`
2. Log in as superuser
3. **Settings → Application** → set **Application URL** to: