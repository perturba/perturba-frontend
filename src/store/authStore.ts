import { create } from "zustand";

type LoginType = "OAUTH" | "GUEST" | "";

interface AuthState {
    accessToken: string | null;
    isAuthenticated: boolean;         
    loginType: LoginType;         
    guestExpiresAt: string | null;

    setAccessToken: (token: string | null) => void;
    setIsAuthenticated: (isAuth: boolean) => void;
    setLoginType: (type: LoginType) => void;
    setGuestExpiresAt: (exp: string | null) => void;
    resetGuest: () => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    accessToken: null,
    isAuthenticated: false,
    loginType: "",
    guestExpiresAt: null,

    setAccessToken: (token) =>
        set({
            accessToken: token,
            isAuthenticated: token !== null,
            loginType: token ? "OAUTH" : "",
        }),

    setIsAuthenticated: (isAuth) => set({ isAuthenticated: isAuth }),

    setLoginType: (type) => set({ loginType: type }),

    setGuestExpiresAt: (exp) => set({ guestExpiresAt: exp }),

    resetGuest: () => set({ loginType: "", guestExpiresAt: null }),

    logout: () => {
        set({
            accessToken: null,
            isAuthenticated: false,
            loginType: "",
            guestExpiresAt: null,
        });
        window.location.href = "/";
    },
}));
