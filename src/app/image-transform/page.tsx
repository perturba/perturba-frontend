"use client";

import StrengthDropdown from "@/components/StrengthDropdown";
import { useRouter } from "next/navigation";
import { useState } from "react";

export const strengthOptions = ["높음", "중간", "낮음"] as const;
export type Strength = typeof strengthOptions[number];

export default function FileUploadTransformPage() {
    const [selected, setSelected] = useState<Strength | undefined>(undefined);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const router = useRouter();

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setSelectedFile(file);
        // TODO: 이미지 업로드 api
    };

    const handleTransformImage = () => {
        // TODO: 변환 요청 api
        router.push("/dashboard/image-upload");
    }

    const handleGoBack = () => {
        router.push("/dashboard/image-upload");
    }

    return (
        <div className="h-full w-full flex bg-gray-50">
            <div className="flex-1 flex flex-col p-8 gap-32">
                <button
                    onClick={handleGoBack}
                    className="mb-8 text-gray-700 text-base flex items-center gap-1 cursor-pointer"
                >
                    <span>&lt;</span> 돌아가기
                </button>
                <div className="flex w-full items-center justify-center">
                    {/* TODO: 업로드 이미지 미리보기 */}
                    <div className="w-full items-center justify-center max-w-xl bg-slate-100 rounded-2xl shadow-lg outline outline-2 outline-blue-500 flex flex-col justify-center items-center mb-6 p-16 px-32">
                        <label className="w-full flex flex-col items-center gap-2 cursor-pointer">
                            <input
                                type="file"
                                accept="image/jpeg"
                                className="hidden"
                                onChange={handleFileUpload}
                            />
                            <span className="text-base font-medium text-gray-900">파일을 업로드하려면 클릭하거나 끌어다 놓으세요</span>
                            <span className="text-xs text-gray-600 mt-1">지원 조건: 224px x 224px · JPEG · ?MB 이하</span>
                        </label>
                    </div>
                </div>
            </div>
            <aside className="w-full max-w-sm bg-indigo-50 flex flex-col items-center p-8 gap-7 md:gap-10 shadow-slate-200 shadow-md">
                <div className="w-full text-center items-center">
                    <h2 className="font-bold text-xl mb-1 text-gray-900">파일 업로드 하기</h2>
                    <div className="text-sm leading-relaxed text-slate-700 mb-6">
                        적용할 변환 강도를 선택하세요.<br />
                        또는 추천받기를 통해 이미지에 가장 적합한 강도를 안내받을 수 있습니다.
                    </div>
                </div>
                <div className="w-full">
                    <StrengthDropdown selected={selected} setSelected={setSelected} />
                </div>
                {/* TODO: 강도 추천받기 모달 */}
                <button className="w-full flex items-center gap-2 bg-white px-5 py-3 rounded-xl border shadow text-yellow-500 text-base font-semibold hover:bg-yellow-50 cursor-pointer">
                    <span>⭐</span>
                    강도 추천받기
                </button>
                <button
                    className="w-full py-4 bg-blue-500 rounded-2xl font-bold text-white text-lg disabled:opacity-60 disabled:bg-gray-400 mt-auto cursor-pointer"
                    disabled={selected === undefined}
                    onClick={handleTransformImage}
                >
                    변환하기
                </button>
            </aside>
        </div>
    );
}
