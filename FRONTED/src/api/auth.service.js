import api from "./auth.axios";

export const registerUser = async (username, email, password) => {
    const res = await api.post("/api/auth/register", { username, email, password });
    return res.data;
};

export const loginUser = async (email, password) => {
    const res = await api.post("/api/auth/login", { email, password });
    return res.data;
};

export const verifyForgotOtp = async (email, otp) => {
    const res = await api.post("/api/auth/verify-forgot-otp", { email, otp });
    return res.data;
};

export const verifyOtp = async (email, otp) => {
    const res = await api.post("/api/auth/verify-otp", { email, otp });
    return res.data;
};

export const resendOtp = async (email) => {
    const res = await api.post("/api/auth/resend-otp", { email });
    return res.data;
};

export const forgotPassword = async (email) => {
    const res = await api.post("/api/auth/forgot-password", { email });
    return res.data;
};

export const resetPassword = async (email, otp, newPassword) => {
    const res = await api.post("/api/auth/reset-password", { email, otp, newPassword });
    return res.data;
};

export const refreshToken = async () => {
    const res = await api.get("/api/auth/refreshToken");
    return res.data;
};

export const logoutUser = async () => {
    const res = await api.get("/api/auth/logout");
    return res.data;
};

export const logoutAll = async () => {
    const res = await api.get("/api/auth/logoutAll");
    return res.data;
};

export const getMe = async () => {
    const res = await api.get("/api/auth/get-me");
    return res.data;
};

export const google = async () => {
    const res = await api.get("/api/auth/google");
    return res.data;
}