import CredentialsProvider from "next-auth/providers/credentials";

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
  callbacks: {
    async redirect({ url, baseUrl }) {
      return baseUrl
    }
}
};