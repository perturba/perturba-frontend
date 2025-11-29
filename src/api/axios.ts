import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { useAuthStore } from "@/store/authStore";

export const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_SERVER_API_URL,
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
});

const refreshInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_SERVER_API_URL,
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
});

axiosInstance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const token = useAuthStore.getState().accessToken;
    if (token && config.headers) {
        config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
});

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error: AxiosError<any>) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & {
            _retry?: boolean;
        };

        const status = error.response?.status;
        const errorCode = (error.response?.data as any)?.code;

        if (status === 401 && errorCode === "GUEST_SESSION_EXPIRED") {
            const { resetGuest, setIsAuthenticated } = useAuthStore.getState();
            resetGuest();
            setIsAuthenticated(false);

            alert("게스트 세션이 만료되어 초기화되었습니다.");
            useAuthStore.getState().resetGuest();
            window.location.href = "/";

            return Promise.reject(error);
        }

        if (originalRequest?.url === "/v1/auth/refresh") {
            return Promise.reject(error);
        }

        if (status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                interface ApiResponse<T> {
                    ok: boolean;
                    data: T;
                    meta: Record<string, unknown>;
                }
                interface TokenResponse {
                    access_token: string;
                    expires_in: number;
                    token_type: "Bearer";
                }

                const res = await refreshInstance.post<ApiResponse<TokenResponse>>(
                    "/v1/auth/refresh"
                );
                const newAccessToken = res.data.data.access_token;

                useAuthStore.getState().setAccessToken(newAccessToken);

                if (originalRequest.headers) {
                    originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
                }

                return axiosInstance(originalRequest);
            } catch {
                useAuthStore.getState().logout();
                return Promise.reject(error);
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;
