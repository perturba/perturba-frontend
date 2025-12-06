import { ApiResponse, TokenResponse } from "@/types/api";
import axiosInstance from "./axios";
import { useAuthStore } from "@/store/authStore";

export async function logout() {
    try {
        await axiosInstance.post("/v1/auth/logout");
    } catch (err) {
        throw err;
    }
}

export const refreshAccessToken = async () => {
    const { data } = await axiosInstance.post<ApiResponse<TokenResponse>>(
        "/v1/auth/refresh"
    );
    return data;
};

export async function checkAuthStatus(): Promise<boolean> {
    const {
        accessToken,
        loginType,
        setAccessToken,
        setLoginType,
        setIsAuthenticated,
    } = useAuthStore.getState();

    if (accessToken) {
        setLoginType("OAUTH");
        setIsAuthenticated(true);
        return true;
    }

    if (loginType === "GUEST") {
        setIsAuthenticated(true);
        return true;
    }

    try {
        const res = await refreshAccessToken();
        if (res.ok && res.data?.accessToken) {
            setAccessToken(res.data.accessToken);
            setLoginType("OAUTH");
            setIsAuthenticated(true);
            return true;
        }
    } catch (err) {
        console.warn("Access token refresh failed:", err);
    }

    setLoginType("");
    setIsAuthenticated(false);
    return false;
}
