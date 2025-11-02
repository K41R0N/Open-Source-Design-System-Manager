# Deployment Guide: Netlify + Supabase

This guide walks you through deploying the Open Source Design System Manager to Netlify with Supabase as the backend.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Supabase Setup](#supabase-setup)
3. [OAuth Configuration](#oauth-configuration)
4. [Netlify Deployment](#netlify-deployment)
5. [Environment Variables](#environment-variables)
6. [Verification](#verification)
7. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before you begin, ensure you have:

- ✅ A GitHub account (for OAuth and repository access)
- ✅ A Google account (optional, for Google OAuth)
- ✅ Access to the project repository
- ✅ Basic familiarity with environment variables

---

## Supabase Setup

### Step 1: Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign in or create an account
3. Click "New Project"
4. Fill in the project details:
   - **Name**: `design-system-manager` (or your preferred name)
   - **Database Password**: Generate a strong password and save it securely
   - **Region**: Choose the region closest to your users
5. Click "Create new project"
6. Wait 2-3 minutes for the project to be provisioned

### Step 2: Run the Database Migration

1. In your Supabase project dashboard, navigate to:
   **SQL Editor** (left sidebar)

2. Open the migration file in this repository:
   `supabase/migrations/20250102_initial_schema.sql`

3. Copy the entire contents of the SQL file

4. Paste into the SQL Editor in Supabase

5. Click "Run" to execute the migration

6. Verify success - you should see:
   ```
   Success. No rows returned
   ```

7. Navigate to **Table Editor** to verify the tables were created:
   - `components`
   - `projects`
   - `tags`

### Step 3: Get API Credentials

1. Navigate to: **Project Settings** (gear icon in left sidebar) → **API**

2. Copy the following values (you'll need them for Netlify):
   - **Project URL** (e.g., `https://abcdefghijk.supabase.co`)
   - **anon/public key** (the long string under "Project API keys")

⚠️ **Important**: Never use the `service_role` key in your frontend application!

---

## OAuth Configuration

You need to configure OAuth providers in Supabase to enable GitHub and Google sign-in.

### GitHub OAuth

1. In Supabase dashboard, go to:
   **Authentication** → **Providers** → **GitHub**

2. Click "Enable"

3. Open a new tab and go to GitHub:
   https://github.com/settings/developers

4. Click "New OAuth App"

5. Fill in the application details:
   ```
   Application name: Design System Manager
   Homepage URL: https://your-netlify-site.netlify.app
   Authorization callback URL: https://abcdefghijk.supabase.co/auth/v1/callback
   ```

6. Click "Register application"

7. Copy the **Client ID**

8. Click "Generate a new client secret" and copy it

9. Return to Supabase and paste:
   - GitHub Client ID
   - GitHub Client Secret

10. Click "Save"

### Google OAuth (Optional)

1. In Supabase dashboard, go to:
   **Authentication** → **Providers** → **Google**

2. Click "Enable"

3. Open Google Cloud Console:
   https://console.cloud.google.com/apis/credentials

4. Create a new project or select an existing one

5. Click "Create Credentials" → "OAuth Client ID"

6. Configure the OAuth consent screen if prompted

7. Choose "Web application" as the application type

8. Add authorized redirect URIs:
   ```
   https://abcdefghijk.supabase.co/auth/v1/callback
   ```

9. Click "Create"

10. Copy the Client ID and Client Secret

11. Return to Supabase and paste:
    - Google Client ID
    - Google Client Secret

12. Click "Save"

### Configure Redirect URLs

1. In Supabase dashboard, go to:
   **Authentication** → **URL Configuration**

2. Add your site URL to "Site URL":
   ```
   https://your-netlify-site.netlify.app
   ```

3. Add to "Redirect URLs":
   ```
   https://your-netlify-site.netlify.app/dashboard
   http://localhost:3000/dashboard
   ```

4. Click "Save"

---

## Netlify Deployment

### Option A: Deploy from GitHub (Recommended)

1. Push your code to GitHub (if not already done)

2. Go to [https://netlify.com](https://netlify.com)

3. Click "Add new site" → "Import an existing project"

4. Choose "Deploy with GitHub"

5. Authorize Netlify to access your repositories

6. Select your repository

7. Configure build settings:
   ```
   Build command: npm run build
   Publish directory: .next
   ```

8. **Don't deploy yet!** First, configure environment variables (see next section)

### Option B: Deploy from Command Line

1. Install Netlify CLI:
   ```bash
   npm install -g netlify-cli
   ```

2. Login to Netlify:
   ```bash
   netlify login
   ```

3. Initialize site:
   ```bash
   netlify init
   ```

4. Follow prompts to create or link to a site

---

## Environment Variables

You must configure environment variables in Netlify before deploying.

### In Netlify Dashboard

1. Go to your site in Netlify Dashboard

2. Navigate to:
   **Site settings** → **Environment variables**

3. Click "Add a variable"

4. Add the following three variables:

   **Variable 1:**
   ```
   Key: NEXT_PUBLIC_USE_TEST_DATA
   Value: false
   ```

   **Variable 2:**
   ```
   Key: NEXT_PUBLIC_SUPABASE_URL
   Value: <your-supabase-project-url>
   ```
   Example: `https://abcdefghijk.supabase.co`

   **Variable 3:**
   ```
   Key: NEXT_PUBLIC_SUPABASE_ANON_KEY
   Value: <your-supabase-anon-key>
   ```
   Example: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

5. Click "Save" for each variable

### Via Netlify CLI (Alternative)

```bash
netlify env:set NEXT_PUBLIC_USE_TEST_DATA "false"
netlify env:set NEXT_PUBLIC_SUPABASE_URL "https://your-project.supabase.co"
netlify env:set NEXT_PUBLIC_SUPABASE_ANON_KEY "your-anon-key"
```

---

## Deploy!

1. In Netlify Dashboard:
   **Deploys** → **Trigger deploy** → **Deploy site**

2. Or via CLI:
   ```bash
   netlify deploy --prod
   ```

3. Wait for the build to complete (usually 2-3 minutes)

4. Once deployed, Netlify will provide a URL like:
   ```
   https://your-site-name.netlify.app
   ```

---

## Verification

### 1. Test the Deployment

1. Visit your Netlify URL

2. Click "Get Started" or "Sign In"

3. Choose "Continue with GitHub" or "Continue with Google"

4. Complete the OAuth flow

5. You should be redirected to the dashboard

### 2. Test Component Creation

1. In the dashboard, click "Add Component"

2. Fill in:
   - Name: "Test Component"
   - HTML: `<div>Hello World</div>`
   - CSS: `div { color: blue; }`

3. Click "Save"

4. Verify the component appears in the list

### 3. Verify Data Persistence

1. Sign out

2. Sign in again with the same account

3. Verify your test component is still there

✅ **Success!** Your data is persisted in Supabase.

---

## Troubleshooting

### Issue: Build fails with "Module not found"

**Solution:**
- Ensure all dependencies are in `package.json`
- Run `npm install` locally to verify
- Check that you're not excluding necessary files in `.gitignore`

### Issue: "Supabase not configured" error

**Solution:**
- Verify environment variables are set in Netlify
- Check that variable names are exact (case-sensitive)
- Ensure variables start with `NEXT_PUBLIC_`
- Redeploy after adding variables

### Issue: OAuth redirect fails

**Solution:**
- Verify redirect URLs in Supabase match your Netlify URL
- Ensure OAuth app callback URLs in GitHub/Google match Supabase callback URL
- Check that Site URL is set correctly in Supabase

### Issue: "Permission denied" errors when creating components

**Solution:**
- Check that RLS policies were created correctly
- Verify you're signed in (check browser console for auth errors)
- Ensure user_id is being set correctly (check browser network tab)

### Issue: Components not appearing after creation

**Solution:**
- Check browser console for errors
- Verify RLS policies allow SELECT for authenticated users
- Try signing out and back in
- Check Supabase logs: **Dashboard** → **Logs** → **API**

### Issue: OAuth shows "Application not configured"

**Solution:**
- In GitHub OAuth app settings, verify:
  - Callback URL matches Supabase exactly
  - Application is not suspended
- In Google OAuth settings, verify:
  - OAuth consent screen is configured
  - App is in "Testing" or "Published" state

---

## Advanced Configuration

### Custom Domain

1. In Netlify: **Domain settings** → **Add custom domain**
2. Follow Netlify's instructions to configure DNS
3. Update Supabase redirect URLs to use your custom domain
4. Update OAuth app callback URLs

### Monitoring

- **Netlify Analytics**: Site settings → Analytics
- **Supabase Logs**: Dashboard → Logs
- **Error Tracking**: Consider integrating Sentry or similar

### Database Backups

Supabase provides automatic backups on paid plans. For free tier:
1. Regularly export data via SQL Editor
2. Store exports securely
3. Consider upgrading for automatic backups

---

## Environment Variable Reference

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `NEXT_PUBLIC_USE_TEST_DATA` | No | `true` | Set to `false` for production |
| `NEXT_PUBLIC_SUPABASE_URL` | Yes (prod) | - | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes (prod) | - | Your Supabase anon/public key |

---

## Security Checklist

Before going live, verify:

- ✅ RLS policies are enabled on all tables
- ✅ Service role key is NOT in environment variables
- ✅ OAuth apps use HTTPS redirect URLs
- ✅ `.env.local` is in `.gitignore`
- ✅ CORS settings in Supabase are appropriate
- ✅ Rate limiting is configured (Supabase handles this)

---

## Support

If you encounter issues not covered in this guide:

1. Check the [Supabase Documentation](https://supabase.com/docs)
2. Check the [Netlify Documentation](https://docs.netlify.com)
3. Review the project's GitHub Issues
4. Check browser console and Supabase logs for error messages

---

## Next Steps

After successful deployment:

1. ✅ Share your deployment URL with users
2. ✅ Monitor Supabase usage dashboard
3. ✅ Set up monitoring and alerts
4. ✅ Consider upgrading Supabase plan as usage grows
5. ✅ Regularly review and update dependencies

---

**Congratulations!** Your Open Source Design System Manager is now live on Netlify with Supabase! 🎉
