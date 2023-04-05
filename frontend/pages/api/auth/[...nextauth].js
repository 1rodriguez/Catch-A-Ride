import NextAuth from "next-auth";
import EmailProvider from "next-auth/providers/email";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "../../../lib/mongodb";

const THIRTY_DAYS = 30 * 24 * 60 * 60;
const THIRTY_MINUTES = 30 * 60;

export default NextAuth({
  secret: process.env.SECRET,
  session: {
    strategy: "jwt",
    maxAge: THIRTY_DAYS,
    updateAge: THIRTY_MINUTES,
  },
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    EmailProvider({
      server: {
        host: "smtp-relay.sendinblue.com",
        port: "587",
        auth: {
          user: "catcharideservice@gmail.com",
          pass: process.env.SMTP_PASS,
        },
      },
      from: "noreply@catcharide.com",
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      // Persist the OAuth access_token to the token right after signin
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token, user }) {
      // Send properties to the client, like an access_token from a provider.
      session.accessToken = token.accessToken;
      if (session?.user) {
        session.user.id = token.sub;
      }

      return session;
    },
    async signIn({ user, account, profile, email, credentials }) {
      // check if user is using a uwo email
      let isAllowedToSignIn = user.email.endsWith("@uwo.ca");
      let banned;
      
      // check if the user is banned
      await fetch(`http://localhost:8000/users/check-ban-status/${user.email}`)
      .then(async (res) => res.json())
      .then((data) => {
        banned = data.banned;
      })
      
      if (!banned && isAllowedToSignIn) {
        return true;
      } else {
        // Return false to display a default error message
        //return false;
        // Or you can return a URL to redirect to:
         return '/unauthorized';
      }
    },
  },
  pages: {
    newUser: "http://localhost:3000/auth/new-user", // new users are directed here on first login
  },
});
