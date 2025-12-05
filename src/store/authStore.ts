import { create } from "zustand";

type LoginType = "OAUTH" | "GUEST" | "";

interface AuthState {
    accessToken: string | null;
    isAuthenticated: boolean;         
    loginType: LoginType;         

    setAccessToken: (token: string | null) => void;
    setIsAuthenticated: (isAuth: boolean) => void;
    setLoginType: (type: LoginType) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    accessToken: null,
    isAuthenticated: false,
    loginType: "",

    setAccessToken: (token) =>
        set({
            accessToken: token,
            isAuthenticated: token !== null,
            loginType: token ? "OAUTH" : "",
        }),

    setIsAuthenticated: (isAuth) => set({ isAuthenticated: isAuth }),

    setLoginType: (type) => set({ loginType: type }),

    logout: () => {
        set({
            accessToken: null,
            isAuthenticated: false,
            loginType: "",
        });
        window.location.href = "/";
    },
}));
