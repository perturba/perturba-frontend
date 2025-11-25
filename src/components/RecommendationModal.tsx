"use client";

import { BiX } from "react-icons/bi";

interface RecommendationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (strength: string) => void;
}

const recommendations = [
    {
        level: "높음",
        description: "강한 효과를 원할 때",
        isRecommended: false,
    },
    {
        level: "중간",
        description: "균형잡힌 결과물 (추천)",
        isRecommended: true,
    },
    {
        level: "낮음",
        description: "자연스러운 효과를 원할 때",
        isRecommended: false,
    },
];

export default function RecommendationModal({
    isOpen,
    onClose,
    onSelect
}: RecommendationModalProps) {
    if (!isOpen) return null;

    return (
        <>
            <div
                className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
                onClick={onClose}
            >
                <div
                    className="w-full max-w-sm bg-white rounded-2xl shadow-2xl p-6 flex flex-col gap-6"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 flex items-center justify-center">
                                <svg
                                    className="w-5 h-5 text-yellow-500"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                >
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                            </div>
                            <h2 className="text-base font-bold text-gray-900">변환 강도 추천</h2>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-lg hover:bg-gray-100 transition"
                        >
                            <BiX size={20} className="text-gray-900" />
                        </button>
                    </div>

                    <p className="text-xs text-gray-700 leading-relaxed">
                        업로드하신 이미지를 분석한 결과, 다음 강도를 추천드립니다.
                    </p>

                    <div className="flex flex-col gap-3">
                        {recommendations.map((rec) => (
                            <button
                                key={rec.level}
                                onClick={() => {
                                    onSelect(rec.level);
                                    onClose();
                                }}
                                className={`w-full p-5 rounded-2xl border-2 text-left transition ${rec.isRecommended
                                    ? "bg-blue-50 border-blue-500"
                                    : "bg-white border-gray-200 hover:border-gray-300"
                                    }`}
                            >
                                <div className="flex justify-between items-center">
                                    <div className="flex flex-col gap-1">
                                        <span className="text-base font-semibold text-gray-900">
                                            {rec.level}
                                        </span>
                                        <span className="text-sm text-gray-600">
                                            {rec.description}
                                        </span>
                                    </div>
                                    {rec.isRecommended && (
                                        <span className="px-3 py-1 bg-blue-600 text-white text-xs font-semibold rounded-full">
                                            추천
                                        </span>
                                    )}
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </>
    )
}
