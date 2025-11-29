"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const { isAuthenticated, loginType } = useAuthStore();
    const isGuest = loginType === "GUEST";

    useEffect(() => {
        if (!isAuthenticated && !isGuest) {
            router.replace("/");
            return;
        }
    }, [isAuthenticated, isGuest, router]);

    return (
        <div className="flex-1 min-h-0 flex flex-col">
            {children}
        </div>
    );
}