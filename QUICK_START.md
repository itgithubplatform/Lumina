# Lumina+ Quick Start Guide 🚀

## ⚡ Fast Setup (5 Minutes)

### Step 1: Google OAuth (REQUIRED)
```
1. Visit: https://console.cloud.google.com/apis/credentials
2. Create OAuth 2.0 Client ID
3. Add redirect URI: http://localhost:3000/api/auth/callback/google
4. Copy Client ID and Secret
```

### Step 2: Update .env.local
```env
GOOGLE_CLIENT_ID=paste-your-client-id-here
GOOGLE_CLIENT_SECRET=paste-your-client-secret-here
DATABASE_URL="postgresql://user:pass@localhost:5432/lumina_db"
```

### Step 3: Install & Run
```bash
npm install
npx prisma generate
npx prisma db push
npm run dev
```

### Step 4: Test
```
1. Open: http://localhost:3000
2. Click "Login"
3. Sign in with Google
4. Select role (Teacher/Student)
5. Access Dashboard
```

## ✅ What's Fixed

- ✅ Next.js 15 compatibility
- ✅ Authentication redirect loops
- ✅ Session persistence
- ✅ Google OAuth integration
- ✅ Middleware configuration
- ✅ Image optimization
- ✅ TypeScript types

## 🔴 Common Errors & Fixes

### "400 Error" from Google
→ Google OAuth not configured. Follow Step 1 above.

### "Prisma not initialized"
→ Run: `npx prisma generate`

### Redirect loop
→ Already fixed! Just ensure NEXTAUTH_SECRET is set.

### Port in use
→ Run: `npm run dev -- -p 3001`

## 📁 Key Files

- `lib/auth.ts` - NextAuth configuration
- `middleware.ts` - Route protection
- `app/dashboard/page.tsx` - Main dashboard
- `.env.local` - Environment variables
- `prisma/schema.prisma` - Database schema

## 🎯 Ready to Run!

All code is verified and compatible with:
- Next.js 15.5.4 ✅
- React 19.1.0 ✅
- NextAuth 4.24.11 ✅
- Prisma 6.16.3 ✅

**Only blocker**: Google OAuth credentials (5 min setup)
