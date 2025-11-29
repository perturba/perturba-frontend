"use client";

import React from "react";
import { BiLoaderAlt, BiCheckCircle, BiXCircle } from "react-icons/bi";
import { useJobStatusStore } from "@/store/jobStatusStore";

interface TransformStatusModalProps {
    onJobClick?: (publicId: string) => void;
}

const TransformStatusModal: React.FC<TransformStatusModalProps> = ({ onJobClick }) => {
    const jobs = useJobStatusStore((state) => state.jobs);

    if (jobs.length === 0) {
        return (
            <div className="absolute right-0 top-full mt-2 mr-4 md:mr-16 min-w-[320px] rounded-2xl shadow-[0px_7px_29px_0px_rgba(100,100,111,0.20)] outline outline-2 outline-offset-[-2px] outline-blue-100 bg-white z-50">
                <div className="self-stretch px-6 py-4 bg-slate-100 rounded-t-2xl outline outline-2 outline-offset-[-2px] outline-blue-100">
                    <span className="text-gray-900 text-base font-bold">업로드한 파일</span>
                </div>
                <div className="px-6 py-8 text-center">
                    <p className="text-gray-500 text-sm">진행 중인 작업이 없습니다.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="absolute right-0 top-full mt-2 mr-4 md:mr-16 min-w-[320px] max-w-[400px] rounded-2xl shadow-[0px_7px_29px_0px_rgba(100,100,111,0.20)] outline outline-2 outline-offset-[-2px] outline-blue-100 flex flex-col items-start bg-white z-50 max-h-[400px] overflow-hidden">
            <div className="self-stretch px-6 py-4 bg-slate-100 rounded-t-2xl outline outline-2 outline-offset-[-2px] outline-blue-100 flex items-center justify-between">
                <span className="text-gray-900 text-base font-bold">업로드한 파일</span>
                <span className="text-gray-600 text-xs font-medium">총 {jobs.length}개</span>
            </div>
            <div className="w-full overflow-y-auto max-h-[320px]">
                {jobs.map((job, idx) => (
                    <button
                        key={job.publicId}
                        onClick={() => onJobClick?.(job.publicId)}
                        className={
                            "w-full px-4 py-3 bg-slate-100 flex items-center justify-between hover:bg-slate-200 transition" +
                            (idx === jobs.length - 1 ? " rounded-b-2xl" : "")
                        }
                    >
                        <div className="flex-1 text-left min-w-0">
                            <span className="truncate text-gray-900 text-base font-medium block">
                                {job.fileName}
                            </span>
                            <span className="text-xs text-gray-500">
                                {new Date(job.createdAt).toLocaleString("ko-KR", {
                                    month: "short",
                                    day: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                })}
                            </span>
                        </div>
                        <span className="flex items-center justify-center ml-3">
                            {job.status === "PROGRESS" && (
                                <BiLoaderAlt className="text-yellow-500 animate-spin" size={24} />
                            )}
                            {job.status === "COMPLETED" && (
                                <BiCheckCircle className="text-green-600" size={24} />
                            )}
                            {job.status === "FAILED" && (
                                <BiXCircle className="text-red-600" size={24} />
                            )}
                        </span>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default TransformStatusModal;
