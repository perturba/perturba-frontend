"use client";

import { useEffect } from "react";
import { useJobStatusStore, subscribeToJob, unsubscribeAll } from "@/store/jobStatusStore";
import { useAuthStore } from "@/store/authStore";

export default function JobSubscriptionProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const jobs = useJobStatusStore((state) => state.jobs);
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

    useEffect(() => {
        if (!isAuthenticated) {
            unsubscribeAll();
            return;
        }

        if (typeof window !== "undefined" && "Notification" in window) {
            if (Notification.permission === "default") {
                Notification.requestPermission();
            }
        }

        const progressJobs = jobs.filter((job) => job.status === "PROGRESS");
        progressJobs.forEach((job) => {
            subscribeToJob(job.publicId, job.fileName);
        });
    }, [isAuthenticated, jobs]);

    return <>{children}</>;
}