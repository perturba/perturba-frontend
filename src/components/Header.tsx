"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import {
    BiMenu,
    BiUpload,
    BiImageAlt,
    BiBookAlt,
    BiPulse,
} from "react-icons/bi";
import Sidebar from "./Sidebar";
import { logout as apiLogout } from "@/api/authApi";
import { getGuestSession } from "@/api/guestControllerApi";
import { useAuthStore } from "@/store/authStore";

export type SidebarMenuItem = {
    label: string;
    href: string;
    icon: React.ReactElement;
};

const sidebarMenu: SidebarMenuItem[] = [
    {
        label: "파일 업로드 하기",
        href: "/dashboard/image-upload",
        icon: <BiUpload size={22} />,
    },
    {
        label: "이미지 목록",
        href: "/dashboard/list",
        icon: <BiImageAlt size={22} />,
    },
    {
        label: "API Docs",
        href: "/dashboard/api-docs",
        icon: <BiBookAlt size={22} />,
    },
    {
        label: "서비스 성능 보기",
        href: "/dashboard/performance",
        icon: <BiPulse size={22} />,
    },
];

export default function Header() {
    const pathname = usePathname();
    const router = useRouter();
    const isLanding = pathname === "/";
    const [menuOpen, setMenuOpen] = useState(false);
    const [curMenu, setCurMenu] = useState<string>(sidebarMenu[0].label);

    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const loginType = useAuthStore((state) => state.loginType);
    const setLoginType = useAuthStore((state) => state.setLoginType);
    const logout = useAuthStore((state) => state.logout);

    const isGuest = !isAuthenticated && loginType === "GUEST";

    const handleMove = (href: string, label: string) => {
        router.push(href);
        setCurMenu(label);
        setMenuOpen(false);
    };

    const handleLogin = () => {
        window.location.href = `${process.env.NEXT_PUBLIC_SERVER_API_URL}/oauth2/authorization/google`;
    };

    const handleGuestLogin = async () => {
        try {
            const res = await getGuestSession();
            setLoginType("GUEST");
            handleMove("/dashboard", sidebarMenu[0].label);
        } catch (error) {
            console.error("Guest login failed:", error);
        }
    };

    const handleLogout = async () => {
        try {
            await apiLogout();
            logout();
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    const toggleMenu = () => setMenuOpen((prev) => !prev);

    const guestSidebarMenu: SidebarMenuItem[] = [sidebarMenu[0]];
    const effectiveMenu = isGuest ? guestSidebarMenu : sidebarMenu;

    return (
        <>
            <header
                className={`h-12 sm:h-14 flex items-center justify-between px-4 py-3 transition-colors duration-300 ${isLanding
                    ? "text-gray-50 fixed top-0 left-0 w-full z-50"
                    : "border-b-2 border-indigo-100 text-slate-800 bg-gray-50"
                    }`}
            >
                <div
                    className={`flex items-center gap-4 ${isLanding ? "" : "flex-1"
                        }`}
                >
                    <Image
                        src={isLanding ? "/perturba_white.png" : "/perturba_black.png"}
                        alt="Logo"
                        width={120}
                        height={26}
                        className="h-6 w-auto"
                    />
                    {!isLanding && (
                        <button
                            onClick={toggleMenu}
                            className="p-2 -ml-2 rounded-lg hover:bg-gray-100 transition"
                            aria-label="메뉴 열기"
                        >
                            <BiMenu size={24} className="text-gray-900" />
                        </button>
                    )}
                </div>
                <div className="flex items-center gap-2">
                    {isLanding ? (
                        <>
                            {!isAuthenticated && !isGuest ? (
                                <>
                                    <button
                                        className="px-2 sm:px-3 py-1.5 text-xs sm:text-sm rounded-xl border border-gray-50 text-gray-300 font-medium hover:bg-white/10 transition"
                                        onClick={handleGuestLogin}
                                    >
                                        게스트 로그인
                                    </button>
                                    <button
                                        className="px-2 sm:px-3 py-1.5 text-xs sm:text-sm rounded-xl border border-gray-50 text-gray-300 font-medium hover:bg-white/10 transition"
                                        onClick={handleLogin}
                                    >
                                        로그인
                                    </button>
                                </>
                            ) : (
                                <button
                                    className="px-3 py-1.5 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition"
                                    onClick={() =>
                                        handleMove("/dashboard", sidebarMenu[0].label)
                                    }
                                >
                                    대시보드로 이동
                                </button>
                            )}
                        </>
                    ) : (
                        <>
                            {isGuest ? null : (
                                <button
                                    className="px-3 py-1.5 text-slate-800 text-sm font-medium hover:text-slate-600 transition"
                                    onClick={handleLogout}
                                >
                                    로그아웃
                                </button>
                            )}
                        </>
                    )}
                </div>
            </header>
            {menuOpen && (
                <Sidebar
                    toggleMenu={toggleMenu}
                    curMenu={curMenu}
                    handleMove={handleMove}
                    menuItems={effectiveMenu}
                />
            )}
        </>
    );
}
