"use client";

import { usePathname } from "next/navigation";

export default function Footer() {
    const pathname = usePathname();
    const isLanding = pathname === "/";

    return (
        <footer
            className={`fixed bottom-0 left-0 w-full z-50 flex items-center items-center justify-between px-8 py-4 transition-colors duration-300 ${isLanding
                ? "text-slate-100"
                : "border-t-2 border-indigo-100 text-slate-800"
                }`}
        >
            <p
                className={`ml-auto text-base font-medium ${isLanding ? "text-slate-100" : "text-slate-800"
                    }`}
            >
                Team. 현우진
            </p>
        </footer>
    );
}
