import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GithubProvider from "next-auth/providers/github";
import { dbUsers } from "../../../database";




export default NextAuth({

  // Configure one or more authentication providers
  providers: [
    // ...add more providers here

    Credentials({
      name: 'Custom Login',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'me@me.com'},
        password: { label: 'Password', type: 'password', placeholder: 'Password'}
      },
      async authorize (credentials) {
        console.log({credentials});
        // return {name: '@Eric', email: 'me@me.com', role: 'admin'};

        return await dbUsers.checkUserEmailPass(credentials!.email, credentials!.password);
      }
    }),

    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),

  ],

  //Custom Pages

  pages: {
    signIn: '/auth/login',
    newUser: '/auth/register'
  },

  //callbacks

  jwt: {
    //secret
  },

  session: {
    maxAge: 2592000,
    strategy: 'jwt',
    updateAge: 86400,
  },

  callbacks: {

    async jwt({ token, account, user }) {
      // console.log({token, account, user});
      if (account){
        
        token.accessToken = account.access_token;

        switch (account.type) {
          case 'oauth':
            token.user = await dbUsers.oAuthToDbUser( user?.email || '', user?.name || '' );
            break;
          case 'credentials':
            token.user = user
            break;
        }

      }
      return token;
    },

    async session({ session, token, user }) {
      // console.log({session, token, user});

      session.accessToken = token.accessToken;
      session.user = token.user as any;
      return session;
    }
  }
});