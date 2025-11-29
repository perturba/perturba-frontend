import { ApiResponse, GuestSessionResponse } from "@/types/api";
import axiosInstance from "./axios";

export async function getGuestSession() {
    try {
        const { data } = await axiosInstance.post<ApiResponse<GuestSessionResponse>>(
            "/v1/guest/session"
        );
        return data;
    } catch (err) {
        throw err;
    }
}
