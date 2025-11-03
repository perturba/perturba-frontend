"use client";
import { useState } from "react";
import { BiShareAlt, BiDownload } from "react-icons/bi";

const tabList = [
    { name: "원본 이미지", key: "original" },
    { name: "변환된 이미지", key: "converted" },
    { name: "AI 변경 요청 결과", key: "ai-result" },
    { name: "적용된 Perturbation 시각화", key: "perturbation" },
] as const;

const images = [
    "https://placehold.co/355x360?text=Original+Image",
    "https://placehold.co/355x360?text=Converted+Image",
    "https://placehold.co/355x360?text=AI+Result",
    "https://placehold.co/355x360?text=Perturbation",
];

export default function ImageDetailPage() {
    const [tabIdx, setTabIdx] = useState(0);

    // TODO: 상세 정보 불러오기 api
    // TODO: 추천 강도 피드백 모달 UI & api
    // TODO: 파일 저장하기 & 파일 공유하기

    return (
        <div className="flex-1 min-h-0 flex flex-col bg-gray-50 py-10 px-8 gap-8 overflow-hidden">
            <div className="flex flex-row justify-between items-center">
                <span className="text-gray-900 text-2xl font-bold">example.jpeg</span>
                <button
                    className="p-2 rounded-full hover:bg-slate-200 transition"
                    title="공유"
                >
                    <BiShareAlt size={24} className="text-gray-600" />
                </button>
            </div>

            <div className="w-full flex justify-center">
                <div className="w-full max-w-2xl bg-white rounded-3xl shadow-md p-6 flex flex-col items-center transition">
                    <div className="w-full flex border-b border-gray-200 mb-4">
                        {tabList.map((tab, idx) => (
                            <button
                                key={tab.key}
                                onClick={() => setTabIdx(idx)}
                                className={`flex-1 py-2 text-center text-base font-medium transition-all duration-200
                ${tabIdx === idx
                                        ? "text-indigo-700 border-b-2 border-indigo-600 font-semibold"
                                        : "text-gray-400 hover:text-gray-600"
                                    }`}
                            >
                                {tab.name}
                            </button>
                        ))}
                    </div>
                    <div className="relative flex justify-center items-center w-full min-h-[260px] bg-gray-100 rounded-xl overflow-hidden group transition">
                        <img
                            src={images[tabIdx]}
                            alt={tabList[tabIdx].name}
                            className="object-contain rounded-lg max-h-[240px] w-auto transition-transform duration-300 group-hover:scale-105"
                        />
                    </div>
                </div>
            </div>

            <div className="w-full flex justify-end items-center mt-2 pr-2">
                <div className="flex flex-col items-center gap-3">
                    <button className="text-gray-700 text-sm border-b border-gray-300 pb-1 w-fit hover:text-blue-600 transition">
                        추천 강도 피드백 주기
                    </button>
                    <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-lg font-bold rounded-2xl px-8 py-2 shadow transition">
                        <BiDownload size={23} />
                        저장하기
                    </button>
                </div>
            </div>
        </div>
    );
}
