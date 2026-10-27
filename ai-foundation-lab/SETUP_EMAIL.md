# Email Setup — Password Reset & Verification

AI Foundation Lab sends three types of emails from PocketBase:

1. **Email verification** — sent on registration
2. **Password reset** — sent via `/forgot-password`
3. **Auth alerts** (optional) — sent on new device logins

By default, PocketBase's email links point at its own admin UI, not your app. **You must configure this once** so links go to your frontend.

## Development (no SMTP — emails go to terminal)

PocketBase prints emails to its console when no SMTP is configured. Perfect for local testing.

### One-time setup in PocketBase admin UI

1. Open `http://127.0.0.1:8090/_/`
2. Log in as superuser
3. **Settings → Application** → set **Application URL** to: