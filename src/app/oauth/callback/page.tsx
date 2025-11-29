"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import LoadingSpinner from "@/components/LoadingSpinner";
import { refreshAccessToken } from "@/api/authApi";

export default function OAuthCallbackPage() {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const handleOAuthCallback = async () => {
            try {
                const token = await refreshAccessToken();

                if (token) {
                    router.replace("/dashboard");
                } else {
                    setError("로그인에 실패했습니다.");
                    setTimeout(() => router.replace("/"), 2000);
                }
            } catch (err) {
                console.error("OAuth callback error:", err);
                setError("로그인 처리 중 오류가 발생했습니다.");
                setTimeout(() => router.replace("/"), 2000);
            }
        };

        handleOAuthCallback();
    }, [router]);

    if (error) {
        return (
            <div className="flex-1 min-h-0 flex flex-col items-center justify-center">
                <div className="text-center">
                    <p className="text-red-600 mb-2">{error}</p>
                    <p className="text-gray-600 text-sm">잠시 후 홈으로 이동합니다...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 min-h-0 flex flex-col">
            <LoadingSpinner />
        </div>
    );
}
