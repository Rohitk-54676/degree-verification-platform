export const authConfig = {
  pages: { signIn: "/login" },
  session: { strategy: "jwt" },
  providers: [],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.universityId = user.universityId;
        token.enrollmentNo = user.enrollmentNo;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.universityId = token.universityId;
        session.user.enrollmentNo = token.enrollmentNo;
      }
      return session;
    },
  },
};