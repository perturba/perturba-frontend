"use client";

import { useEffect } from "react";
import { useJobStatusStore, subscribeToJob } from "@/store/jobStatusStore";

export function JobStatusRehydrator() {
    const jobs = useJobStatusStore((s) => s.jobs);
    const hasHydrated = useJobStatusStore((s) => s._hasHydrated);

    useEffect(() => {
        if (!hasHydrated) return;

        jobs
            .filter((job) => job.status === "PROGRESS")
            .forEach((job) => {
                subscribeToJob(job.publicId, job.fileName);
            });
    }, [hasHydrated, jobs]);

    return null;
}
