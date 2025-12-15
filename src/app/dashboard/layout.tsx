"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { JobStatusRehydrator } from "@/components/JobStatusHydrator";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const { isAuthenticated, loginType } = useAuthStore();

    const isGuest = loginType === "GUEST";

    const guestAllowedExactPaths = ["/dashboard/image-upload"];
    const isGuestAllowedDynamicPath = pathname.startsWith("/dashboard/image-detail/");

    const isGuestAllowedPath =
        guestAllowedExactPaths.includes(pathname) || isGuestAllowedDynamicPath;

    useEffect(() => {
        if (!isAuthenticated) {
            router.replace("/");
            return;
        }

        if (isGuest && !isGuestAllowedPath) {
            router.replace("/dashboard/image-upload");
            return;
        }
    }, [isAuthenticated, isGuest, isGuestAllowedPath, router]);

    return (
        <div className="flex-1 min-h-0 flex flex-col">
            <JobStatusRehydrator />
            {children}
        </div>
    );
}
