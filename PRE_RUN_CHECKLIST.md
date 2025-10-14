# Pre-Run Checklist for Lumina+ ✅

## Critical Issues Fixed

### ✅ 1. Next.js 15 Compatibility
- **next.config.js**: Updated to use `experimental.serverComponentsExternalPackages` instead of deprecated `serverExternalPackages`
- **Images config**: Changed from `domains` to `remotePatterns` for Next.js 15
- **Added Google user images support** for OAuth profile pictures

### ✅ 2. Authentication (NextAuth)
- **lib/auth.ts**: 
  - Added `maxAge` for session persistence
  - Added `trigger` parameter for JWT callback
  - Added `NEXTAUTH_SECRET` requirement
  - Proper session update handling
- **middleware.ts**: Using NextAuth middleware (not custom)
- **SessionProvider**: Added `refetchOnWindowFocus` for session persistence

### ✅ 3. Redirect Loop Fixes
- **Dashboard**: Simplified auth check, no unnecessary redirects
- **Sign-in page**: Prevents rendering when already authenticated
- **Select-role page**: Uses `router.replace()` instead of `router.push()`
- All redirects use `replace()` to prevent history stack issues

### ✅ 4. Database Schema
- **Prisma schema**: Includes all required models (User, Session, Account, etc.)
- **StudentFiles model**: Added for student-specific file uploads
- **Relations**: Properly configured between models

## Required Setup Steps

### 🔴 CRITICAL: Google OAuth Setup (MUST DO FIRST)

1. **Go to Google Cloud Console**: https://console.cloud.google.com/
2. **Create/Select Project**
3. **Enable Google+ API**
4. **Create OAuth 2.0 Credentials**:
   - Authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
5. **Copy Client ID and Secret**
6. **Update `.env.local`**:
   ```env
   GOOGLE_CLIENT_ID=your-actual-client-id
   GOOGLE_CLIENT_SECRET=your-actual-client-secret
   ```

### 🟡 Database Setup

1. **Update DATABASE_URL in `.env.local`**:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/lumina_db"
   ```

2. **Run Prisma commands**:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

### 🟢 Environment Variables Check

Verify `.env.local` has:
```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=lumina-dev-secret-key-2024-change-in-production-abc123xyz789
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
DATABASE_URL="postgresql://..."
```

## Installation Steps

```bash
# 1. Clean install
rm -rf node_modules .next
npm install

# 2. Generate Prisma Client
npx prisma generate

# 3. Push database schema
npx prisma db push

# 4. Start development server
npm run dev
```

## Verification Steps

### ✅ After Starting Server

1. **Visit**: http://localhost:3000
2. **Click "Login"** or go to `/auth/signin`
3. **Click "Continue with Google"**
4. **Should redirect to Google OAuth** (not show 400 error)
5. **After Google sign-in**: Should redirect to `/select-role`
6. **Select role and accessibility**: Should redirect to `/dashboard`
7. **Click "Dashboard" in navbar**: Should stay on dashboard (no loop)

## Known Issues & Solutions

### Issue: "400. That's an error"
**Cause**: Google OAuth not configured
**Solution**: Follow Google OAuth Setup steps above

### Issue: Redirect loop between sign-in and dashboard
**Cause**: Session not persisting
**Solution**: Already fixed in code, ensure `.env.local` has `NEXTAUTH_SECRET`

### Issue: "Module not found: next-auth/react"
**Cause**: Missing dependency
**Solution**: Run `npm install next-auth`

### Issue: "@prisma/client did not initialize"
**Cause**: Prisma not generated
**Solution**: Run `npx prisma generate`

## Package Versions (Verified Compatible)

- ✅ Next.js: 15.5.4
- ✅ React: 19.1.0
- ✅ NextAuth: 4.24.11
- ✅ Prisma Client: 6.16.3
- ✅ TypeScript: 5.x
- ✅ Tailwind CSS: 4.x

## Files Modified for Next.js 15

1. `next.config.js` - Updated image config and external packages
2. `lib/auth.ts` - Added session maxAge and trigger support
3. `middleware.ts` - Simplified to use NextAuth middleware
4. `app/dashboard/page.tsx` - Fixed auth checks
5. `app/auth/signin/page.tsx` - Prevent rendering when authenticated
6. `app/select-role/page.tsx` - Use router.replace()
7. `components/providers/authProvider.tsx` - Added refetch options
8. `.env.local` - Added NEXTAUTH_SECRET and OAuth placeholders

## Final Checklist Before Running

- [ ] Google OAuth credentials configured in `.env.local`
- [ ] Database URL configured in `.env.local`
- [ ] NEXTAUTH_SECRET set in `.env.local`
- [ ] `npm install` completed successfully
- [ ] `npx prisma generate` completed
- [ ] `npx prisma db push` completed
- [ ] No TypeScript errors
- [ ] Port 3000 is available

## If Everything Fails

1. Delete `.next` folder: `rm -rf .next`
2. Delete `node_modules`: `rm -rf node_modules`
3. Clean install: `npm install`
4. Regenerate Prisma: `npx prisma generate`
5. Restart server: `npm run dev`

---

**Status**: ✅ All code is Next.js 15 compatible and ready to run
**Last Updated**: Current session
**Critical Blocker**: Google OAuth credentials must be configured
