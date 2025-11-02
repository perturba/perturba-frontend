"use client";
import { useRouter, usePathname } from "next/navigation";
import { BiUpload, BiImageAlt, BiBookAlt, BiPulse } from "react-icons/bi";

const sidebarMenu = [
    { label: "파일 업로드 하기", href: "/dashboard/image-transform", icon: <BiUpload size={22} /> },
    { label: "이미지 목록", href: "/dashboard/list", icon: <BiImageAlt size={22} /> },
    { label: "API Docs", href: "/dashboard/api-docs", icon: <BiBookAlt size={22} /> },
    { label: "서비스 성능 보기", href: "/dashboard/performance", icon: <BiPulse size={22} /> }
];

export default function DashboardSidebar() {
    const router = useRouter();
    const pathname = usePathname();

    return (
        <aside
            className="bg-blue-100 w-full max-w-xs flex flex-1 flex-col py-10 px-6 gap-8 shadow-lg md:py-12 md:px-8"
        >
            <nav className="flex flex-col gap-2.5">
                {sidebarMenu.map(item => {
                    const isActive = pathname.startsWith(item.href);
                    return (
                        <button
                            key={item.label}
                            className={`
                flex items-center w-full py-3 px-6 rounded-xl font-semibold text-lg transition
                gap-3 cursor-pointer
                ${isActive ? "bg-white text-gray-900 shadow-md" : "text-gray-600 hover:bg-gray-50"}
              `}
                            onClick={() => router.push(item.href)}
                            aria-current={isActive ? "page" : undefined}
                        >
                            <span className="text-blue-400">{item.icon}</span>
                            {item.label}
                        </button>
                    );
                })}
            </nav>
        </aside>
    );
}
