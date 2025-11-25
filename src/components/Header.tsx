"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { BiMenu, BiUpload, BiX, BiImageAlt, BiBookAlt, BiPulse } from "react-icons/bi";
import MenuItem from "./MenuItem";
import Sidebar from "./Sidebar";

type SidebarMenuItem = {
    label: string;
    href: string;
    icon: React.ReactElement;
};

export const sidebarMenu: SidebarMenuItem[] = [
    { label: "파일 업로드 하기", href: "/dashboard/image-upload", icon: <BiUpload size={22} /> },
    { label: "이미지 목록", href: "/dashboard/list", icon: <BiImageAlt size={22} /> },
    { label: "API Docs", href: "/dashboard/api-docs", icon: <BiBookAlt size={22} /> },
    { label: "서비스 성능 보기", href: "/dashboard/performance", icon: <BiPulse size={22} /> },
];

export default function Header() {
    const pathname = usePathname();
    const router = useRouter();
    const isLanding = pathname === "/";
    const [menuOpen, setMenuOpen] = useState(false);
    const [curMenu, setCurMenu] = useState<string>(sidebarMenu[0].label);

    const handleMove = (href: string, label: string) => {
        router.push(href);
        setCurMenu(label);
        setMenuOpen(false);
    };

    const handleLogin = () => handleMove("/dashboard", sidebarMenu[0].label);
    const handleLogout = () => handleMove("/", sidebarMenu[0].label);

    const toggleMenu = () => setMenuOpen((prev) => !prev);

    return (
        <>
            <header
                className={`h-14 flex items-center justify-between px-4 py-3 transition-colors duration-300 ${isLanding
                    ? "text-gray-50 fixed top-0 left-0 w-full z-50"
                    : "border-b-2 border-indigo-100 text-slate-800 bg-gray-50"
                    }`}
            >
                <div className={`flex items-center gap-4 ${isLanding ? "" : "flex-1"}`}>
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
                        <button
                            className="px-3 py-1.5 rounded-xl border border-gray-50 text-gray-300 text-sm font-medium"
                            onClick={handleLogin}
                        >
                            로그인
                        </button>
                    ) : (
                        <button
                            className="px-3 py-1.5 text-slate-800 text-sm font-medium"
                            onClick={handleLogout}
                        >
                            로그아웃
                        </button>
                    )}
                </div>
            </header>
            {menuOpen && (
                <Sidebar
                    toggleMenu={toggleMenu}
                    curMenu={curMenu}
                    handleMove={handleMove}
                />
            )}
        </>
    );
}
