import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "utils/prisma";

if (!process.env.GOOGLE_OAUTH_CLIENT_ID || !process.env.GOOGLE_OAUTH_CLIENT_SECRET) {
  throw new Error("Missing Google OAuth credentials");
}

export const authOptions: NextAuthOptions = {
  secret: process.env.SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_OAUTH_CLIENT_ID,
      clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user, profile }) {
      const { image, avatar_url } = profile;

      const email = profile.email || user.email;
      const name = profile.name || user.name;
      const imageUrl = String(image || avatar_url || user.image) || null;

      if (!email || !name) {
        return false;
      }

      await prisma.user.upsert({
        where: { email },
        create: { email, name, imageUrl },
        update: { email, name, imageUrl },
      });

      return true;
    },
  },
};

export default NextAuth(authOptions);
