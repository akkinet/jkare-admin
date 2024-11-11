// import NextAuth from "next-auth";
// import { authOptions } from "@/config/authOption";

// const handler = NextAuth(authOptions);
// export { handler as GET, handler as POST };

// export default NextAuth.default(authOptions)

import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
// Add more providers if needed

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "email",
          type: "text",
        },
        password: {
          label: "password",
          type: "password",
        },
      },
      async authorize(credentials, req) {
        try {
          const res = await fetch(
            `${process.env.API_URL}/user/login`,
            {
              method: "POST",
              body: JSON.stringify(credentials),
              headers: { "Content-Type": "application/json" },
            }
          );
      
          const user = await res.json();
          if (res.ok && !user?.error) {
            return user;
          } else {
            console.error("Login error:", user.error);
            return null;
          }
        } catch (error) {
          console.error("Fetch error:", error);
          return null;
        }
      }
    }),
  ],
  pages: {
    signIn: "/login"
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: true
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
