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

class EventSourceManager {
    private sources = new Map<string, EventSource>();

    subscribe(publicId: string, fileName: string, store: JobStatusState) {
        if (this.sources.has(publicId)) {
            return;
        }

        const url = `${process.env.NEXT_PUBLIC_SERVER_API_URL}/v1/jobs/${publicId}/events`;
        const eventSource = new EventSource(url, { withCredentials: true });

        this.setupEventHandlers(eventSource, publicId, fileName, store);

        this.sources.set(publicId, eventSource);
    }

    private setupEventHandlers(
        eventSource: EventSource,
        publicId: string,
        fileName: string,
        store: JobStatusState
    ) {
        eventSource.addEventListener("job-created", (event) => {
            const data = JSON.parse(event.data);
            store.addJob({
                publicId: data.publicId,
                fileName,
                status: "PROGRESS",
                createdAt: data.createdAt || new Date().toISOString(),
            });
        });

        eventSource.addEventListener("job-completed", (event) => {
            const data = JSON.parse(event.data);
            store.updateJobStatus(publicId, "COMPLETED", data.completedAt);

            this.notifyUser(fileName, "success");
            this.sendToast(fileName, "success");
            this.cleanup(publicId);
        });

        eventSource.addEventListener("job-failed", () => {
            store.updateJobStatus(publicId, "FAILED");

            this.sendToast(fileName, "error");
            this.cleanup(publicId);
        });

        eventSource.onerror = () => {
            this.cleanup(publicId);
        };
    }

    private notifyUser(fileName: string, type: "success" | "error") {
        if (typeof window === "undefined" || !("Notification" in window)) {
            return;
        }

        if (Notification.permission === "granted") {
            const message = type === "success"
                ? `${fileName} 변환이 완료되었습니다.`
                : `${fileName} 변환에 실패했습니다.`;

            new Notification(type === "success" ? "작업 완료" : "작업 실패", {
                body: message,
                icon: "/perturba_black.png",
            });
        }
    }

    private sendToast(fileName: string, type: "success" | "error") {
        const message = type === "success"
            ? `${fileName} 변환이 완료되었습니다.`
            : `${fileName} 변환에 실패했습니다.`;

        window.dispatchEvent(
            new CustomEvent("job-toast", {
                detail: { type, message },
            })
        );
    }

    private cleanup(publicId: string) {
        const eventSource = this.sources.get(publicId);
        if (eventSource) {
            eventSource.close();
            this.sources.delete(publicId);
        }
    }

    unsubscribe(publicId: string) {
        this.cleanup(publicId);
    }

    unsubscribeAll() {
        this.sources.forEach((es) => es.close());
        this.sources.clear();
    }

    has(publicId: string): boolean {
        return this.sources.has(publicId);
    }
}

const eventSourceManager = new EventSourceManager();

export const useJobStatusStore = create<JobStatusState>()(
    persist(
        (set, get) => ({
            jobs: [],

            addJob: (job) =>
                set((state) => {
                    if (state.jobs.some((j) => j.publicId === job.publicId)) {
                        return state;
                    }
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
                    eventSourceManager.unsubscribe(publicId);
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
    const store = useJobStatusStore.getState();
    eventSourceManager.subscribe(publicId, fileName, store);
};

export const unsubscribeFromJob = (publicId: string) => {
    eventSourceManager.unsubscribe(publicId);
};

export const unsubscribeAll = () => {
    eventSourceManager.unsubscribeAll();
};
