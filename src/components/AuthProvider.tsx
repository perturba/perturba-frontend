"use client";

import { useEffect, useState } from "react";
import { checkAuthStatus } from "@/api/authApi";
import { useAuthStore } from "@/store/authStore";

export default function AuthProvider({ children }: { children: React.ReactNode }) {
    const [isChecking, setIsChecking] = useState(true);
    const setIsAuthenticated = useAuthStore((state) => state.setIsAuthenticated);

    useEffect(() => {
        const initAuth = async () => {
            try {
                const isAuthenticated = await checkAuthStatus();
                setIsAuthenticated(isAuthenticated);
            } catch (error) {
                console.error("Auth check failed:", error);
                setIsAuthenticated(false);
            } finally {
                setIsChecking(false);
            }
        };

        initAuth();
    }, [setIsAuthenticated]);

    if (isChecking) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
            </div>
        );
    }

    return <>{children}</>;
}
