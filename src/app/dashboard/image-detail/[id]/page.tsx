"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BiChevronLeft, BiShareAlt, BiDownload, BiChevronDown } from "react-icons/bi";
import FeedbackModal from "@/components/FeedbackModal";

const tabList = ["원본 이미지", "변환된 이미지", "AI 변경 요청 결과", "적용된 Perturbation 시각화"] as const;

export default function ResponsiveImageDetailPage() {
    const [tabIdx, setTabIdx] = useState(0);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [showStatus, setShowStatus] = useState(false);
    const router = useRouter();

    const handleGoBack = () => {
        router.push("/dashboard/list");
    };

    return (
        <div className="flex-1 flex flex-col bg-white md:bg-gray-50 overflow-hidden">
            <div className="flex md:hidden items-center justify-between px-3 py-3 bg-white border-b border-gray-200">
                <button onClick={handleGoBack} className="p-2">
                    <BiChevronLeft size={24} className="text-gray-900" />
                </button>
                <h1 className="flex-1 text-center text-base font-semibold text-gray-900 truncate px-2">
                    example.jpeg
                </h1>
                <button className="p-2">
                    <BiShareAlt size={24} className="text-gray-900" />
                </button>
            </div>

            <div className="hidden md:flex items-center justify-between px-8 py-10 bg-gray-50">
                <h1 className="text-2xl font-bold text-gray-900">example.jpeg</h1>
                <button className="p-2 rounded-full hover:bg-slate-200 transition">
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
                        <span>{tabList[tabIdx]}</span>
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
                                    className={`w-full px-4 py-3 text-left text-sm font-medium ${idx === tabIdx
                                        ? "bg-indigo-50 text-blue-600"
                                        : "text-gray-900 hover:bg-gray-50"
                                        }`}
                                >
                                    {tab}
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
                                className={`flex-1 py-2 text-center text-base font-medium transition-all ${tabIdx === idx
                                    ? "text-indigo-700 border-b-2 border-indigo-600 font-semibold"
                                    : "text-gray-400 hover:text-gray-600"
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                    <div className="relative flex justify-center items-center w-full min-h-[260px] bg-gray-100 rounded-xl overflow-hidden">
                        <img
                            src="https://images.unsplash.com/photo-1517849845537-4d257902454a?w=600&h=600&fit=crop"
                            alt={tabList[tabIdx]}
                            className="object-contain rounded-lg max-h-[240px] w-auto"
                        />
                    </div>
                </div>

                <div className="md:hidden w-full">
                    <div className="bg-white rounded-2xl overflow-hidden shadow-lg">
                        <div className="aspect-square bg-gray-100 flex items-center justify-center">
                            <img
                                src="https://images.unsplash.com/photo-1517849845537-4d257902454a?w=600&h=600&fit=crop"
                                alt={tabList[tabIdx]}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="px-4 md:px-8 py-4 md:py-6 bg-white border-t border-gray-200 md:bg-gray-50 md:border-t-0">
                <div className="flex flex-col items-center md:items-end gap-3 md:gap-4 max-w-2xl md:ml-auto md:mr-8">
                    <button
                        className="text-gray-700 text-sm font-medium border-b border-gray-400 pb-1 md:hover:text-blue-600 transition"
                        onClick={() => { setShowStatus(true) }}
                    >
                        변환 강도 피드백 주기
                    </button>
                    <button className="w-full md:w-auto flex items-center justify-center gap-2 bg-blue-600 md:hover:bg-blue-700 text-white text-lg font-bold rounded-2xl px-8 py-3 md:py-2 shadow-lg transition">
                        <BiDownload size={24} className="md:w-5 md:h-5" />
                        저장하기
                    </button>
                </div>
            </div>

            {showStatus && (
                <FeedbackModal
                    isOpen={showStatus}
                    onClose={() => setShowStatus(false)}
                />
            )}
        </div>
    );
}