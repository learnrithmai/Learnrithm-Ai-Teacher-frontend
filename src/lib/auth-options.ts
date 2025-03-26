import NextAuth, { NextAuthOptions, User } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";
import { ENV } from "@/types/envSchema";
import logger from "@/utils/chalkLogger";
import { SERVER_API_URL } from "./consts";
import { RegisterUserSchema } from "@/types/authSchema";
import { JWT } from "next-auth/jwt";
import { ClientUserSchema } from "@/types/userSchema";

// ----------------------------------------------------------------
// Module Augmentation for NextAuth Session & JWT Types
// ----------------------------------------------------------------

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      Name: string;
      email: string;
      method: string;
      lastLogin?: string;
      imgThumbnail?: string;
    };
    token: {
      accessToken: {
        token: string;
        expires: Date;
      },
      refreshToken: string;
      tokenExpiry: Date;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    Name: string;
    email: string;
    imgThumbnail?: string;
    method: string;
    lastLogin?: string;
    accessToken: {
      token: string;
      expires: Date;
    },
    refreshToken: string;
    tokenExpiry: Date;
    error?: string;
  }
}

// ----------------------------------------------------------------
// Interfaces for API Responses
// ----------------------------------------------------------------

type RefreshApiResponse = {
  success: string;
  accessToken: {
    token: string;
    expires: Date;
  };
  expiresAt: Date;
  refreshToken: string;
  error?: string;
}

// ----------------------------------------------------------------
// Helper: Refresh Access Token via backend refresh endpoint.
// ----------------------------------------------------------------

async function refreshAccessToken(token: JWT): Promise<JWT> {
  if (!token.refreshToken) {
    logger.error("No refresh token available.");
    return { ...token, error: "NoRefreshToken" };
  }
  try {
    const response: { status: number, data: RefreshApiResponse } = await axios.post(
      `${SERVER_API_URL}/auth/refresh-tokens`,
      null,
      {
        headers: { Cookie: `jwt=${token.refreshToken}` },
      }
    );

    if (response.status !== 200) {
      throw new Error("Failed to refresh access token.");
    }
    logger.info("Access token refreshed successfully.");
    return {
      ...token,
      accessToken: response.data.accessToken,
      tokenExpiry: new Date(
        Date.now() + (response.data.expiresAt ? Number(response.data.expiresAt) * 1000 : 3600 * 1000)
      ),
      refreshToken: response.data.refreshToken,
    };
  } catch (error: any) {
    logger.error("Failed to refresh access token:", error);
    return { ...token, error: "RefreshTokenExpired" };
  }
}

// ----------------------------------------------------------------
// NextAuth Options: Handles Google & Email/Password (Login/Signup)
// ----------------------------------------------------------------

export const authOptions: NextAuthOptions = {
  secret: ENV.JWT_SECRET,
  providers: [
    // Google Authentication Provider
    GoogleProvider({
      clientId: ENV.GOOGLE_CLIENT_ID || "",
      clientSecret: ENV.GOOGLE_CLIENT_SECRET || "",
      authorization: {
        params: {
          scope: "openid email profile",
          access_type: "offline",
          prompt: "consent",
        },
      },
    }),
    // Credentials Provider for Email/Password Login/Signup
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "user@example.com",
        },
        password: { label: "Password", type: "password" },
        isSignup: {
          label: "isSignup",
          type: "text",
          placeholder: "true or false",
        },
        Name: {
          label: "Name",
          type: "text",
          placeholder: "Your Name",
        },
        country: {
          label: "Country",
          type: "text",
          placeholder: "Your Country",
        },
        referralCode: {
          label: "Referral code (optional)",
          type: "text",
          placeholder: "Your Referred user code",
        },
      },
      // Inside the authorize function
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing email or password.");
        }
        const isSignup = credentials.isSignup === "true";

        try {
          if (isSignup) {
            // Prepare the registration payload.
            const dataToSend: RegisterUserSchema = {
              email: credentials.email,
              password: credentials.password,
              Name: credentials.Name,
              method: "normal",
              country: credentials.country,
              referralCode: credentials.referralCode,
            };
            // SIGNUP: Call the backend /register endpoint.
            const res: { status: number, data: { success: string, user: ClientUserSchema } } = await axios.post(
              `${SERVER_API_URL}/auth/register`,
              dataToSend
            );
            if (res.status !== 201) {
              throw new Error("Sign up failed.");
            }
            return res.data.user;
          } else {
            // LOGIN: Call the backend /login endpoint.
            const res: { status: number, data: { success: string, user: ClientUserSchema } } = await axios.post(`${SERVER_API_URL}/auth/login`, {
              email: credentials.email,
              password: credentials.password,
            });
            if (res.status !== 200) {
              throw new Error("Login failed.");
            }
            return res.data.user;
          }
        } catch (error: any) {
          logger.error("Auth provider error:", error);
          return null;
        }
      },
    }),
  ],

  // ----------------------------------------------------------------
  // Callbacks: JWT & Session callbacks to store and refresh tokens.
  // ----------------------------------------------------------------

  callbacks: {
    // JWT callback is invoked on sign in and subsequent token refresh cycles.
    async jwt({ token, user }): Promise<JWT> {
      // On initial sign-in, the 'user' object is provided.
      if (user) {
        const clientUser = user as ClientUserSchema;
        return {
          ...token,
          id: clientUser.id,
          Name: clientUser.Name,
          email: clientUser.email,
          method: clientUser.method,
          lastLogin: clientUser.lastLogin,
          imgThumbnail: clientUser.imgThumbnail,
        };
      }
      // If the token still has a valid access token, return it.
      if (token.accessToken && token.tokenExpiry && Date.now() < token.tokenExpiry.getTime()) {
        return token;
      }
      // Otherwise, try to refresh the access token using the refresh token.
      if (token.refreshToken) {
        return await refreshAccessToken(token);
      }
      // If no valid refresh token is available, include an error.
      return { ...token, error: "NoRefreshTokenAvailable" };
    },
    // Session callback attaches token details to the session.
    async session({ session, token }): Promise<typeof session> {
      if (!token.Name) {
        return session;
      }
      // Include the user details in the session.
      session.user = {
        id: token.id,
        Name: token.Name,
        email: token.email,
        method: token.method,
        imgThumbnail: token.imgThumbnail,
        lastLogin: token.lastLogin,
      };
      // Include the token details in the session.
      session.token = {
        accessToken: token.accessToken,
        refreshToken: token.refreshToken,
        tokenExpiry: token.tokenExpiry,
      };

      return session;
    },
  },

  session: { strategy: "jwt" },
  jwt: { secret: ENV.JWT_SECRET },
};

export default NextAuth(authOptions);