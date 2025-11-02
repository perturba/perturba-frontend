"use client";

import TransformStatusButton from "@/components/TransformStatusButton";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ImageUploadPage() {
    const router = useRouter();
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setSelectedFile(file);
        
        // TODO: 이미지 업로드 api

        const fileUrl = URL.createObjectURL(file);
        router.push(`/image-transform?file=${encodeURIComponent(fileUrl)}`);
    };

    return (
        <div className="w-full min-h-screen bg-gray-50 flex flex-col py-10 px-8 gap-16">
            <div className="flex flex-row justify-between">
                <span className="text-gray-900 text-2xl font-bold">파일 업로드 하기</span>
                <TransformStatusButton />
            </div>
            
            <div className="flex w-full items-center justify-center">
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
            <div className="flex w-full items-center justify-center ">
                <div className="w-full max-w-2xl rounded-2xl shadow outline outline-1 outline-blue-100 flex flex-col items-start">
                    <div className="w-full px-6 py-4 bg-slate-100 rounded-t-2xl">
                        <span className="text-base text-gray-900 font-bold">지원 파일 조건</span>
                    </div>
                    <div className="w-full px-0 py-2 bg-blue-100 flex">
                        <span className="flex-1 text-center text-base font-medium text-gray-900">파일형식</span>
                        <span className="flex-1 text-center text-base font-medium text-gray-900">최대 파일 사이즈</span>
                        <span className="flex-1 text-center text-base font-medium text-gray-900">최대 해상도</span>
                    </div>
                    <div className="w-full px-0 py-3 bg-slate-100 rounded-b-2xl border-l-2 border-r-2 border-b-2 border-blue-100 flex">
                        <span className="flex-1 text-center text-base font-medium text-gray-900">JPEG</span>
                        <span className="flex-1 text-center text-base font-medium text-slate-950">?MB</span>
                        <span className="flex-1 text-center text-base font-medium text-gray-900">224px x 224px</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
