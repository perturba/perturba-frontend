import axios, { AxiosError, InternalAxiosRequestConfig, AxiosInstance } from "axios";
import { useAuthStore } from "@/store/authStore";
import { ApiError } from "@/types/api";

const getBaseURL = () => {
    if (process.env.NODE_ENV === 'development') {
        return '/api';
    }
    return process.env.NEXT_PUBLIC_SERVER_API_URL;
};

const defaultConfig = {
    baseURL: getBaseURL(),
    headers: {
        "Content-Type": "application/json"
    },
    withCredentials: true,
};

export const axiosInstance: AxiosInstance = axios.create(defaultConfig);

const refreshInstance: AxiosInstance = axios.create(defaultConfig);

let isRefreshing = false;
let failedQueue: Array<{
    resolve: (value?: unknown) => void;
    reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: Error | null = null) => {
    failedQueue.forEach(promise => {
        if (error) {
            promise.reject(error);
        } else {
            promise.resolve();
        }
    });
    failedQueue = [];
};

axiosInstance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const token = useAuthStore.getState().accessToken;
    if (token && config.headers) {
        config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
});

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error: AxiosError<ApiError>) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & {
            _retry?: boolean;
        };

        if (!originalRequest) {
            return Promise.reject(error);
        }

        const status = error.response?.status;
        const errorCode = error.response?.data?.code;

        if (status === 401 && errorCode === "GUEST_SESSION_EXPIRED") {
            const { resetGuest, setIsAuthenticated } = useAuthStore.getState();
            resetGuest();
            setIsAuthenticated(false);
            alert("게스트 세션이 만료되어 초기화되었습니다.");
            window.location.href = "/";
            return Promise.reject(error);
        }

        if (originalRequest.url === "/v1/auth/refresh") {
            return Promise.reject(error);
        }

        if (status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then(() => axiosInstance(originalRequest))
                    .catch(err => Promise.reject(err));
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                interface TokenResponse {
                    access_token: string;
                    expires_in: number;
                    token_type: "Bearer";
                }

                const res = await refreshInstance.post<{
                    ok: boolean;
                    data: TokenResponse;
                }>("/v1/auth/refresh");

                const newAccessToken = res.data.data.access_token;
                useAuthStore.getState().setAccessToken(newAccessToken);

                processQueue();

                if (originalRequest.headers) {
                    originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
                }
                return axiosInstance(originalRequest);
            } catch (refreshError) {
                processQueue(refreshError as Error);
                useAuthStore.getState().logout();
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;
