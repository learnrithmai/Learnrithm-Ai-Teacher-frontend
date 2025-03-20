// ────────────────────────────────────────────────────────────────
// Register User Schema
// ────────────────────────────────────────────────────────────────

export type RegisterUserSchema = {
    Name: string,
    email: string,
    password?: string
    referralCode?: string,
    country?: string,
    method: "normal" | "google",
    image?: string,
};

// ────────────────────────────────────────────────────────────────
// Login Schema
// ────────────────────────────────────────────────────────────────

export type LoginSchema = {
    email: string,
    password: string
};

// ────────────────────────────────────────────────────────────────
// Forgot Password Schema
// ────────────────────────────────────────────────────────────────

export type ForgotPasswordSchema = {
    email: string,
};