# NexaCart — seller account foundation

A Next.js 15 + Supabase starter implementing open seller registration and secure accounts.

## Included
- Public seller registration with name, shop name, email, country and password
- Supabase email/password authentication and email-confirmation callback
- Sign-in, sign-out and protected seller dashboard
- Database trigger automatically provisions an active store for each new auth user
- Row Level Security: sellers can access only their own profile and store
- No manual seller approval queue

## Connect your Supabase project
1. Create a project at https://supabase.com/dashboard.
2. In Project Settings → API, copy the Project URL and publishable key (or legacy anon key).
3. Run `supabase/migrations/0001_seller_accounts.sql` in the Supabase SQL Editor.
4. Copy `.env.example` to `.env.local` and add your project URL, publishable/anon key, and site URL.
5. In Supabase Authentication → URL Configuration, add `http://localhost:3000/auth/callback` and your production `https://YOUR_DOMAIN/auth/callback`.
6. Configure production SMTP/email delivery and your email-confirmation policy.

## Run locally
Requires Node.js 20+.
```bash
npm install
npm run dev
```
Open http://localhost:3000.

## Deploy
Import the project into Vercel or another Next.js host and set the same environment variables. Add the production callback URL to Supabase.

## Security and launch checklist
- The Supabase publishable/anon key is intended for public clients; RLS is the security boundary.
- Never expose a service-role key in client code or a `NEXT_PUBLIC_*` variable.
- Configure CAPTCHA/bot protection, email verification, rate limits, monitoring, audit logs, privacy policy and seller terms before public launch.
- Open registration does not mean unrestricted payouts: perform legally appropriate identity/business and payout verification before enabling withdrawals; retain the ability to suspend abusive accounts.
- This is the authentication and seller-account foundation only. Product publishing, image storage, inventory, orders, payments, commissions, tax, shipping, refunds and payouts remain to be implemented.
