"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { BiChevronDown, BiChevronLeft, BiImage, BiX } from "react-icons/bi";
import RecommendationModal from "@/components/RecommendationModal";
import { useImageUploadStore } from "@/store/imageUploadStore";
import { useJobStatusStore, subscribeToJob } from "@/store/jobStatusStore";
import type { Intensity } from "@/types/api";
import { createJob } from "@/api/jobApi";
import { useAuthStore } from "@/store/authStore";

const strengthOptions = ["높음", "중간", "낮음"] as const;
type Strength = typeof strengthOptions[number];

const strengthToIntensity: Record<Strength, Intensity> = {
    "높음": "HIGH",
    "중간": "MEDIUM",
    "낮음": "LOW",
};

export default function ImageTransformPage() {
    const router = useRouter();
    const [selected, setSelected] = useState<Strength>("중간");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [showRecommendation, setShowRecommendation] = useState(false);
    const [creating, setCreating] = useState(false);
    const { loginType } = useAuthStore();
    const isGuest = loginType === "GUEST";

    const { uploadedImage, clearUploadedImage } = useImageUploadStore();
    const addJob = useJobStatusStore((state) => state.addJob);

    const hasCheckedInitialImage = useRef(false);

    useEffect(() => {
        if (hasCheckedInitialImage.current) return;
        hasCheckedInitialImage.current = true;

        if (!uploadedImage) {
            router.replace("/dashboard/image-upload");
            return;
        }

        setSelectedFile(uploadedImage.file);
    }, [uploadedImage, router]);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setSelectedFile(file);
    };

    const handleTransformImage = async () => {
        if (!uploadedImage || creating) return;

        try {
            setCreating(true);

            const intensity = strengthToIntensity[selected];
            const response = await createJob({
                inputAssetId: uploadedImage.assetId,
                intensity,
                notifyVia: "NONE",
                clientChannel: "WEB",
                requestMode: "ASYNC",
            });

            if (response.ok && response.data) {
                const { publicId } = response.data;

                addJob({
                    publicId,
                    fileName: uploadedImage.file.name,
                    status: "PROGRESS",
                    createdAt: new Date().toISOString(),
                });

                subscribeToJob(publicId, uploadedImage.file.name);

                window.dispatchEvent(
                    new CustomEvent("job-toast", {
                        detail: {
                            type: "success",
                            message: `${uploadedImage.file.name} 변환이 시작되었습니다.`,
                        },
                    })
                );

                clearUploadedImage();
                if(isGuest) router.push("/dashboard/image-upload");
                else router.push("/dashboard/list");
            } else {
                throw new Error("작업 생성 실패");
            }
        } catch (error) {
            console.error("Job creation failed:", error);
            window.dispatchEvent(
                new CustomEvent("job-toast", {
                    detail: {
                        type: "error",
                        message: "작업 생성에 실패했습니다. 다시 시도해주세요.",
                    },
                })
            );
        } finally {
            setCreating(false);
        }
    };

    const handleGoBack = () => {
        clearUploadedImage();
        router.push("/dashboard/image-upload");
    };

    const handleSelectRecommendation = (strength: string) => {
        setSelected(strength as Strength);
    };

    const handleRemoveImage = () => {
        setSelectedFile(null);
    };

    const hasImage = selectedFile && uploadedImage;

    return (
        <>
            <div className="h-full w-full flex-1 flex flex-col md:flex-row bg-white md:bg-gray-50 overflow-hidden">
                <div className="flex-1 flex flex-col bg-white">
                    <div className="flex md:hidden items-center px-2 sm:px-3 py-2 sm:py-3 bg-white">
                        <button onClick={handleGoBack} className="p-1.5 sm:p-2">
                            <BiChevronLeft size={20} className="text-gray-900 sm:w-6 sm:h-6" />
                        </button>
                        <h1 className="flex-1 text-center text-sm sm:text-base font-semibold text-gray-900 -ml-8 sm:-ml-10">
                            파일 업로드 하기
                        </h1>
                    </div>

                    <div className="hidden md:flex items-center px-8 py-6">
                        <button
                            onClick={handleGoBack}
                            className="text-gray-700 text-base flex items-center gap-1"
                        >
                            <span>&lt;</span> 돌아가기
                        </button>
                    </div>

                    <div className="flex-1 flex items-center justify-center px-4 sm:px-5 md:px-8 bg-gray-50">
                        {hasImage ? (
                            <div className="w-full max-w-[160px] sm:max-w-[320px] md:max-w-xl bg-white rounded-3xl shadow-lg overflow-hidden border-2 border-blue-200">
                                <div className="relative aspect-square bg-gray-100">
                                    <img
                                        src={uploadedImage!.preview}
                                        alt="Preview"
                                        className="w-full h-full object-cover"
                                    />
                                    <button
                                        onClick={handleRemoveImage}
                                        className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition"
                                    >
                                        <BiX size={20} className="text-gray-700" />
                                    </button>
                                </div>
                                <div className="p-2 sm:p-4 bg-white">
                                    <p className="text-xs sm:text-sm text-gray-700 font-medium mb-2">
                                        현재 업로드된 이미지:
                                    </p>
                                    <p className="text-xs sm:text-sm text-gray-900 font-semibold truncate">
                                        {selectedFile!.name}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        {(selectedFile!.size / 1024 / 1024).toFixed(2)} MB
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <label className="w-full max-w-[280px] sm:max-w-[320px] md:max-w-xl bg-white md:bg-slate-100 border-2 md:border-4 border-dashed border-blue-500 rounded-3xl py-12 sm:py-16 md:py-20 flex flex-col items-center justify-center gap-2 sm:gap-3 md:gap-4 cursor-pointer md:shadow-lg">
                                <input
                                    type="file"
                                    accept="image/jpeg,image/png,image/gif"
                                    className="hidden"
                                    onChange={handleFileUpload}
                                />
                                <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 flex items-center justify-center mb-1 md:mb-2">
                                    <BiImage size={40} className="text-blue-500 sm:w-12 sm:h-12" />
                                </div>
                                <span className="text-[11px] sm:text-xs md:text-base font-medium md:font-semibold text-gray-900 text-center px-4 sm:px-6 md:px-8 leading-tight sm:leading-normal">
                                    파일을 업로드하려면 클릭하세요
                                </span>
                                <span className="text-[9px] sm:text-[10px] md:text-xs text-gray-600 text-center">
                                    지원 조건: 224×224px · JPEG, PNG, GIF · 10MB 이하
                                </span>
                            </label>
                        )}
                    </div>
                </div>

                <aside className="w-full md:max-w-sm bg-indigo-50 px-4 sm:px-5 md:px-8 py-4 sm:py-6 md:py-8 space-y-3 sm:space-y-5 md:space-y-7 md:shadow-md">
                    <div className="text-center md:text-center">
                        <h2 className="hidden md:block text-xl font-bold text-gray-900 mb-2">
                            파일 업로드 하기
                        </h2>
                        <p className="text-[11px] sm:text-xs md:text-sm text-slate-700 leading-relaxed">
                            적용할 변환 강도를 선택하세요.<br />
                            또는 추천받기를 통해<br />
                            이미지에 가장 적합한 강도를 안내받을 수 있습니다.
                        </p>
                    </div>

                    <div className="relative">
                        <button
                            type="button"
                            className="w-full bg-white rounded-2xl px-4 sm:px-5 py-2.5 sm:py-3 font-bold flex items-center justify-between text-blue-600 shadow-sm border md:border-0"
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                        >
                            <span className="text-sm sm:text-base md:text-lg">{selected}</span>
                            <BiChevronDown
                                className={`text-lg sm:text-xl md:text-2xl transition-transform ${dropdownOpen ? "rotate-180" : ""
                                    }`}
                            />
                        </button>
                        {dropdownOpen && (
                            <div className="absolute w-full mt-2 bg-white rounded-2xl shadow-xl overflow-hidden z-10 border md:border-0">
                                {strengthOptions.map((option) => (
                                    <button
                                        key={option}
                                        type="button"
                                        onClick={() => {
                                            setSelected(option);
                                            setDropdownOpen(false);
                                        }}
                                        className={`w-full px-4 sm:px-5 py-2.5 sm:py-3 text-sm sm:text-base md:text-lg font-semibold text-left ${option === selected
                                                ? "bg-indigo-50 text-blue-600"
                                                : "text-gray-900 hover:bg-gray-50"
                                            }`}
                                    >
                                        {option}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <button
                        onClick={() => setShowRecommendation(true)}
                        className="w-full flex items-center justify-center gap-1.5 sm:gap-2 bg-white px-4 sm:px-5 py-2.5 sm:py-3 rounded-2xl md:rounded-xl shadow-sm border md:border text-yellow-500 text-xs sm:text-sm md:text-base font-bold md:font-semibold"
                    >
                        <span className="text-sm sm:text-base md:text-lg">⭐</span>
                        강도 추천받기
                    </button>

                    <button
                        className="w-full py-2.5 sm:py-3 bg-blue-500 rounded-2xl font-bold text-white text-sm sm:text-base md:text-lg shadow-md flex items-center justify-center gap-1.5 sm:gap-2 disabled:opacity-60 disabled:bg-gray-400 disabled:cursor-not-allowed"
                        disabled={!hasImage || creating}
                        onClick={handleTransformImage}
                    >
                        {creating ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                생성 중...
                            </>
                        ) : (
                            <>
                                <svg
                                    className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M5 13l4 4L19 7"
                                    />
                                </svg>
                                변환하기
                            </>
                        )}
                    </button>
                </aside>
            </div>

            <RecommendationModal
                isOpen={showRecommendation}
                onClose={() => setShowRecommendation(false)}
                onSelect={handleSelectRecommendation}
            />
        </>
    );
}
