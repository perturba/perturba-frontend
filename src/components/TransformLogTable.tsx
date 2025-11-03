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

const statusColor: Record<Status, string> = {
    "진행중": "text-yellow-500 font-medium",
    "완료": "text-green-600 font-medium"
};

const rows: LogRow[] = Array(30)
    .fill(0)
    .map((_, i) => ({
        fileName: "example.jpeg",
        createdAt: "2025.09.12",
        status: i % 8 === 0 ? "진행중" : "완료",
        id: String(i + 1)
    }));

const PAGE_SIZE = 8;

const TransformLogFlexTable: React.FC = () => {
    const [page, setPage] = useState<number>(1);
    const totalPages = Math.ceil(rows.length / PAGE_SIZE);
    const pageRows = rows.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
    const router = useRouter();

    const handleRowClick = (id: string) => {
        router.push(`/dashboard/image-detail/${id}`);
    };

    // TODO: 이미지 list 불러오기 api

    return (
        <div className="w-full max-w-2xl lg:max-w-3xl rounded-xl shadow-md outline outline-1 outline-blue-100 flex flex-col items-start mx-auto my-8 bg-white">
            <div className="w-full px-6 py-4 bg-gray-50 rounded-t-xl outline outline-1 outline-blue-100 flex items-center">
                <span className="text-gray-900 text-base font-bold">변환 적용 내역</span>
            </div>
            <div className="w-full px-6 md:px-14 py-2.5 bg-blue-100 flex justify-between items-center rounded-t-lg">
                <span className="flex-1 min-w-0 text-gray-900 text-base font-medium">파일명</span>
                <span className="flex-1 min-w-0 text-gray-900 text-base font-medium text-center">생성일</span>
                <span className="flex-1 min-w-0 text-gray-900 text-base font-medium text-right">상태</span>
            </div>
            {pageRows.map((row, idx) => {
                const rounded = idx === pageRows.length - 1 ? "rounded-b-xl" : "rounded-none";
                return (
                    <button
                        type="button"
                        key={row.id}
                        onClick={() => handleRowClick(row.id)}
                        className={`w-full px-6 md:px-14 py-2 bg-gray-50 border-l border-r border-b border-blue-100 flex items-center ${rounded} hover:bg-indigo-50 transition cursor-pointer focus:outline-none`}
                        tabIndex={0}
                        aria-label={`상세 페이지로 이동: ${row.fileName}`}
                    >
                        <span className="flex-1 min-w-0 text-gray-900 text-base font-medium truncate text-left">{row.fileName}</span>
                        <span className="flex-1 min-w-0 text-gray-900 text-base font-medium text-center">{row.createdAt}</span>
                        <span className={`flex-1 min-w-0 text-base font-medium text-right ${statusColor[row.status]}`}>{row.status}</span>
                    </button>
                );
            })}
            <div className="w-full flex justify-center items-center gap-2 py-4">
                <button
                    className="px-3 py-1 rounded-lg bg-indigo-100 text-indigo-700 font-medium disabled:bg-gray-100 disabled:text-gray-400 transition"
                    onClick={() => setPage((p) => Math.max(p - 1, 1))}
                    disabled={page === 1}
                >
                    이전
                </button>
                {Array.from({ length: totalPages }, (_, i) => (
                    <button
                        key={i}
                        className={`px-3 py-1 rounded-lg font-medium ${page === i + 1
                            ? "bg-indigo-500 text-white"
                            : "bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
                            }`}
                        onClick={() => setPage(i + 1)}
                    >
                        {i + 1}
                    </button>
                ))}
                <button
                    className="px-3 py-1 rounded-lg bg-indigo-100 text-indigo-700 font-medium disabled:bg-gray-100 disabled:text-gray-400 transition"
                    onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                    disabled={page === totalPages}
                >
                    다음
                </button>
            </div>
        </div>
    );
};

export default TransformLogFlexTable;
