import { DefaultSession, NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { prisma } from './db/prisma'
import { Role, Accessibility, User } from "@prisma/client"

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      role: Role
      accessibility: Accessibility[]|[]
      provider: string
    } & DefaultSession['user']
  }
}
export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    })
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60,
  },
  callbacks: {
    async jwt({ token, user, account, trigger }) {
      if (user) {
        const userPrisma = user as User
        token.uid = userPrisma.id;
        token.role = userPrisma.role;
        token.accessibility = userPrisma.accessibility;
      }
      
      if (trigger === 'update' || !token.role) {
        const dbUser = await prisma.user.findUnique({
          where: { id: token.uid as string },
          select: { role: true, accessibility: true },
        });
        if (dbUser) {
          token.role = dbUser.role;
          token.accessibility = dbUser.accessibility;
        }
      }
      
      if (account?.provider) {
        token.provider = account.provider
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.uid as string
        session.user.role = token.role as Role
        session.user.accessibility = token.accessibility as Accessibility[]|[]
        session.user.provider = token.provider as string
      }      
      return session
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
  secret: process.env.NEXTAUTH_SECRET,
}