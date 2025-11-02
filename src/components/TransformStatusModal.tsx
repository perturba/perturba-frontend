import React from "react";
import { BiLoaderAlt, BiCheckCircle } from "react-icons/bi";

type FileStatus = "processing" | "done";

interface FileItem {
    fileName: string;
    status: FileStatus;
}

interface TransformStatusModalProps {
    files: FileItem[];
}

const TransformStatusModal: React.FC<TransformStatusModalProps> = ({ files }) => {
    return (
        <div className="absolute right-0 top-full mt-2 min-w-[320px] rounded-2xl shadow-[0px_7px_29px_0px_rgba(100,100,111,0.20)] outline outline-2 outline-offset-[-2px] outline-blue-100 flex flex-col items-start bg-white z-50">
            <div className="self-stretch px-6 py-4 bg-slate-100 rounded-t-2xl outline outline-2 outline-offset-[-2px] outline-blue-100 flex items-center">
                <span className="text-gray-900 text-base font-bold">업로드한 파일</span>
            </div>
            {files.map((item, idx) => (
                <div
                    key={idx}
                    className={
                        "w-full px-4 py-3 bg-slate-100 flex items-center justify-between" +
                        (idx === files.length - 1 ? " rounded-b-2xl" : "")
                    }
                >
                    <span className="truncate text-gray-900 text-base font-medium">{item.fileName}</span>
                    <span className="flex items-center justify-center">
                        {item.status === "processing" && (
                            <BiLoaderAlt className="text-yellow-500 animate-spin" size={24} />
                        )}
                        {item.status === "done" && (
                            <BiCheckCircle className="text-green-600" size={24} />
                        )}
                    </span>
                </div>
            ))}

        </div>
    );
};

export default TransformStatusModal;
