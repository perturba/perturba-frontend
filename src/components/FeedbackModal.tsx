"use client";

import { useState } from "react";
import { BiX, BiSend } from "react-icons/bi";

interface FeedbackModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const strengthOptions = ["매우 약함", "약함", "보통", "강함", "매우 강함"];
const distortionOptions = ["매우 낮음", "낮음", "보통", "높음", "매우 높음"];

export default function FeedbackModal({ isOpen, onClose }: FeedbackModalProps) {
    const [strengthRating, setStrengthRating] = useState<number | null>(null);
    const [distortionRating, setDistortionRating] = useState<number | null>(null);

    const handleSubmit = () => {
        console.log("Feedback submitted:", { strengthRating, distortionRating });
        onClose();
    };

    if (!isOpen) return null;

    return (
        <>
            <div
                className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
                onClick={onClose}
            >
                <div
                    className="w-full max-w-xl bg-white rounded-2xl shadow-xl p-6 md:p-8 flex flex-col gap-6 md:gap-8"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="flex justify-between items-center pb-4 md:pb-6 border-b border-gray-200">
                        <h2 className="text-lg md:text-xl font-semibold text-gray-900">
                            변환 강도 피드백
                        </h2>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-lg hover:bg-gray-100 transition"
                        >
                            <BiX size={24} className="text-gray-900" />
                        </button>
                    </div>

                    <div className="flex flex-col gap-4">
                        <h3 className="text-base font-medium text-gray-900">
                            1. 변환 강도를 평가해주세요
                        </h3>
                        <div className="grid grid-cols-5 gap-2">
                            {strengthOptions.map((option, idx) => (
                                <button
                                    key={option}
                                    onClick={() => setStrengthRating(idx)}
                                    className={`py-3 px-2 rounded-lg border text-sm font-normal transition ${strengthRating === idx
                                            ? "bg-sky-700 border-sky-700 text-white"
                                            : "bg-white border-gray-300 text-gray-700 hover:border-gray-400"
                                        }`}
                                >
                                    {option}
                                </button>
                            ))}
                        </div>
                        <div className="flex justify-between px-1">
                            <span className="text-xs text-gray-500">약함</span>
                            <span className="text-xs text-gray-500">강함</span>
                        </div>
                    </div>

                    <div className="flex flex-col gap-4">
                        <h3 className="text-base font-medium text-gray-900">
                            2. 이미지 왜곡 정도를 평가해주세요
                        </h3>
                        <div className="grid grid-cols-5 gap-2">
                            {distortionOptions.map((option, idx) => (
                                <button
                                    key={option}
                                    onClick={() => setDistortionRating(idx)}
                                    className={`py-3 px-2 rounded-lg border text-sm font-normal transition ${distortionRating === idx
                                            ? "bg-sky-700 border-sky-700 text-white"
                                            : "bg-white border-gray-300 text-gray-700 hover:border-gray-400"
                                        }`}
                                >
                                    {option}
                                </button>
                            ))}
                        </div>
                        <div className="flex justify-between px-1">
                            <span className="text-xs text-gray-500">낮음</span>
                            <span className="text-xs text-gray-500">높음</span>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-gray-200 flex justify-end">
                        <button
                            onClick={handleSubmit}
                            disabled={strengthRating === null || distortionRating === null}
                            className="flex items-center gap-2 px-6 py-3 bg-sky-700 text-white rounded-lg font-medium hover:bg-sky-800 disabled:opacity-50 disabled:cursor-not-allowed transition"
                        >
                            제출하기
                            <BiSend size={16} />
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
