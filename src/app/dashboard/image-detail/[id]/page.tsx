"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { BiChevronLeft, BiShareAlt, BiDownload, BiChevronDown } from "react-icons/bi";
import FeedbackModal from "@/components/FeedbackModal";
import LoadingSpinner from "@/components/LoadingSpinner";
import { getJobResult, submitJobFeedback } from "@/api/jobApi";
import type { JobResultResponse, FeedbackRequest } from "@/types/api";
import { AxiosError } from "axios";

const tabList = ["원본 이미지", "변환된 이미지", "AI 변경 요청 결과", "적용된 Perturbation 시각화"] as const;

export default function ResponsiveImageDetailPage() {
    const [tabIdx, setTabIdx] = useState(0);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [showFeedback, setShowFeedback] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [jobResult, setJobResult] = useState<JobResultResponse | null>(null);
    const [jobStatus, setJobStatus] = useState<"PROGRESS" | "COMPLETED" | "FAILED" | null>(null);
    const [submittingFeedback, setSubmittingFeedback] = useState(false);

    const router = useRouter();
    const params = useParams();
    const publicId = params.id as string;

    useEffect(() => {
        if (publicId) {
            loadJobResult();
        }
    }, [publicId]);

    const loadJobResult = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await getJobResult(publicId);

            if (response.ok && response.data) {
                setJobResult(response.data);
                setJobStatus(response.data.completedAt ? "COMPLETED" : "PROGRESS");
            } else {
                throw new Error("작업 결과를 불러오는데 실패했습니다.");
            }
        } catch (err) {
            console.error("Failed to load job result:", err);

            if (err instanceof AxiosError && err.response?.status === 404) {
                setJobStatus("PROGRESS");
                setError(null);
            } else if (err instanceof Error && err.message.includes("not found")) {
                setJobStatus("PROGRESS");
                setError(null);
            } else {
                setError("작업 결과를 불러오는데 실패했습니다.");
                setJobStatus("FAILED");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleGoBack = () => {
        router.push("/dashboard/list");
    };

    const handleFeedbackSubmit = async (feedback: FeedbackRequest) => {
        try {
            setSubmittingFeedback(true);
            const response = await submitJobFeedback(publicId, feedback);

            if (response.ok) {
                window.dispatchEvent(
                    new CustomEvent("job-toast", {
                        detail: {
                            type: "success",
                            message: "피드백이 성공적으로 제출되었습니다.",
                        },
                    })
                );
                setShowFeedback(false);
            } else {
                throw new Error("피드백 제출에 실패했습니다.");
            }
        } catch (err) {
            console.error("Failed to submit feedback:", err);
            window.dispatchEvent(
                new CustomEvent("job-toast", {
                    detail: {
                        type: "error",
                        message: "피드백 제출에 실패했습니다. 다시 시도해주세요.",
                    },
                })
            );
        } finally {
            setSubmittingFeedback(false);
        }
    };

    const handleDownload = async () => {
        if (!jobResult) return;

        const imageUrl = getCurrentImageUrl();
        if (!imageUrl) return;

        try {
            const a = document.createElement("a");
            a.href = imageUrl;
            a.download = `perturba_${tabList[tabIdx].replace(/\s+/g, '_')}_${Date.now()}.jpg`;
            a.target = "_blank";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);

            window.dispatchEvent(
                new CustomEvent("job-toast", {
                    detail: {
                        type: "success",
                        message: "이미지 다운로드를 시작했습니다.",
                    },
                })
            );
        } catch (err) {
            console.error("Download failed:", err);
            window.dispatchEvent(
                new CustomEvent("job-toast", {
                    detail: {
                        type: "error",
                        message: "이미지 다운로드에 실패했습니다.",
                    },
                })
            );
        }
    };

    const handleShare = async () => {
        const shareUrl = window.location.href;

        try {
            if (navigator.share) {
                await navigator.share({
                    title: getFileName(),
                    text: "Perturba로 변환된 이미지를 확인해보세요!",
                    url: shareUrl,
                });

                window.dispatchEvent(
                    new CustomEvent("job-toast", {
                        detail: {
                            type: "success",
                            message: "공유되었습니다.",
                        },
                    })
                );
            } else {
                await navigator.clipboard.writeText(shareUrl);

                window.dispatchEvent(
                    new CustomEvent("job-toast", {
                        detail: {
                            type: "success",
                            message: "링크가 클립보드에 복사되었습니다.",
                        },
                    })
                );
            }
        } catch (err) {
            console.error("Share failed:", err);

            window.dispatchEvent(
                new CustomEvent("job-toast", {
                    detail: {
                        type: "error",
                        message: "공유에 실패했습니다. URL을 직접 복사해주세요.",
                    },
                })
            );
        }
    };

    const getCurrentImageUrl = () => {
        if (!jobResult) return null;

        switch (tabIdx) {
            case 0:
                return jobResult.input?.url || null;
            case 1:
                return jobResult.perturbed?.url || null;
            case 2:
                return jobResult.deepfakeOutput?.url || null;
            case 3:
                return jobResult.perturbationVis?.url || null;
            default:
                return jobResult.input?.url || null;
        }
    };

    const isTabProcessing = (idx: number) => {
        if (idx === 0) return false;
        if (jobStatus !== "COMPLETED") return true;

        switch (idx) {
            case 1:
                return !jobResult?.perturbed;
            case 2:
                return !jobResult?.deepfakeOutput;
            case 3:
                return !jobResult?.perturbationVis;
            default:
                return false;
        }
    };

    const getFileName = () => {
        if (!jobResult) return "이미지";
        return `작업 ${publicId.slice(0, 8)}...`;
    };

    if (loading) {
        return (
            <div className="flex-1 flex flex-col bg-white md:bg-gray-50 overflow-hidden">
                <div className="flex md:hidden items-center justify-between px-3 py-3 bg-white border-b border-gray-200">
                    <button onClick={handleGoBack} className="p-2">
                        <BiChevronLeft size={24} className="text-gray-900" />
                    </button>
                    <h1 className="flex-1 text-center text-base font-semibold text-gray-900 truncate px-2">
                        로딩 중...
                    </h1>
                </div>
                <div className="flex-1 flex items-center justify-center">
                    <LoadingSpinner />
                </div>
            </div>
        );
    }

    if (error || !jobResult) {
        return (
            <div className="flex-1 flex flex-col bg-white md:bg-gray-50 overflow-hidden">
                <div className="flex md:hidden items-center justify-between px-3 py-3 bg-white border-b border-gray-200">
                    <button onClick={handleGoBack} className="p-2">
                        <BiChevronLeft size={24} className="text-gray-900" />
                    </button>
                </div>
                <div className="flex-1 flex flex-col items-center justify-center p-8">
                    <p className="text-red-600 mb-4">{error || "작업 결과를 찾을 수 없습니다."}</p>
                    <button
                        onClick={handleGoBack}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                        목록으로 돌아가기
                    </button>
                </div>
            </div>
        );
    }

    const currentImageUrl = getCurrentImageUrl();

    return (
        <div className="flex-1 flex flex-col bg-white md:bg-gray-50 overflow-hidden">
            <div className="flex md:hidden items-center justify-between px-3 py-3 bg-white border-b border-gray-200">
                <button onClick={handleGoBack} className="p-2">
                    <BiChevronLeft size={24} className="text-gray-900" />
                </button>
                <h1 className="flex-1 text-center text-base font-semibold text-gray-900 truncate px-2">
                    {getFileName()}
                </h1>
                <button className="p-2" onClick={handleShare}>
                    <BiShareAlt size={24} className="text-gray-900" />
                </button>
            </div>

            <div className="hidden md:flex items-center justify-between px-8 py-10 bg-gray-50">
                <h1 className="text-2xl font-bold text-gray-900">{getFileName()}</h1>
                <button className="p-2 rounded-full hover:bg-slate-200 transition" onClick={handleShare}>
                    <BiShareAlt size={24} className="text-gray-600" />
                </button>
            </div>

            <div className="md:hidden px-5 py-3 bg-white border-b border-gray-200">
                <div className="relative">
                    <button
                        type="button"
                        className="w-full flex items-center justify-between text-base font-semibold text-gray-900"
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                    >
                        <span className="flex items-center gap-2">
                            {tabList[tabIdx]}
                            {isTabProcessing(tabIdx) && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
                                    변환중
                                </span>
                            )}
                        </span>
                        <BiChevronDown
                            className={`text-xl transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
                        />
                    </button>
                    {dropdownOpen && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-200 z-10 overflow-hidden">
                            {tabList.map((tab, idx) => (
                                <button
                                    key={tab}
                                    type="button"
                                    onClick={() => {
                                        setTabIdx(idx);
                                        setDropdownOpen(false);
                                    }}
                                    disabled={isTabProcessing(idx)}
                                    className={`w-full px-4 py-3 text-left text-sm font-medium flex items-center justify-between ${idx === tabIdx
                                            ? "bg-indigo-50 text-blue-600"
                                            : isTabProcessing(idx)
                                                ? "text-gray-300 bg-gray-50 cursor-not-allowed"
                                                : "text-gray-900 hover:bg-gray-50"
                                        }`}
                                >
                                    <span>{tab}</span>
                                    {isTabProcessing(idx) && (
                                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-600">
                                            변환중
                                        </span>
                                    )}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <div className="flex-1 overflow-y-auto bg-gray-50 flex flex-col md:justify-center items-center px-4 md:px-0 py-5 md:py-0">
                <div className="hidden md:block w-full max-w-2xl bg-white rounded-2xl shadow-md p-6">
                    <div className="w-full flex border-b border-gray-200 mb-4">
                        {tabList.map((tab, idx) => (
                            <button
                                key={tab}
                                onClick={() => setTabIdx(idx)}
                                disabled={isTabProcessing(idx)}
                                className={`flex-1 py-2 text-center text-sm font-medium transition-all relative ${tabIdx === idx
                                        ? "text-indigo-700 border-b-2 border-indigo-600 font-semibold"
                                        : isTabProcessing(idx)
                                            ? "text-gray-300 cursor-not-allowed"
                                            : "text-gray-400 hover:text-gray-600"
                                    }`}
                            >
                                <span className="flex items-center justify-center gap-1.5">
                                    {tab}
                                    {isTabProcessing(idx) && (
                                        <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
                                            변환중
                                        </span>
                                    )}
                                </span>
                            </button>
                        ))}
                    </div>
                    <div className="relative flex justify-center items-center w-full min-h-[260px] bg-gray-100 rounded-xl overflow-hidden">
                        {isTabProcessing(tabIdx) ? (
                            <div className="flex flex-col items-center gap-4">
                                <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
                                <p className="text-gray-600 font-medium">이미지 변환 중...</p>
                                <p className="text-gray-500 text-sm">완료되면 알림을 받으실 수 있습니다</p>
                            </div>
                        ) : currentImageUrl ? (
                            <img
                                src={currentImageUrl}
                                alt={tabList[tabIdx]}
                                className="object-contain rounded-lg max-h-[240px] w-auto"
                            />
                        ) : null}
                    </div>
                </div>

                <div className="md:hidden w-full">
                    <div className="bg-white rounded-2xl overflow-hidden shadow-lg">
                        <div className="aspect-square bg-gray-100 flex items-center justify-center">
                            {isTabProcessing(tabIdx) ? (
                                <div className="flex flex-col items-center gap-4 p-8">
                                    <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
                                    <p className="text-gray-600 font-medium text-center">이미지 변환 중...</p>
                                    <p className="text-gray-500 text-sm text-center">완료되면 알림을 받으실 수 있습니다</p>
                                </div>
                            ) : currentImageUrl ? (
                                <img
                                    src={currentImageUrl}
                                    alt={tabList[tabIdx]}
                                    className="w-full h-full object-cover"
                                />
                            ) : null}
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-center md:justify-end px-4 md:px-8 py-4 md:py-6 bg-white border-t border-gray-200 md:bg-gray-50 md:border-t-0">
                <div className="flex flex-col items-center gap-3 md:gap-4 max-w-2xl md:ml-auto md:mr-4">
                    <button
                        className="text-gray-700 text-sm font-medium border-b border-gray-400 pb-1 md:hover:text-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed disabled:text-gray-400 disabled:border-gray-300"
                        onClick={() => setShowFeedback(true)}
                        disabled={jobStatus !== "COMPLETED"}
                    >
                        변환 강도 피드백 주기
                    </button>
                    <button
                        className="w-full md:w-auto flex items-center justify-center gap-2 bg-blue-600 md:hover:bg-blue-700 text-white text-lg font-bold rounded-2xl px-8 py-3 md:py-2 shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-400"
                        onClick={handleDownload}
                        disabled={isTabProcessing(tabIdx)}
                    >
                        <BiDownload size={24} className="md:w-5 md:h-5" />
                        {isTabProcessing(tabIdx) ? "변환 중..." : "저장하기"}
                    </button>
                </div>
            </div>

            {showFeedback && (
                <FeedbackModal
                    isOpen={showFeedback}
                    onClose={() => setShowFeedback(false)}
                    onSubmit={handleFeedbackSubmit}
                    isSubmitting={submittingFeedback}
                />
            )}
        </div>
    );
}
