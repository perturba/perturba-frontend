"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Status = "진행중" | "완료";
interface LogRow {
    fileName: string;
    createdAt: string;
    status: Status;
    id: string;
}

const rows: LogRow[] = Array(7)
    .fill(0)
    .map((_, i) => ({
        fileName: "example.jpeg",
        createdAt: "2025.09.12",
        status: i === 0 ? "진행중" : "완료",
        id: String(i + 1)
    }));

const PAGE_SIZE = 8;

export default function ResponsiveImageListPage() {
    const router = useRouter();
    const [page, setPage] = useState<number>(1);

    const totalPages = Math.ceil(rows.length / PAGE_SIZE);
    const pageRows = rows.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    const handleRowClick = (id: string) => {
        router.push(`/dashboard/image-detail/${id}`);
    };

    return (
        <div className="flex-1 flex flex-col bg-gray-50 overflow-hidden">
            <div className="px-4 md:px-16 py-4 md:py-10 bg-white md:bg-gray-50">
                <h1 className="text-base md:text-2xl font-semibold md:font-bold text-gray-900">
                    변환된 이미지 목록
                </h1>
            </div>

            <div className="flex-1 overflow-y-auto px-4 md:px-16 py-4 md:py-8">
                <div className="w-full max-w-[360px] md:max-w-3xl mx-auto bg-white rounded-2xl overflow-hidden shadow-sm md:shadow-md border-2 border-indigo-100">
                    <div className="px-5 md:px-8 py-3 md:py-5 bg-slate-100 border-b-2 border-indigo-100">
                        <h2 className="text-base font-bold text-gray-900">변환 적용 내역</h2>
                    </div>

                    <div className="md:hidden">
                        {pageRows.map((row) => (
                            <button
                                key={row.id}
                                onClick={() => handleRowClick(row.id)}
                                className="w-full px-5 py-4 flex items-center justify-between bg-slate-100 border-b border-white last:border-b-0 active:bg-indigo-50"
                            >
                                <div className="flex-1 text-left">
                                    <p className="text-base font-semibold text-gray-900">
                                        {row.fileName}
                                    </p>
                                    <p className="text-sm text-gray-600 mt-0.5">
                                        {row.createdAt}
                                    </p>
                                </div>
                                <div className="ml-4">
                                    <span
                                        className={`inline-flex px-3 py-1.5 rounded-lg text-sm font-bold ${row.status === "진행중"
                                                ? "bg-yellow-100 text-yellow-600"
                                                : "bg-green-100 text-green-600"
                                            }`}
                                    >
                                        {row.status}
                                    </span>
                                </div>
                            </button>
                        ))}
                    </div>

                    <div className="hidden md:block">
                        <div className="px-14 py-2.5 bg-blue-100 flex justify-between items-center">
                            <span className="flex-1 text-base font-medium text-gray-900">파일명</span>
                            <span className="flex-1 text-center text-base font-medium text-gray-900">생성일</span>
                            <span className="flex-1 text-right text-base font-medium text-gray-900">상태</span>
                        </div>
                        {pageRows.map((row, idx) => {
                            const rounded = idx === pageRows.length - 1 ? "rounded-b-2xl" : "";
                            return (
                                <button
                                    key={row.id}
                                    onClick={() => handleRowClick(row.id)}
                                    className={`w-full px-14 py-2 bg-gray-50 border-l border-r border-b border-blue-100 flex items-center ${rounded} hover:bg-indigo-50 transition`}
                                >
                                    <span className="flex-1 text-base font-medium text-gray-900 truncate text-left">
                                        {row.fileName}
                                    </span>
                                    <span className="flex-1 text-center text-base font-medium text-gray-900">
                                        {row.createdAt}
                                    </span>
                                    <span className={`flex-1 text-right text-base font-medium ${row.status === "진행중" ? "text-yellow-500" : "text-green-600"
                                        }`}>
                                        {row.status}
                                    </span>
                                </button>
                            );
                        })}
                    </div>

                    {totalPages > 1 && (
                        <div className="flex justify-center items-center gap-2 py-4">
                            <button
                                className="px-3 py-1 rounded-lg bg-indigo-100 text-indigo-700 font-medium disabled:bg-gray-100 disabled:text-gray-400 text-sm md:text-base"
                                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                                disabled={page === 1}
                            >
                                이전
                            </button>
                            {Array.from({ length: totalPages }, (_, i) => (
                                <button
                                    key={i}
                                    className={`px-3 py-1 rounded-lg font-medium text-sm md:text-base ${page === i + 1
                                            ? "bg-indigo-500 text-white"
                                            : "bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
                                        }`}
                                    onClick={() => setPage(i + 1)}
                                >
                                    {i + 1}
                                </button>
                            ))}
                            <button
                                className="px-3 py-1 rounded-lg bg-indigo-100 text-indigo-700 font-medium disabled:bg-gray-100 disabled:text-gray-400 text-sm md:text-base"
                                onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                                disabled={page === totalPages}
                            >
                                다음
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
