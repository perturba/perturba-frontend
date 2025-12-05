"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";

export default function ImageTransformLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const { isAuthenticated } = useAuthStore();

    useEffect(() => {
        if (!isAuthenticated) {
            router.replace("/");
            return;
        }
    }, [isAuthenticated, router]);

    return (
        <div className="flex flex-row h-full flex-1">
            <div className="flex-1 overflow-auto">{children}</div>
        </div>
    );
}
