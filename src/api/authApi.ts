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
        setAccessToken,
        setLoginType,
        setIsAuthenticated,
    } = useAuthStore.getState();

    if (accessToken) {
        setLoginType("OAUTH");
        setIsAuthenticated(true);
        return true;
    }

    const { loginType } = useAuthStore();

    const isGuest = loginType === "GUEST";

    if (isGuest) {
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
        console.warn("Access token refresh failed, fallback to guest:", err);
    }

    setLoginType("");
    setIsAuthenticated(false);
    return false;
}
