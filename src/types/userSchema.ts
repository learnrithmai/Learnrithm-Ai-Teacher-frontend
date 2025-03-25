// ────────────────────────────────────────────────────────────────
// Change Password Form Schema
// ────────────────────────────────────────────────────────────────

export type changePasswordSchema = {
    id: string,
    password: string,
    newPassword: string,
}

// ────────────────────────────────────────────────────────────────
// Update user information Schema
// ────────────────────────────────────────────────────────────────


export type UpdateInfoSchema = {
    id: string,
    name?: string,
    lastLogin?: string,
    imgThumbnail?: string,
    birthDate?: string,
    phoneNumber?: string,
    institution?: string,
    linkedin?: string,
    instagram?: string,
    facebook?: string,
    x?: string,
}

// ────────────────────────────────────────────────────────────────
// update user plan Schema
// ────────────────────────────────────────────────────────────────

export type updatePlanSchema = {
    id: string,
    plan: string,
    ExpirationSubscription: string
};

// ────────────────────────────────────────────────────────────────
// Cookies Client User Schema
// ────────────────────────────────────────────────────────────────

export type ClientUserSchema = {
    id: string,
    Name: string,
    email: string,
    method: string,
    lastLogin: string,
    imgThumbnail?: string,
    token: {
        accessToken: string,
        refreshToken: string,
        tokenExpiry: number
    }
}