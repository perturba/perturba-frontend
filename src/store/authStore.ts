import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

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
    logout: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
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

            logout: () => {
                set({
                    accessToken: null,
                    isAuthenticated: false,
                    loginType: "",
                    guestExpiresAt: null,
                });
            },
        }),
        {
            name: "auth-storage", 
            storage: createJSONStorage(() => localStorage),
        }
    )
);
