"use client";

import { BiX } from "react-icons/bi";
import MenuItem from "./MenuItem";
import { usePathname } from "next/navigation";
import { sidebarMenu } from "./Header";

type SidebarProps = {
    toggleMenu: () => void;
    curMenu: string;
    handleMove: (href: string, label: string) => void;
}

export default function Sidebar({toggleMenu, curMenu, handleMove}: SidebarProps) {
    const pathname = usePathname();

    return (
        <>
            <div
                className="fixed inset-0 bg-black/50 z-40 transition-opacity"
                onClick={toggleMenu}
            />
            <aside className="fixed top-0 left-0 h-full w-72 bg-blue-100 z-50 shadow-2xl transform transition-transform duration-300 flex flex-col">
                <div className="flex items-center justify-between p-4 border-b border-blue-200">
                    <span className="text-lg font-bold text-gray-900">{curMenu}</span>
                    <button
                        onClick={toggleMenu}
                        className="p-2 rounded-lg hover:bg-blue-200 transition"
                        aria-label="메뉴 닫기"
                    >
                        <BiX size={24} className="text-gray-900" />
                    </button>
                </div>
                <nav className="flex flex-col gap-2 p-4">
                    {sidebarMenu.map((item) => (
                        <MenuItem
                            key={item.href}
                            label={item.label}
                            href={item.href}
                            icon={item.icon}
                            isActive={pathname.startsWith(item.href)}
                            onClick={() => handleMove(item.href, item.label)}
                        />
                    ))}
                </nav>
            </aside>
        </>
    )
}