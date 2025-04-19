import NextAuth from "next-auth";
import FacebookProvider from "next-auth/providers/facebook";
import CredentialsProvider from "next-auth/providers/credentials";
import GitHubProvider from "next-auth/providers/github";
import axios from "axios";
import { handleSubmit } from "./app/(logged-out)/register/action";

const login = async (data: any) => {
  try {
    const apiUrl = `http://localhost:5000/api/v1/auth/login`;
    const response = await axios.post(apiUrl, data);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Login failed");
  }
};

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    CredentialsProvider({
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing credentials");
        }
        const user = await login({
          email: credentials.email,
          password: credentials.password,
        });
        console.log('user', user)
        if (!user) {
          throw new Error("Invalid username or password");
        }

        return {
          id: user.data.user.id,
          name: user.data.user.name,
          email: user.data.user.email,
          role: user.data.user.role,
          image: user.data.user.profileImage || null,
          token : user.data.token ?? "",
          tel :user.data.tel ?? ""
        };
      },
    }),

    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID as string,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET as string,
      authorization: {
        url: "https://www.facebook.com/v13.0/dialog/oauth",
        params: {
          scope: "public_profile,email",
        },
      },
    }),

    GitHubProvider({
      clientId: process.env.AUTH_GITHUB_ID as string,
      clientSecret: process.env.AUTH_GITHUB_SECRET as string,
    }),
  ],

  callbacks: {
    async jwt({ token, user, account } : {token : any, user : any, account : any}) {
      if (user) { 
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.role = user.role;
        token.image = user.image ?? "/";
        token.token = user.token ?? ""
        token.tel = user.tel
      }
      if(account){
        console.log('account', account)
        token.provider = account.provider
      }
      // token.thirdParty = account.provider !== "credentials";
      // token.provider = account.provider;
      return token;
    },

    async session({ session, token } : {session : any, token : any}) {
      session.user = {
        id: token.id,
        name: token.name,
        email: token.email,
        role: token.role,
        image: token.image,
        token: token.token,
        tel : token.tel,
      };
      if(token){
        session.provider = token.provider
      }
      // session.thirdParty = token.thirdParty;
      // session.provider = token.provider;
    
      return session;
    },

    async redirect({ url, baseUrl }) {
      return url.startsWith(baseUrl) ? url : baseUrl;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
  },
});