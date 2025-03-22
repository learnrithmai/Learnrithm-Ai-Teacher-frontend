// auth-options.ts
import NextAuth, { NextAuthOptions } from "next-auth";
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
      id: string,
      Name: string,
      email: string,
      method: string,
      lastLogin: string,
      imgThumbnail?: string,
    };
    token: {
      accessToken: string,
      refreshToken: string,
      tokenExpiry: number
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    Name: string;
    email: string;
    imgThumbnail?: string;
    method: string,
    lastLogin: string,
    accessToken: string;
    refreshToken: string;
    tokenExpiry: number;
  }
}

// ----------------------------------------------------------------
// Interfaces for API Responses
// ----------------------------------------------------------------

interface RefreshApiResponse {
  success: string;
  accessToken: {
    token: string;
  };
  expiresAt: number; // Unix timestamp in seconds
  refreshToken?: string;
}
interface AuthApiResponse {
  user: ClientUserSchema;
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
    const response = await axios.post<RefreshApiResponse>(
      `${SERVER_API_URL}/refresh-tokens`,
      null,
      {
        headers: { Cookie: `jwt=${token.refreshToken}` },
        // If your backend expects the refresh token in the body instead, use:
        // data: { refreshToken: token.refreshToken },
      }
    );
    const data = response.data;
    logger.info("Access token refreshed successfully.");
    return {
      ...token,
      accessToken: data.accessToken.token,
      tokenExpiry: Date.now() + (data.expiresAt ? data.expiresAt * 1000 : 3600 * 1000),
      refreshToken: data.refreshToken ?? token.refreshToken,
    };
  } catch (error) {
    logger.error("Failed to refresh access token:", error as string);
    return { ...token, error: "RefreshTokenExpired" };
  }
}

// ----------------------------------------------------------------
// NextAuth Options: Handles Google & Email/Password (Login/Signup)
// ----------------------------------------------------------------

export const authOptions: NextAuthOptions = {
  secret: ENV.JWT_SECRET,
  providers: [
    // -------------------------------
    // Google Authentication Provider
    // -------------------------------
    GoogleProvider({
      clientId: ENV.GOOGLE_CLIENT_ID || "",
      clientSecret: ENV.GOOGLE_CLIENT_SECRET || "",
      authorization: {
        params: {
          scope: "openid email profile",
          access_type: "offline", // to receive a refresh token
          prompt: "consent",      // forces account selection & consent
        },
      },
    }),
    // --------------------------------------------------
    // Credentials Provider for Email/Password Login/Signup
    // --------------------------------------------------
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "user@example.com" },
        password: { label: "Password", type: "password" },
        isSignup: { label: "isSignup", type: "text", placeholder: "true or false" },
        Name: { label: "Name", type: "text", placeholder: "Your Name" },
        country: { label: "Country", type: "text", placeholder: "Your Country" },
        referralCode: {
          label: "Referral code (optional)",
          type: "text",
          placeholder: "Your Referred user code",
        },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing email or password.");
        }
        const isSignup = credentials.isSignup === "true";
        let response = null;

        try {
          if (isSignup) {
            // Prepare the registration payload.
            const dataToSend: RegisterUserSchema = {
              email: credentials.email,
              password: credentials.password,
              Name: credentials.Name || "",
              method: "normal",
              country: credentials.country || "",
              referralCode: credentials.referralCode || "",
            };
            // SIGNUP: Call the backend /register endpoint.
            response = await axios.post<AuthApiResponse>(
              `${SERVER_API_URL}/register`,
              dataToSend
            );
            if (response.status !== 201) {
              throw new Error("Sign up failed.");
            }
          } else {
            // LOGIN: Call the backend /login endpoint.
            response = await axios.post<AuthApiResponse>(`${SERVER_API_URL}/login`, {
              email: credentials.email,
              password: credentials.password,
            });
            if (response.status !== 200) {
              throw new Error("Login failed.");
            }
          }
        } catch (error: unknown) {
          logger.error("Auth provider error:", error as string);
        }

        if (!response || !response.data) {
          return null;
        }

        // Return the user object with tokens.
        return response.data.user;
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
        // Merge user data into the token.
        return { ...token, ...user } as JWT;
      }
      // If the token still has a valid access token, return it.
      if (token.accessToken && token.tokenExpiry && Date.now() < token.tokenExpiry) {
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
        return session
      }
      // Include the user details in the session.
      session.user = {
        id: token.id,
        Name: token.Name,
        email: token.email,
        method: token.method,
        imgThumbnail: token.image as string | undefined,
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