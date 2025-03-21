import NextAuth, { NextAuthOptions, DefaultSession } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import axios from "axios";
import { JWT } from "next-auth/jwt";
import { RegisterUserSchema } from "@/types/authSchema";
import { SERVER_API_URL } from "./consts";
import logger from "@/utils/chalkLogger";

interface Token {
  accessToken?: string;
  refreshToken?: string;
  tokenExpiry?: number;
  error?: string;
}

async function refreshAccessToken(token: Token): Promise<Token> {
  try {
    const url = "https://oauth2.googleapis.com/token";
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID || "",
        client_secret: process.env.GOOGLE_CLIENT_SECRET || "",
        grant_type: "refresh_token",
        refresh_token: token.refreshToken as string,
      }),
    });

    const refreshedTokens = await response.json();

    if (!response.ok) {
      throw new Error(refreshedTokens.error || "Failed to refresh token");
    }

    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      tokenExpiry: Date.now() + refreshedTokens.expires_in * 1000,
      refreshToken: refreshedTokens.refresh_token ?? token.refreshToken,
    };
  } catch (error) {
    console.error("Error refreshing access token", error);
    return { ...token, error: "RefreshAccessTokenError" };
  }
}

declare module "next-auth" {
  interface Session extends DefaultSession {
    user?: {
      name: string;
      image: string;
      email: string;
      userId?: string;
      accessToken?: string;
      refreshToken?: string;
      tokenExpiry?: Date;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    refreshToken?: string;
    tokenExpiry?: number;
    error?: string;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      authorization: {
        params: {
          scope:
            "openid email profile https://www.googleapis.com/auth/youtube.force-ssl",
          access_type: "offline",
          prompt: "consent",
        },
      },
    }),
  ],
  callbacks: {
    // JWT callback: store and refresh tokens as needed.
    async jwt({ token, account }): Promise<JWT> {
      if (account) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.tokenExpiry = account.expires_at ? account.expires_at * 1000 : undefined;
      }

      if (token.accessToken && token.tokenExpiry && Date.now() < token.tokenExpiry) {
        return token;
      }

      if (token.refreshToken) {
        return (await refreshAccessToken(token)) as JWT;
      }

      return { ...token, error: "NoRefreshTokenAvailable" };
    },

    // Session callback: attach additional user details.
    async session({ session, token }) {
      try {
        const res = await axios.get(
          `${SERVER_API_URL}/user?email=${session.user?.email}`
        );
        const user = res.data as {
          name?: string;
          image?: string;
          email?: string;
          country?: string;
          id?: string;
        };

        session.user = {
          name: user?.name || "",
          image: user?.image || "",
          email: user?.email || "",
          userId: user?.id?.toString(),
          accessToken: token.accessToken,
          refreshToken: token.refreshToken,
          tokenExpiry: token.tokenExpiry ? new Date(token.tokenExpiry) : undefined,
        };
      } catch (error) {
        logger.error("Error fetching user data:", error as string);
      }
      return session;
    },

    // Sign-in callback: upsert user data into the database.
    async signIn({ user, account }) {
      if (!user.email || !account) return false;

      const dataToSend: RegisterUserSchema = {
        Name: user.name || "",
        image: user.image || "",
        email: user.email || "",
        method: "google",
      };

      try {
        await axios.post(`${SERVER_API_URL}/auth/register`, dataToSend);
        return true;
      } catch (error) {
        logger.error("Error storing user auth data:", error as string);
        return false;
      }
    },
  },
  session: {
    strategy: "jwt",
  },
};

export default NextAuth(authOptions);