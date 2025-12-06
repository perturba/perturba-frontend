"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { getJobList } from "@/api/jobApi";
import type { Job } from "@/types/api";
import LoadingSpinner from "@/components/LoadingSpinner";

const PAGE_SIZE = 5;

export default function ImageListPage() {
    const router = useRouter();
    const [page, setPage] = useState<number>(0);
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);
    const [totalPages, setTotalPages] = useState(0);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadJobs();
    }, [page]);

    const loadJobs = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await getJobList(page, PAGE_SIZE);

            setJobs(response.items);
            setTotalPages(response.totalPages);
        } catch (err) {
            console.error("Failed to load jobs:", err);
            setError("작업 목록을 불러오는데 실패했습니다.");
        } finally {
            setLoading(false);
        }
    };

    const handleRowClick = (publicId: string) => {
        router.push(`/dashboard/image-detail/${publicId}`);
    };

    const getStatusLabel = (status: Job["status"]) => {
        switch (status) {
            case "PROGRESS":
                return "진행중";
            case "COMPLETED":
                return "완료";
            case "FAILED":
                return "실패";
            default:
                return status;
        }
    };

    const getStatusColor = (status: Job["status"]) => {
        switch (status) {
            case "PROGRESS":
                return "bg-yellow-100 text-yellow-600";
            case "COMPLETED":
                return "bg-green-100 text-green-600";
            case "FAILED":
                return "bg-red-100 text-red-600";
            default:
                return "bg-gray-100 text-gray-600";
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("ko-KR", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
        }).replace(/\. /g, ".").replace(/\.$/, "");
    };

    if (loading && jobs.length === 0) {
        return (
            <div className="flex-1 flex flex-col bg-gray-50 overflow-hidden">
                <div className="px-4 md:px-16 py-4 md:py-10 bg-white md:bg-gray-50">
                    <h1 className="text-base md:text-2xl font-semibold md:font-bold text-gray-900">
                        변환된 이미지 목록
                    </h1>
                </div>
                <div className="flex-1 flex items-center justify-center">
                    <LoadingSpinner />
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col bg-gray-50 overflow-hidden">
            <div className="px-4 md:px-16 py-4 md:py-10 bg-white md:bg-gray-50">
                <h1 className="text-base md:text-2xl font-semibold md:font-bold text-gray-900">
                    변환된 이미지 목록
                </h1>
            </div>

            <div className="flex-1 overflow-y-auto px-4 md:px-16 py-4 md:py-8">
                {error ? (
                    <div className="w-full max-w-[360px] md:max-w-3xl mx-auto bg-white rounded-2xl p-8 text-center">
                        <p className="text-red-600 mb-4">{error}</p>
                        <button
                            onClick={loadJobs}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                        >
                            다시 시도
                        </button>
                    </div>
                ) : jobs.length === 0 ? (
                    <div className="w-full max-w-[360px] md:max-w-3xl mx-auto bg-white rounded-2xl p-8 text-center">
                        <p className="text-gray-600">변환된 이미지가 없습니다.</p>
                    </div>
                ) : (
                    <div className="w-full max-w-[360px] md:max-w-3xl mx-auto bg-white rounded-2xl overflow-hidden shadow-sm md:shadow-md border-2 border-indigo-100">
                        <div className="px-5 md:px-8 py-3 md:py-5 bg-slate-100 border-b-2 border-indigo-100">
                            <h2 className="text-base font-bold text-gray-900">변환 적용 내역</h2>
                        </div>

                        <div className="md:hidden">
                            {jobs.map((job) => (
                                <button
                                    key={job.publicId}
                                    onClick={() => handleRowClick(job.publicId)}
                                    className="w-full px-5 py-4 flex items-center justify-between bg-slate-100 border-b border-white last:border-b-0 active:bg-indigo-50"
                                >
                                    <div className="flex-1 text-left">
                                        <p className="text-base font-semibold text-gray-900">
                                            Job {job.publicId.slice(0, 8)}...
                                        </p>
                                        <p className="text-sm text-gray-600 mt-0.5">
                                            {formatDate(job.createdAt)}
                                        </p>
                                    </div>
                                    <div className="ml-4">
                                        <span
                                            className={`inline-flex px-3 py-1.5 rounded-lg text-sm font-bold ${getStatusColor(job.status)}`}
                                        >
                                            {getStatusLabel(job.status)}
                                        </span>
                                    </div>
                                </button>
                            ))}
                        </div>

                        <div className="hidden md:block">
                            <div className="px-14 py-2.5 bg-blue-100 flex justify-between items-center">
                                <span className="flex-1 text-base font-medium text-gray-900">작업 ID</span>
                                <span className="flex-1 text-center text-base font-medium text-gray-900">생성일</span>
                                <span className="flex-1 text-right text-base font-medium text-gray-900">상태</span>
                            </div>
                            {jobs.map((job, idx) => {
                                const rounded = idx === jobs.length - 1 ? "rounded-b-2xl" : "";
                                return (
                                    <button
                                        key={job.publicId}
                                        onClick={() => handleRowClick(job.publicId)}
                                        className={`w-full px-14 py-2 bg-gray-50 border-l border-r border-b border-blue-100 flex items-center ${rounded} hover:bg-indigo-50 transition`}
                                    >
                                        <span className="flex-1 text-base font-medium text-gray-900 truncate text-left">
                                            {job.publicId}
                                        </span>
                                        <span className="flex-1 text-center text-base font-medium text-gray-900">
                                            {formatDate(job.createdAt)}
                                        </span>
                                        <span className={`flex-1 text-right text-base font-medium ${job.status === "PROGRESS" ? "text-yellow-500" :
                                            job.status === "COMPLETED" ? "text-green-600" :
                                                "text-red-600"
                                            }`}>
                                            {getStatusLabel(job.status)}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>

                        {totalPages > 1 && (
                            <div className="flex justify-center items-center gap-2 py-4">
                                <button
                                    className="px-3 py-1 rounded-lg bg-indigo-100 text-indigo-700 font-medium disabled:bg-gray-100 disabled:text-gray-400 text-sm md:text-base"
                                    onClick={() => setPage((p) => Math.max(p - 1, 0))}
                                    disabled={page === 0 || loading}
                                >
                                    이전
                                </button>
                                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                                    let pageNum: number;
                                    if (totalPages <= 5) {
                                        pageNum = i;
                                    } else if (page < 3) {
                                        pageNum = i;
                                    } else if (page > totalPages - 3) {
                                        pageNum = totalPages - 5 + i;
                                    } else {
                                        pageNum = page - 2 + i;
                                    }

                                    return (
                                        <button
                                            key={pageNum}
                                            className={`px-3 py-1 rounded-lg font-medium text-sm md:text-base ${page === pageNum
                                                ? "bg-indigo-500 text-white"
                                                : "bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
                                                }`}
                                            onClick={() => setPage(pageNum)}
                                            disabled={loading}
                                        >
                                            {pageNum + 1}
                                        </button>
                                    );
                                })}
                                <button
                                    className="px-3 py-1 rounded-lg bg-indigo-100 text-indigo-700 font-medium disabled:bg-gray-100 disabled:text-gray-400 text-sm md:text-base"
                                    onClick={() => setPage((p) => Math.min(p + 1, totalPages - 1))}
                                    disabled={page === totalPages - 1 || loading}
                                >
                                    다음
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
