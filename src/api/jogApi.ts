

import type {
    ApiResponse,
    JobListResponse,
    CreateJobRequest,
    CreateJobResponse,
    JobResultResponse,
    FeedbackRequest,
} from "@/types/api";
import axiosInstance from "./axios";

export const getJobList = async (page = 0, size = 10) => {
    const { data } = await axiosInstance.get<JobListResponse>("/v1/jobs", {
        params: { page, size },
    });
    return data;
};

export const createJob = async (
    request: CreateJobRequest,
    idempotencyKey?: string
) => {
    const headers = idempotencyKey
        ? { "idempotency-key": idempotencyKey }
        : undefined;

    const { data } = await axiosInstance.post<ApiResponse<CreateJobResponse>>(
        "/v1/jobs",
        request,
        { headers }
    );
    return data;
};

export const getJobResult = async (publicId: string) => {
    const { data } = await axiosInstance.get<ApiResponse<JobResultResponse>>(
        `/v1/jobs/${publicId}/result`
    );
    return data;
};

export const submitJobFeedback = async (
    publicId: string,
    feedback: FeedbackRequest
) => {
    const { data } = await axiosInstance.post<ApiResponse<string>>(
        `/v1/jobs/${publicId}/feedback`,
        feedback
    );
    return data;
};

export const subscribeJobEvents = (publicId: string) => {
    const url = `${process.env.NEXT_PUBLIC_SERVER_API_URL}/v1/jobs/${publicId}/events`;
    return new EventSource(url, { withCredentials: true });
};
