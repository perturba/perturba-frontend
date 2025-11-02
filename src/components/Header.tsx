"use client";

import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";

export default function Header() {
    const pathname = usePathname();
    const router = useRouter();
    const isLanding = pathname === "/";

    const handleLogin = () => {
        router.push("/dashboard");
    };

    const handleLogout = () => {
        router.push("/");
    }

    return (
        <header
            className={`fixed top-0 left-0 w-full z-50 flex items-center justify-between px-8 py-4 transition-colors duration-300 ${isLanding
                ? "text-gray-50"
                : "border-b-2 border-indigo-100 text-slate-800"
                }`}
        >
            <div className="flex items-center">
                <Image
                    src={
                        isLanding
                            ? "/perturba_white.png"
                            : "/perturba_black.png"
                    }
                    alt="Logo"
                    width={135}
                    height={30}
                    className="h-7 w-auto"
                />
            </div>

            <div className="flex items-center gap-4">
                {isLanding ? (
                    <>
                        <button
                            className="px-4 py-2 text-slate-100 text-base font-medium"
                            onClick={handleLogin}
                        >
                            로그인
                        </button>
                        <button
                            className="px-4 py-2 rounded-2xl border border-gray-50 text-gray-300 text-base font-medium"
                            onClick={handleLogin}
                        >
                            게스트 로그인
                        </button>
                    </>
                ) : (
                    <>
                        <button
                            className="px-4 py-2 text-slate-800 text-base font-medium"
                            onClick={handleLogout}
                        >
                            로그아웃
                        </button>
                    </>
                )}
            </div>
        </header>
    );
}
