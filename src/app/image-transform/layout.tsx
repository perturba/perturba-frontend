import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";

export default function ImageTransformLayout({ children }: { children: React.ReactNode }) {
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
        <div className="flex flex-row h-full flex-1">
            <div className="flex-1 overflow-auto">{children}</div>
        </div>
    );
}
