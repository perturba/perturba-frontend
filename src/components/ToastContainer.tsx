"use client";

import { useEffect, useState } from "react";
import { BiCheckCircle, BiXCircle, BiX } from "react-icons/bi";

interface Toast {
    id: string;
    type: "success" | "error";
    message: string;
}

export default function ToastContainer() {
    const [toasts, setToasts] = useState<Toast[]>([]);

    useEffect(() => {
        const handleToast = (event: CustomEvent) => {
            const { type, message } = event.detail;
            const id = `${Date.now()}-${Math.random()}`;

            setToasts((prev) => [...prev, { id, type, message }]);

            setTimeout(() => {
                setToasts((prev) => prev.filter((t) => t.id !== id));
            }, 5000);
        };

        window.addEventListener("job-toast", handleToast as EventListener);

        return () => {
            window.removeEventListener("job-toast", handleToast as EventListener);
        };
    }, []);

    const removeToast = (id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    };

    return (
        <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
            {toasts.map((toast) => (
                <div
                    key={toast.id}
                    className={`pointer-events-auto min-w-[300px] max-w-[400px] rounded-xl shadow-xl p-4 flex items-center gap-3 animate-slide-in ${toast.type === "success"
                            ? "bg-green-50 border-2 border-green-200"
                            : "bg-red-50 border-2 border-red-200"
                        }`}
                >
                    {toast.type === "success" ? (
                        <BiCheckCircle size={24} className="text-green-600 flex-shrink-0" />
                    ) : (
                        <BiXCircle size={24} className="text-red-600 flex-shrink-0" />
                    )}
                    <p
                        className={`flex-1 text-sm font-medium ${toast.type === "success" ? "text-green-900" : "text-red-900"
                            }`}
                    >
                        {toast.message}
                    </p>
                    <button
                        onClick={() => removeToast(toast.id)}
                        className={`p-1 rounded-lg transition flex-shrink-0 ${toast.type === "success"
                                ? "hover:bg-green-100"
                                : "hover:bg-red-100"
                            }`}
                    >
                        <BiX
                            size={18}
                            className={
                                toast.type === "success" ? "text-green-600" : "text-red-600"
                            }
                        />
                    </button>
                </div>
            ))}
        </div>
    );
}
