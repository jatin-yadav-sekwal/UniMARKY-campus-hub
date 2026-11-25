# Auth branding — removing `bmoxstzvmzzvxbnuqntz.supabase.co` from sign-in

## Symptom

When a student clicks **Google** on `/auth`, the Google account chooser says:

> Sign in with Google
> **to continue to bmoxstzvmzzvxbnuqntz.supabase.co**

## Why it happens

The web app signs in with `supabase.auth.signInWithOAuth({ provider: 'google' })`.
The Supabase project has **no custom Google OAuth credentials**, so Supabase
falls back to its shared Google OAuth client. In that case Google displays the
OAuth redirect host — the Supabase project reference
(`bmoxstzvmzzvxbnuqntz`) — instead of an application name.

`bmoxstzvmzzvxbnuqntz` is the Supabase **project ref**. It is not written
anywhere in the application source; it only appears in the project URL
(`VITE_SUPABASE_URL`, see `apps/web/.env`). No frontend code change can rename
it — the consent screen is rendered by Google from the OAuth client
configuration.

The same ref also appears briefly in the URL of email-confirmation links
(`https://bmoxstzvmzzvxbnuqntz.supabase.co/auth/v1/verify?...`) before Supabase
redirects back to the app.

## Fix — own Google OAuth client (≈10 minutes, dashboard only)

### 1. Create a Google OAuth client

1. Open the [Google Cloud Console](https://console.cloud.google.com/) and
   create (or select) a project named **UniMARKY**.
2. **APIs & Services → OAuth consent screen**:
   - User type: **External**
   - App name: **UniMARKY**
   - User support email: your address
   - Authorized domains: `unimarky.runs-on.dev` (add any other web origins)
   - Developer contact: your address
   - Publish the app (or keep it in *Testing* and add test users).
3. **APIs & Services → Credentials → Create credentials → OAuth client ID**:
   - Application type: **Web application**
   - Name: `UniMARKY Web`
   - Authorized JavaScript origins:
     - `https://unimarky.runs-on.dev`
     - `http://localhost:5173`
   - Authorized redirect URIs:
     - `https://bmoxstzvmzzvxbnuqntz.supabase.co/auth/v1/callback`
4. Copy the **Client ID** and **Client secret**.

> The redirect URI is fixed by Supabase. If you later move to a Supabase
> custom domain, use `https://<custom-domain>/auth/v1/callback` instead.

### 2. Enable the client in Supabase

Supabase Dashboard → your project → **Authentication → Providers → Google**:

- Toggle **Enable**
- Paste the **Client ID** and **Client secret**
- **Save**

The Google account chooser now shows **"to continue to UniMARKY"**.

### 3. Point auth back at the app

Supabase Dashboard → **Authentication → URL Configuration**:

- **Site URL**: `https://unimarky.runs-on.dev`
- **Redirect URLs** — add:
  - `https://unimarky.runs-on.dev/**`
  - `http://localhost:5173/**`
  - any preview domain, e.g. `https://*.vercel.app/**`

This is what makes the confirmation email and the OAuth callback land on the
app (`/auth`) instead of a Supabase-hosted page.

### 4. Brand the emails (recommended)

Supabase Dashboard → **Authentication → Emails**:

- Set the sender name to **UniMARKY** (configure custom SMTP — Resend,
  Postmark, SES, etc. — for reliable delivery).
- Replace the default templates so the copy says UniMARKY.

The verification link still passes through
`https://bmoxstzvmzzvxbnuqntz.supabase.co/auth/v1/verify?...` for a moment
before redirecting. That is normal for Supabase-hosted auth. Only a
[Supabase custom domain](https://supabase.com/docs/guides/platform/custom-domains)
(paid add-on) changes that host; the branded OAuth client above is what removes
the project ref from the sign-in screen.

## Verify

1. Open `https://<web-origin>/auth` and click **Google** → the chooser says
   *"to continue to UniMARKY"*.
2. Sign up with email → the confirmation link returns to
   `https://<web-origin>/auth`.

## Notes

- Never put the Google **client secret** in the web app or in `VITE_*`
  variables. It lives only in the Supabase dashboard.
- `VITE_GOOGLE_CLIENT_ID` is not read by the current code (Google OAuth is
  delegated to Supabase) and can be removed from local env files.