import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { JobStatus } from "@/types/api";

export interface JobItem {
    publicId: string;
    fileName: string;
    status: JobStatus;
    createdAt: string;
    completedAt?: string;
}

interface JobStatusState {
    jobs: JobItem[];

    addJob: (job: JobItem) => void;
    updateJobStatus: (publicId: string, status: JobStatus, completedAt?: string) => void;
    removeJob: (publicId: string) => void;
    getJobsByStatus: (status: JobStatus) => JobItem[];
}

const eventSources = new Map<string, EventSource>();

export const useJobStatusStore = create<JobStatusState>()(
    persist(
        (set, get) => ({
            jobs: [],

            addJob: (job) =>
                set((state) => {
                    const exists = state.jobs.some((j) => j.publicId === job.publicId);
                    if (exists) return state;
                    return { jobs: [job, ...state.jobs] };
                }),

            updateJobStatus: (publicId, status, completedAt) =>
                set((state) => ({
                    jobs: state.jobs.map((job) =>
                        job.publicId === publicId
                            ? { ...job, status, ...(completedAt && { completedAt }) }
                            : job
                    ),
                })),

            removeJob: (publicId) =>
                set((state) => {
                    const eventSource = eventSources.get(publicId);
                    if (eventSource) {
                        eventSource.close();
                        eventSources.delete(publicId);
                    }
                    return {
                        jobs: state.jobs.filter((job) => job.publicId !== publicId),
                    };
                }),

            getJobsByStatus: (status) => {
                return get().jobs.filter((job) => job.status === status);
            },
        }),
        {
            name: "job-status-storage",
            storage: createJSONStorage(() => localStorage),
        }
    )
);

export const subscribeToJob = (publicId: string, fileName: string) => {
    if (eventSources.has(publicId)) {
        return;
    }

    const url = `${process.env.NEXT_PUBLIC_SERVER_API_URL}/v1/jobs/${publicId}/events`;
    const eventSource = new EventSource(url, { withCredentials: true });

    eventSource.onopen = () => {
        console.log(`SSE connected for job: ${publicId}`);
    };

    eventSource.addEventListener("job-created", (event) => {
        const data = JSON.parse(event.data);
        useJobStatusStore.getState().addJob({
            publicId: data.publicId,
            fileName,
            status: "PROGRESS",
            createdAt: data.createdAt || new Date().toISOString(),
        });
    });

    eventSource.addEventListener("job-completed", (event) => {
        const data = JSON.parse(event.data);
        useJobStatusStore.getState().updateJobStatus(publicId, "COMPLETED", data.completedAt);

        if (typeof window !== "undefined" && "Notification" in window) {
            if (Notification.permission === "granted") {
                new Notification("작업 완료", {
                    body: `${fileName} 변환이 완료되었습니다.`,
                    icon: "/perturba_black.png",
                });
            }
        }

        window.dispatchEvent(
            new CustomEvent("job-toast", {
                detail: {
                    type: "success",
                    message: `${fileName} 변환이 완료되었습니다.`,
                },
            })
        );

        eventSource.close();
        eventSources.delete(publicId);
    });

    eventSource.addEventListener("job-failed", (event) => {
        const data = JSON.parse(event.data);
        useJobStatusStore.getState().updateJobStatus(publicId, "FAILED");

        window.dispatchEvent(
            new CustomEvent("job-toast", {
                detail: {
                    type: "error",
                    message: `${fileName} 변환에 실패했습니다.`,
                },
            })
        );

        eventSource.close();
        eventSources.delete(publicId);
    });

    eventSource.onerror = (error) => {
        console.error(`SSE error for job ${publicId}:`, error);
        eventSource.close();
        eventSources.delete(publicId);
    };

    eventSources.set(publicId, eventSource);
};

export const unsubscribeFromJob = (publicId: string) => {
    const eventSource = eventSources.get(publicId);
    if (eventSource) {
        eventSource.close();
        eventSources.delete(publicId);
    }
};

export const unsubscribeAll = () => {
    eventSources.forEach((es) => es.close());
    eventSources.clear();
};